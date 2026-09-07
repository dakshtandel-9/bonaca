"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import FieldControl from "@/components/admin/FieldControl";
import { getAtPath, setAtPath } from "@/lib/cms/path";
import type { PageSchema } from "@/lib/cms/schema";
import type { SiteContent } from "@/lib/cms/types";

type SaveState = "idle" | "dirty" | "saving" | "saved" | "error";

/**
 * The editing surface for one page group.
 *
 * It holds the whole site in state, not just this group, because publishing
 * writes the document in one piece — a partial patch would let two tabs
 * overwrite each other field by field. Only this group's sections are drawn.
 */
export default function ContentEditor({
  page,
  initialContent,
  updatedAt,
}: {
  page: PageSchema;
  initialContent: SiteContent;
  updatedAt: string | null;
}) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [state, setState] = useState<SaveState>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(updatedAt);

  const dirty = state === "dirty" || state === "error";

  /* A page group is remounted on navigation, so a fresh server payload has to
     replace state — otherwise switching pages would show the previous one. */
  useEffect(() => {
    setContent(initialContent);
    setState("idle");
    setMessage(null);
  }, [initialContent, page.id]);

  useEffect(() => {
    if (!dirty) return;

    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const update = useCallback((path: string, next: unknown) => {
    setContent((current) => setAtPath(current, path, next));
    setState("dirty");
    setMessage(null);
  }, []);

  const publish = useCallback(async () => {
    setState("saving");
    setMessage(null);

    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const data = (await response.json()) as {
        error?: string;
        updatedAt?: string;
        content?: SiteContent;
      };

      if (!response.ok) {
        setState("error");
        setMessage(data.error ?? "Could not publish.");
        return;
      }

      if (data.content) setContent(data.content);
      setLastSaved(data.updatedAt ?? new Date().toISOString());
      setState("saved");
      setMessage("Published. The site is live with these changes.");
    } catch {
      setState("error");
      setMessage("Could not reach the server.");
    }
  }, [content]);

  /* ⌘S / Ctrl-S, because that is what anyone editing text reaches for. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (state !== "saving") void publish();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [publish, state]);

  const savedLabel = useMemo(() => {
    if (!lastSaved) return "Never published";
    const date = new Date(lastSaved);
    return `Last published ${date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    })}`;
  }, [lastSaved]);

  const statusText =
    state === "saving"
      ? "Publishing…"
      : state === "error"
        ? message ?? "Something went wrong"
        : state === "dirty"
          ? "Unsaved changes"
          : state === "saved"
            ? message ?? "Published"
            : savedLabel;

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>{page.label}</h1>
          <p>{page.summary}</p>
        </div>

        {page.href ? (
          <a
            className="admin-btn"
            href={page.href}
            target="_blank"
            rel="noreferrer"
          >
            View page ↗
          </a>
        ) : null}
      </div>

      {page.sections.map((section) => (
        <section className="admin-card" key={section.id} id={`section-${section.id}`}>
          <div className="admin-card-head">
            <div>
              <h2>{section.label}</h2>
              {section.description ? <p>{section.description}</p> : null}
            </div>

            {page.href && section.anchor ? (
              <a
                className="admin-anchor-link"
                href={`${page.href}#${section.anchor}`}
                target="_blank"
                rel="noreferrer"
              >
                See it on the site ↗
              </a>
            ) : null}
          </div>

          <div className="admin-card-body">
            <div className="admin-fields">
              {section.fields.map((field) => {
                const path = section.path ? `${section.path}.${field.name}` : field.name;
                return (
                  <FieldControl
                    key={path}
                    field={field}
                    value={getAtPath(content, path)}
                    onChange={(next) => update(path, next)}
                  />
                );
              })}
            </div>
          </div>
        </section>
      ))}

      <div className="admin-savebar">
        <p className="admin-savebar-status">
          <span
            className="admin-dot"
            data-state={
              state === "dirty" ? "dirty" : state === "saved" ? "saved" : state === "error" ? "error" : undefined
            }
            aria-hidden="true"
          />
          {statusText}
        </p>

        <div className="admin-savebar-actions">
          <Link className="admin-btn" data-variant="ghost" href="/admin">
            Dashboard
          </Link>
          <button
            type="button"
            className="admin-btn"
            data-variant="primary"
            onClick={() => void publish()}
            disabled={state === "saving"}
          >
            {state === "saving" ? "Publishing…" : "Publish changes"}
          </button>
        </div>
      </div>
    </>
  );
}
