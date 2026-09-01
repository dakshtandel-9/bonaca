/**
 * Anchor ids used by the homepage sections and the navigation links.
 * Keeping them in one place prevents navigation and sections drifting apart.
 */
export const SECTION_IDS = {
  stay: "stay",
  overview: "overview",
  story: "story",
  gallery: "gallery",
  experience: "experience",
  amenities: "amenities",
  location: "location",
  booking: "booking",
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

/** Base directories for property photography once real assets are added. */
export const IMAGE_PATHS = {
  exterior: "/images/property/exterior",
  interior: "/images/property/interior",
  rooms: "/images/property/rooms",
  outdoor: "/images/property/outdoor",
  gallery: "/images/property/gallery",
  branding: "/images/branding",
} as const;
