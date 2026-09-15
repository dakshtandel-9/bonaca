import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";

import { authenticateMcp, authChallenge, mcpConfig } from "@/lib/mcp/auth";
import { createContentMcpServer } from "@/lib/mcp/server";
import { contentService } from "@/lib/mcp/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const allowed = new Set([new URL(mcpConfig().resource).origin,
    ...(process.env.MCP_ALLOWED_ORIGINS?.split(",").map((value) => value.trim()).filter(Boolean) ?? [])]);
  if (origin && !allowed.has(origin)) return Response.json({ error: "Origin not allowed." }, { status: 403 });
  const identity = await authenticateMcp(request);
  if (!identity) return Response.json({ error: "MCP authentication required." }, {
    status: 401, headers: { "WWW-Authenticate": authChallenge(), "Cache-Control": "no-store" },
  });
  // Bound the body while reading, including clients using chunked encoding.
  const reader = request.body?.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 1024 * 1024) {
        await reader.cancel();
        return Response.json({ error: "Request exceeds 1 MB." }, { status: 413 });
      }
      chunks.push(value);
    }
  }
  let parsedBody: unknown;
  try { parsedBody = JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { return Response.json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }, { status: 400 }); }
  const server = createContentMcpServer(identity, contentService);
  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  try {
    await server.connect(transport);
    const response = await transport.handleRequest(request, { parsedBody });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } finally {
    await server.close();
  }
}

// Stateless request/response transport does not open SSE or retain sessions.
function methodNotAllowed() {
  return new Response(null, { status: 405, headers: { Allow: "POST" } });
}
export const GET = methodNotAllowed;
export const DELETE = methodNotAllowed;
