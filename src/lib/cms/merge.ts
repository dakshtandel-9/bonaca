import { DEFAULT_CONTENT } from "@/lib/cms/defaults";
import type { SiteContent } from "@/lib/cms/types";

type Plain = Record<string, unknown>;

const isPlainObject = (value: unknown): value is Plain =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Layer one document over another.
 *
 * Two rules, and they matter:
 *
 *  • Objects merge key by key, and only keys the base knows about survive —
 *    a stale field left behind by an older CRM build cannot reach a component.
 *  • Arrays replace wholesale, because deleting the fourth room has to actually
 *    delete it. Each item is still patched against the base item's shape, so
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

/**
 * Layer a partial payload over an arbitrary base document.
 *
 * The base decides which keys exist and what each one's type is, so passing the
 * *current* content rather than the defaults is what lets a partial import —
 * "here are the new experiences, nothing else" — leave the rest of the site
 * standing. Merging that same payload over `DEFAULT_CONTENT` would quietly
 * reset every page it did not mention.
 */
export function mergeInto<T>(base: T, incoming: unknown): T {
  return mergeValue(base, incoming) as T;
}

/** Merge an arbitrary stored payload into a complete, renderable `SiteContent`. */
export function withDefaults(stored: unknown): SiteContent {
  return mergeInto(DEFAULT_CONTENT, stored);
}

/** A structural clone of the shipped content, safe to hand to the editor. */
export function cloneDefaults(): SiteContent {
  return structuredClone(DEFAULT_CONTENT);
}
