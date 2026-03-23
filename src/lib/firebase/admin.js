// ─── Firebase Admin SDK — server-side only ────────────────────────────────────
// Used by API routes to write to Firestore with full admin privileges,
// bypassing client security rules.  Never import this from client components.
//
// Credential priority:
//   1. FIREBASE_ADMIN_CREDENTIALS_JSON — dedicated Firebase SA (recommended)
//   2. BIGQUERY_CREDENTIALS_JSON       — BigQuery SA (must have Cloud Datastore User role)
//   3. Application Default Credentials — local dev
//
// projectId is ALWAYS pinned to NEXT_PUBLIC_FIREBASE_PROJECT_ID ("optionsindepth"),
// never taken from serviceAccount.project_id, to avoid cross-project Firestore errors.
// ─────────────────────────────────────────────────────────────────────────────
import admin from "firebase-admin";

// Always use the Firebase project ID, regardless of which SA JSON we load.
const FIREBASE_PROJECT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "optionsindepth";

let adminApp;

export function getAdminApp() {
  if (adminApp) return adminApp;

  if (admin.apps.length) {
    adminApp = admin.apps[0];
    return adminApp;
  }

  // 1. Prefer dedicated Firebase Admin SA (has full Firestore access by default)
  const firebaseCredJson = process.env.FIREBASE_ADMIN_CREDENTIALS_JSON;
  if (firebaseCredJson) {
    const serviceAccount = JSON.parse(firebaseCredJson);
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: FIREBASE_PROJECT_ID,
    });
    return adminApp;
  }

  // 2. Fall back to BigQuery SA (needs "Cloud Datastore User" IAM role on Firebase project)
  const bqCredJson = process.env.BIGQUERY_CREDENTIALS_JSON;
  if (bqCredJson) {
    const serviceAccount = JSON.parse(bqCredJson);
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: FIREBASE_PROJECT_ID,  // ← always Firebase project, NOT serviceAccount.project_id
    });
    return adminApp;
  }

  // 3. Local dev: Application Default Credentials (gcloud auth application-default login)
  adminApp = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: FIREBASE_PROJECT_ID,
  });
  return adminApp;
}

export function getAdminFirestore() {
  return admin.firestore(getAdminApp());
}
