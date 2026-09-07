import MediaLibrary from "@/components/admin/MediaLibrary";
import type { MediaItem } from "@/lib/cms/types";
import { listMedia, mediaBackend } from "@/lib/server/media";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  let items: MediaItem[] = [];
  let error: string | null = null;

  try {
    items = await listMedia();
  } catch (cause) {
    error =
      cause instanceof Error
        ? `Could not read the library: ${cause.message}`
        : "Could not read the library.";
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Media library</h1>
          <p>
            Every photograph uploaded through the CRM. Upload here, or from any image field
            while you are editing a page.
          </p>
        </div>
        <span className="admin-pill" data-tone={mediaBackend === "r2" ? undefined : "warn"}>
          {mediaBackend === "r2" ? "Cloudflare R2" : "Local folder"}
        </span>
      </div>

      {error ? (
        <div className="admin-notice" data-tone="error">
          {error}
        </div>
      ) : null}

      <MediaLibrary initialItems={items} />
    </>
  );
}
