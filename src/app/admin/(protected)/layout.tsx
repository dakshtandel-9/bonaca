import { redirect } from "next/navigation";

import AdminNav from "@/components/admin/AdminNav";
import { CMS_SCHEMA } from "@/lib/cms/schema";
import { storageBackend } from "@/lib/cms/store";
import { getSession } from "@/lib/server/auth";
import { mediaBackend } from "@/lib/server/media";

export const dynamic = "force-dynamic";

/**
 * The gate. Every signed-in screen sits inside this group, so there is exactly
 * one place the session is checked for pages — and each API route checks again
 * for itself.
 */
export default async function ProtectedAdminLayout({
  children,
}: LayoutProps<"/admin">) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="admin-shell">
      <AdminNav
        pages={CMS_SCHEMA.map((page) => ({
          id: page.id,
          label: page.label,
          href: page.href,
          sections: page.sections.length,
        }))}
        username={session.username}
        storage={storageBackend}
        media={mediaBackend}
      />
      <main className="admin-main">{children}</main>
    </div>
  );
}
