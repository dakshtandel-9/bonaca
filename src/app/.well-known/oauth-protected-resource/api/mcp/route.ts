import { mcpConfig, READ_SCOPE, WRITE_SCOPE } from "@/lib/mcp/auth";

export const dynamic = "force-dynamic";

export function GET() {
  const config = mcpConfig();
  if (!config.issuer || !config.jwksUrl) return Response.json({ error: "OAuth is not configured." }, { status: 503 });
  return Response.json({ resource: config.resource, authorization_servers: [config.issuer],
    scopes_supported: [READ_SCOPE, WRITE_SCOPE], bearer_methods_supported: ["header"], resource_name: "Bonaca CRM" });
}
