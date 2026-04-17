import { getApps, initializeApp, cert, applicationDefault, type App } from "firebase-admin/app";
import { getDatabase, type Database } from "firebase-admin/database";

let app: App | null = null;

function initAdmin(): App {
  if (app) return app;
  if (getApps().length > 0) {
    app = getApps()[0]!;
    return app;
  }
  const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
  if (!databaseURL) {
    throw new Error("NEXT_PUBLIC_FIREBASE_DATABASE_URL is required for firebase-admin");
  }

  const credJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (credJson) {
    app = initializeApp({
      credential: cert(JSON.parse(credJson)),
      databaseURL,
    });
  } else {
    app = initializeApp({ credential: applicationDefault(), databaseURL });
  }
  return app;
}

export function getAdminDb(): Database {
  return getDatabase(initAdmin());
}
