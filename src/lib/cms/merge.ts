import { DEFAULT_CONTENT } from "@/lib/cms/defaults";
import type { SiteContent } from "@/lib/cms/types";

type Plain = Record<string, unknown>;

const isPlainObject = (value: unknown): value is Plain =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Layer a stored document over the defaults.
 *
 * Two rules, and they matter:
 *
 *  • Objects merge key by key, and only keys the defaults know about survive —
 *    a stale field left behind by an older CRM build cannot reach a component.
 *  • Arrays replace wholesale, because deleting the fourth room has to actually
 *    delete it. Each item is still patched against the default item's shape, so
 *    a row saved before a field existed renders with that field's default
 *    rather than `undefined` in the markup.
 */
function mergeValue(fallback: unknown, stored: unknown): unknown {
  if (stored === undefined || stored === null) return fallback;

  if (Array.isArray(fallback)) {
    if (!Array.isArray(stored)) return fallback;
    const template = fallback[0];
    return stored.map((item) =>
      isPlainObject(template) && isPlainObject(item) ? mergeValue(template, item) : item,
    );
  }

  if (isPlainObject(fallback)) {
    if (!isPlainObject(stored)) return fallback;
    const out: Plain = {};
    for (const key of Object.keys(fallback)) {
      out[key] = mergeValue(fallback[key], stored[key]);
    }
    return out;
  }

  /* A number field that arrives as a numeric string (every HTML input does
     this) is worth keeping rather than silently discarding. */
  if (typeof fallback === "number" && typeof stored === "string" && stored.trim() !== "") {
    const parsed = Number(stored);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  if (typeof fallback !== typeof stored) return fallback;
  return stored;
}

/** Merge an arbitrary stored payload into a complete, renderable `SiteContent`. */
export function withDefaults(stored: unknown): SiteContent {
  return mergeValue(DEFAULT_CONTENT, stored) as SiteContent;
}

/** A structural clone of the shipped content, safe to hand to the editor. */
export function cloneDefaults(): SiteContent {
  return structuredClone(DEFAULT_CONTENT);
}
