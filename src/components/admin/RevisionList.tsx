"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { Revision } from "@/lib/cms/revisions";

const WHY: Record<string, string> = {
  import: "before an AI import",
  restore: "before restoring an earlier snapshot",
};

/**
 * Putting a snapshot back.
 *
 * Behind a confirm because it replaces the whole site in one go — and because
 * the row it replaces is itself snapshotted first, the confirm can promise that
 * honestly rather than warning about something irreversible.
 */
export default function RevisionList({ revisions }: { revisions: Revision[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  async function restore(revision: Revision) {
    const when = new Date(revision.savedAt).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    if (!window.confirm(`Put the whole site back to how it was on ${when}?`)) return;

    setBusy(revision.id);
    setError(null);
    setDone(null);

    try {
      const response = await fetch(`/api/admin/revisions/${revision.id}/restore`, {
        method: "POST",
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Could not restore that snapshot.");
        return;
      }

      setDone(`Restored the site to ${when}.`);
      router.refresh();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(null);
    }
  }

  if (revisions.length === 0) {
    return (
      <p className="admin-empty">
        No snapshots yet. One is saved automatically before every AI import.
      </p>
    );
  }

  return (
    <>
      {error ? (
        <div className="admin-notice" data-tone="error">
          {error}
        </div>
      ) : null}
      {done ? (
        <div className="admin-notice" data-tone="info">
          {done}
        </div>
      ) : null}

      <ul className="admin-revisions">
        {revisions.map((revision) => (
          <li key={revision.id}>
            <div>
              <strong>
                {new Date(revision.savedAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </strong>
              <small>
                Saved {WHY[revision.reason] ?? revision.reason}
                {revision.scope && revision.scope !== "site-wide" ? ` of ${revision.scope}` : ""} ·
                by {revision.by}
              </small>
            </div>

            <button
              type="button"
              className="admin-btn"
              onClick={() => void restore(revision)}
              disabled={busy !== null}
            >
              {busy === revision.id ? "Restoring…" : "Restore"}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
