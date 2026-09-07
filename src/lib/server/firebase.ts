import "server-only";

import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/**
 * Firestore, initialised once per server process from the service-account
 * credentials in the environment.
 *
 * Every accessor returns `null` rather than throwing when the credentials are
 * absent. That is deliberate: it lets the whole CRM run against the on-disk
 * fallback store before anyone has opened the Firebase console, and it means a
 * missing key in production degrades to the shipped content instead of a 500.
 */

const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();

/** Dashboards and .env files store the PEM with escaped newlines. */
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n").trim();

export const isFirebaseConfigured = Boolean(projectId && clientEmail && privateKey);

const APP_NAME = "bonaca-cms";

let cachedApp: App | null = null;

function getApp(): App | null {
  if (!isFirebaseConfigured) return null;
  if (cachedApp) return cachedApp;

  const existing = getApps().find((app) => app.name === APP_NAME);
  cachedApp =
    existing ??
    initializeApp(
      {
        credential: cert({
          projectId: projectId!,
          clientEmail: clientEmail!,
          privateKey: privateKey!,
        }),
        projectId: projectId!,
      },
      APP_NAME,
    );

  return cachedApp;
}

/**
 * The Firestore handle lives on `globalThis`, not in a module variable.
 *
 * Next.js gives each route entry its own copy of this module, while
 * firebase-admin keeps a single Firestore instance per app for the whole
 * process. A module-local cache therefore starts out empty in the second copy,
 * which then reaches the already-initialised Firestore and calls `settings()`
 * on it again — that throws, and during `next build` it fails the whole build.
 *
 * Keying off the global symbol registry gives every copy the same handle, so
 * `settings()` runs exactly once per process, whichever copy gets there first.
 * `settings()` is also the only way to set `ignoreUndefinedProperties`:
 * `initializeFirestore()` forwards `preferRest` and nothing else.
 */
const DB_KEY = Symbol.for("bonaca-cms.firestore");

const globalForDb = globalThis as typeof globalThis & {
  [DB_KEY]?: Firestore;
};

export function getDb(): Firestore | null {
  const cached = globalForDb[DB_KEY];
  if (cached) return cached;

  const app = getApp();
  if (!app) return null;

  const db = getFirestore(app);
  db.settings({ ignoreUndefinedProperties: true });
  globalForDb[DB_KEY] = db;
  return db;
}

export const CONTENT_COLLECTION =
  process.env.FIREBASE_CONTENT_COLLECTION?.trim() || "bonaca-cms";

export const CONTENT_DOCUMENT =
  process.env.FIREBASE_CONTENT_DOCUMENT?.trim() || "site-content";

/** Where the media library's index lives, alongside the content document. */
export const MEDIA_COLLECTION = `${CONTENT_COLLECTION}-media`;
