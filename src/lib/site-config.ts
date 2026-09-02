/**
 * ============================================================================
 *  THE ONLY FILE YOU NEED TO EDIT TO GO LIVE.
 * ============================================================================
 *
 *  Every value marked  // ⚠️ REPLACE  is placeholder text or a dead link.
 *  Search this file for "REPLACE" — when no hits remain, the site is launch
 *  ready. Nothing below is hardcoded anywhere else in the codebase.
 */
export const siteConfig = {
  name: "Bonaca",
  title: "Bonaca — A Private Retreat",
  description:
    "Bonaca is a private villa kept for one group at a time — limestone courtyards, unhurried rooms and an open green horizon.",
  url: "https://bonaca-retreat.dakshtandel.chatgpt.site",
  locale: "en_IN",

  /** Short line under the logo in the footer and in social previews. */
  tagline: "A private retreat rooted in calm.",

  contact: {
    email: "hello@bonaca.example", // ⚠️ REPLACE with the real inbox
    phone: "+91 00000 00000", // ⚠️ REPLACE with the real number
    /** Full wa.me link, e.g. https://wa.me/919000000000?text=Hi%20Bonaca */
    whatsapp: "#", // ⚠️ REPLACE
  },

  social: {
    instagram: "#", // ⚠️ REPLACE
    facebook: "#", // ⚠️ REPLACE
  },

  /** Where guests actually complete a booking. */
  links: {
    airbnb: "#", // ⚠️ REPLACE with the live Airbnb listing URL
    booking: "#", // ⚠️ REPLACE with the live Booking.com listing URL
    agoda: "#", // ⚠️ REPLACE with the live Agoda listing URL
    googleMaps: "#", // ⚠️ REPLACE with the Google Maps place link
  },

  /**
   * Google Maps embed for the Location section.
   * Get it from Google Maps → Share → Embed a map → copy the src="..." value.
   * Leave as null and a tasteful typographic panel is shown instead.
   */
  mapEmbedUrl: null as string | null, // ⚠️ REPLACE

  /** Where the property is. Shown in the hero meta bar and the footer. */
  place: {
    locality: "Location to be confirmed", // ⚠️ REPLACE e.g. "Alibaug, Maharashtra"
    region: "India", // ⚠️ REPLACE
    /** Only shared with confirmed guests — kept deliberately vague in public. */
    addressNote: "Full address is shared once your booking is confirmed.",
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** True when a link has not been filled in yet, so the UI can soften it. */
export const isPlaceholderLink = (href: string) => !href || href === "#";
