import type { ReactNode } from "react";

import { isPlaceholderLink } from "@/lib/site-config";

interface ExternalLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  /** Use only when the visible text is not descriptive on its own. */
  "aria-label"?: string;
  /** Styling hook, e.g. "primary" | "ghost" | "header". */
  "data-variant"?: string;
}

/**
 * A link that leaves the website. Always opens in a new tab with safe rel
 * attributes, so components never have to remember to set them.
 *
 * While a listing URL is still "#", the link renders without an href: it keeps
 * its styling but does not navigate. There is no in-page booking section to
 * fall back to, and a bare "#" would just throw the visitor to the top.
 */
export default function ExternalLink({ href, children, ...rest }: ExternalLinkProps) {
  if (isPlaceholderLink(href)) {
    return (
      <a
        data-placeholder-link="true"
        aria-disabled="true"
        title="Listing link coming soon"
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}
