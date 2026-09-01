/** A single link in the header navigation or in a footer link group. */
export interface NavigationItem {
  id: string;
  /** Visible link text. */
  label: string;
  /** In-page anchor (e.g. "#gallery") or route path. */
  href: string;
}

/** A titled group of links rendered inside the footer. */
export interface FooterLinkGroup {
  id: string;
  title: string;
  items: NavigationItem[];
}

/** An external social/contact profile link. */
export interface SocialLink {
  id: string;
  label: string;
  url: string;
}
