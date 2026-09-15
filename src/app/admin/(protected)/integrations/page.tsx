import Link from "next/link";

import { mcpConfig } from "@/lib/mcp/auth";

export const dynamic = "force-dynamic";

export default function IntegrationsPage() {
  const config = mcpConfig();
  const oauthReady = Boolean(config.issuer && config.jwksUrl);
  const tokenReady = Boolean(config.token && config.token.length >= 32);
  return (
    <>
      <div className="admin-header">
        <div>
          <h1>AI connections</h1>
          <p>Connect an assistant to edit every page of this website through conversation.</p>
        </div>
      </div>
      <section className="admin-card">
        <div className="admin-card-head"><h2>Bonaca CRM MCP</h2></div>
        <div className="admin-card-body">
          <p>Ask your connected assistant to change the hero text, update a rate, rewrite FAQs,
            or update several sections together. Requested edits publish directly to this site.</p>
          <dl className="admin-meta-list">
            <div><dt>Connection URL</dt><dd style={{ overflowWrap: "anywhere" }}><code>{config.resource}</code></dd></div>
            <div><dt>ChatGPT sign-in</dt><dd>{oauthReady ? "OAuth settings configured; connection testing required" : "OAuth setup required"}</dd></div>
            <div><dt>Machine access</dt><dd>{tokenReady ? "Access token configured" : "Access token not configured"}</dd></div>
            <div><dt>Access</dt><dd>All pages and settings in this Bonaca CRM</dd></div>
          </dl>
        </div>
      </section>
      <section className="admin-card">
        <div className="admin-card-head"><h2>Connect ChatGPT</h2></div>
        <div className="admin-card-body">
          <ol>
            <li>Have your developer configure OAuth sign-in for this site and deploy the connection URL over HTTPS.</li>
            <li>Add this MCP server in ChatGPT&apos;s developer settings using the connection URL above and OAuth authentication.</li>
            <li>Sign in with an account authorized to edit this site, then enable the connection in your conversation.</li>
          </ol>
          <p>Other MCP clients can connect using a separately configured access token.
            Each separate CRM website needs its own connection and credentials.</p>
          <p><a href="https://developers.openai.com/plugins/build/auth" target="_blank" rel="noreferrer">ChatGPT authentication guide ↗</a></p>
        </div>
      </section>
      <section className="admin-card">
        <div className="admin-card-head"><h2>Try these requests</h2></div>
        <div className="admin-card-body">
          <ul>
            <li>“Change the homepage hero heading to ‘A slower kind of stay’.”</li>
            <li>“Set the accommodation headline rate to ₹18,000 per night.”</li>
            <li>“Show me the current FAQs, then shorten the answer about check-in.”</li>
            <li>“Undo the last website edit.”</li>
          </ul>
          <p>Every published AI edit saves a snapshot first. You can also restore it from <Link href="/admin/revisions">Revisions</Link>.</p>
        </div>
      </section>
    </>
  );
}
