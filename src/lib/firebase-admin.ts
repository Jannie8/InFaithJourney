// Server-only Firebase Admin SDK helper. NEVER import this into a client component.
//
// On Firebase App Hosting (and most Google Cloud runtimes) the Admin SDK picks up
// Application Default Credentials automatically, so initializeApp() needs no args.
// Locally you would set GOOGLE_APPLICATION_CREDENTIALS to a service-account key,
// but the webhook only runs in production, so ADC is the expected path.

import { getApps, initializeApp, applicationDefault, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let cachedApp: App | null = null;

function getAdminApp(): App {
  if (cachedApp) return cachedApp;

  const existing = getApps();
  if (existing.length > 0) {
    cachedApp = existing[0];
    return cachedApp;
  }

  cachedApp = initializeApp({
    credential: applicationDefault(),
  });
  return cachedApp;
}

/** Returns the Admin Firestore instance (bypasses security rules — server only). */
export function getAdminDb(): Firestore {
  return getFirestore(getAdminApp());
}
