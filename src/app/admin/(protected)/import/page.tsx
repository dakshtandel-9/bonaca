import ImportPanel from "@/components/admin/ImportPanel";
import { SITE_WIDE } from "@/lib/cms/fields";
import { CMS_SCHEMA } from "@/lib/cms/schema";

export const dynamic = "force-dynamic";

/**
 * Write the site's copy in ChatGPT, bring back one JSON file, review it, publish.
 *
 * The whole flow lives on one screen on purpose: the prompt and the JSON that
 * answers it belong to the same piece of work, and splitting them across pages
 * would only invite importing a file against the wrong page group.
 */
export default function ImportPage() {
  const scopes = [
    ...CMS_SCHEMA.map((page) => ({ id: page.id, label: page.label, href: page.href })),
    { id: SITE_WIDE, label: "The whole site", href: "/" },
  ];

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>AI import</h1>
          <p>
            Rewrite a page by talking to ChatGPT, then bring the result back as a file.
            Nothing goes live until you have seen exactly what it changes.
          </p>
        </div>
      </div>

      <div className="admin-notice" data-tone="info">
        <strong>Photographs are never touched.</strong> ChatGPT is not shown your images and
        cannot set them — every picture stays where you put it in the media library, and a
        new row arrives without one for you to fill in.
      </div>

      <ImportPanel scopes={scopes} />
    </>
  );
}
