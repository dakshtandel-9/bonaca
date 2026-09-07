import type { NextRequest } from "next/server";

import { getSiteContentUncached, revalidateSiteContent } from "@/lib/cms/content";
import { withDefaults } from "@/lib/cms/merge";
import { storageBackend, writeStoredContent } from "@/lib/cms/store";
import { getSession } from "@/lib/server/auth";
import { requireApiSession } from "@/lib/server/guard";
import { mediaBackend } from "@/lib/server/media";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** The current content, straight from the store, for the editor to load. */
export async function GET() {
  const denied = await requireApiSession();
  if (denied) return denied;

  const content = await getSiteContentUncached();

  return Response.json({
    content,
    storage: storageBackend,
    media: mediaBackend,
  });
}

/**
 * Publish. The whole document is written at once — the editor holds the entire
 * site in memory, so a partial patch would only invite two tabs overwriting
 * each other field by field.
 */
export async function PUT(request: NextRequest) {
  const denied = await requireApiSession();
  if (denied) return denied;

  const session = await getSession();

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Malformed request." }, { status: 400 });
  }

  const incoming = (payload as { content?: unknown } | null)?.content;
  if (!incoming || typeof incoming !== "object") {
    return Response.json({ error: "No content supplied." }, { status: 400 });
  }

  try {
    const record = await writeStoredContent(withDefaults(incoming), session?.username ?? "admin");
    revalidateSiteContent();

    return Response.json({
      ok: true,
      updatedAt: record.updatedAt,
      storage: storageBackend,
      content: record.content,
    });
  } catch (error) {
    console.error("[cms] publish failed:", error);
    return Response.json(
      {
        error:
          error instanceof Error
            ? `Could not save: ${error.message}`
            : "Could not save the changes.",
      },
      { status: 500 },
    );
  }
}
