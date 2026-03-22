"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { logUserActivity } from "@/lib/firebase/userService";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Fetch or create user profile in Firestore
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            setUserProfile(userSnap.data());
            // Log recurring login
            await logUserActivity(user.uid, "SESSION_LOGIN", { method: "auth_state_change" });
          } else {
            // Create default free-tier profile
            const initialProfile = {
              email: user.email,
              displayName: user.displayName || "",
              photoURL: user.photoURL || "",
              plan: "free",
              simulationsRunToday: 0,
              simulationsLimit: 5,
              lastSimulationDate: new Date().toISOString().split('T')[0],
              createdAt: new Date().toISOString()
            };
            await setDoc(userRef, initialProfile);
            setUserProfile(initialProfile);
            // Log signup event
            await logUserActivity(user.uid, "ACCOUNT_CREATED", { initialPlan: "free" });
          }
        } catch (error) {
          if (error.code !== 'permission-denied') {
             console.error("Firestore Error in AuthContext:", error);
          }
          // Graceful degradation: still allow user to be logged in locally
          setUserProfile({
            plan: "free",
            simulationsRunToday: 0,
            simulationsLimit: 5,
            error: true
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Update profile locally when limits change
  const updateLocalProfile = (updates) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading, updateLocalProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
