import { createHash } from "node:crypto";

import { collectFieldRefs, SITE_WIDE } from "@/lib/cms/fields";
import { getAtPath, setAtPath } from "@/lib/cms/path";
import type { Field } from "@/lib/cms/schema";
import type { SiteContent } from "@/lib/cms/types";

export function contentVersion(content: SiteContent): string {
  return createHash("sha256").update(JSON.stringify(content)).digest("hex");
}

export function assertSafePath(path: string): void {
  if (!path || path.split(".").some((part) =>
    !/^[A-Za-z0-9_-]+$/.test(part) || ["__proto__", "constructor", "prototype"].includes(part))) {
    throw new Error("Invalid content path.");
  }
}

/** Resolve only schema fields and existing list indices, never arbitrary object keys. */
export function resolveField(path: string, content: SiteContent): Field {
  assertSafePath(path);
  const ref = collectFieldRefs(SITE_WIDE).find((entry) =>
    path === entry.path || path.startsWith(`${entry.path}.`));
  if (!ref) throw new Error(`Unknown editable field: ${path}`);
  let field = ref.field;
  let value = getAtPath(content, ref.path);
  const rest = path.slice(ref.path.length).split(".").filter(Boolean);
  while (rest.length) {
    const index = rest.shift()!;
    if (!/^(0|[1-9][0-9]*)$/.test(index) || !Array.isArray(value) || Number(index) >= value.length) {
      throw new Error(`Use an existing list index at ${path}; replace the list to add or remove rows.`);
    }
    value = value[Number(index)];
    if (field.kind === "stringList" && rest.length === 0) {
      return { kind: "text", name: index, label: field.label };
    }
    if (field.kind !== "objectList") throw new Error(`Invalid list path: ${path}`);
    const name = rest.shift();
    const child = field.fields.find((entry) => entry.name === name);
    if (!child) throw new Error(`Choose a row field or replace the entire list: ${path}`);
    field = child;
    value = getAtPath(value, name!);
  }
  return field;
}

const plain = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function validateValue(field: Field, value: unknown, path: string, current: unknown): unknown {
  const fail = (message: string): never => { throw new Error(`${path}: ${message}`); };
  switch (field.kind) {
    case "number":
      if (typeof value !== "number" || !Number.isFinite(value)) return fail("expected a finite number");
      if (field.min !== undefined && value < field.min) return fail(`minimum is ${field.min}`);
      if (field.max !== undefined && value > field.max) return fail(`maximum is ${field.max}`);
      return value;
    case "boolean":
      return typeof value === "boolean" ? value : fail("expected true or false");
    case "select":
      return field.options.some((option) => option.value === value) ? value : fail("invalid option");
    case "stringList":
      return Array.isArray(value) && value.every((item) => typeof item === "string")
        ? value : fail("expected a list of strings");
    case "objectList": {
      if (!Array.isArray(value)) return fail("expected a list of rows");
      if (value.length < (field.min ?? 0)) return fail(`at least ${field.min} rows required`);
      const existing = Array.isArray(current) ? current : [];
      const ids = new Set<string>();
      return value.map((row, index) => {
        if (!plain(row)) return fail(`row ${index} must be an object`);
        const allowed = new Set([...field.fields.map((entry) => entry.name), ...Object.keys(field.template)]);
        if (Object.keys(row).some((name) => !allowed.has(name))) return fail(`unknown field in row ${index}`);
        if ("id" in field.template) {
          if (typeof row.id !== "string" || !/^[a-zA-Z0-9_-]+$/.test(row.id) || ids.has(row.id)) {
            return fail("each row needs a unique, nonempty URL-safe id");
          }
          ids.add(row.id);
        }
        const previous = "id" in field.template ? existing.find((entry) => entry.id === row.id) : undefined;
        const merged = { ...field.template, ...previous, ...row };
        for (const child of field.fields) {
          merged[child.name] = validateValue(child, merged[child.name], `${path}.${index}.${child.name}`, previous?.[child.name]);
        }
        return merged;
      });
    }
    default: {
      if (typeof value !== "string") return fail("expected text");
      if (field.name === "id" && !/^[a-zA-Z0-9_-]+$/.test(value)) return fail("invalid row id");
      const link = field.kind === "url" || field.kind === "image" || ["href", "url"].includes(field.name);
      if (link && value !== "") {
        const safe = !/[\u0000-\u0020\\]/.test(value) && (
          (value.startsWith("/") && !value.startsWith("//")) || value.startsWith("#") ||
          /^https?:\/\/[^/]+/i.test(value) || (field.kind !== "image" && /^(mailto:|tel:)/i.test(value))
        );
        if (!safe) return fail("expected an HTTP(S) URL, site path, or supported contact link");
      }
      return value;
    }
  }
}

export interface ContentEdit { path: string; value: unknown }

/** All edits validate before persistence; unrelated content is preserved. */
export function applyContentEdits(current: SiteContent, edits: ContentEdit[]) {
  if (!edits.length || edits.length > 100) throw new Error("Supply between 1 and 100 edits.");
  const paths = edits.map((edit) => edit.path);
  for (let i = 0; i < paths.length; i++) {
    if (paths.some((path, j) => j !== i && (path === paths[i] || path.startsWith(`${paths[i]}.`)))) {
      throw new Error("Overlapping edits are not allowed; supply each field or list once.");
    }
  }
  let next = current;
  const changes = [];
  for (const edit of edits) {
    const field = resolveField(edit.path, current);
    if (field.name === "id") throw new Error("Replace the whole list to change row ids.");
    const before = getAtPath(current, edit.path);
    const after = validateValue(field, edit.value, edit.path, before);
    if (JSON.stringify(before) !== JSON.stringify(after)) {
      next = setAtPath(next, edit.path, after);
      changes.push({ path: edit.path, before, after });
    }
  }
  return { next, changes };
}
