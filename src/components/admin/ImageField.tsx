"use client";

import { useRef, useState } from "react";

import MediaPicker from "@/components/admin/MediaPicker";

/**
 * One image slot: a preview, an upload button, the library, and the raw URL
 * for the cases the other two do not cover (a photograph already on a CDN, or
 * one of the originals still sitting in /public).
 */
export default function ImageField({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (next: string) => void;
  id: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  async function upload(file: File) {
    setUploading(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("file", file);

      const response = await fetch("/api/admin/media", { method: "POST", body: form });
      const data = (await response.json()) as { item?: { url: string }; error?: string };

      if (!response.ok || !data.item) {
        setError(data.error ?? "Upload failed.");
        return;
      }

      onChange(data.item.url);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="admin-image">
      <div className="admin-image-preview">
        {value ? (
          /* A plain <img>: the CRM previews arbitrary URLs the moment they are
             typed, which is exactly what next/image is not for. */
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" loading="lazy" />
        ) : (
          <span>No image</span>
        )}
      </div>

      <div className="admin-image-tools">
        <input
          id={id}
          className="admin-input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="/images/… or https://…"
          spellCheck={false}
        />

        <div className="admin-image-actions">
          <button
            type="button"
            className="admin-btn"
            data-size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading…" : "Upload"}
          </button>

          <button
            type="button"
            className="admin-btn"
            data-size="sm"
            onClick={() => setPickerOpen(true)}
          >
            Choose from library
          </button>

          {value ? (
            <button
              type="button"
              className="admin-btn"
              data-size="sm"
              data-variant="danger"
              onClick={() => onChange("")}
            >
              Clear
            </button>
          ) : null}
        </div>

        {uploading ? (
          <div className="admin-progress" aria-hidden="true">
            <span style={{ width: "60%" }} />
          </div>
        ) : null}

        {error ? (
          <p className="admin-notice" data-tone="error" role="alert">
            {error}
          </p>
        ) : null}

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

      {pickerOpen ? (
        <MediaPicker
          onClose={() => setPickerOpen(false)}
          onSelect={(url) => {
            onChange(url);
            setPickerOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
