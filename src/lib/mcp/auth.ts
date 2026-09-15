import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from "jose";

export const READ_SCOPE = "content:read";
export const WRITE_SCOPE = "content:write";
export interface McpIdentity { subject: string; scopes: string[] }

export function mcpConfig() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const resource = new URL("/api/mcp", base).href;
  return {
    resource,
    metadataUrl: new URL("/.well-known/oauth-protected-resource/api/mcp", base).href,
    issuer: process.env.MCP_OAUTH_ISSUER?.trim(),
    jwksUrl: process.env.MCP_OAUTH_JWKS_URL?.trim(),
    token: process.env.MCP_API_TOKEN?.trim(),
  };
}

const keySets = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

export async function verifyOAuthToken(
  token: string,
  issuer: string,
  resource: string,
  keys: JWTVerifyGetKey,
): Promise<McpIdentity> {
  const { payload } = await jwtVerify(token, keys, {
    issuer, audience: resource, algorithms: ["RS256", "ES256"], requiredClaims: ["exp", "sub", "iat"],
  });
  const scopes = typeof payload.scope === "string" ? payload.scope.split(/\s+/) : [];
  if (!payload.sub || !scopes.includes(READ_SCOPE)) throw new Error("Missing content read permission.");
  return { subject: `oauth:${payload.sub}`, scopes };
}

export async function authenticateMcp(request: Request): Promise<McpIdentity | null> {
  const match = request.headers.get("authorization")?.match(/^Bearer ([^\s]+)$/i);
  if (!match) return null;
  const token = match[1];
  const config = mcpConfig();
  // A separate machine credential; never accept the CRM password or cookie.
  if (config.token && config.token.length >= 32) {
    const digest = (value: string) => createHash("sha256").update(value).digest();
    if (timingSafeEqual(digest(token), digest(config.token))) {
      return { subject: "mcp:api-token", scopes: [READ_SCOPE, WRITE_SCOPE] };
    }
  }
  if (!config.issuer || !config.jwksUrl) return null;
  try {
    if (new URL(config.issuer).protocol !== "https:" || new URL(config.jwksUrl).protocol !== "https:") return null;
    let keys = keySets.get(config.jwksUrl);
    if (!keys) {
      keys = createRemoteJWKSet(new URL(config.jwksUrl));
      keySets.set(config.jwksUrl, keys);
    }
    return await verifyOAuthToken(token, config.issuer, config.resource, keys);
  } catch {
    return null;
  }
}

export function authChallenge(scope = READ_SCOPE) {
  return `Bearer resource_metadata="${mcpConfig().metadataUrl}", scope="${scope}"`;
}
