import { getApps, initializeApp, cert, applicationDefault, type App } from "firebase-admin/app";
import { getDatabase, type Database } from "firebase-admin/database";

let app: App | null = null;

export function initAdmin(): App {
  if (app) return app;
  if (getApps().length > 0) {
    app = getApps()[0]!;
    return app;
  }
  const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
  if (!databaseURL) {
    throw new Error("NEXT_PUBLIC_FIREBASE_DATABASE_URL is required for firebase-admin");
  }
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  // Prefer base64 on Vercel (avoids env-var newline mangling in private_key)
  const credB64 = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_B64;
  const credJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  let credObject: Record<string, unknown> | null = null;
  if (credB64) {
    credObject = JSON.parse(Buffer.from(credB64, "base64").toString("utf-8"));
  } else if (credJson) {
    credObject = JSON.parse(credJson);
  }
  const credential = credObject
    ? cert(credObject as Parameters<typeof cert>[0])
    : applicationDefault();
  app = initializeApp({ credential, databaseURL, storageBucket });
  return app;
}

export function getAdminDb(): Database {
  return getDatabase(initAdmin());
}
