/**
 * ============================================================================
 *  Taking JSON from a chat window and making it safe to publish.
 * ============================================================================
 *
 *  Three stages, deliberately separate so the preview and the apply can run the
 *  identical pipeline: parse what a chat window actually pastes, validate every
 *  value against `CMS_SCHEMA`, then describe what would change.
 *
 *  The validator keeps only what is legal and reports everything it refused,
 *  rather than rejecting a whole import over one bad field — a model that got
 *  eight paragraphs right and one rating wrong should not cost you the eight.
 */

import { collectFieldRefs, describePath, lockedNames, scopePages } from "@/lib/cms/fields";
import { mergeInto } from "@/lib/cms/merge";
import { getAtPath, setAtPath, uniqueId } from "@/lib/cms/path";
import type { Field } from "@/lib/cms/schema";
import type { SiteContent } from "@/lib/cms/types";

type Plain = Record<string, unknown>;

const isPlainObject = (value: unknown): value is Plain =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Something the importer refused, changed, or wants to point out. */
export interface ImportIssue {
  path: string;
  label: string;
  reason: string;
  severity: "dropped" | "adjusted" | "note";
}

/** One row inside a list that changed, for the preview to render. */
export interface RowChange {
  id: string;
  title: string;
  state: "added" | "removed" | "changed" | "moved";
  fields: { label: string; before: unknown; after: unknown }[];
}

/** One accept-or-reject unit in the preview. */
export interface Change {
  path: string;
  label: string;
  before: unknown;
  after: unknown;
  isList: boolean;
  rows: RowChange[];
}

/* ------------------------------------------------------------------ parsing */

/**
 * Pull JSON out of whatever the chat window put on the clipboard.
 *
 * Fenced block first, because that is what the prompt asks for; failing that,
 * the outermost braces, which covers a bare object with "Here you go:" in front
 * of it and a friendly sign-off after.
 */
