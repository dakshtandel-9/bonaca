"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

interface NavPage {
  id: string;
  label: string;
  href: string | null;
  sections: number;
}

/**
 * The sidebar. Page groups that map to a public URL are listed as "Pages";
 * the rest are settings that cut across the whole site.
 */
export default function AdminNav({
  pages,
  username,
  storage,
  media,
}: {
  pages: NavPage[];
  username: string;
  storage: "firestore" | "file";
  media: "r2" | "local";
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const sitePages = pages.filter((page) => page.href !== null);
  const settings = pages.filter((page) => page.href === null);

  const isCurrent = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname === href;

  async function signOut() {
    setSigningOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const renderGroup = (title: string, items: NavPage[]) => (
    <div className="admin-nav-group">
      <p className="admin-nav-title">{title}</p>
      <ul>
        {items.map((page) => {
          const href = `/admin/pages/${page.id}`;
          return (
            <li key={page.id}>
              <Link href={href} data-current={isCurrent(href) ? "" : undefined}>
                {page.label}
                <small>{page.sections}</small>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <aside className="admin-sidebar">
      <div>
        <div className="admin-brand">
          <strong>Bonaca</strong>
          <span>CRM</span>
        </div>
      </div>

      <nav className="admin-nav" aria-label="CRM sections">
        <div className="admin-nav-group">
          <p className="admin-nav-title">Overview</p>
          <ul>
            <li>
              <Link href="/admin" data-current={isCurrent("/admin") ? "" : undefined}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/media"
                data-current={isCurrent("/admin/media") ? "" : undefined}
              >
                Media library
              </Link>
            </li>
            <li>
              <Link
                href="/admin/import"
                data-current={isCurrent("/admin/import") ? "" : undefined}
              >
                AI import
              </Link>
            </li>
            <li>
              <Link
                href="/admin/revisions"
                data-current={isCurrent("/admin/revisions") ? "" : undefined}
              >
                Revisions
              </Link>
            </li>
          </ul>
        </div>

        {renderGroup("Pages", sitePages)}
        {renderGroup("Site settings", settings)}
      </nav>

      <div className="admin-sidebar-foot">
        <p>
          Signed in as <strong>{username}</strong>
        </p>
        <p>
          Content: {storage === "firestore" ? "Firebase" : "local file"} · Images:{" "}
          {media === "r2" ? "Cloudflare R2" : "local folder"}
        </p>
        <button
          type="button"
          className="admin-btn"
          data-size="sm"
          onClick={signOut}
          disabled={signingOut}
        >
          {signingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </aside>
  );
}
