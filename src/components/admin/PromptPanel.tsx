"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * The outbound half of the ChatGPT round trip.
 *
 * Callers that can change `scope` should pass it as `key` too — a fetched
 * prompt belongs to the scope it was built for, and remounting is a cleaner
 * reset than tearing three pieces of state down by hand.
 *
 * The prompt is fetched rather than rendered into the page because it is built
 * from the live content and runs to tens of kilobytes — shipping eight of them
 * down with every page load, to be read at most once, is not a trade worth
 * making.
 */
export default function PromptPanel({
  scope,
  label,
  open: initialOpen = false,
}: {
  scope: string;
  label: string;
  open?: boolean;
}) {
  const [open, setOpen] = useState(initialOpen);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open || prompt || error) return;

    let cancelled = false;

    void (async () => {
      try {
        const response = await fetch(`/api/admin/prompt?scope=${encodeURIComponent(scope)}`);
        const data = (await response.json()) as { prompt?: string; error?: string };

        if (cancelled) return;
        if (!response.ok || !data.prompt) {
          setError(data.error ?? "Could not build the prompt.");
          return;
        }
        setPrompt(data.prompt);
      } catch {
        if (!cancelled) setError("Could not reach the server.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, prompt, error, scope]);

  const copy = useCallback(async () => {
    if (!prompt) return;

    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setError("Could not reach the clipboard — select the text below and copy it.");
    }
  }, [prompt]);

  return (
    <div className="admin-prompt">
      <div className="admin-prompt-head">
        <button
          type="button"
          className="admin-btn"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
        >
          {open ? "Hide the prompt" : "Write with ChatGPT"}
        </button>

        {open && prompt ? (
          <>
            <button type="button" className="admin-btn" data-variant="primary" onClick={() => void copy()}>
              {copied ? "Copied ✓" : "Copy prompt"}
            </button>
            <a className="admin-btn" href="https://chatgpt.com/" target="_blank" rel="noreferrer">
              Open ChatGPT ↗
            </a>
          </>
        ) : null}
      </div>

      {open ? (
        <div className="admin-prompt-body">
          <p className="admin-help">
            Rewriting <strong>{label}</strong>.
          </p>

          <ol className="admin-steps">
            <li>Copy the prompt and paste it into a new ChatGPT conversation.</li>
            <li>
              Talk to it about the content — ask for rewrites, new rows, a different tone.
              Nothing here changes while you do.
            </li>
            <li>
              When you are happy, ask for the final JSON, then bring it back to{" "}
              <strong>AI import</strong> as a file or pasted text.
            </li>
          </ol>

          {error ? (
            <div className="admin-notice" data-tone="error">
              {error}
            </div>
          ) : null}

          {prompt ? (
            <textarea
              className="admin-textarea admin-prompt-text"
              value={prompt}
              readOnly
              rows={14}
              onFocus={(event) => event.currentTarget.select()}
              aria-label="The prompt to paste into ChatGPT"
            />
          ) : error ? null : (
            <p className="admin-help">Building the prompt…</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
