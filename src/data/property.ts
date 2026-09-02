import type { Property } from "@/types/property";
import { siteConfig } from "@/lib/site-config";

export const property: Property = {
  name: "Bonaca",
  type: "Private villa",
  locality: siteConfig.place.locality,
  tagline: siteConfig.tagline,
  intro: [
    "Bonaca is a private home kept for a single group at a time. The rooms are unhurried, the courtyard holds the last of the evening light, and the days are yours to shape.",
    "Everything here is arranged around rest — space to gather, corners to retreat to, and a horizon that stays quiet from morning to night.",
  ],
};

/**
 * The opening statement. Split into words by the section so the colour can
 * wash across it as the reader scrolls.
 */
export const overviewStatement =
  "We built Bonaca for the pace you lose in a city. Limestone underfoot, lime-washed walls that hold the cool, and one family in the house at a time.";

/**
 * The sharpest line in the copy, pulled out of the statement so it can carry
 * the dark panel instead of trailing off the end of a paragraph.
 */
export const overviewPanel = {
  label: "One group at a time",
  /** Set as two explicit lines so the break never lands mid-sentence. */
  quoteLines: ["Nothing to queue for.", "Nothing to share."],
  claim:
    "The entire house is yours for the length of your stay — no shared walls, no neighbouring guests, and no one else in the building.",
};

/**
 * The four facts, each carrying its own supporting line.
 *
 * These used to be two separate grids: a row of numbers and a row of
 * highlights that repeated them ("3 Bedrooms" then "Three en-suite rooms").
 * Merged into one ledger so each fact is stated once.
 *
 * ⚠️ REPLACE each `value` with the confirmed figure. The hero reads index 0
 * for bedrooms and index 1 for guests, so keep that order.
 */
export const propertyStats = [
  {
    id: "bedrooms",
    value: 3,
    suffix: "",
    label: "Bedrooms",
    note: "each en-suite",
    detail: "Each with its own bathroom and a shuttered window onto the green.",
  },
  {
    id: "guests",
    value: 8,
    suffix: "",
    label: "Guests",
    note: "sleeps comfortably",
    detail: "Room for families and small groups travelling together.",
  },
  {
    id: "acres",
    value: 2,
    suffix: "",
    label: "Acres",
    note: "of private ground",
    detail: "A walled courtyard for the evenings, open ground beyond it.",
  },
  {
    id: "caretaker",
    value: 24,
    suffix: "/7",
    label: "Caretaker",
    note: "on the property",
    detail: "On site, reachable at any hour, invisible unless wanted.",
  },
] as const;
