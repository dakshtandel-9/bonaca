import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Whether a file actually exists under /public.
 *
 * Server components are evaluated at build time under `output: "export"`, so a
 * photo slot can fill itself the moment the file is dropped into /public — no
 * code change and no broken <img> in the meantime.
 */
export function publicAssetExists(publicPath: string): boolean {
  return existsSync(join(process.cwd(), "public", publicPath.replace(/^\/+/, "")));
}
