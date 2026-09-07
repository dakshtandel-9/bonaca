import "server-only";

import { randomBytes } from "node:crypto";
import { mkdir, readdir, stat, unlink, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";

import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import type { MediaItem } from "@/lib/cms/types";

/**
 * The photo library behind every image field in the CRM.
 *
 * Cloudflare R2 is the store, reached over its S3-compatible API. When it is
 * not configured the same operations run against `public/uploads/`, which keeps
 * the CRM completely usable locally — the only difference the rest of the app
 * ever sees is whether the returned URL is absolute or site-relative.
 */

const accountId = process.env.R2_ACCOUNT_ID?.trim();
const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
const bucket = process.env.R2_BUCKET?.trim();
const publicBase = process.env.R2_PUBLIC_BASE_URL?.trim().replace(/\/+$/, "");
const prefix = (process.env.R2_PREFIX?.trim() || "bonaca").replace(/^\/+|\/+$/g, "");

export const isR2Configured = Boolean(
  accountId && accessKeyId && secretAccessKey && bucket && publicBase,
);

export const mediaBackend: "r2" | "local" = isR2Configured ? "r2" : "local";

const LOCAL_DIR = join(process.cwd(), "public", "uploads");
const LOCAL_URL_BASE = "/uploads";

/** 15 MB. Large enough for a full-resolution villa photograph, small enough
    that a mis-drag of a RAW file is rejected rather than uploaded. */
export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

export const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
};

let cachedClient: S3Client | null = null;

function getClient(): S3Client | null {
  if (!isR2Configured) return null;
  if (cachedClient) return cachedClient;

  cachedClient = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: accessKeyId!, secretAccessKey: secretAccessKey! },
  });

  return cachedClient;
}

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(extname(name).toLowerCase(), "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "image";

/** `bonaca/2026/09/courtyard-dusk-3f9a12.webp` — sortable, and never colliding. */
function buildKey(filename: string, contentType: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const extension =
    ALLOWED_TYPES[contentType] ?? (extname(filename).toLowerCase() || ".bin");
  const unique = randomBytes(3).toString("hex");

  return `${prefix}/${year}/${month}/${slugify(filename)}-${unique}${extension}`;
}

export const publicUrlFor = (key: string) =>
  isR2Configured ? `${publicBase}/${key}` : `${LOCAL_URL_BASE}/${key.split("/").pop()}`;

export async function uploadMedia(
  bytes: Uint8Array,
  filename: string,
  contentType: string,
): Promise<MediaItem> {
  const key = buildKey(filename, contentType);
  const client = getClient();

  if (client) {
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: bytes,
        ContentType: contentType,
        /* Immutable: the key already carries a random suffix, so an edited
           photograph is a new object rather than an overwrite. */
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
  } else {
    await mkdir(LOCAL_DIR, { recursive: true });
    await writeFile(join(LOCAL_DIR, key.split("/").pop()!), bytes);
  }

  return {
    key,
    url: publicUrlFor(key),
    size: bytes.byteLength,
    uploadedAt: new Date().toISOString(),
    contentType,
  };
}

/** Newest first, capped — the picker is a grid, not an archive browser. */
export async function listMedia(limit = 200): Promise<MediaItem[]> {
  const client = getClient();

  if (client) {
    const result = await client.send(
      new ListObjectsV2Command({ Bucket: bucket, Prefix: `${prefix}/`, MaxKeys: 1000 }),
    );

    return (result.Contents ?? [])
      .filter((object) => object.Key && !object.Key.endsWith("/"))
      .map((object) => ({
        key: object.Key!,
        url: publicUrlFor(object.Key!),
        size: object.Size ?? 0,
        uploadedAt: (object.LastModified ?? new Date()).toISOString(),
        contentType: "",
      }))
      .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))
      .slice(0, limit);
  }

  try {
    const names = await readdir(LOCAL_DIR);
    const files = await Promise.all(
      names.map(async (name) => {
        const info = await stat(join(LOCAL_DIR, name));
        return {
          key: name,
          url: `${LOCAL_URL_BASE}/${name}`,
          size: info.size,
          uploadedAt: info.mtime.toISOString(),
          contentType: "",
        };
      }),
    );

    return files.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)).slice(0, limit);
  } catch {
    return [];
  }
}

export async function deleteMedia(key: string): Promise<void> {
  const client = getClient();

  if (client) {
    await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    return;
  }

  /* Local mode stores flat, and the key is the filename. Refuse anything with
     a path separator so a crafted key cannot climb out of public/uploads. */
  if (key.includes("/") || key.includes("..")) throw new Error("Invalid media key");
  await unlink(join(LOCAL_DIR, key));
}
