/**
 * Reading and writing a value at a dot path, without mutating what is already
 * there. The editor keeps the whole site in one state object, so every keystroke
 * clones only the spine down to the field that changed.
 */

type Unknown = Record<string, unknown>;

export function getAtPath(source: unknown, path: string): unknown {
  if (!path) return source;

  return path.split(".").reduce<unknown>((value, key) => {
    if (value === null || value === undefined) return undefined;
    if (Array.isArray(value)) return value[Number(key)];
    if (typeof value === "object") return (value as Unknown)[key];
    return undefined;
  }, source);
}

export function setAtPath<T>(source: T, path: string, next: unknown): T {
  if (!path) return next as T;

  const [key, ...rest] = path.split(".");

  if (Array.isArray(source)) {
    const index = Number(key);
    const copy = source.slice();
    copy[index] = rest.length === 0 ? next : setAtPath(copy[index], rest.join("."), next);
    return copy as unknown as T;
  }

  const base = (source ?? {}) as Unknown;
  return {
    ...base,
    [key]: rest.length === 0 ? next : setAtPath(base[key], rest.join("."), next),
  } as T;
}

/** Move an array item, returning a new array. Out-of-range moves are no-ops. */
export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length || from === to) return items;
  const copy = items.slice();
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

/**
 * A readable, unique id for a newly added row. Ids end up in `key` props and in
 * page anchors, so they have to be stable and URL-safe rather than pretty.
 */
export function uniqueId(base: string, taken: string[]): string {
  const root = base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "item";
  if (!taken.includes(root)) return root;

  let n = 2;
  while (taken.includes(`${root}-${n}`)) n += 1;
  return `${root}-${n}`;
}
