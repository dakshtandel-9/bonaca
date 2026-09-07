import { IMAGES } from "@/lib/constants";

/**
 * ⚠️ REPLACE every figure below with the confirmed tariff before the site goes
 * live. Rates are held as plain numbers so the page can format them once, in
 * one place, rather than repeating "₹" through the markup.
 */
export const CURRENCY = "INR";

export const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(amount);

/** The headline number — the cheapest night the villa is ever sold at. */
export const leadRate = {
  amount: 34000, // ⚠️ REPLACE
  unit: "per night",
  note: "For the entire villa, up to 8 guests.",
};

export interface RateRow {
  id: string;
  label: string;
  detail: string;
  amount: number;
  unit: string;
}

/** The full tariff. Order is cheapest first, which is how guests read it. */
export const rateRows: RateRow[] = [
  {
    id: "weeknight",
    label: "Weeknights",
    detail: "Monday to Thursday",
    amount: 34000, // ⚠️ REPLACE
    unit: "night",
  },
  {
    id: "weekend",
    label: "Weekends",
    detail: "Friday to Sunday",
    amount: 42000, // ⚠️ REPLACE
    unit: "night",
  },
  {
    id: "festive",
    label: "Festive & long weekends",
    detail: "Diwali, Christmas, New Year, gazetted long weekends",
    amount: 55000, // ⚠️ REPLACE
    unit: "night",
  },
  {
    id: "extra-guest",
    label: "Extra guest",
    detail: "Beyond the base 8, up to a maximum of 10",
    amount: 2500, // ⚠️ REPLACE
    unit: "guest, per night",
  },
];

/** What the nightly rate already covers, so the tariff is not read as bare. */
export const rateInclusions = [
  "Exclusive use of the whole villa and grounds",
  "Housekeeping through your stay",
  "Caretaker on the property, 24/7",
  "Wi-Fi, power backup, and hot water in all bathrooms",
  "Parking inside the gate for two cars",
];

/**
 * The exclusions matter more than the inclusions — every one of these is a
 * charge a guest would otherwise meet at check-out.
 */
export const rateExclusions = [
  "Transport, airport and station transfers",
  "GST and any applicable government levies",
  "Meals, groceries, and the cook's charge",
  "The refundable security deposit",
  "Bonfires, barbecues and special set-ups",
];

export const minimumStay = "2 nights, and 3 on festive dates."; // ⚠️ REPLACE

export const stayTimes = {
  checkIn: "2:00 PM",
  checkOut: "11:00 AM",
  checkInNote: "The caretaker meets you at the gate and walks you through the house.",
  checkOutNote: "Late check-out until 1:00 PM is free when the next booking allows it.",
  earlyCheckIn: "Early check-in from 11:00 AM, subject to availability.",
};

export interface PolicyClause {
  id: string;
  /** The window the clause applies to, e.g. "30+ days before check-in". */
  window: string;
  /** What the guest actually gets back. */
  outcome: string;
}

export const cancellationPolicy: PolicyClause[] = [
  {
    id: "over-30",
    window: "30 days or more before check-in",
    outcome: "90% of the amount paid is refunded. We keep 10% as a booking fee.",
  },
  {
    id: "15-29",
    window: "15 to 29 days before check-in",
    outcome: "50% of the amount paid is refunded.",
  },
  {
    id: "7-14",
    window: "7 to 14 days before check-in",
    outcome: "25% of the amount paid is refunded.",
  },
  {
    id: "under-7",
    window: "Less than 7 days before check-in",
    outcome: "No refund. The dates are held for you either way.",
  },
];

export const refundPolicy = [
  "Refunds go back to the card or account you paid from — we do not issue credit notes unless you ask for one.",
  "Approved refunds are processed within 7 to 10 working days of the cancellation being confirmed in writing.",
  "One free date change is allowed if you tell us 21 days or more before check-in, subject to the villa being open on the new dates.",
  "If we ever have to cancel on you — a repair, a power failure, anything at our end — you are refunded in full, whatever the notice.",
  "Bookings made through Airbnb, Booking.com or Agoda follow that platform's cancellation terms instead of this one.",
];

/** The long-form description. Kept as paragraphs so the page can space them. */
export const aboutTheVilla = [
  "Bonaca is a three-bedroom house on two acres, let to one group at a time. There is no reception, no other booking running alongside yours, and no shared wall — the gate closes behind you and the place is yours until check-out.",
  "The plan is simple and deliberate: two wings holding the bedrooms, a sunken living room between them, and a limestone courtyard that everything opens onto. Lime-washed walls and deep window reveals keep the interiors cool through the afternoon without the air conditioning having to work for it.",
  "Beyond the boundary wall the land opens into green and keeps going. Mornings are the reason most people book a second night; evenings belong to the courtyard, which is lit from the planting beds and holds the last of the day for about forty minutes.",
  "A caretaker lives on the property and is reachable at any hour. Housekeeping happens once a day, around you rather than at you, and the kitchen is yours to cook in — or to hand over, if you would rather not.",
];

