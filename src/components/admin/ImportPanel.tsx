"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";

import PromptPanel from "@/components/admin/PromptPanel";
import type { Change, ImportIssue, RowChange } from "@/lib/cms/import";

interface ScopeOption {
  id: string;
  label: string;
  href: string | null;
}

interface Preview {
  changes: Change[];
  issues: ImportIssue[];
}

/** Values go into a diff cell, so a 900-character paragraph has to be tamed. */
function preview(value: unknown, limit = 260): string {
  if (value === undefined || value === null) return "—";
  if (typeof value === "string") return value.length > limit ? `${value.slice(0, limit)}…` : value || "(empty)";
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  const json = JSON.stringify(value);
  return json.length > limit ? `${json.slice(0, limit)}…` : json;
}

const ROW_STATE: Record<RowChange["state"], string> = {
  added: "New",
  removed: "Removed",
  changed: "Edited",
  moved: "Moved",
};

/**
 * The inbound half of the round trip: paste, check, look at what it would do,
 * then publish the parts you agree with.
 *
 * Nothing here decides what is legal — the server re-runs the whole validation
 * on apply. This screen's job is to make a language model's decisions visible
 * before they become the website.
 */
export default function ImportPanel({ scopes }: { scopes: ScopeOption[] }) {
  const [scope, setScope] = useState(scopes[0]?.id ?? "");
  const [raw, setRaw] = useState("");
  const [checking, setChecking] = useState(false);
  const [applying, setApplying] = useState(false);
  const [result, setResult] = useState<Preview | null>(null);
  const [rejected, setRejected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setResult(null);
    setRejected(new Set());
    setError(null);
    setDone(null);
  }, []);

  const readFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      reset();
      setRaw(await file.text());
    },
    [reset],
  );

  const check = useCallback(async () => {
    setChecking(true);
    reset();

    try {
      const response = await fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope, raw }),
      });

      const data = (await response.json()) as Preview & { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Could not read that JSON.");
        return;
      }

      setResult({ changes: data.changes, issues: data.issues });
    } catch {
      setError("Could not reach the server.");
    } finally {
      setChecking(false);
    }
  }, [raw, reset, scope]);

  const apply = useCallback(async () => {
    if (!result) return;

    const acceptedPaths = result.changes
      .map((change) => change.path)
      .filter((path) => !rejected.has(path));

    setApplying(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/import/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope, raw, acceptedPaths }),
      });

      const data = (await response.json()) as { applied?: number; error?: string };

      if (!response.ok) {
        setError(data.error ?? "Could not publish.");
        return;
      }

      setResult(null);
      setRaw("");
      setDone(
        `${data.applied} change${data.applied === 1 ? "" : "s"} published. The site is live with them.`,
      );
    } catch {
      setError("Could not reach the server.");
    } finally {
      setApplying(false);
    }
  }, [raw, rejected, result, scope]);

  const toggle = (path: string) =>
    setRejected((current) => {
      const next = new Set(current);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });

  const current = scopes.find((option) => option.id === scope);
  const accepted = result ? result.changes.length - rejected.size : 0;
  const dropped = result?.issues.filter((issue) => issue.severity === "dropped") ?? [];
  const adjusted = result?.issues.filter((issue) => issue.severity !== "dropped") ?? [];

  return (
    <>
      {/* ------------------------------------------------------- 1. the prompt */}
      <section className="admin-card">
        <div className="admin-card-head">
          <div>
            <h2>1 · Get the prompt</h2>
            <p>Pick what you want to rewrite, then take the prompt to ChatGPT.</p>
          </div>
        </div>
        <div className="admin-card-body">
          <div className="admin-field">
            <label className="admin-label" htmlFor="import-scope">
              What are you rewriting?
            </label>
            <select
              id="import-scope"
              className="admin-select"
              value={scope}
              onChange={(event) => {
                setScope(event.target.value);
                reset();
              }}
            >
              {scopes.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="admin-help">
              One page at a time keeps the conversation short and the JSON reliable. The
              whole site is there for a full rewrite.
            </p>
          </div>

          <PromptPanel key={scope} scope={scope} label={current?.label ?? "this page"} />
        </div>
      </section>

      {/* ------------------------------------------------- 2. the json coming back */}
      <section className="admin-card">
        <div className="admin-card-head">
          <div>
            <h2>2 · Bring the JSON back</h2>
            <p>Drop the file ChatGPT gave you, or paste the code block.</p>
          </div>
        </div>
        <div className="admin-card-body">
          <div
            className="admin-drop"
            data-dragging={dragging ? "" : undefined}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              void readFile(event.dataTransfer.files[0]);
            }}
          >
            <p>
              Drop a <code>.json</code> file here, or{" "}
              <button
                type="button"
                className="admin-btn"
                data-size="sm"
                onClick={() => fileInput.current?.click()}
              >
                choose a file
              </button>
            </p>
            <input
              ref={fileInput}
              type="file"
              accept="application/json,.json,.txt"
              hidden
              onChange={(event) => {
                void readFile(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </div>

          <div className="admin-field">
            <label className="admin-label" htmlFor="import-raw">
              …or paste it here
            </label>
            <textarea
              id="import-raw"
              className="admin-textarea"
              rows={8}
              value={raw}
              placeholder={'Paste the whole reply — the ```json block and any chat around it is fine.'}
              onChange={(event) => {
                setRaw(event.target.value);
                reset();
              }}
            />
          </div>

          <div className="admin-list-foot">
            <button
              type="button"
              className="admin-btn"
              data-variant="primary"
              onClick={() => void check()}
              disabled={checking || !raw.trim()}
            >
              {checking ? "Checking…" : "Check this JSON"}
            </button>
            {raw.trim() ? (
              <button
                type="button"
                className="admin-btn"
                data-variant="ghost"
                onClick={() => {
                  setRaw("");
                  reset();
                }}
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {error ? (
        <div className="admin-notice" data-tone="error">
          {error}
        </div>
      ) : null}

      {done ? (
        <div className="admin-notice" data-tone="info">
          <strong>{done}</strong>{" "}
          {current?.href ? (
            <a href={current.href} target="_blank" rel="noreferrer">
              View the page ↗
            </a>
          ) : null}{" "}
          <Link href="/admin/revisions">Undo from Revisions</Link>
        </div>
      ) : null}

      {/* --------------------------------------------------- 3. what would change */}
      {result ? (
        <section className="admin-card">
          <div className="admin-card-head">
            <div>
              <h2>3 · Check what it would change</h2>
              <p>
                {result.changes.length === 0
                  ? "Nothing — this matches what is already on the site."
                  : `${result.changes.length} field${
                      result.changes.length === 1 ? "" : "s"
                    } would change. Untick anything you do not want.`}
              </p>
            </div>
          </div>

          <div className="admin-card-body">
            {dropped.length > 0 ? (
              <div className="admin-notice" data-tone="warn">
                <strong>
                  {dropped.length} thing{dropped.length === 1 ? " was" : "s were"} ignored.
                </strong>
                <ul className="admin-issues">
                  {dropped.map((issue, index) => (
                    <li key={`${issue.path}-${index}`}>
                      <code>{issue.path}</code> {issue.reason}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {adjusted.length > 0 ? (
              <div className="admin-notice" data-tone="info">
                <ul className="admin-issues">
                  {adjusted.map((issue, index) => (
                    <li key={`${issue.path}-${index}`}>
                      <code>{issue.path}</code> {issue.reason}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {result.changes.length === 0 ? (
              <p className="admin-empty">No changes to publish.</p>
            ) : (
              <div className="admin-diff">
                {result.changes.map((change) => {
                  const off = rejected.has(change.path);

                  return (
                    <article className="admin-diff-item" key={change.path} data-off={off ? "" : undefined}>
                      <label className="admin-check admin-diff-head">
                        <input type="checkbox" checked={!off} onChange={() => toggle(change.path)} />
                        <span>
                          <strong>{change.label}</strong>
                          <code>{change.path}</code>
                        </span>
                      </label>

                      {change.isList ? (
                        <ul className="admin-diff-rows">
                          {change.rows.map((row) => (
                            <li key={`${row.state}-${row.id}`}>
                              <span className="admin-pill" data-state={row.state}>
                                {ROW_STATE[row.state]}
                              </span>{" "}
                              <strong>{row.title}</strong>
                              {row.fields.length > 0 ? (
                                <ul className="admin-diff-fields">
                                  {row.fields.map((field) => (
                                    <li key={field.label}>
                                      <em>{field.label}</em>
                                      <del>{preview(field.before)}</del>
                                      <ins>{preview(field.after)}</ins>
                                    </li>
                                  ))}
                                </ul>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="admin-diff-fields">
                          <del>{preview(change.before)}</del>
                          <ins>{preview(change.after)}</ins>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {result.changes.length > 0 ? (
            <div className="admin-savebar">
              <p className="admin-savebar-status">
                {accepted} of {result.changes.length} ticked · a snapshot is saved before
                anything is written
              </p>
              <div className="admin-savebar-actions">
                <button
                  type="button"
                  className="admin-btn"
                  data-variant="primary"
                  onClick={() => void apply()}
                  disabled={applying || accepted === 0}
                >
                  {applying ? "Publishing…" : `Apply ${accepted} change${accepted === 1 ? "" : "s"}`}
                </button>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
    </>
  );
}
