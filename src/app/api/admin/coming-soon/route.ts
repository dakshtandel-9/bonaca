import type { NextRequest } from "next/server";

import { getSiteContentUncached, revalidateSiteContent } from "@/lib/cms/content";
import { storageBackend, writeStoredContent } from "@/lib/cms/store";
import { getSession } from "@/lib/server/auth";
import { requireApiSession } from "@/lib/server/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Take the site down, or put it back up.
 *
 * A route of its own rather than a trip through the content editor: this is the
 * one switch someone reaches for in a hurry, and it should not require loading
 * the whole document into a browser tab first. It still reads the current
 * content and writes it back whole, so it goes through exactly the same store
 * and cache invalidation as a publish.
 */
export async function POST(request: NextRequest) {
  const denied = await requireApiSession();
  if (denied) return denied;

  const session = await getSession();

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Malformed request." }, { status: 400 });
  }

  const { enabled } = (payload ?? {}) as { enabled?: unknown };
  if (typeof enabled !== "boolean") {
    return Response.json({ error: "Malformed request." }, { status: 400 });
  }

  try {
    const current = await getSiteContentUncached();

    const record = await writeStoredContent(
      { ...current, comingSoon: { ...current.comingSoon, enabled } },
      session?.username ?? "admin",
    );
    revalidateSiteContent();

    return Response.json({
      ok: true,
      enabled: record.content.comingSoon.enabled,
      updatedAt: record.updatedAt,
      storage: storageBackend,
    });
  } catch (error) {
    console.error("[cms] coming-soon toggle failed:", error);
    return Response.json({ error: "Could not change the setting." }, { status: 500 });
  }
}
