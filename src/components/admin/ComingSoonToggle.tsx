"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * The switch, on the dashboard where it can be found in a hurry.
 *
 * Turning the site *off* asks first; turning it back on does not. The two
 * directions are not equally consequential, and a confirm on the harmless one
 * only teaches people to click through the dialog that matters.
 */
export default function ComingSoonToggle({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    const next = !enabled;

    if (
      next &&
      !window.confirm(
        "Replace the whole public website with the coming soon page? Visitors will not be able to reach any page until you turn it off.",
      )
    ) {
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/coming-soon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: next }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Could not change the setting.");
        return;
      }

      router.refresh();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-notice" data-tone={enabled ? "warn" : "info"}>
      <div className="admin-switch">
        <p>
          {enabled ? (
            <>
              <strong>The site is showing the coming soon page.</strong> Every public page
              is replaced by it and search engines are being turned away. The CRM is
              unaffected.
            </>
          ) : (
            <>
              <strong>The site is live.</strong> Switch to the coming soon page to take
              every public page down while you work.
            </>
          )}
        </p>

        <button
          type="button"
          className="admin-btn"
          data-variant={enabled ? "primary" : undefined}
          onClick={() => void toggle()}
          disabled={busy}
        >
          {busy ? "Saving…" : enabled ? "Put the site back up" : "Show coming soon page"}
        </button>
      </div>

      {error ? <p className="admin-switch-error">{error}</p> : null}
    </div>
  );
}
