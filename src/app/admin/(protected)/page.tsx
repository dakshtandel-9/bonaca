import Link from "next/link";

import ComingSoonToggle from "@/components/admin/ComingSoonToggle";

import { getSiteContentUncached } from "@/lib/cms/content";
import { isIndexable, launchIssues } from "@/lib/cms/derive";
import { CMS_SCHEMA } from "@/lib/cms/schema";
import { readStoredContent, storageBackend } from "@/lib/cms/store";
import { mediaBackend } from "@/lib/server/media";

export const dynamic = "force-dynamic";

/**
 * The landing screen: where to go, what is still a placeholder, and whether
 * the content and images are actually going anywhere permanent yet.
 */
export default async function AdminDashboard() {
  const [content, stored] = await Promise.all([
    getSiteContentUncached(),
    readStoredContent(),
  ]);

  const issues = launchIssues(content);
  const indexable = isIndexable(content);

  const counts = {
    gallery: content.home.gallery.items.length,
    spaces: content.home.rooms.items.length,
    bedrooms: content.accommodation.rooms.items.length,
    experiences: content.experiences.items.length,
    faqs: content.knowBeforeYouBook.items.length,
    reviews: content.home.reviews.items.length,
    amenities: content.amenities.items.length,
  };

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Every page and every section of the Bonaca website is editable here. Changes go
            live the moment you publish.
          </p>
        </div>
        <a className="admin-btn" href="/" target="_blank" rel="noreferrer">
          View site ↗
        </a>
      </div>

      <ComingSoonToggle enabled={content.comingSoon.enabled} />

      {storageBackend === "file" ? (
        <div className="admin-notice" data-tone="warn">
          <strong>Firebase is not connected.</strong> Edits are being saved to{" "}
          <code>.data/content.json</code> on this machine. Add the{" "}
          <code>FIREBASE_*</code> keys to <code>.env</code> to store them in Firestore —
          without it, a deploy to a new server starts from the shipped content.
        </div>
      ) : null}

      {mediaBackend === "local" ? (
        <div className="admin-notice" data-tone="warn">
          <strong>Cloudflare R2 is not connected.</strong> Uploads are being written to{" "}
          <code>public/uploads/</code>. Add the <code>R2_*</code> keys to <code>.env</code>{" "}
          to store photographs in the bucket instead.
        </div>
      ) : null}

      {issues.length > 0 ? (
        <div className="admin-notice" data-tone={indexable ? "info" : "warn"}>
          <strong>
            {indexable
              ? "Indexing has been forced on, but some details are still placeholders:"
              : "The site is hidden from search engines until these are filled in:"}
          </strong>{" "}
          {issues.join(", ")}.
        </div>
      ) : (
        <div className="admin-notice" data-tone="info">
          <strong>Everything is filled in.</strong> The site is open to search engines and
          listed in the sitemap.
        </div>
      )}

      <section className="admin-card" style={{ marginTop: "1.25rem" }}>
        <div className="admin-card-head">
          <h2>Pages</h2>
        </div>
        <div className="admin-card-body">
          <div className="admin-grid-cards">
            {CMS_SCHEMA.filter((page) => page.href).map((page) => (
              <Link className="admin-tile" key={page.id} href={`/admin/pages/${page.id}`}>
                <h3>{page.label}</h3>
                <p>{page.summary}</p>
                <small>
                  {page.sections.length} sections · {page.href}
                </small>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-card-head">
          <h2>Site settings</h2>
          <p>Details that appear on more than one page.</p>
        </div>
        <div className="admin-card-body">
          <div className="admin-grid-cards">
            {CMS_SCHEMA.filter((page) => !page.href).map((page) => (
              <Link className="admin-tile" key={page.id} href={`/admin/pages/${page.id}`}>
                <h3>{page.label}</h3>
                <p>{page.summary}</p>
                <small>{page.sections.length} sections</small>
              </Link>
            ))}
            <Link className="admin-tile" href="/admin/media">
              <h3>Media library</h3>
              <p>Every photograph uploaded to the site, in one place.</p>
              <small>{mediaBackend === "r2" ? "Cloudflare R2" : "Local folder"}</small>
            </Link>
            <Link className="admin-tile" href="/admin/import">
              <h3>AI import</h3>
              <p>Rewrite a page with ChatGPT, then bring the result back as one file.</p>
              <small>Reviewed before anything is published</small>
            </Link>
            <Link className="admin-tile" href="/admin/revisions">
              <h3>Revisions</h3>
              <p>Snapshots taken before each import, and the way back from one.</p>
              <small>Last 10 kept</small>
            </Link>
          </div>
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-card-head">
          <h2>What is on the site right now</h2>
        </div>
        <div className="admin-card-body">
          <dl className="admin-meta-list">
            <div>
              <dt>Last published</dt>
              <dd>
                {stored?.updatedAt
                  ? new Date(stored.updatedAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "Never — the site is showing its shipped content"}
              </dd>
            </div>
            <div>
              <dt>Public site</dt>
              <dd>{content.comingSoon.enabled ? "Coming soon page" : "Live"}</dd>
            </div>
            <div>
              <dt>Content store</dt>
              <dd>{storageBackend === "firestore" ? "Firebase Firestore" : "Local file"}</dd>
            </div>
            <div>
              <dt>Image store</dt>
              <dd>{mediaBackend === "r2" ? "Cloudflare R2" : "public/uploads"}</dd>
            </div>
            <div>
              <dt>Gallery photographs</dt>
              <dd>{counts.gallery}</dd>
            </div>
            <div>
              <dt>Spaces / bedrooms</dt>
              <dd>
                {counts.spaces} / {counts.bedrooms}
              </dd>
            </div>
            <div>
              <dt>Experiences</dt>
              <dd>{counts.experiences}</dd>
            </div>
            <div>
              <dt>Amenities</dt>
              <dd>{counts.amenities}</dd>
            </div>
            <div>
              <dt>Questions answered</dt>
              <dd>{counts.faqs}</dd>
            </div>
            <div>
              <dt>Guest reviews</dt>
              <dd>{counts.reviews}</dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
