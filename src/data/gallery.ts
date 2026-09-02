import { IMAGES } from "@/lib/constants";
import type { GalleryItem } from "@/types/gallery";

/**
 * Twelve distinct photographs, ordered for the masonry rather than by subject:
 * exteriors, interiors and grounds alternate so no column reads as a run of the
 * same room. The single portrait frame sits mid-grid, where the stagger it
 * creates is doing the most work.
 *
 * Every frame is the house at dusk, which is the hour the lighting was built
 * for — add daylight photography and the grid absorbs it at any count.
 */
export const galleryItems: GalleryItem[] = [
  {
    id: "compound-dusk",
    src: IMAGES.galleryCompound,
    alt: "Bonaca's two wings seen from above at dusk, the lawn between them lit from the garden beds",
    category: "exterior",
    width: 1448,
    height: 1086,
  },
  {
    id: "lounge-pit",
    src: IMAGES.galleryLounge,
    alt: "The sunken lounge, its seating set into the floor around a low timber table, opening to the courtyard",
    category: "interior",
    width: 1448,
    height: 1086,
  },
  {
    id: "bedroom-courtyard",
    src: IMAGES.galleryBedroomCourtyard,
    alt: "A bedroom in cream linen with an olive throw, sliding doors open to a planted courtyard",
    category: "bedroom",
    width: 1448,
    height: 1086,
  },
  {
    id: "pool-walk",
    src: IMAGES.galleryPoolWalk,
    alt: "The reflecting pool running the length of the terrace, lanterns along the walk and the treeline beyond",
    category: "outdoor",
    width: 1448,
    height: 1086,
  },
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
    id: "lawn-elevation",
    src: IMAGES.galleryLawn,
    alt: "The house from the lawn, its double-height opening and timber screens lit from below",
    category: "exterior",
    width: 1448,
    height: 1086,
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
    id: "courtyard-lanterns",
    src: IMAGES.galleryLanterns,
    alt: "The courtyard between the two wings after dark, stepping stones and lanterns across the grass",
    category: "outdoor",
    width: 1448,
    height: 1086,
  },
  {
    id: "bedroom-terrace",
    src: IMAGES.galleryBedroomTerrace,
    alt: "A second bedroom with a low timber platform bed and a slatted screen onto the trees",
    category: "bedroom",
    width: 1448,
    height: 1086,
  },
  {
    id: "aerial-night",
    src: IMAGES.galleryAerial,
    alt: "The full compound from above at night, the boundary wall picked out in warm light",
    category: "exterior",
    width: 1448,
    height: 1086,
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
