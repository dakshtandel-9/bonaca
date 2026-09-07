import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * A single-operator session for the CRM.
 *
 * There is one account — the owner — so this is a signed cookie rather than a
 * user table: the payload carries the username and an expiry, and an HMAC over
 * it means the browser cannot mint or extend its own session.
 */

export const SESSION_COOKIE = "bonaca_admin";
const MAX_AGE_SECONDS = 60 * 60 * 12; // A working day, then log back in.

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME?.trim() || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";

/**
 * Without a secret the sessions would be forgeable, so one is generated per
 * process. The cost is that everyone is logged out on restart — loud enough to
 * notice in production, harmless in development.
 */
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET?.trim() || randomBytes(32).toString("hex");

export const isAdminConfigured = ADMIN_PASSWORD.length > 0;

interface SessionPayload {
  username: string;
  /** Unix seconds. */
  exp: number;
}

const encode = (value: string) => Buffer.from(value, "utf8").toString("base64url");
const decode = (value: string) => Buffer.from(value, "base64url").toString("utf8");

const sign = (body: string) =>
  createHmac("sha256", SESSION_SECRET).update(body).digest("base64url");

/** Length-safe comparison, so neither secrets nor signatures leak by timing. */
function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function checkCredentials(username: string, password: string): boolean {
  if (!isAdminConfigured) return false;
  /* Both halves are always compared, so a wrong username and a wrong password
     take the same time to reject. */
  const userOk = safeEqual(username.trim().toLowerCase(), ADMIN_USERNAME.toLowerCase());
  const passOk = safeEqual(password, ADMIN_PASSWORD);
  return userOk && passOk;
}

export function createSessionToken(username: string): string {
  const payload: SessionPayload = {
    username,
    exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS,
  };
  const body = encode(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
}

export function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;

  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  if (!safeEqual(signature, sign(body))) return null;

  try {
    const payload = JSON.parse(decode(body)) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/** The signed-in operator, or `null`. Safe to call from any server context. */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE_SECONDS,
} as const;
