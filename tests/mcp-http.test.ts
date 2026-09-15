import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { mkdtemp, symlink, copyFile, cp, rm, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

test("real HTTP MCP: auth, discovery, publish, conflict, revision, undo and corrupt-store protection", { timeout: 180000 }, async () => {
  // A separate Next project and content directory: never read or mutate the owner's .env/.data.
  const root = process.cwd();
  const directory = await mkdtemp(join(tmpdir(), "bonaca-mcp-test-"));
  await cp(join(root, "src"), join(directory, "src"), { recursive: true });
  for (const name of ["public", "node_modules"]) await symlink(join(root, name), join(directory, name), "dir");
  for (const name of ["package.json", "tsconfig.json", "next.config.ts"]) await copyFile(join(root, name), join(directory, name));
  const socket = createServer();
  await new Promise<void>((resolve) => socket.listen(0, "127.0.0.1", resolve));
  const port = (socket.address() as { port: number }).port;
  await new Promise<void>((resolve) => socket.close(() => resolve()));
  const origin = `http://localhost:${port}`;
  const endpoint = `${origin}/api/mcp`;
  const token = randomBytes(32).toString("hex");
  const child = spawn(process.execPath, [join(root, "node_modules/next/dist/bin/next"), "dev", directory, "--webpack", "--port", String(port)], {
    cwd: directory,
    env: { ...process.env, NODE_ENV: "development", NEXT_TELEMETRY_DISABLED: "1", NEXT_PUBLIC_SITE_URL: origin,
      FIREBASE_PROJECT_ID: "", FIREBASE_CLIENT_EMAIL: "", FIREBASE_PRIVATE_KEY: "", R2_ACCOUNT_ID: "",
      MCP_API_TOKEN: token, MCP_OAUTH_ISSUER: "https://auth.test/", MCP_OAUTH_JWKS_URL: "https://auth.test/jwks",
      ADMIN_USERNAME: "tester", ADMIN_PASSWORD: "isolated-test-password", ADMIN_SESSION_SECRET: randomBytes(32).toString("hex") },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let logs = "";
  child.stdout.on("data", (chunk) => { logs = (logs + chunk).slice(-10000); });
  child.stderr.on("data", (chunk) => { logs = (logs + chunk).slice(-10000); });
  const client = new Client({ name: "bonaca-test", version: "1.0.0" });
  try {
    let ready = false;
    for (let i = 0; i < 120; i++) {
      if (child.exitCode !== null) throw new Error(logs);
      try {
        const response = await fetch(endpoint, { signal: AbortSignal.timeout(1000) });
        if (response.status === 405) { ready = true; break; }
      } catch { /* Startup/compilation is still in progress. */ }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    assert.ok(ready, logs);
    const anonymous = await fetch(endpoint, { method: "POST", body: "{}" });
    assert.equal(anonymous.status, 401);
    assert.match(anonymous.headers.get("www-authenticate")!, /oauth-protected-resource/);
    const metadata = await (await fetch(`${origin}/.well-known/oauth-protected-resource/api/mcp`)).json();
    assert.equal(metadata.resource, endpoint);
    const hostile = await fetch(endpoint, { method: "POST", headers: { Origin: "https://evil.test", Authorization: `Bearer ${token}` }, body: "{}" });
    assert.equal(hostile.status, 403);
    const oversized = await fetch(endpoint, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: "x".repeat(1024 * 1024 + 1) });
    assert.equal(oversized.status, 413);
    await client.connect(new StreamableHTTPClientTransport(new URL(endpoint), { requestInit: { headers: { Authorization: `Bearer ${token}` } } }));
    const tools = await client.listTools();
    assert.equal(tools.tools.length, 7);
    assert.equal(tools.tools.find((tool) => tool.name === "update_content")?.annotations?.readOnlyHint, false);
    const call = async (name: string, args = {}) => {
      const response = await client.callTool({ name, arguments: args });
      assert.ok(!response.isError, JSON.stringify(response));
      return response.structuredContent as Record<string, unknown>;
    };
    const fields = await call("list_content_fields");
    assert.ok((fields.paths as string[]).includes("home.hero.titleLines"));
    const initial = await call("read_content", { path: "home.hero" });
    const edits = [{ path: "home.hero.titleLines", value: ["MCP test title"] }, { path: "accommodation.rates.leadAmount", value: 18000 }];
    const preview = await call("preview_edits", { edits });
    assert.equal(preview.published, false);
    const saved = await call("update_content", { expectedVersion: initial.version, edits });
    assert.equal(saved.published, true);
    const hero = await call("read_content", { path: "home.hero.titleLines" });
    assert.deepEqual(hero.content, ["MCP test title"]);
    const record = JSON.parse(await readFile(join(directory, ".data/content.json"), "utf8"));
    assert.equal(record.content.accommodation.rates.leadAmount, 18000);
    assert.equal(record.updatedBy, "mcp:api-token");
    const conflict = await client.callTool({ name: "update_content", arguments: { expectedVersion: initial.version, edits } });
    assert.equal(conflict.isError, true);
    const invalid = await client.callTool({ name: "update_content", arguments: { expectedVersion: saved.version, edits: [{ path: "home.reviews.items.0.rating", value: 100 }] } });
    assert.equal(invalid.isError, true);
    const revisions = await call("list_revisions");
    assert.equal((revisions.revisions as unknown[]).length, 1);
    await call("restore_revision", { id: saved.revisionId, expectedVersion: saved.version });
    assert.deepEqual((await call("read_content", { path: "home.hero" })).content, initial.content);
    await call("list_media");
    const latest = await call("read_content");
    const simultaneous = await Promise.all(["First", "Second"].map((value) => client.callTool({ name: "update_content", arguments: {
      expectedVersion: latest.version, edits: [{ path: "home.hero.eyebrow", value }],
    } })));
    assert.equal(simultaneous.filter((response) => !response.isError).length, 1, "only one concurrent edit can win");
    const login = await fetch(`${origin}/api/admin/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: "tester", password: "isolated-test-password" }) });
    assert.equal(login.status, 200);
    const page = await fetch(`${origin}/admin/integrations`, { headers: { Cookie: login.headers.get("set-cookie")!.split(";")[0] } });
    assert.equal(page.status, 200);
    const html = await page.text();
    assert.match(html, /AI connections/);
    assert.ok(!html.includes(token), "admin page must not expose credentials");
    // Corrupt storage must not be treated as a fresh site during editing.
    await writeFile(join(directory, ".data/content.json"), "{broken");
    const broken = await client.callTool({ name: "read_content", arguments: {} });
    assert.equal(broken.isError, true);
    assert.equal(await readFile(join(directory, ".data/content.json"), "utf8"), "{broken");
  } catch (error) {
    throw new Error(`${error instanceof Error ? error.stack : error}\nServer logs:\n${logs}`);
  } finally {
    await client.close().catch(() => undefined);
    const exited = new Promise<void>((resolve) => child.once("exit", () => resolve()));
    child.kill("SIGTERM");
    if (child.exitCode === null) await exited;
    await rm(directory, { recursive: true, force: true });
  }
});
