import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

// Real Firebase config provided by user
const firebaseConfig = {
  apiKey: "AIzaSyDvEo-3x27NcLFKXZ6MsxJGEqL3HCQWWSo",
  authDomain: "optionsindepth.firebaseapp.com",
  projectId: "optionsindepth",
  storageBucket: "optionsindepth.firebasestorage.app",
  messagingSenderId: "733487242360",
  appId: "1:733487242360:web:f322904dfd294ffafda18d",
  measurementId: "G-VGM6PZGN65"
};

// Initialize Firebase only if not already initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Use explicit initialization with long polling to prevent SSR/HMR AbortErrors across Edge nodes.
// We also explicitly pass the "default" database ID instead of the implied "(default)"
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, "optionsindepth");
