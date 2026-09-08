import type { NextRequest } from "next/server";

import { getSiteContentUncached } from "@/lib/cms/content";
import { buildPrompt } from "@/lib/cms/prompt";
import { requireApiSession } from "@/lib/server/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** The prompt to paste into ChatGPT, built fresh from the live content. */
export async function GET(request: NextRequest) {
  const denied = await requireApiSession();
  if (denied) return denied;

  const scope = request.nextUrl.searchParams.get("scope")?.trim() ?? "";
  const content = await getSiteContentUncached();
  const prompt = buildPrompt(scope, content);

  if (!prompt) {
    return Response.json({ error: "That is not a page of this site." }, { status: 400 });
  }

  return Response.json({ scope, prompt });
}
