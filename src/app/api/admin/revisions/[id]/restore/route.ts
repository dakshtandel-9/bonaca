import type { NextRequest } from "next/server";

import { revalidateSiteContent } from "@/lib/cms/content";
import { readRevision, saveRevision } from "@/lib/cms/revisions";
import { readStoredContent, writeStoredContent } from "@/lib/cms/store";
import { getSession } from "@/lib/server/auth";
import { requireApiSession } from "@/lib/server/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Put a snapshot back, having first snapshotted what is there now. */
export async function POST(
  _request: NextRequest,
  { params }: RouteContext<"/api/admin/revisions/[id]/restore">,
) {
  const denied = await requireApiSession();
  if (denied) return denied;

  const session = await getSession();
  const { id } = await params;

  const snapshot = await readRevision(id);
  if (!snapshot) {
    return Response.json({ error: "That snapshot is no longer available." }, { status: 404 });
  }

  try {
    /* Restoring is itself undoable, so a mis-click is not a second disaster. */
    const previous = await readStoredContent();
    if (previous) {
      await saveRevision(previous, {
        reason: "restore",
        scope: "site-wide",
        by: session?.username ?? "admin",
      });
    }

    const record = await writeStoredContent(snapshot.content, session?.username ?? "admin");
    revalidateSiteContent();

    return Response.json({ ok: true, updatedAt: record.updatedAt });
  } catch (error) {
    console.error("[cms] restore failed:", error);
    return Response.json({ error: "Could not restore that snapshot." }, { status: 500 });
  }
}
