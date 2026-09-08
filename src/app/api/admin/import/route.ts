import type { NextRequest } from "next/server";

import { getSiteContentUncached } from "@/lib/cms/content";
import { runImport } from "@/lib/cms/import";
import { requireApiSession } from "@/lib/server/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Preview an import. Writes nothing.
 *
 * The whole point is that the operator sees what a language model decided to do
 * before any of it reaches the site, so this route is deliberately read-only —
 * the apply is a separate, explicit call.
 */
export async function POST(request: NextRequest) {
  const denied = await requireApiSession();
  if (denied) return denied;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Malformed request." }, { status: 400 });
  }

  const { scope, raw } = (payload ?? {}) as { scope?: unknown; raw?: unknown };

  if (typeof scope !== "string" || typeof raw !== "string" || !raw.trim()) {
    return Response.json({ error: "Paste the JSON from ChatGPT first." }, { status: 400 });
  }

  const current = await getSiteContentUncached();
  const result = runImport(scope, raw, current);

  if ("error" in result) return Response.json({ error: result.error }, { status: 400 });

  return Response.json({
    changes: result.changes,
    issues: result.issues,
  });
}
