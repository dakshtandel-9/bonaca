import type { Metadata } from "next";

import "./admin.css";

export const metadata: Metadata = {
  title: "CRM",
  /* Belt and braces alongside the Disallow in robots.txt — the CRM must never
     turn up in a search result, whatever the site's own indexing setting is. */
  robots: { index: false, follow: false, nocache: true },
};

/** The CRM renders outside the site's chrome; this is the whole wrapper. */
export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return <div className="admin">{children}</div>;
}
