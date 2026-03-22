import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, getFirestore } from "firebase/firestore";

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
const isNew = !getApps().length;
const app = isNew ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// initializeFirestore must only be called once per app instance.
// On HMR hot-reloads the module re-evaluates but the Firebase app persists,
// so calling initializeFirestore again would throw "settings can no longer be changed".
// Guard with try/catch: first load initialises with long-polling; subsequent loads
// just retrieve the existing instance via getFirestore.
let db;
try {
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  }, "optionsindepth");
} catch {
  // Already initialised (HMR re-eval) — grab the existing instance
  db = getFirestore(app, "optionsindepth");
}
export { db };
