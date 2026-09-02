export interface Moment {
  id: string;
  time: string;
  title: string;
  body: string;
}

/**
 * The Experience section, rebuilt as a day rather than another photo grid.
 * Deliberately image-free: it gives the page a breath between the photographic
 * sections and does not lean on photography we do not have yet.
 */
export const moments: Moment[] = [
  {
    id: "morning",
    time: "06:40",
    title: "The light arrives before you do",
    body: "It comes in low across the fields and moves along the courtyard wall. Coffee is already on. Nobody is expecting anything of you yet.",
  },
  {
    id: "midday",
    time: "13:15",
    title: "The house keeps its own cool",
    body: "Lime-washed walls and deep reveals do most of the work. The living room stays shaded while the stone outside turns white.",
  },
  {
    id: "evening",
    time: "18:50",
    title: "Everything moves outside",
    body: "The courtyard lights come up from the planting beds. This is the hour the house was designed around, and it lasts about forty minutes.",
  },
  {
    id: "night",
    time: "22:30",
    title: "It gets properly dark",
    body: "No street lamps, no corridor noise, no one else in the building. The quiet is the amenity people write to us about.",
  },
];
