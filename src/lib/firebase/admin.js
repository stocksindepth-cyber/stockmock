// ─── Firebase Admin SDK — server-side only ────────────────────────────────────
// Used by API routes to write to Firestore with full admin privileges,
// bypassing client security rules.  Never import this from client components.
// ─────────────────────────────────────────────────────────────────────────────
import admin from "firebase-admin";

let adminApp;

export function getAdminApp() {
  if (adminApp) return adminApp;

  // Reuse the BigQuery service-account JSON — same GCP project (optionsindepth)
  // Set BIGQUERY_CREDENTIALS_JSON env var on Vercel as the full JSON string.
  const credJson = process.env.BIGQUERY_CREDENTIALS_JSON;

  if (!credJson) {
    // Local dev fallback: use GOOGLE_APPLICATION_CREDENTIALS file path
    if (!admin.apps.length) {
      adminApp = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "optionsindepth",
      });
    } else {
      adminApp = admin.apps[0];
    }
    return adminApp;
  }

  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(credJson);
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
  } else {
    adminApp = admin.apps[0];
  }

  return adminApp;
}

export function getAdminFirestore() {
  return admin.firestore(getAdminApp());
}
