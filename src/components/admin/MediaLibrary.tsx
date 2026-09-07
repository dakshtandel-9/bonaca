"use client";

import { useRef, useState } from "react";

import type { MediaItem } from "@/lib/cms/types";

const formatSize = (bytes: number) =>
  bytes > 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

/** Upload, browse, copy a URL, delete. */
export default function MediaLibrary({ initialItems }: { initialItems: MediaItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList) {
    setUploading(true);
    setError(null);

    for (const file of Array.from(files)) {
      try {
        const form = new FormData();
        form.append("file", file);

        const response = await fetch("/api/admin/media", { method: "POST", body: form });
        const data = (await response.json()) as { item?: MediaItem; error?: string };

        if (!response.ok || !data.item) {
          setError(data.error ?? `Could not upload ${file.name}.`);
          continue;
        }

        setItems((current) => [data.item!, ...current]);
      } catch {
        setError(`Could not upload ${file.name}.`);
      }
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function remove(item: MediaItem) {
    if (
      !window.confirm(
        "Delete this file permanently? Any page still pointing at it will show a broken image.",
      )
    ) {
      return;
    }

    const response = await fetch(`/api/admin/media?key=${encodeURIComponent(item.key)}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Could not delete that file.");
      return;
    }

    setItems((current) => current.filter((entry) => entry.key !== item.key));
  }

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setError("Could not copy — select the URL and copy it by hand.");
    }
  }

  return (
    <section className="admin-card">
      <div className="admin-card-head">
        <div>
          <h2>{items.length} files</h2>
          <p>JPG, PNG, WebP, AVIF, GIF or SVG. Up to 15 MB each.</p>
        </div>
        <button
          type="button"
          className="admin-btn"
          data-variant="primary"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "Uploading…" : "Upload images"}
        </button>
      </div>

      <div className="admin-card-body">
        {error ? (
          <p className="admin-notice" data-tone="error" role="alert">
            {error}
          </p>
        ) : null}

        {items.length === 0 ? (
          <p className="admin-empty">
            Nothing uploaded yet. The photography that shipped with the site lives in{" "}
            <code>/public/images</code> and can still be used by typing its path into any
            image field.
          </p>
        ) : (
          <div className="admin-media-grid" style={{ marginTop: error ? "1rem" : 0 }}>
            {items.map((item) => (
              <figure className="admin-media-tile" key={item.key} style={{ cursor: "default" }}>
                <button
                  type="button"
                  className="admin-media-delete"
                  onClick={() => void remove(item)}
                  aria-label="Delete file"
                >
                  ✕
                </button>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt="" loading="lazy" />

                <figcaption title={item.key}>{item.key.split("/").pop()}</figcaption>

                <div style={{ padding: "0 0.5rem 0.5rem", display: "flex", gap: "0.35rem" }}>
                  <button
                    type="button"
                    className="admin-btn"
                    data-size="sm"
                    onClick={() => void copy(item.url)}
                  >
                    {copied === item.url ? "Copied" : "Copy URL"}
                  </button>
                  <span className="admin-help" style={{ marginTop: "0.35rem" }}>
                    {formatSize(item.size)}
                  </span>
                </div>
              </figure>
            ))}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(event) => {
            if (event.target.files?.length) void uploadFiles(event.target.files);
          }}
        />
      </div>
    </section>
  );
}
