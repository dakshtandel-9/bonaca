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
 */
export const reviews: Review[] = [
  {
    id: "placeholder-1",
    quote:
      "Replace this with a real guest review. Two or three sentences reads best — the layout is built for roughly this length and will still look right a little shorter.",
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
      "A third placeholder quote. Three to five reviews is the sweet spot — enough to feel established, few enough that every one of them is worth reading.",
    author: "Guest name",
    origin: "City",
    platform: "Agoda",
    rating: 5,
  },
];
