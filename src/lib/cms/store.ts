import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import { withDefaults } from "@/lib/cms/merge";
import type { SiteContent, StoredContent } from "@/lib/cms/types";
import {
  CONTENT_COLLECTION,
  CONTENT_DOCUMENT,
  getDb,
  isFirebaseConfigured,
} from "@/lib/server/firebase";

/**
 * Reading and writing the one document the whole site is made of.
 *
 * Firestore is the store. When it is not configured the same document is kept
 * at `.data/content.json`, so the CRM is fully usable — editing, uploading,
 * publishing — from a fresh clone with nothing but `npm run dev`. The shapes
 * on both paths are identical, so moving to Firebase later is a copy-paste of
 * credentials and nothing else.
 */

const LOCAL_FILE = join(process.cwd(), ".data", "content.json");

export const storageBackend: "firestore" | "file" = isFirebaseConfigured
  ? "firestore"
  : "file";

async function readLocal(): Promise<StoredContent | null> {
  try {
    const raw = await readFile(LOCAL_FILE, "utf8");
    return JSON.parse(raw) as StoredContent;
  } catch {
    return null;
  }
}

async function writeLocal(record: StoredContent): Promise<void> {
  await mkdir(dirname(LOCAL_FILE), { recursive: true });
  await writeFile(LOCAL_FILE, `${JSON.stringify(record, null, 2)}\n`, "utf8");
}

/**
 * The raw stored document, or `null` when nothing has been published yet.
 * Never throws: a Firestore outage falls back to the shipped defaults rather
 * than taking the public site down with it.
 */
export async function readStoredContent(): Promise<StoredContent | null> {
  const db = getDb();

  if (!db) return readLocal();

  try {
    const snapshot = await db.collection(CONTENT_COLLECTION).doc(CONTENT_DOCUMENT).get();
    if (!snapshot.exists) return null;

    return snapshot.data() as StoredContent;
  } catch (error) {
    console.error("[cms] Firestore read failed, falling back to defaults:", error);
    return readLocal();
  }
}

/** Persist the whole document. Throws, so the CRM can report a failed save. */
export async function writeStoredContent(
  content: SiteContent,
  updatedBy: string,
): Promise<StoredContent> {
  const record: StoredContent = {
    /* Merged on the way in as well as on the way out, so a truncated payload
       from a stale browser tab cannot erase a section. */
    content: withDefaults(content),
    updatedAt: new Date().toISOString(),
    updatedBy,
  };

  const db = getDb();

  if (db) {
    await db
      .collection(CONTENT_COLLECTION)
      .doc(CONTENT_DOCUMENT)
      .set(record, { merge: false });
  } else {
    await writeLocal(record);
  }

  return record;
}
