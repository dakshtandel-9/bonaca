import type { NextRequest } from "next/server";

import { requireApiSession } from "@/lib/server/guard";
import {
  ALLOWED_TYPES,
  deleteMedia,
  listMedia,
  MAX_UPLOAD_BYTES,
  mediaBackend,
  uploadMedia,
} from "@/lib/server/media";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** The media library, newest first. */
export async function GET() {
  const denied = await requireApiSession();
  if (denied) return denied;

  try {
    return Response.json({ items: await listMedia(), backend: mediaBackend });
  } catch (error) {
    console.error("[media] list failed:", error);
    return Response.json({ error: "Could not read the media library." }, { status: 500 });
  }
}

/** Upload one image. Type and size are checked here, not in the browser. */
export async function POST(request: NextRequest) {
  const denied = await requireApiSession();
  if (denied) return denied;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Malformed upload." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "No file supplied." }, { status: 400 });
  }

  if (!ALLOWED_TYPES[file.type]) {
    return Response.json(
      {
        error: `${file.type || "That file type"} is not an image we accept. Use JPG, PNG, WebP, AVIF, GIF or SVG.`,
      },
      { status: 415 },
    );
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return Response.json(
      { error: `That file is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is 15 MB.` },
      { status: 413 },
    );
  }

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const item = await uploadMedia(bytes, file.name, file.type);
    return Response.json({ ok: true, item, backend: mediaBackend });
  } catch (error) {
    console.error("[media] upload failed:", error);
    return Response.json(
      {
        error:
          error instanceof Error ? `Upload failed: ${error.message}` : "Upload failed.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const denied = await requireApiSession();
  if (denied) return denied;

  const key = request.nextUrl.searchParams.get("key");
  if (!key) return Response.json({ error: "No key supplied." }, { status: 400 });

  try {
    await deleteMedia(key);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[media] delete failed:", error);
    return Response.json({ error: "Could not delete that file." }, { status: 500 });
  }
}
