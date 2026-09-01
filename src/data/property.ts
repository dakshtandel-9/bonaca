import type { Property, PropertyHighlight } from "@/types/property";

/**
 * PLACEHOLDER copy. Replace with the real property description once the
 * client provides final content.
 */
export const property: Property = {
  name: "Bonaca",
  type: "Private villa",
  locality: "Location to be confirmed",
  tagline: "A private retreat rooted in calm.",
  intro: [
    "Bonaca is a private home kept for a single group at a time. The rooms are unhurried, the garden is quiet, and the days are yours to shape.",
    "Everything here is arranged around rest: space to gather, corners to retreat to, and a setting that stays calm from morning to night.",
  ],
};

/** PLACEHOLDER facts — confirm each value with the client before launch. */
export const propertyHighlights: PropertyHighlight[] = [
  {
    id: "entire-home",
    label: "Entire Home",
    description: "The whole villa is yours for the length of your stay.",
  },
  {
    id: "bedrooms",
    label: "3 Bedrooms",
    description: "Each bedroom has its own bathroom and outdoor view.",
  },
  {
    id: "guests",
    label: "Up to 8 Guests",
    description: "Comfortable for families and small groups travelling together.",
  },
  {
    id: "garden",
    label: "Private Garden",
    description: "An enclosed green space for slow mornings and long evenings.",
  },
  {
    id: "setting",
    label: "Peaceful Location",
    description: "Set away from traffic, close enough to reach easily.",
  },
];
