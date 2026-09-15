import "server-only";

import { revalidateSiteContent } from "@/lib/cms/content";
import { withDefaults } from "@/lib/cms/merge";
import { applyContentEdits, contentVersion } from "@/lib/cms/mcp-content";
import { listRevisions, readRevision, saveRevision } from "@/lib/cms/revisions";
import { readStoredContent, writeStoredContent } from "@/lib/cms/store";
import type { SiteContent } from "@/lib/cms/types";
import type { McpContentService } from "@/lib/mcp/server";
import { listMedia } from "@/lib/server/media";

async function snapshot(expectedVersion: string) {
  // Editing must fail on storage errors, rather than publishing fallback defaults.
  const stored = await readStoredContent(true);
  const content = withDefaults(stored?.content);
  if (contentVersion(content) !== expectedVersion) throw new Error("Content changed since it was read. Read it again before applying edits.");
  return stored ? { ...stored, content } : { content, updatedAt: new Date().toISOString(), updatedBy: "defaults" };
}

async function persist(previous: Awaited<ReturnType<typeof snapshot>>, next: SiteContent, expectedVersion: string, by: string, reason: string) {
  const revisionId = await saveRevision(previous, { reason, scope: "site-wide", by });
  if (!revisionId) throw new Error("Could not save an undo revision. No content was published.");
  const record = await writeStoredContent(next, by, expectedVersion);
  revalidateSiteContent();
  return { published: true, version: contentVersion(record.content), updatedAt: record.updatedAt, revisionId };
}

export const contentService: McpContentService = {
  async read() { return withDefaults((await readStoredContent(true))?.content); },
  async publish(edits, expectedVersion, by) {
    const previous = await snapshot(expectedVersion);
    const { next, changes } = applyContentEdits(previous.content, edits);
    if (!changes.length) return { published: false, version: expectedVersion, changes: [] };
    return { ...await persist(previous, next, expectedVersion, by, "mcp"), changes };
  },
  revisions: listRevisions,
  async restore(id, expectedVersion, by) {
    const previous = await snapshot(expectedVersion);
    const revision = await readRevision(id);
    if (!revision) throw new Error("Revision not found.");
    return persist(previous, withDefaults(revision.content), expectedVersion, by, "restore");
  },
  media: listMedia,
};
