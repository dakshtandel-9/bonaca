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
  showcase: "showcase",
  moments: "moments",
  amenities: "amenities",
  reviews: "reviews",
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

/** Every photograph used on the site, resolved from one place. */
export const IMAGES = {
  /** Blue-hour approach shot, cropped two ways and art-directed in the hero. */
  heroWide: "/images/bonaca/hero/hero-wide.jpg",
  heroTall: "/images/bonaca/hero/hero-tall.jpg",
  /**
   * The Premise band photograph. Drop the file at exactly this path and it
   * appears automatically — see public/images/bonaca/premise/README.md for
   * the required dimensions.
   */
  premise: "/images/bonaca/premise/sec2.webp",
  story: "/images/bonaca/story/sec3.webp",
  courtyard: "/images/bonaca/rooms/courtyard.webp",
  living: "/images/bonaca/rooms/living-room.webp",
  bedroom: "/images/bonaca/rooms/bedroom.webp",
  fields: "/images/bonaca/rooms/the-green.webp",
  /**
   * Gallery photography. All 1448×1086, shot at dusk, and re-encoded from the
   * supplied PNGs — `images.unoptimized` is on for the static export, so what
   * is committed here is what visitors download.
   */
  galleryCompound: "/images/bonaca/gallery/compound-dusk.jpg",
  galleryAerial: "/images/bonaca/gallery/aerial-night.jpg",
  galleryLounge: "/images/bonaca/gallery/lounge-pit.jpg",
  galleryBedroomCourtyard: "/images/bonaca/gallery/bedroom-courtyard.jpg",
  galleryBedroomTerrace: "/images/bonaca/gallery/bedroom-terrace.jpg",
  galleryPoolWalk: "/images/bonaca/gallery/pool-walk.jpg",
  galleryLawn: "/images/bonaca/gallery/lawn-elevation.jpg",
  galleryLanterns: "/images/bonaca/gallery/courtyard-lanterns.jpg",
  /** Trimmed to the wordmark's bounding box (468×118) so it scales predictably. */
  logoDark: "/images/bonaca/branding/logo-dark-trim.png",
  logoLight: "/images/bonaca/branding/logo-light-trim.png",
} as const;
