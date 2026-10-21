import { IMAGES } from "@/lib/constants";

export interface Moment {
  id: string;
  time: string;
  /** A line break typed here is kept on the card, so a title can be set in two lines. */
  title: string;
  body: string;
  /** The portrait frame above the hour. */
  image: string;
}

/**
 * The day at Bonaca, first light to dark, as a row of cards. Each hour carries
 * its own photograph, so the row doubles as the second pass at the photography
 * that the separate showcase band used to be.
 */
export const moments: Moment[] = [
  {
    id: "sunrise",
    time: "06:00",
    title: "Sunrise",
    body: "A gentle start. Mist, birds and the first light over the green landscape.",
    image: IMAGES.fields,
  },
  {
    id: "breakfast",
    time: "08:00",
    title: "Breakfast,\nwhenever.",
    body: "No alarms, no rush. A fresh, leisurely spread when you're ready.",
    image: IMAGES.galleryPoolWalk,
  },
  {
    id: "afternoon",
    time: "10:00",
    title: "Out and about\nor a slower afternoon.",
    body: "Head out to discover the Dooars — tea gardens, forests and rivers — or stay in and let the afternoon unfold by the pool.",
    image: IMAGES.galleryLawn,
  },
  {
    id: "sunset",
    time: "17:30",
    title: "Sunset",
    body: "Watch the day change colours as the light softens over the hills and forests.",
    image: IMAGES.galleryCourtyardSunset,
  },
  {
    id: "dinner",
    time: "19:30",
    title: "Good food,\nlower tempo.",
    body: "Come together over chef-cooked meals with regional flavours and time for conversation.",
    image: IMAGES.galleryLanterns,
  },
  {
    id: "night",
    time: "21:00",
    title: "Goodnight.",
    body: "It gets properly dark here. Clear skies, quieter nights and a different kind of stillness.",
    image: IMAGES.galleryAerial,
  },
];
