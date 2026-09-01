import type { ReactNode } from "react";

interface ExternalLinkProps {
  href: string;
  children: ReactNode;
  /** Use only when the visible text is not descriptive on its own. */
  "aria-label"?: string;
  /** Structural hook for the design phase (e.g. "primary"). */
  "data-variant"?: string;
}

/**
 * A link that leaves the website. Always opens in a new tab with safe rel
 * attributes, so components never have to remember to set them.
 */
export default function ExternalLink({
  href,
  children,
  ...rest
}: ExternalLinkProps) {
  if (href === "#") {
    return (
      <a
        href="#booking"
        aria-disabled="true"
        data-placeholder-link="true"
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