export interface Bedroom {
  id: string;
  index: string;
  name: string;
  /** One line under the name, e.g. "En-suite · King bed". */
  kind: string;
  description: string;
  image: string;
  width: number;
  height: number;
  features: string[];
}

/** The three sleeping rooms. `propertyStats` says three bedrooms — keep it so. */
export const bedrooms: Bedroom[] = [
  {
    id: "courtyard-room",
    index: "01",
    name: "The Courtyard Room",
    kind: "En-suite · King bed · Sleeps 2",
    description:
      "The ground-floor room, with sliding doors straight onto the planted courtyard. Cove-lit and cool all afternoon, and the first room to catch the garden lights once the sun goes.",
    image: IMAGES.galleryBedroomCourtyard,
    width: 1448,
    height: 1086,
    features: ["King bed", "Courtyard access", "Walk-in shower", "Blackout curtains"],
  },
  {
    id: "terrace-room",
    index: "02",
    name: "The Terrace Room",
    kind: "En-suite · King bed · Sleeps 2",
    description:
      "A low platform bed under a cove-lit ceiling, a long timber sideboard, and sliding doors that open the whole wall onto the trees. The quietest room in the house.",
    image: IMAGES.galleryBedroomTerrace,
    width: 1448,
    height: 1086,
    features: ["King bed", "Private terrace", "Bathtub", "Reading chair"],
  },
  {
    id: "garden-room",
    index: "03",
    name: "The Garden Room",
    kind: "En-suite · Twin or king · Sleeps 2–4",
    description:
      "The bright one: white walls, a jali screen at the window and a bench at the foot of the bed. The beds split into twins and there is floor for two more.",
    image: IMAGES.galleryBedroomDay,
    width: 1400,
    height: 1866,
    features: ["Twin or king", "Space for 2 extra beds", "Jali screen", "Double wardrobe"],
  },
];

export interface VillaImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

/**
 * The three frames at the top of the page: one large lead and two beside it.
 * Order matters — index 0 is the large one.
 */
export const featuredImages: VillaImage[] = [
  {
    id: "courtyard-sunset",
    src: IMAGES.galleryCourtyardSunset,
    alt: "The paved courtyard between the two white volumes at sunset, the living room lit through a run of windows",
    width: 2000,
    height: 1500,
  },
  {
    id: "compound-dusk",
    src: IMAGES.galleryCompound,
    alt: "The whole compound from above at dusk, both blocks lit and a treeline of palms on the horizon",
    width: 1448,
    height: 1086,
  },
  {
    id: "pool-walk",
    src: IMAGES.galleryPoolWalk,
    alt: "The reflecting pool running beside the walk at blue hour, lanterns set along it",
    width: 1448,
    height: 1086,
  },
];

/**
 * Everything else, shown further down so the page opens on three frames.
 * Nine, not ten: the grid is three across, and a count off the multiple leaves
 * an orphan on the last row. Every frame here is a photograph that appears
 * nowhere else on the page.
 */
export const villaImages: VillaImage[] = [
  {
    id: "lawn-elevation",
    src: IMAGES.galleryLawn,
    alt: "The double-height elevation seen from the lawn at blue hour, timber screens and the interiors lit behind them",
    width: 1448,
    height: 1086,
  },
  {
    id: "living-day",
    src: IMAGES.galleryLivingDay,
    alt: "The living room in the afternoon: a long white sofa, a potted olive tree and an arched niche onto the stairs",
    width: 1800,
    height: 1350,
  },
  {
    id: "lounge-pit",
    src: IMAGES.galleryLounge,
    alt: "The sunken lounge after dark, seating set into the floor around a low timber table, open to the courtyard",
    width: 1448,
    height: 1086,
  },
  {
    id: "lounge-wide",
    src: IMAGES.living,
    alt: "The same lounge seen wide, the sideboard and pendant lights beyond it and the courtyard through the opening",
    width: 1536,
    height: 1024,
  },
  {
    id: "courtyard-lanterns",
    src: IMAGES.galleryLanterns,
    alt: "The lawn between the two wings at dusk, stepping stones and lanterns across the grass",
    width: 1448,
    height: 1086,
  },
  {
    id: "courtyard-above",
    src: IMAGES.courtyard,
    alt: "The courtyard from above at dusk, paved walks running round the lawn and the rooms lit either side",
    width: 1536,
    height: 1024,
  },
  {
    id: "wings-night",
    src: IMAGES.fields,
    alt: "Both wings from the lawn at night, the columns uplit and every room glowing behind the glass",
    width: 1536,
    height: 1024,
  },
  {
    id: "aerial-night",
    src: IMAGES.galleryAerial,
    alt: "The compound from directly above at night, the boundary wall and the gate picked out in warm light",
    width: 1448,
    height: 1086,
  },
  {
    id: "fields-morning",
    src: IMAGES.galleryFieldsMorning,
    alt: "Morning over the fields, seen from the upper terrace past a timber beam",
    width: 1800,
    height: 1350,
  },
];
