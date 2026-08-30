// Server-only Firebase Admin SDK helper. NEVER import this into a client component.
//
// On Firebase App Hosting (and most Google Cloud runtimes) the Admin SDK picks up
// Application Default Credentials automatically, so initializeApp() needs no args.
// Locally you would set GOOGLE_APPLICATION_CREDENTIALS to a service-account key,
// but the webhook only runs in production, so ADC is the expected path.

import { getApps, initializeApp, applicationDefault, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let cachedApp: App | null = null;

// App Hosting supplies a project ID automatically, but `next dev` does not. The
// Admin Auth SDK still needs the project ID to validate the token's audience even
// though Firebase publishes the signing certificates publicly.
const projectId =
  process.env.GCLOUD_PROJECT ||
  process.env.GOOGLE_CLOUD_PROJECT ||
  process.env.FIREBASE_PROJECT_ID ||
  'infaithjourney-90d96';

function getAdminApp(): App {
  if (cachedApp) return cachedApp;

  const existing = getApps();
  if (existing.length > 0) {
    cachedApp = existing[0];
    return cachedApp;
  }

  cachedApp = initializeApp({
    credential: applicationDefault(),
    projectId,
  });
  return cachedApp;
}

/** Returns the Admin Firestore instance (bypasses security rules — server only). */
export function getAdminDb(): Firestore {
  return getFirestore(getAdminApp());
}

/** Returns the Admin Auth instance for verifying server-side ID tokens. */
export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}
