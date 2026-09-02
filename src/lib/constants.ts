/**
 * Anchor ids used by the homepage sections and the navigation links.
 * Keeping them in one place prevents navigation and sections drifting apart.
 */
export const SECTION_IDS = {
  stay: "stay",
  overview: "overview",
  story: "story",
  rooms: "rooms",
  gallery: "gallery",
  moments: "moments",
  amenities: "amenities",
  reviews: "reviews",
  location: "location",
  booking: "booking",
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

/** Every photograph used on the site, resolved from one place. */
export const IMAGES = {
  /** Blue-hour approach shot, cropped two ways and art-directed in the hero. */
  heroWide: "/images/bonaca/hero/hero-wide.png",
  heroTall: "/images/bonaca/hero/hero-tall.png",
  /**
   * The Premise band photograph. Drop the file at exactly this path and it
   * appears automatically — see public/images/bonaca/premise/README.md for
   * the required dimensions.
   */
  premise: "/images/bonaca/premise/premise-wide.jpg",
  courtyard: "/images/bonaca/rooms/courtyard.png",
  living: "/images/bonaca/rooms/living-room.png",
  bedroom: "/images/bonaca/rooms/bedroom.png",
  fields: "/images/bonaca/rooms/the-green.png",
  /** Trimmed to the wordmark's bounding box (468×118) so it scales predictably. */
  logoDark: "/images/bonaca/branding/logo-dark-trim.png",
  logoLight: "/images/bonaca/branding/logo-light-trim.png",
} as const;
