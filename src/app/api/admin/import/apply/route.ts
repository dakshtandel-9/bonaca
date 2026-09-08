import type { NextRequest } from "next/server";

import { getSiteContentUncached, revalidateSiteContent } from "@/lib/cms/content";
import { pickPaths, runImport } from "@/lib/cms/import";
import { mergeInto } from "@/lib/cms/merge";
import { saveRevision } from "@/lib/cms/revisions";
import { readStoredContent, storageBackend, writeStoredContent } from "@/lib/cms/store";
import { getSession } from "@/lib/server/auth";
import { requireApiSession } from "@/lib/server/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Apply an import and publish.
 *
 * The raw text is validated again here rather than trusting a document posted
 * back by the browser: the preview and the write have to be the same pipeline,
 * or an approved diff is not a promise about what lands.
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

  const { scope, raw, acceptedPaths } = (payload ?? {}) as {
    scope?: unknown;
    raw?: unknown;
    acceptedPaths?: unknown;
  };

  if (typeof scope !== "string" || typeof raw !== "string" || !raw.trim()) {
    return Response.json({ error: "Nothing to import." }, { status: 400 });
  }

  if (!Array.isArray(acceptedPaths) || acceptedPaths.some((path) => typeof path !== "string")) {
    return Response.json({ error: "Malformed request." }, { status: 400 });
  }

  if (acceptedPaths.length === 0) {
    return Response.json({ error: "No changes were ticked." }, { status: 400 });
  }

  const current = await getSiteContentUncached();
  const result = runImport(scope, raw, current);

  if ("error" in result) return Response.json({ error: result.error }, { status: 400 });

  const accepted = mergeInto(current, pickPaths(result.clean, acceptedPaths as string[]));

  try {
    /* Snapshot first. If this is the write that ruins the homepage, the copy
       has to already exist. */
    const previous = await readStoredContent();
    if (previous) {
      await saveRevision(previous, {
        reason: "import",
        scope,
        by: session?.username ?? "admin",
      });
    }

    const record = await writeStoredContent(accepted, session?.username ?? "admin");
    revalidateSiteContent();

    return Response.json({
      ok: true,
      updatedAt: record.updatedAt,
      applied: acceptedPaths.length,
      storage: storageBackend,
    });
  } catch (error) {
    console.error("[cms] import failed:", error);
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
