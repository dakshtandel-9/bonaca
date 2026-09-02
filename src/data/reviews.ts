export interface Review {
  id: string;
  quote: string;
  author: string;
  origin: string;
  platform: string;
  rating: number;
}

/**
 * ⚠️ PLACEHOLDER TEXT — NOT REAL GUEST REVIEWS.
 *
 * These are deliberately written so they can never be mistaken for genuine
 * testimonials. Replace each entry with a real, attributable quote before the
 * site goes live, or set this array to [] and the whole Reviews section
 * removes itself from the page automatically.
 *
 * The wall reads as three scrolling columns, so it wants roughly nine entries
 * to fill without visibly repeating. Fewer is fine — the columns are dealt
 * round-robin and simply run shorter.
 */
export const reviews: Review[] = [
  {
    id: "placeholder-1",
    quote:
      "Replace this with a real guest review. Two or three sentences reads best — the card is built for roughly this length and will still look right a little shorter.",
    author: "Guest name",
    origin: "City",
    platform: "Airbnb",
    rating: 5,
  },
  {
    id: "placeholder-2",
    quote:
      "A second placeholder quote. Pull these straight from your Airbnb or Booking.com listing once the first guests have stayed, and keep the guest's own wording.",
    author: "Guest name",
    origin: "City",
    platform: "Booking.com",
    rating: 5,
  },
  {
    id: "placeholder-3",
    quote:
      "A third placeholder quote. Nine or so reviews fills the three columns; every one of them should still be worth stopping to read.",
    author: "Guest name",
    origin: "City",
    platform: "Agoda",
    rating: 5,
  },
  {
    id: "placeholder-4",
    quote:
      "A fourth placeholder quote. Short ones are welcome — a two-line review sitting between longer cards gives the column somewhere to breathe.",
    author: "Guest name",
    origin: "City",
    platform: "Airbnb",
    rating: 5,
  },
  {
    id: "placeholder-5",
    quote:
      "A fifth placeholder quote. Reviews that name one specific thing — the quiet, the courtyard at dusk, the drive in — do more work than general praise.",
    author: "Guest name",
    origin: "City",
    platform: "Booking.com",
    rating: 5,
  },
  {
    id: "placeholder-6",
    quote:
      "A sixth placeholder quote. Keep the platform accurate on each card; it is the part a sceptical reader checks first.",
    author: "Guest name",
    origin: "City",
    platform: "Agoda",
    rating: 5,
  },
  {
    id: "placeholder-7",
    quote:
      "A seventh placeholder quote. A four-star review among the fives reads as more honest than an unbroken wall of perfect scores.",
    author: "Guest name",
    origin: "City",
    platform: "Airbnb",
    rating: 4,
  },
  {
    id: "placeholder-8",
    quote:
      "An eighth placeholder quote. Trim to the sentence that matters rather than pasting a whole review — an ellipsis is fine, rewriting is not.",
    author: "Guest name",
    origin: "City",
    platform: "Booking.com",
    rating: 5,
  },
  {
    id: "placeholder-9",
    quote:
      "A ninth placeholder quote. Once these are real, keep the guest's first name and city only; full names do not belong on a public page.",
    author: "Guest name",
    origin: "City",
    platform: "Airbnb",
    rating: 5,
  },
];
