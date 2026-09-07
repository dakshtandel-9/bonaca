import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { Readable } from "node:stream";

import { isR2Configured } from "@/lib/server/media";

export const runtime = "nodejs";

/**
 * Serves the local upload fallback.
 *
 * `public/` is only read at build time, so a file uploaded through the CRM at
 * runtime is a 404 until the next deploy — which would make the no-R2 fallback
 * quietly broken in exactly the situation it exists for. This route reads the
 * folder live instead.
 *
 * With R2 configured nothing reaches here: those URLs point at the bucket.
 */
const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

export async function GET(_request: Request, context: RouteContext<"/uploads/[...path]">) {
  if (isR2Configured) return new Response("Not found", { status: 404 });

  const { path } = await context.params;

  /* One flat folder: anything with a separator or a traversal segment is a
     probe, not a filename. */
  const name = Array.isArray(path) ? path.join("/") : path;
  if (!name || name.includes("/") || normalize(name) !== name || name.startsWith(".")) {
    return new Response("Not found", { status: 404 });
  }

  const type = TYPES[extname(name).toLowerCase()];
  if (!type) return new Response("Not found", { status: 404 });

  const file = join(process.cwd(), "public", "uploads", name);

  try {
    const info = await stat(file);
    if (!info.isFile()) return new Response("Not found", { status: 404 });

    const stream = Readable.toWeb(createReadStream(file)) as ReadableStream;

    return new Response(stream, {
      headers: {
        "Content-Type": type,
        "Content-Length": String(info.size),
        /* The key carries a random suffix, so the bytes at a URL never change. */
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
