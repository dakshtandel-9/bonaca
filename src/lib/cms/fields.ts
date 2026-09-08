/**
 * ============================================================================
 *  Walking `CMS_SCHEMA` — shared by the prompt writer and the import validator.
 * ============================================================================
 *
 *  Both halves of the ChatGPT round trip have to agree, exactly, on two things:
 *  which fields exist at which dot path, and which of them a language model is
 *  not allowed to touch. Deriving both from this one module is what keeps the
 *  prompt honest about what the CRM will actually accept.
 */

import { CMS_SCHEMA, type Field, type PageSchema, type SectionSchema } from "@/lib/cms/schema";

/** A single editable field, resolved to its absolute dot path. */
export interface FieldRef {
  /** Dot path into `SiteContent`, e.g. "home.hero.eyebrow". */
  path: string;
  field: Field;
  section: SectionSchema;
  page: PageSchema;
}

/** The whole site in one prompt, rather than a single page group. */
export const SITE_WIDE = "site-wide";

/**
 * Fields that describe a photograph rather than the words on the page.
 *
 * A model that cannot see the picture cannot meaningfully change its pixel
 * dimensions or its focal point, and a wrong value here silently misframes or
 * stretches the image on the live site. They ride along with the photograph.
 */
const IMAGE_ADJACENT = new Set(["width", "height", "focus"]);

/**
 * Names within one field list that the AI may not write.
 *
 * The image fields themselves always, plus the dimension and framing fields —
 * but only in a list that actually carries a photograph, so a stray `width`
 * somewhere else in the schema stays editable.
 */
export function lockedNames(fields: Field[]): Set<string> {
  const locked = new Set<string>();
  let hasImage = false;

  for (const field of fields) {
    if (field.kind === "image") {
      locked.add(field.name);
      hasImage = true;
    }
  }

  if (hasImage) {
    for (const field of fields) {
      if (IMAGE_ADJACENT.has(field.name)) locked.add(field.name);
    }
  }

  return locked;
}

/** The page groups a scope covers. Unknown scopes resolve to nothing. */
export function scopePages(scope: string): PageSchema[] {
  if (scope === SITE_WIDE) return CMS_SCHEMA;
  const page = CMS_SCHEMA.find((entry) => entry.id === scope);
  return page ? [page] : [];
}

/**
 * Every top-level field in a scope, resolved to its dot path.
 *
 * An `objectList` comes back as one ref pointing at the array — its row fields
 * are walked separately, because a row is validated against its own field list
 * and its own locked names.
 */
export function collectFieldRefs(scope: string): FieldRef[] {
  const refs: FieldRef[] = [];

  for (const page of scopePages(scope)) {
    for (const section of page.sections) {
      for (const field of section.fields) {
        refs.push({
          path: section.path ? `${section.path}.${field.name}` : field.name,
          field,
          section,
          page,
        });
      }
    }
  }

  return refs;
}

/** A human label for a path, for the diff table and the issue list. */
export function describePath(ref: FieldRef, rowTitle?: string, rowField?: Field): string {
  const head = `${ref.page.label} · ${ref.section.label}`;
  if (rowTitle && rowField) return `${head} · ${rowTitle} · ${rowField.label}`;
  return `${head} · ${ref.field.label}`;
}
