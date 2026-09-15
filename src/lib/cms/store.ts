import "server-only";

import { mkdir, readFile, writeFile, rename, rmdir, unlink } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { dirname, join } from "node:path";

import { withDefaults } from "@/lib/cms/merge";
import { contentVersion } from "@/lib/cms/mcp-content";
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

async function readLocal(strict = false): Promise<StoredContent | null> {
  try {
    const raw = await readFile(LOCAL_FILE, "utf8");
    return JSON.parse(raw) as StoredContent;
  } catch (error) {
    if (strict && (error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    return null;
  }
}

async function writeLocal(record: StoredContent): Promise<void> {
  await mkdir(dirname(LOCAL_FILE), { recursive: true });
  const temporary = `${LOCAL_FILE}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporary, `${JSON.stringify(record, null, 2)}\n`, "utf8");
    await rename(temporary, LOCAL_FILE);
  } finally {
    await unlink(temporary).catch(() => undefined);
  }
}

/**
 * The raw stored document, or `null` when nothing has been published yet.
 * Public reads fall back on storage errors. Pass strict=true for editing so an
 * outage cannot turn into a write based on fallback content.
 */
export async function readStoredContent(strict = false): Promise<StoredContent | null> {
  const db = getDb();

  if (!db) return readLocal(strict);

  try {
    const snapshot = await db.collection(CONTENT_COLLECTION).doc(CONTENT_DOCUMENT).get();
    if (!snapshot.exists) return null;

    return snapshot.data() as StoredContent;
  } catch (error) {
    if (strict) throw error;
    console.error("[cms] Firestore read failed, falling back to defaults:", error);
    return readLocal();
  }
}

/** Persist the whole document. Throws, so the CRM can report a failed save. */
export async function writeStoredContent(
  content: SiteContent,
  updatedBy: string,
  expectedVersion?: string,
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
    const ref = db.collection(CONTENT_COLLECTION).doc(CONTENT_DOCUMENT);
    if (expectedVersion !== undefined) {
      await db.runTransaction(async (transaction) => {
        const snapshot = await transaction.get(ref);
        assertContentVersion(snapshot.data() as StoredContent | undefined, expectedVersion);
        transaction.set(ref, record);
      });
    } else {
      await ref.set(record, { merge: false });
    }
  } else {
    // Every local writer uses the same lock, including the existing admin routes.
    await mkdir(dirname(LOCAL_FILE), { recursive: true });
    const lock = `${LOCAL_FILE}.lock`;
    let acquired = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      try {
        await mkdir(lock);
        acquired = true;
        break;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }
    if (!acquired) throw new Error("Content is busy. Retry shortly.");
    try {
      if (expectedVersion !== undefined) assertContentVersion(await readLocal(true), expectedVersion);
      await writeLocal(record);
    } finally {
      await rmdir(lock);
    }
  }

  return record;
}

function assertContentVersion(stored: StoredContent | null | undefined, expected: string) {
  if (contentVersion(withDefaults(stored?.content)) !== expected) {
    throw new Error("Content changed since it was read. Read it again before applying edits.");
  }
}
