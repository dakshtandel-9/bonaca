import type { NextRequest } from "next/server";

import {
  ADMIN_USERNAME,
  checkCredentials,
  createSessionToken,
  isAdminConfigured,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/server/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * A deliberately slow door.
 *
 * One account and a public URL means the only realistic attack is guessing the
 * password, so attempts are counted per IP and locked out for a while once
 * they run out. The window is in-process, which is enough here: it costs an
 * attacker a fresh instance per five guesses.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

const attempts = new Map<string, { count: number; firstAt: number }>();

function tooManyAttempts(ip: string): boolean {
  const record = attempts.get(ip);
  if (!record) return false;
  if (Date.now() - record.firstAt > WINDOW_MS) {
    attempts.delete(ip);
    return false;
  }
  return record.count >= MAX_ATTEMPTS;
}

function recordFailure(ip: string): void {
  const record = attempts.get(ip);
  if (!record || Date.now() - record.firstAt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAt: Date.now() });
    return;
  }
  record.count += 1;
}

export async function POST(request: NextRequest) {
  if (!isAdminConfigured) {
    return Response.json(
      { error: "ADMIN_PASSWORD is not set on the server. Add it to .env and restart." },
      { status: 503 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";

  if (tooManyAttempts(ip)) {
    return Response.json(
      { error: "Too many attempts. Try again in a few minutes." },
      { status: 429 },
    );
  }

  let username = "";
  let password = "";

  try {
    const body = (await request.json()) as { username?: string; password?: string };
    username = typeof body.username === "string" ? body.username : "";
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return Response.json({ error: "Malformed request." }, { status: 400 });
  }

  if (!checkCredentials(username || ADMIN_USERNAME, password)) {
    recordFailure(ip);
    return Response.json({ error: "That username and password do not match." }, { status: 401 });
  }

  attempts.delete(ip);

  const response = Response.json({ ok: true, username: ADMIN_USERNAME });
  const token = createSessionToken(ADMIN_USERNAME);

  const parts = [
    `${SESSION_COOKIE}=${token}`,
    `Path=${sessionCookieOptions.path}`,
    `Max-Age=${sessionCookieOptions.maxAge}`,
    "HttpOnly",
    "SameSite=Lax",
    ...(sessionCookieOptions.secure ? ["Secure"] : []),
  ];
  response.headers.set("Set-Cookie", parts.join("; "));

  return response;
}
