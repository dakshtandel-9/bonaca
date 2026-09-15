import assert from "node:assert/strict";
import { test } from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { cloneDefaults } from "../src/lib/cms/merge";
import { contentVersion } from "../src/lib/cms/mcp-content";
import { createContentMcpServer } from "../src/lib/mcp/server";

test("read-only OAuth identities cannot publish or restore", async () => {
  let writes = 0;
  const current = cloneDefaults();
  const server = createContentMcpServer({ subject: "oauth:reader", scopes: ["content:read"] }, {
    async read() { return current; },
    async publish() { writes++; return {}; },
    async restore() { writes++; return {}; },
    async revisions() { return []; }, async media() { return []; },
  });
  const client = new Client({ name: "permissions-test", version: "1" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  await client.connect(clientTransport);
  try {
    assert.ok(!(await client.callTool({ name: "read_content", arguments: {} })).isError);
    for (const [name, args] of [
      ["update_content", { expectedVersion: contentVersion(current), edits: [{ path: "home.hero.eyebrow", value: "Changed" }] }],
      ["restore_revision", { expectedVersion: contentVersion(current), id: "snapshot" }],
    ] as const) {
      const response = await client.callTool({ name, arguments: args });
      assert.equal(response.isError, true);
      assert.ok(response._meta?.["mcp/www_authenticate"]);
    }
    assert.equal(writes, 0);
  } finally { await client.close(); await server.close(); }
});
