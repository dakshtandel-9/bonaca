import { IMAGES } from "@/lib/constants";

export interface Room {
  id: string;
  index: string;
  name: string;
  kind: string;
  description: string;
  image: string;
  /** object-position, so one photograph can be framed differently per space. */
  focus: string;
  facts: string[];
}

export const rooms: Room[] = [
  {
    id: "courtyard",
    index: "01",
    name: "The Courtyard",
    kind: "Outdoor",
    description:
      "Stone underfoot, walls on three sides and the sky on the fourth. It holds the heat of the day just long enough for the evening.",
    image: IMAGES.courtyard,
    focus: "50% 50%",
    facts: ["Open air", "Evening lighting", "Seats 10"],
  },
  {
    id: "living",
    index: "02",
    name: "The Living Room",
    kind: "Interior",
    description:
      "A sunken floor, a long low sofa and a teak beam overhead. The room everyone drifts back to without deciding to.",
    image: IMAGES.living,
    focus: "50% 52%",
    facts: ["Sunken lounge", "Reading corner", "Opens to courtyard"],
  },
  {
    id: "bedroom",
    index: "03",
    name: "The Bedrooms",
    kind: "Sleeping",
    description:
      "Three rooms, each with its own bathroom, linen you will want to steal, and a shuttered window facing the fields.",
    image: IMAGES.bedroom,
    focus: "50% 50%",
    facts: ["3 en-suite", "Blackout shutters", "King beds"],
  },
  {
    id: "fields",
    index: "04",
    name: "The Green",
    kind: "Grounds",
    description:
      "Past the wall the land opens and keeps going. Mornings here are the reason people book a second night.",
    image: IMAGES.fields,
    focus: "50% 50%",
    facts: ["Open outlook", "Morning light", "Walking paths"],
  },
];
