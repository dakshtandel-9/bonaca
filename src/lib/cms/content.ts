import "server-only";

import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";

import { withDefaults } from "@/lib/cms/merge";
import { readStoredContent } from "@/lib/cms/store";
import type { SiteContent } from "@/lib/cms/types";

/** Cache tag every page's content read is filed under. */
export const SITE_CONTENT_TAG = "site-content";

/**
 * One Firestore read per deployment, not per visitor.
 *
 * The result is tagged, so publishing in the CRM drops it immediately, and it
 * also carries a one-minute ceiling as a backstop — if a tag invalidation is
 * ever missed (a cold region, a host without a shared cache), the site still
 * catches up on its own rather than serving yesterday's rates forever.
 */
const loadContent = unstable_cache(
  async (): Promise<SiteContent> => {
    const stored = await readStoredContent();
    return withDefaults(stored?.content);
  },
  ["bonaca-site-content"],
  { tags: [SITE_CONTENT_TAG], revalidate: 60 },
);

/**
 * The content for the current render. Memoised per request, so a page, its
 * layout and its `generateMetadata` all share a single read.
 */
export const getSiteContent = cache(async (): Promise<SiteContent> => loadContent());

/** A read that always hits the store — what the CRM edits against. */
export async function getSiteContentUncached(): Promise<SiteContent> {
  const stored = await readStoredContent();
  return withDefaults(stored?.content);
}

/**
 * Push a publish out to every rendered page.
 *
 * `expire: 0` rather than the recommended stale-while-revalidate window: the
 * owner has just pressed Publish and is about to open the site in the next tab,
 * so the first request after a save must block for fresh content rather than
 * serve one more stale render.
 */
export function revalidateSiteContent(): void {
  revalidateTag(SITE_CONTENT_TAG, { expire: 0 });
  revalidatePath("/", "layout");
}
