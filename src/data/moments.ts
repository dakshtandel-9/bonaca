import { IMAGES } from "@/lib/constants";

export interface Moment {
  id: string;
  time: string;
  title: string;
  body: string;
  /** Shown in the hover marquee — the room the hour actually happens in. */
  image: string;
}

/**
 * The Experience section, told as a day rather than another photo grid. Each
 * hour is paired with the one photograph that belongs to it, so the marquee
 * reveal in FlowingMenu shows the room the copy is describing.
 */
export const moments: Moment[] = [
  {
    id: "morning",
    time: "06:40",
    title: "The light arrives before you do",
    body: "It comes in low across the fields and moves along the courtyard wall. Coffee is already on. Nobody is expecting anything of you yet.",
    image: IMAGES.fields,
  },
  {
    id: "midday",
    time: "13:15",
    title: "The house keeps its own cool",
    body: "Lime-washed walls and deep reveals do most of the work. The living room stays shaded while the stone outside turns white.",
    image: IMAGES.living,
  },
  {
    id: "evening",
    time: "18:50",
    title: "Everything moves outside",
    body: "The courtyard lights come up from the planting beds. This is the hour the house was designed around, and it lasts about forty minutes.",
    image: IMAGES.courtyard,
  },
  {
    id: "night",
    time: "22:30",
    title: "It gets properly dark",
    body: "No street lamps, no corridor noise, no one else in the building. The quiet is the amenity people write to us about.",
    image: IMAGES.bedroom,
  },
];
