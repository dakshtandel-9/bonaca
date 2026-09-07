import { notFound } from "next/navigation";

import ContentEditor from "@/components/admin/ContentEditor";
import { getSiteContentUncached } from "@/lib/cms/content";
import { findPageSchema } from "@/lib/cms/schema";
import { readStoredContent } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export default async function AdminPageEditor({ params }: PageProps<"/admin/pages/[page]">) {
  const { page: pageId } = await params;

  const schema = findPageSchema(pageId);
  if (!schema) notFound();

  const [content, stored] = await Promise.all([
    getSiteContentUncached(),
    readStoredContent(),
  ]);

  /* Keyed on the page group so moving between them mounts a fresh editor.
     Without it React would reuse the instance and keep the previous group's
     state — including its unsaved edits — under the new heading. */
  return (
    <ContentEditor
      key={schema.id}
      page={schema}
      initialContent={content}
      updatedAt={stored?.updatedAt ?? null}
    />
  );
}
