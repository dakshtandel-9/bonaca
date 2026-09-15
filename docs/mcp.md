# Edit Bonaca through an AI assistant

The application serves a Streamable HTTP MCP server at `/api/mcp`. It connects
to the same content store and schema as `/admin`, so assistants can publish
text, numbers, links, image URLs, switches and lists across every CRM section.
The assistant interprets the conversation; this endpoint does not need an
OpenAI API key or a second model call.

## Tools

| Tool | Purpose |
| --- | --- |
| `list_content_fields` | Discover page ids, section paths, field types and list templates. |
| `read_content` | Read current content and its version, optionally at one path. |
| `preview_edits` | Validate a batch and return before/after values without saving. |
| `update_content` | Publish 1–100 edits together, with an expected content version. |
| `list_media` | Find uploaded image URLs. |
| `list_revisions` | Find previous content snapshots. |
| `restore_revision` | Restore the entire site to a snapshot, saving the current site first. |

Reads require `content:read`; writes require both `content:read` and
`content:write`. Write tools are marked as writes so clients can apply their
own consent settings. The endpoint never accepts the admin password or cookie.

## Connect ChatGPT

1. Deploy this app at your stable HTTPS domain. Set `NEXT_PUBLIC_SITE_URL` to
   that origin. Use Firestore for serverless hosting; local files need a
   persistent, writable volume.
2. Configure an OAuth authorization server for your CRM editors. It must expose
   OAuth or OIDC discovery metadata, authorization code flow with PKCE `S256`,
   and a supported registration method (CIMD, dynamic registration, or a
   predefined client configured in ChatGPT).
3. Register the exact resource/audience `https://YOUR-DOMAIN/api/mcp`. The
   provider must honor the OAuth `resource` parameter and issue signed JWT
   access tokens for this audience, with `iss`, `sub`, `iat`, `exp` and a
   space-separated `scope` claim. Supported signing algorithms: RS256, ES256.
   Grant `content:read` and `content:write` only to authorized editors; do not
   give these scopes to everyone who can sign up with the provider.
4. Set `MCP_OAUTH_ISSUER` to the provider's exact issuer and
   `MCP_OAUTH_JWKS_URL` to its HTTPS `jwks_uri`. Redeploy/restart.
5. Add the MCP URL in ChatGPT developer settings and choose OAuth. If using a
   predefined client, register the exact callback URL shown by ChatGPT with
   your provider. Sign in and enable the connection for the conversation.

Discovery is published at
`/.well-known/oauth-protected-resource/api/mcp` and advertised in the
`WWW-Authenticate` header of unauthenticated POST responses. Authentication
checks signature, issuer, audience, expiration and scopes on every request.
OAuth is configured externally; this repository does not provision an identity
provider or create a ChatGPT account connection for you.

See the official [authentication guide](https://developers.openai.com/plugins/build/auth)
and [connection guide](https://developers.openai.com/plugins/deploy/connect-chatgpt).
Client availability and write confirmations depend on your account and settings.

## Connect a bearer-token MCP client

For Codex or another client that supports custom authorization headers:

1. Generate a separate secret with `openssl rand -hex 32` and set
   `MCP_API_TOKEN` in the server environment. Tokens shorter than 32 characters
   are rejected. Do not reuse `ADMIN_PASSWORD`.
2. Put the same secret in the client's environment as `BONACA_MCP_TOKEN`.
3. Configure the client with the MCP URL and
   `Authorization: Bearer <BONACA_MCP_TOKEN>`.

Example Codex configuration:

See the official [MCP configuration reference](https://learn.chatgpt.com/docs/extend/mcp?surface=cli).

```toml
[mcp_servers.bonaca]
url = "https://YOUR-DOMAIN/api/mcp"
bearer_token_env_var = "BONACA_MCP_TOKEN"
```

This is a full-access machine credential for this one site. Rotate it by
changing `MCP_API_TOKEN` and restarting the server. ChatGPT user sign-in uses
the OAuth setup above. Never paste credentials into a chat or commit them.

## Example tool sequence

Read `home.hero`, then call `update_content` with the returned version:

```json
{
  "expectedVersion": "<version from read_content>",
  "edits": [
    { "path": "home.hero.titleLines", "value": ["A slower", "kind of stay"] },
    { "path": "accommodation.rates.leadAmount", "value": 18000 }
  ]
}
```

Use `home.overview.stats.0.value` to edit an existing list row. Replace the
whole array to add, remove or reorder rows; retain every row that should stay.
Object rows use their schema template and preserve existing fields by id.
Read the schema before adding rows. Use uploaded media or image URLs supplied
by the user; this server does not generate or upload image files.

Publishing rejects unknown paths, wrong types, out-of-range values, duplicate
ids, overlapping edits and stale versions. No changes are saved if validation
fails. Before publishing, it saves a revision; if the snapshot fails, publishing
stops. A Firestore transaction (or local file lock and atomic rename) checks the
version at write time. Existing admin full-document saves retain their existing
last-writer behavior; reload an open editor after AI edits before publishing it.
The last ten snapshots are retained and can also be restored in `/admin/revisions`.

Each deployment controls one CRM. Reuse this integration on another deployment
with separate storage, OAuth resource and credentials. Arbitrary third-party
CRMs need their own adapters; this implementation does not grant cross-site access.

## Verify

```bash
npm run test:mcp
npm run lint
npx tsc --noEmit
npm run build
```

Use MCP Inspector against the running endpoint for a real provider smoke test.
For a browser-based Inspector, add its exact Origin to `MCP_ALLOWED_ORIGINS`.
Use its proxy for cross-origin browser requests; the endpoint does not enable
wildcard CORS. The default transport uses stateless JSON responses, with GET
and DELETE returning 405. Requests are limited to 1 MB.

The local store's lock waits up to five seconds. If a process crashes while
holding `.data/content.json.lock`, stop all writers and remove that empty lock
directory before restarting; do not remove it while a save is in progress.
