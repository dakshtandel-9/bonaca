/**
 * ============================================================================
 *  The seed values, and the deployment origin.
 * ============================================================================
 *
 *  Nothing here is edited to go live any more — the CRM at /admin owns all of
 *  it now. This file is what the site falls back to before anything has been
 *  published: `lib/cms/defaults.ts` reads it to build the default content, and
 *  the first save in the CRM supersedes every value below.
 *
 *  The one exception is `url`, which is not content: it belongs to wherever
 *  the site is hosted, so it stays in the environment.
 */
const defaultSiteUrl = "https://bonaca-retreat.dakshtandel.chatgpt.site";

/** The deployment origin can be overridden at build time for a custom domain. */
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl).replace(/\/+$/, "");

export const siteConfig = {
  name: "Bonaca",
  title: "Bonaca — A Private Retreat",
  description:
    "Bonaca is a private villa kept for one group at a time — limestone courtyards, unhurried rooms and an open green horizon.",
  url: siteUrl,
  locale: "en_IN",
  language: "en-IN",

  /** Short line under the logo in the footer and in social previews. */
  tagline: "A private retreat rooted in calm.",

  contact: {
    email: "hello@bonaca.example",
    phone: "+91 00000 00000",
    /** Full wa.me link, e.g. https://wa.me/919000000000?text=Hi%20Bonaca */
    whatsapp: "#",
  },

  social: {
    instagram: "#",
    facebook: "#",
  },

  /** Where guests actually complete a booking. */
  links: {
    airbnb: "#",
    booking: "#",
    agoda: "#",
    googleMaps: "#",
  },

  /** Where the property is. Shown in the footer. */
  place: {
    locality: "Location to be confirmed",
    region: "India",
    countryCode: "IN",
  },
} as const;

export type SiteConfig = typeof siteConfig;
