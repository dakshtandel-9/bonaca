import "server-only";

import { getSession } from "@/lib/server/auth";

/**
 * Gate for every /api/admin route.
 *
 * Returns a 401 to send straight back, or `null` when the caller is signed in.
 * Each route calls this itself rather than leaning on a proxy, so a route added
 * later cannot quietly ship unprotected.
 */
export async function requireApiSession(): Promise<Response | null> {
  const session = await getSession();
  if (session) return null;

  return Response.json({ error: "Not signed in." }, { status: 401 });
}
