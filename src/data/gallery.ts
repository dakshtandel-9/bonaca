import { IMAGES } from "@/lib/constants";
import type { GalleryItem } from "@/types/gallery";

/**
 * ⚠️ These are the only four DISTINCT photographs currently available. The
 * previous list repeated the same living room three times and the same field
 * twice. Add new photography here and the grid + lightbox absorb it
 * automatically — the layout is written for any count from 4 upward.
 */
export const galleryItems: GalleryItem[] = [
  {
    id: "courtyard",
    src: IMAGES.courtyard,
    alt: "Bonaca's limestone courtyard at sunset, lit from the garden beds",
    category: "exterior",
    width: 2000,
    height: 1500,
  },
  {
    id: "living-room",
    src: IMAGES.living,
    alt: "The sunken living room with a teak beam and a potted olive tree",
    category: "interior",
    width: 1800,
    height: 1350,
  },
  {
    id: "bedroom",
    src: IMAGES.bedroom,
    alt: "A bedroom in cream linen with an olive throw and a shuttered window",
    category: "bedroom",
    width: 1400,
    height: 1866,
  },
  {
    id: "fields",
    src: IMAGES.fields,
    alt: "Green fields seen from Bonaca's upper terrace in the early morning",
    category: "outdoor",
    width: 1800,
    height: 1350,
  },
];

/** Filter chips, derived so they never drift from the items above. */
export const galleryCategories = [
  "all",
  ...Array.from(new Set(galleryItems.map((item) => item.category))),
];
