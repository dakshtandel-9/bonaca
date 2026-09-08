/**
 * ============================================================================
 *  The prompt you paste into ChatGPT.
 * ============================================================================
 *
 *  Generated from `CMS_SCHEMA`, never hand-written, so it cannot drift from
 *  what the importer will actually accept. It carries three things: a guide to
 *  every field in scope, the content as it stands today, and the rules the JSON
 *  coming back has to follow.
 *
 *  Photographs are stripped on the way out. A model that has never seen the
 *  pictures can only invent URLs, and an invented URL is a broken image on the
 *  live site — so it is never shown one, and `import.ts` drops any that arrive.
 */

import { lockedNames, scopePages, SITE_WIDE } from "@/lib/cms/fields";
import { getAtPath, setAtPath } from "@/lib/cms/path";
import type { Field } from "@/lib/cms/schema";
import type { SiteContent } from "@/lib/cms/types";

type Plain = Record<string, unknown>;

const isPlainObject = (value: unknown): value is Plain =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** How one field is described to the model, in plain English. */
function describeKind(field: Field): string {
  switch (field.kind) {
    case "text":
      return "short text";
    case "url":
      return "a URL";
    case "textarea":
      return "text, a few sentences";
    case "number": {
      const bounds =
        field.min !== undefined && field.max !== undefined
          ? `, between ${field.min} and ${field.max}`
          : field.min !== undefined
            ? `, at least ${field.min}`
            : field.max !== undefined
              ? `, at most ${field.max}`
              : "";
      return `a number${bounds}`;
    }
    case "boolean":
      return "true or false";
    case "select":
      return `exactly one of: ${field.options.map((option) => `"${option.value}"`).join(", ")}`;
    case "stringList":
      return field.multiline ? "a list of paragraphs" : "a list of short text";
    case "image":
      return "a photograph";
    case "objectList":
      return "a list of rows";
  }
}

/** One line of the field guide. */
function fieldLine(field: Field, indent: string): string {
  const help = field.help ? ` — ${field.help}` : "";
  return `${indent}- ${field.name}: ${field.label} (${describeKind(field)})${help}`;
}

/** The guide: what exists, at which path, and what each field will accept. */
function buildGuide(scope: string): string {
  const lines: string[] = [];

  for (const page of scopePages(scope)) {
    lines.push(`\n### ${page.label}`);

    for (const section of page.sections) {
      const locked = lockedNames(section.fields);
      const visible = section.fields.filter((field) => !locked.has(field.name));
      if (visible.length === 0) continue;

      lines.push(`\n"${section.path}" — ${section.label}`);
      if (section.description) lines.push(`  ${section.description}`);

      for (const field of visible) {
        if (field.kind === "objectList") {
          const rowLocked = lockedNames(field.fields);
          const rowFields = field.fields.filter((row) => !rowLocked.has(row.name));
          const floor = field.min ? `, at least ${field.min}` : "";

          lines.push(`  - ${field.name}: ${field.label} (a list of rows${floor})`);
          lines.push(`    Every row has these keys:`);
          for (const row of rowFields) lines.push(fieldLine(row, "      "));
        } else {
          lines.push(fieldLine(field, "  "));
        }
      }
    }
  }

  return lines.join("\n");
}

/** Strip the keys the model is not allowed to write out of one row. */
function pruneRow(row: unknown, fields: Field[]): unknown {
  if (!isPlainObject(row)) return row;

  const locked = lockedNames(fields);
  const out: Plain = {};

  for (const [key, value] of Object.entries(row)) {
    if (locked.has(key)) continue;
    out[key] = value;
  }

  return out;
}

/** The content as it stands, scoped to the page group, photographs removed. */
function buildCurrentValues(scope: string, content: SiteContent): unknown {
  let out: Plain = {};

  for (const page of scopePages(scope)) {
    for (const section of page.sections) {
      const locked = lockedNames(section.fields);

      for (const field of section.fields) {
        if (locked.has(field.name)) continue;

        const path = section.path ? `${section.path}.${field.name}` : field.name;
        const value = getAtPath(content, path);
        if (value === undefined) continue;

        const scoped =
          field.kind === "objectList" && Array.isArray(value)
            ? value.map((row) => pruneRow(row, field.fields))
            : value;

        out = setAtPath(out, path, scoped);
      }
    }
  }

  return out;
}

/** A short note on the property, so the copy comes back in the right voice. */
function buildContext(content: SiteContent): string {
  const place = [content.site.place.locality, content.site.place.region]
    .filter(Boolean)
    .join(", ");

  return [
    `- Property: ${content.site.name}`,
    content.site.tagline ? `- In a line: ${content.site.tagline}` : null,
    place ? `- Where: ${place}` : null,
    content.site.description ? `- How it describes itself: ${content.site.description}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * The complete prompt for one page group, or for the whole site.
 *
 * Written to be pasted into a fresh ChatGPT conversation and then talked to —
 * the JSON is what the chat produces at the end, not what it opens with.
 */
export function buildPrompt(scope: string, content: SiteContent): string {
  const pages = scopePages(scope);
  if (pages.length === 0) return "";

  const label =
    scope === SITE_WIDE ? "the whole website" : `the "${pages[0].label}" page of the website`;

  const values = JSON.stringify(buildCurrentValues(scope, content), null, 2);

  return `I want your help rewriting ${label}.

## About the property

${buildContext(content)}

## How this works

Talk with me normally about the content first. Ask me questions, suggest wording,
show me options — treat this as an editing conversation, not a one-shot task.

When I say I am happy with it, and only then, give me the finished content as a
single JSON code block that I can save as a .json file. That file gets uploaded
straight into the website's admin, so the shape has to be exact.

## The fields you can write

Each heading below is a dot path. A field listed under "home.hero" means the key
"eyebrow" inside "hero" inside "home".
${buildGuide(scope)}

## Rules for the JSON

1. Return ONE fenced json code block, with nothing after it.
2. Keep the exact same structure and key names as the current content below.
   Do not invent new keys, and do not rename or move anything.
3. You may leave out any part you did not change. Anything you omit keeps its
   current value — so a small edit can be a small JSON file.
4. Lists replace what is there completely. If you return "items", return EVERY
   row you want on the finished page, including the ones you left alone, in the
   order you want them. A list with three rows in it will leave three rows on
   the site.
5. Every row has an "id". Keep the existing id when you edit a row. For a new
   row, invent a short lowercase id with hyphens instead of spaces, e.g.
   "sunset-cruise". Ids must be unique within their list.
6. Never write a photograph. Do not add "image", "src", "width", "height" or
   "focus" keys anywhere. The photographs are managed separately in the admin
   and are matched back on by id — if you add them, they will be discarded.
7. Respect the field types above exactly: a field listed as "exactly one of"
   must use one of those values verbatim, and a number must stay in its range.
8. Write in British English, in the same measured, unhurried voice as the
   current copy. No exclamation marks, no marketing clichés.

## The current content

\`\`\`json
${values}
\`\`\`
`;
}
