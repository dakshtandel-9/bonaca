import { IMAGES } from "@/lib/constants";

export interface Experience {
  id: string;
  title: string;
  /** One line under the title. Two sentences at most — these are cards. */
  description: string;
  /** Photographed at Bonaca, not stock. One frame per card. */
  image: string;
  width: number;
  height: number;
  alt: string;
  /** Out of 5. ⚠️ REPLACE with the real average once reviews are collected. */
  rating: number;
  /** Small label beside the stars, e.g. "Included" or "On request". */
  tag: string;
}

/**
 * Nine things guests actually do here, each tied to the one photograph it
 * happens in. `tag` is doing real work: it separates what the nightly rate
 * already covers from what has to be arranged and paid for.
 */
export const experiences: Experience[] = [
  {
    id: "sunrise",
    title: "Sunrise over the fields",
    description:
      "The light comes in low across the green and moves along the terrace wall. Coffee is on by six; nothing is expected of you yet.",
    image: IMAGES.galleryFieldsMorning,
    width: 1800,
    height: 1350,
    alt: "Morning mist over the fields, seen from the upper terrace past a timber beam",
    rating: 5,
    tag: "Included",
  },
  {
    id: "courtyard",
    title: "The courtyard, all day",
    description:
      "Breakfast is laid on the stone while it is still cool and mostly stays there. By evening the same table is doing something else entirely.",
    image: IMAGES.galleryCourtyardSunset,
    width: 2000,
    height: 1500,
    alt: "The paved courtyard between the two white volumes at sunset, the living room lit behind a run of windows",
    rating: 5,
    tag: "Included",
  },
  {
    id: "long-afternoon",
    title: "Long afternoons indoors",
    description:
      "Lime-washed walls and deep reveals keep the living room cool while the stone outside turns white. Books, a low table, nowhere to be.",
    image: IMAGES.galleryLivingDay,
    width: 1800,
    height: 1350,
    alt: "The living room in the afternoon: a long white sofa, a potted olive tree and an arched niche onto the stairs",
    rating: 5,
    tag: "Included",
  },
  {
    id: "pool-afternoon",
    title: "Afternoons by the water",
    description:
      "The reflecting pool runs the length of the walk and holds the shade until four. Lanterns come on before you have thought about dinner.",
    image: IMAGES.galleryPoolWalk,
    width: 1448,
    height: 1086,
    alt: "The reflecting pool running beside the lit walk at blue hour, lanterns set along it",
    rating: 5,
    tag: "Included",
  },
  {
    id: "sundowners",
    title: "Sundowners on the lawn",
    description:
      "Chairs get dragged out at about half past six and nobody moves them back. The best forty minutes of the day, every day.",
    image: IMAGES.galleryLawn,
    width: 1448,
    height: 1086,
    alt: "The double-height elevation seen from the lawn at blue hour, the interiors lit behind timber screens",
    rating: 5,
    tag: "Included",
  },
  {
    id: "bonfire",
    title: "Bonfire and barbecue",
    description:
      "Set up on the lawn between the wings on the evening you ask for it — wood, grill, and someone to keep both going.",
    image: IMAGES.galleryLanterns,
    width: 1448,
    height: 1086,
    alt: "The lawn between the two wings at dusk, stepping stones and lanterns across the grass",
    rating: 5,
    tag: "On request",
  },
  {
    id: "stargazing",
    title: "Stargazing from the terrace",
    description:
      "No street lamps for a mile in any direction. The house lights go down at eleven and the sky does the rest.",
    image: IMAGES.galleryAerial,
    width: 1448,
    height: 1086,
    alt: "The compound from directly above at night, the boundary wall picked out in warm light",
    rating: 5,
    tag: "Included",
  },
  {
    id: "slow-evening",
    title: "Slow evenings in the lounge",
    description:
      "A sunken floor, cushions on three sides and a teak table in the middle. The room everyone drifts back to without deciding to.",
    image: IMAGES.galleryLounge,
    width: 1448,
    height: 1086,
    alt: "The sunken lounge after dark, seating set into the floor around a low timber table, open to the courtyard",
    rating: 5,
    tag: "Included",
  },
  {
    id: "after-dark",
    title: "The house after dark",
    description:
      "Every column uplit, every room glowing, and nobody else inside the gate. Worth walking the grounds once before bed.",
    image: IMAGES.fields,
    width: 1536,
    height: 1024,
    alt: "Both wings from the lawn at night, the columns uplit and every room glowing behind the glass",
    rating: 5,
    tag: "Included",
  },
];