function extractJson(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const fenced = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)```/i);
  if (fenced?.[1]?.trim()) return fenced[1].trim();

  const open = trimmed.indexOf("{");
  const close = trimmed.lastIndexOf("}");
  if (open !== -1 && close > open) return trimmed.slice(open, close + 1);

  return null;
}

/**
 * A payload written against one page group, but returned without its wrapper —
 * `{ "items": [...] }` where the CRM expects `{ "experiences": { "items": ... } }`.
 * Only applied when nothing at the top level is recognised on its own, so a
 * correctly shaped document is never second-guessed.
 */
function autoWrap(payload: Plain, scope: string): Plain {
  const pages = scopePages(scope);
  if (pages.length !== 1) return payload;

  const roots = new Set(collectFieldRefs(scope).map((ref) => ref.path.split(".")[0]));
  const recognised = Object.keys(payload).some((key) => roots.has(key));
  if (recognised) return payload;

  const wrapped = { [pages[0].id]: payload };
  const known = new Set(collectFieldRefs(scope).map((ref) => ref.path));
  const reachable = [...known].some((path) => getAtPath(wrapped, path) !== undefined);

  return reachable ? wrapped : payload;
}

export function parsePayload(
  raw: string,
  scope: string,
): { data: Plain } | { error: string } {
  const source = extractJson(raw);
  if (!source) {
    return { error: "No JSON found. Paste the whole code block ChatGPT gave you." };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(source);
  } catch (error) {
    return {
      error: `That is not valid JSON${
        error instanceof Error ? ` — ${error.message}` : ""
      }. Ask ChatGPT to send the JSON again on its own.`,
    };
  }

  if (!isPlainObject(parsed)) {
    return { error: "The JSON has to be an object, not a list or a bare value." };
  }

  /* The prompt asks for the content itself, but a chat window will sometimes
     wrap it the way the API does. */
  const unwrapped =
    isPlainObject(parsed.content) && Object.keys(parsed).length === 1
      ? parsed.content
      : parsed;

  return { data: autoWrap(unwrapped, scope) };
}

/* --------------------------------------------------------------- validating */

const isUsableUrl = (value: string): boolean =>
  value === "" ||
  value.startsWith("/") ||
  value.startsWith("#") ||
  /^(https?:|mailto:|tel:)/i.test(value);

/** Check one non-list field. `undefined` means "refused"; the issue says why. */
function coerceField(
  field: Field,
  value: unknown,
  path: string,
  label: string,
  issues: ImportIssue[],
): unknown {
  const drop = (reason: string) => {
    issues.push({ path, label, reason, severity: "dropped" });
    return undefined;
  };

  switch (field.kind) {
    case "image":
      return drop("Photographs are set in the admin, not by ChatGPT.");

    case "text":
    case "textarea":
      if (typeof value !== "string") return drop("Expected text.");
      return value.trim();

    case "url": {
      if (typeof value !== "string") return drop("Expected a link.");
      const url = value.trim();
      if (!isUsableUrl(url)) return drop(`"${url}" is not a usable link.`);
      return url;
    }

    case "number": {
      const parsed = typeof value === "string" ? Number(value.trim()) : value;
      if (typeof parsed !== "number" || !Number.isFinite(parsed)) {
        return drop("Expected a number.");
      }
      if (field.min !== undefined && parsed < field.min) {
        issues.push({
          path,
          label,
          reason: `${parsed} is below the minimum of ${field.min} — raised to ${field.min}.`,
          severity: "adjusted",
        });
        return field.min;
      }
      if (field.max !== undefined && parsed > field.max) {
        issues.push({
          path,
          label,
          reason: `${parsed} is above the maximum of ${field.max} — lowered to ${field.max}.`,
          severity: "adjusted",
        });
        return field.max;
      }
      return parsed;
    }

    case "boolean":
      if (typeof value === "boolean") return value;
      if (value === "true") return true;
      if (value === "false") return false;
      return drop("Expected true or false.");

    case "select": {
      const allowed = field.options.map((option) => option.value);
      if (typeof value !== "string" || !allowed.includes(value)) {
        return drop(`"${String(value)}" is not one of: ${allowed.join(", ")}.`);
      }
      return value;
    }

    case "stringList": {
      if (!Array.isArray(value)) return drop("Expected a list.");
      const kept = value.filter((entry): entry is string => typeof entry === "string");
      if (kept.length !== value.length) {
        issues.push({
          path,
          label,
          reason: `${value.length - kept.length} item(s) were not text and were removed.`,
          severity: "adjusted",
        });
      }
      return kept.map((entry) => entry.trim());
    }

    case "objectList":
      /* Handled by coerceList, which needs the current rows to match against. */
      return undefined;
  }
}

/**
 * Validate a list, matching each row back to the one it came from.
 *
 * Matching by id is what lets photographs survive a rewrite: the model never
 * sees them, so the picture, its dimensions and its focal point are carried
 * over from the existing row rather than being left blank.
 */
function coerceList(
  field: Extract<Field, { kind: "objectList" }>,
  value: unknown,
  path: string,
  label: string,
  current: unknown,
  issues: ImportIssue[],
): unknown {
  if (!Array.isArray(value)) {
    issues.push({ path, label, reason: "Expected a list of rows.", severity: "dropped" });
    return undefined;
  }

  if (field.min !== undefined && value.length < field.min) {
    issues.push({
      path,
      label,
      reason: `Only ${value.length} row(s) supplied but the site needs at least ${field.min}. The whole list was left as it is.`,
      severity: "dropped",
    });
    return undefined;
  }

  const existing = Array.isArray(current) ? current : [];
  const byId = new Map<string, Plain>();
  for (const row of existing) {
    if (isPlainObject(row) && typeof row.id === "string") byId.set(row.id, row);
  }

  const locked = lockedNames(field.fields);
  const taken: string[] = [];
  const out: Plain[] = [];

  /* Counted rather than reported row by row: a model that decided to invent
     photographs usually invents one for every row, and ten identical warnings
     bury the issues that actually need reading. */
  let refusedPhotos = 0;

  value.forEach((row, index) => {
    if (!isPlainObject(row)) {
      issues.push({
        path: `${path}.${index}`,
        label,
        reason: `Row ${index + 1} was not an object and was skipped.`,
        severity: "dropped",
      });
      return;
    }

    const titleValue = row[field.titleKey];
    const seed =
      typeof row.id === "string" && row.id.trim()
        ? row.id
        : typeof titleValue === "string" && titleValue.trim()
          ? titleValue
          : field.itemLabel;

    const id = uniqueId(seed, taken);
    taken.push(id);

    const previous = byId.get(id);
    const base: Plain = previous
      ? { ...previous }
      : { ...(field.template as Plain), id };

    if (!previous && field.fields.some((rowField) => rowField.kind === "image")) {
      issues.push({
        path: `${path}.${id}`,
        label,
        reason: `"${id}" is a new row — add its photograph in the admin once this is applied.`,
        severity: "note",
      });
    }

    for (const rowField of field.fields) {
      if (locked.has(rowField.name)) {
        if (row[rowField.name] !== undefined) refusedPhotos += 1;
        continue;
      }
      if (rowField.name === "id") continue;

      const incoming = row[rowField.name];
      if (incoming === undefined) continue;

      const rowLabel = `${label} · ${id} · ${rowField.label}`;
      const clean =
        rowField.kind === "objectList"
          ? coerceList(rowField, incoming, `${path}.${id}.${rowField.name}`, rowLabel, base[rowField.name], issues)
          : coerceField(rowField, incoming, `${path}.${id}.${rowField.name}`, rowLabel, issues);

      if (clean !== undefined) base[rowField.name] = clean;
    }

    base.id = id;
    out.push(base);
  });

  if (refusedPhotos > 0) {
    issues.push({
      path,
      label,
      reason: `${refusedPhotos} photograph field(s) were ignored — pictures are set in the admin, and each row kept the one it already had.`,
      severity: "dropped",
    });
  }

  return out;
}

export interface ValidationResult {
  /** Only the values that passed, at their real dot paths. */
  clean: Plain;
  issues: ImportIssue[];
}

/**
 * Walk the payload against the schema, keeping what is legal.
 *
 * Anything the schema does not describe is dropped rather than merged — the
 * store would strip it on write anyway, and reporting it here is how you find
 * out the model invented a field.
 */
export function validateImport(
  scope: string,
  payload: Plain,
  current: SiteContent,
): ValidationResult {
  const refs = collectFieldRefs(scope);
  const byPath = new Map(refs.map((ref) => [ref.path, ref]));

  /* Every ancestor of a known path, so the walk knows what to descend into. */
  const prefixes = new Set<string>();
  for (const ref of refs) {
    const parts = ref.path.split(".");
    for (let i = 1; i < parts.length; i += 1) prefixes.add(parts.slice(0, i).join("."));
  }

  const issues: ImportIssue[] = [];
  let clean: Plain = {};

  const walk = (node: unknown, path: string) => {
    const ref = byPath.get(path);

    if (ref) {
      const label = describePath(ref);

      /* A dimension or focal-point field sitting beside a photograph is locked
         for the same reason the photograph is. */
      if (lockedNames(ref.section.fields).has(ref.field.name)) {
        issues.push({
          path,
          label,
          reason: "Describes a photograph, which ChatGPT does not set.",
          severity: "dropped",
        });
        return;
      }

      const value =
        ref.field.kind === "objectList"
          ? coerceList(ref.field, node, path, label, getAtPath(current, path), issues)
          : coerceField(ref.field, node, path, label, issues);

      if (value !== undefined) clean = setAtPath(clean, path, value);
      return;
    }

    if (!isPlainObject(node)) {
      issues.push({
        path,
        label: path,
        reason: "Not a field this site has — ignored.",
        severity: "dropped",
      });
      return;
    }

    for (const key of Object.keys(node)) {
      const child = path ? `${path}.${key}` : key;

      if (!byPath.has(child) && !prefixes.has(child)) {
        issues.push({
          path: child,
          label: child,
          reason: "Not a field this site has — ignored.",
          severity: "dropped",
        });
        continue;
      }

      walk(node[key], child);
    }
  };

  walk(payload, "");

  return { clean, issues };
}

/* ---------------------------------------------------------------- diffing */

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, index) => deepEqual(item, b[index]));
  }

  if (isPlainObject(a) && isPlainObject(b)) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    return [...keys].every((key) => deepEqual(a[key], b[key]));
  }

  return false;
}

const rowTitle = (row: Plain, titleKey: string, fallback: string): string => {
  const value = row[titleKey];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
};

/** Row-level detail for a list, so the preview names the bedroom that changed. */
function diffRows(
  field: Extract<Field, { kind: "objectList" }>,
  before: unknown,
  after: unknown,
): RowChange[] {
  const oldRows = Array.isArray(before) ? before.filter(isPlainObject) : [];
  const newRows = Array.isArray(after) ? after.filter(isPlainObject) : [];

  const oldById = new Map(oldRows.map((row, index) => [String(row.id ?? index), { row, index }]));
  const newById = new Map(newRows.map((row, index) => [String(row.id ?? index), { row, index }]));

  const changes: RowChange[] = [];

  newRows.forEach((row, index) => {
    const id = String(row.id ?? index);
    const previous = oldById.get(id);
    const title = rowTitle(row, field.titleKey, id);

    if (!previous) {
      changes.push({ id, title, state: "added", fields: [] });
      return;
    }

    const fields = field.fields
      .filter((rowField) => !deepEqual(previous.row[rowField.name], row[rowField.name]))
      .map((rowField) => ({
        label: rowField.label,
        before: previous.row[rowField.name],
        after: row[rowField.name],
      }));

    if (fields.length > 0) {
      changes.push({ id, title, state: "changed", fields });
    } else if (previous.index !== index) {
      changes.push({ id, title, state: "moved", fields: [] });
    }
  });

  oldRows.forEach((row, index) => {
    const id = String(row.id ?? index);
    if (newById.has(id)) return;
    changes.push({
      id,
      title: rowTitle(row, field.titleKey, id),
      state: "removed",
      fields: [],
    });
  });

  return changes;
}

/**
 * What would actually change, one entry per field, ready to accept or reject.
 *
 * `next` is the already-merged document, so this compares two complete sites
 * rather than a site and a patch.
 */
export function diffContent(scope: string, current: SiteContent, next: SiteContent): Change[] {
  const changes: Change[] = [];

  for (const ref of collectFieldRefs(scope)) {
    const before = getAtPath(current, ref.path);
    const after = getAtPath(next, ref.path);

    if (deepEqual(before, after)) continue;

    changes.push({
      path: ref.path,
      label: describePath(ref),
      before,
      after,
      isList: ref.field.kind === "objectList",
      rows: ref.field.kind === "objectList" ? diffRows(ref.field, before, after) : [],
    });
  }

  return changes;
}

/** Narrow a validated payload to the paths the operator ticked. */
export function pickPaths(clean: Plain, paths: string[]): Plain {
  let out: Plain = {};

  for (const path of paths) {
    const value = getAtPath(clean, path);
    if (value !== undefined) out = setAtPath(out, path, value);
  }

  return out;
}

/* ---------------------------------------------------------------- pipeline */

export interface ImportResult {
  /** Everything that passed validation, at its real dot path. */
  clean: Plain;
  issues: ImportIssue[];
  /** The complete site as it would stand if every change were accepted. */
  next: SiteContent;
  changes: Change[];
}

/**
 * Parse, validate, merge and diff in one call.
 *
 * The preview and the apply both go through here, on the server, from the same
 * raw text — so what you approve is what gets written. The apply deliberately
 * re-runs this rather than trusting a document posted back by the browser.
 *
 * `mergeInto(current, ...)` is the load-bearing line: layering over the current
 * site rather than the shipped defaults is what lets a payload that mentions
 * only the experiences leave the other three pages standing.
 */
export function runImport(
  scope: string,
  raw: string,
  current: SiteContent,
): ImportResult | { error: string } {
  if (scopePages(scope).length === 0) {
    return { error: "That is not a page of this site." };
  }

  const parsed = parsePayload(raw, scope);
  if ("error" in parsed) return parsed;

  const { clean, issues } = validateImport(scope, parsed.data, current);
  const next = mergeInto(current, clean);

  return { clean, issues, next, changes: diffContent(scope, current, next) };
}
