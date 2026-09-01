/**
 * Central website configuration.
 *
 * PLACEHOLDER: every value here is temporary and must be replaced with the
 * real property details before launch. Never hardcode these values (especially
 * booking URLs) inside components — always import from here.
 */
export const siteConfig = {
  name: "Bonaca",
  title: "Bonaca — A Private Retreat",
  description:
    "Discover Bonaca, a thoughtfully designed private retreat surrounded by greenery, comfort and quiet.",
  url: "https://bonaca-retreat.dakshtandel.chatgpt.site",
  locale: "en_IN",

  contact: {
    /** PLACEHOLDER contact details. */
    email: "To be confirmed",
    phone: "To be confirmed",
    whatsapp: "#",
  },

  social: {
    instagram: "#",
    facebook: "#",
  },

  /** PLACEHOLDER booking destinations. Replace "#" with the real listings. */
  links: {
    airbnb: "#",
    booking: "#",
    agoda: "#",
    googleMaps: "#",
  },
} as const;

export type SiteConfig = typeof siteConfig;
