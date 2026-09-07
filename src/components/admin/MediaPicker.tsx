"use client";

import { useEffect, useRef, useState } from "react";

import type { MediaItem } from "@/lib/cms/types";

/** The library, as a modal, for picking an image already uploaded. */
export default function MediaPicker({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (url: string) => void;
}) {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const response = await fetch("/api/admin/media");
        const data = (await response.json()) as { items?: MediaItem[]; error?: string };
        if (cancelled) return;

        if (!response.ok) setError(data.error ?? "Could not load the library.");
        else setItems(data.items ?? []);
      } catch {
        if (!cancelled) setError("Could not reach the server.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function upload(file: File) {
    setUploading(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/admin/media", { method: "POST", body: form });
      const data = (await response.json()) as { item?: MediaItem; error?: string };

      if (!response.ok || !data.item) {
        setError(data.error ?? "Upload failed.");
        return;
      }

      setItems((current) => [data.item!, ...(current ?? [])]);
      onSelect(data.item.url);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      className="admin-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Media library"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="admin-modal">
        <div className="admin-modal-head">
          <h2>Media library</h2>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              className="admin-btn"
              data-size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading…" : "Upload new"}
            </button>
            <button type="button" className="admin-btn" data-size="sm" onClick={onClose}>
              Close
            </button>
          </div>
        </div>

        <div className="admin-modal-body">
          {error ? (
            <p className="admin-notice" data-tone="error" role="alert">
              {error}
            </p>
          ) : null}

          {items === null ? (
            <p className="admin-empty">Loading…</p>
          ) : items.length === 0 ? (
            <p className="admin-empty">
              Nothing uploaded yet. Use “Upload new”, or type a path to a file already in{" "}
              <code>/public</code>.
            </p>
          ) : (
            <div className="admin-media-grid">
              {items.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className="admin-media-tile"
                  onClick={() => onSelect(item.url)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt="" loading="lazy" />
                  <figcaption>{item.key.split("/").pop()}</figcaption>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
        }}
      />
    </div>
  );
}
