import "server-only";

import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { StoredContent } from "@/lib/cms/types";
import { CONTENT_COLLECTION, CONTENT_DOCUMENT, getDb } from "@/lib/server/firebase";

/**
 * Snapshots taken before an import, so a bad one is one click to undo.
 *
 * Publishing overwrites the whole document with no history, which is fine while
 * a person is typing into a form and can see what they changed. An import is
 * different: the change was written somewhere else, arrives all at once, and can
 * touch every section of a page. This is the net under it.
 *
 * Same two backends as `store.ts`, same shapes on both, so a local clone behaves
 * exactly like production.
 */

const LOCAL_DIR = join(process.cwd(), ".data", "revisions");

/** How many to keep. Enough to walk back a bad afternoon, not a version store. */
const KEEP = 10;

export interface RevisionMeta {
  /** Why the snapshot was taken — always "import" today. */
  reason: string;
  /** The page group the import was scoped to. */
  scope: string;
  by: string;
}

export interface Revision extends RevisionMeta {
  id: string;
  /** When the snapshot was taken, not when the content it holds was published. */
  savedAt: string;
}

interface RevisionRecord extends Revision {
  content: StoredContent;
}

/** Firestore doc ids and filenames share this, so the two stores stay in step. */
const newId = (): string => new Date().toISOString().replace(/[:.]/g, "-");

/** A row for the list: everything except the site it is holding. */
const summarise = (record: RevisionRecord): Revision => ({
  id: record.id,
  savedAt: record.savedAt,
  reason: record.reason,
  scope: record.scope,
  by: record.by,
});

const revisionsRef = () =>
  getDb()?.collection(CONTENT_COLLECTION).doc(CONTENT_DOCUMENT).collection("revisions") ?? null;

/**
 * Save a snapshot, then drop the oldest beyond `KEEP`.
 *
 * Never throws. A snapshot that could not be written is worth a line in the
 * log, but it is not worth blocking the import the operator asked for — and the
 * preview they just approved is the primary safeguard.
 */
export async function saveRevision(
  content: StoredContent,
  meta: RevisionMeta,
): Promise<string | null> {
  const record: RevisionRecord = { id: newId(), savedAt: new Date().toISOString(), ...meta, content };

  try {
    const ref = revisionsRef();

    if (ref) {
      await ref.doc(record.id).set(record);
      const stale = await ref.orderBy("savedAt", "desc").offset(KEEP).get();
      await Promise.all(stale.docs.map((doc) => doc.ref.delete()));
    } else {
      await mkdir(LOCAL_DIR, { recursive: true });
      await writeFile(
        join(LOCAL_DIR, `${record.id}.json`),
        `${JSON.stringify(record, null, 2)}\n`,
        "utf8",
      );

      const files = (await readdir(LOCAL_DIR)).filter((name) => name.endsWith(".json")).sort();
      await Promise.all(
        files.slice(0, Math.max(0, files.length - KEEP)).map((name) => unlink(join(LOCAL_DIR, name))),
      );
    }

    return record.id;
  } catch (error) {
    console.error("[cms] could not save a revision:", error);
    return null;
  }
}

/** The newest snapshots first, without their content. */
export async function listRevisions(limit = KEEP): Promise<Revision[]> {
  try {
    const ref = revisionsRef();

    if (ref) {
      const snapshot = await ref.orderBy("savedAt", "desc").limit(limit).get();
      return snapshot.docs.map((doc) => summarise(doc.data() as RevisionRecord));
    }

    const files = (await readdir(LOCAL_DIR).catch(() => []))
      .filter((name) => name.endsWith(".json"))
      .sort()
      .reverse()
      .slice(0, limit);

    const records = await Promise.all(
      files.map(async (name) => {
        try {
          return JSON.parse(await readFile(join(LOCAL_DIR, name), "utf8")) as RevisionRecord;
        } catch {
          return null;
        }
      }),
    );

    return records.filter((record): record is RevisionRecord => record !== null).map(summarise);
  } catch (error) {
    console.error("[cms] could not list revisions:", error);
    return [];
  }
}

/** One snapshot's content, or `null` if it is gone. */
export async function readRevision(id: string): Promise<StoredContent | null> {
  /* The id reaches this from a URL, and in file mode it becomes a filename. */
  if (!/^[0-9A-Za-z-]+$/.test(id)) return null;

  try {
    const ref = revisionsRef();

    if (ref) {
      const snapshot = await ref.doc(id).get();
      return snapshot.exists ? (snapshot.data() as RevisionRecord).content : null;
    }

    const raw = await readFile(join(LOCAL_DIR, `${id}.json`), "utf8");
    return (JSON.parse(raw) as RevisionRecord).content;
  } catch {
    return null;
  }
}
