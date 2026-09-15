import assert from "node:assert/strict";
import { test } from "node:test";
import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT } from "jose";
import { authenticateMcp, verifyOAuthToken } from "../src/lib/mcp/auth";

test("machine auth is disabled without a strong dedicated token", async () => {
  const previous = process.env.MCP_API_TOKEN;
  try {
    process.env.MCP_API_TOKEN = "short";
    assert.equal(await authenticateMcp(new Request("https://site.test/api/mcp", { headers: { Authorization: "Bearer short" } })), null);
    process.env.MCP_API_TOKEN = "a".repeat(64);
    assert.equal(await authenticateMcp(new Request("https://site.test/api/mcp")), null);
    const identity = await authenticateMcp(new Request("https://site.test/api/mcp", { headers: { Authorization: `Bearer ${"a".repeat(64)}` } }));
    assert.deepEqual(identity?.scopes, ["content:read", "content:write"]);
  } finally {
    if (previous === undefined) delete process.env.MCP_API_TOKEN;
    else process.env.MCP_API_TOKEN = previous;
  }
});

test("OAuth verifies signature, issuer, audience, expiry and scopes", async () => {
  const { privateKey, publicKey } = await generateKeyPair("RS256");
  const keys = createLocalJWKSet({ keys: [{ ...await exportJWK(publicKey), kid: "test", alg: "RS256" }] });
  const issuer = "https://auth.test/";
  const resource = "https://site.test/api/mcp";
  const sign = (claims: Record<string, unknown> = {}) => new SignJWT({ scope: "content:read content:write", ...claims })
    .setProtectedHeader({ alg: "RS256", kid: "test" }).setIssuer(issuer).setAudience(resource)
    .setSubject("editor").setIssuedAt().setExpirationTime("5m").sign(privateKey);
  const token = await sign();
  assert.equal((await verifyOAuthToken(token, issuer, resource, keys)).subject, "oauth:editor");
  await assert.rejects(verifyOAuthToken(token, "https://other.test/", resource, keys));
  await assert.rejects(verifyOAuthToken(token, issuer, "https://other-site.test/api/mcp", keys));
  await assert.rejects(verifyOAuthToken(await sign({ scope: "content:write" }), issuer, resource, keys));
  const expired = await new SignJWT({ scope: "content:read" }).setProtectedHeader({ alg: "RS256", kid: "test" })
    .setIssuer(issuer).setAudience(resource).setSubject("editor").setIssuedAt(1).setExpirationTime(2).sign(privateKey);
  await assert.rejects(verifyOAuthToken(expired, issuer, resource, keys));
  const other = await generateKeyPair("RS256");
  await assert.rejects(verifyOAuthToken(token, issuer, resource, createLocalJWKSet({ keys: [{ ...await exportJWK(other.publicKey), kid: "test", alg: "RS256" }] })));
});
