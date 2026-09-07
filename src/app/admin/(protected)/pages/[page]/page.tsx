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

  return (
    <ContentEditor
      page={schema}
      initialContent={content}
      updatedAt={stored?.updatedAt ?? null}
    />
  );
}
