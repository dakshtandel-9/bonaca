import Link from "next/link";
import type { ReactNode } from "react";

import ExternalLink from "@/components/ui/ExternalLink";

interface ActionLinkProps {
  /** From the CRM: a path on this site ("/experiences", "#rooms") or a full URL. */
  href: string;
  children: ReactNode;
  className?: string;
}

/**
 * A button-style link whose destination the owner types in. Paths on this site
 * stay client-side navigations; anything else is treated as leaving the site.
 */
export default function ActionLink({ href, children, className }: ActionLinkProps) {
  const internal = href.startsWith("/") || href.startsWith("#");

  if (internal) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <ExternalLink href={href} className={className}>
      {children}
    </ExternalLink>
  );
}
