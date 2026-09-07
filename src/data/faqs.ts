export interface Faq {
  id: string;
  /** The group heading this question sits under. */
  group: string;
  question: string;
  /** Two or three sentences. Every answer is open on the page, so keep it short. */
  answer: string;
}

/**
 * Everything a guest writes in to ask, answered before they have to. Nothing
 * here collapses — an accordion would hide exactly the terms someone came to
 * the page to read.
 */
export const faqs: Faq[] = [
  {
    id: "whole-villa",
    group: "Booking",
    question: "Do we get the whole villa?",
    answer:
      "Yes. Bonaca is let to one group at a time — all three bedrooms, both wings, the courtyard and the grounds. There is no second booking running alongside yours and no shared wall.",
  },
  {
    id: "how-many",
    group: "Booking",
    question: "How many people can stay?",
    answer:
      "Eight guests comfortably across three en-suite bedrooms, and up to ten with extra beds in the Garden Room. Anything above eight is charged per extra guest per night.",
  },
  {
    id: "minimum-stay",
    group: "Booking",
    question: "Is there a minimum stay?",
    answer:
      "Two nights as a rule, and three across festive dates and long weekends. Write to us if you need a single night — we can sometimes make it work midweek.",
  },
  {
    id: "how-to-pay",
    group: "Booking",
    question: "How do we pay, and when?",
    answer:
      "Fifty per cent confirms the dates and the balance is due seven days before check-in. Bank transfer or UPI direct with us; card if you book through Airbnb, Booking.com or Agoda.",
  },
  {
    id: "deposit",
    group: "Booking",
    question: "Is there a security deposit?",
    answer:
      "A refundable deposit is collected at check-in and returned within 48 hours of check-out, less anything broken. It is not part of the nightly rate.",
  },
  {
    id: "check-in-out",
    group: "Your stay",
    question: "What are the check-in and check-out times?",
    answer:
      "Check-in is from 2:00 PM and check-out is by 11:00 AM. Early check-in from 11:00 AM and late check-out until 1:00 PM are free when the calendar allows — ask on the day before, not on the day.",
  },
  {
    id: "transport",
    group: "Your stay",
    question: "Is transport included?",
    answer:
      "No. Rates cover the villa only — transport, airport and station transfers, and any car you keep for the stay are separate and billed at cost. We are glad to arrange a driver if you tell us in advance.",
  },
  {
    id: "food",
    group: "Your stay",
    question: "Is food included? Is there a cook?",
    answer:
      "Meals are not in the rate. The kitchen is fully equipped and yours to use, or a cook can come in for the stay — you pay for the groceries and the cook's charge, and you decide the menu.",
  },
  {
    id: "power-wifi",
    group: "Your stay",
    question: "What about Wi-Fi and power cuts?",
    answer:
      "Wi-Fi reaches every room and the courtyard, and it is strong enough to work from. A backup generator carries the whole house, so a cut in the area is something you generally do not notice.",
  },
  {
    id: "caretaker",
    group: "Your stay",
    question: "Is anyone on the property with us?",
    answer:
      "A caretaker lives on site and is reachable at any hour, and housekeeping comes through once a day. Both work around you — you will not be checked on.",
  },
  {
    id: "children",
    group: "House rules",
    question: "Are children welcome?",
    answer:
      "Very. Children under five stay free and cots can be set up in any of the three rooms. The pool is unfenced, so please keep an eye on small swimmers.",
  },
  {
    id: "pets",
    group: "House rules",
    question: "Can we bring a pet?",
    answer:
      "Well-behaved dogs are welcome by prior arrangement, at no extra charge. Tell us before you book so we can put the right rugs away.",
  },
  {
    id: "events",
    group: "House rules",
    question: "Can we host a party or an event?",
    answer:
      "Small celebrations with your own group are fine. Anything with day guests, outside caterers or amplified music needs written approval first and carries a separate charge.",
  },
  {
    id: "smoking",
    group: "House rules",
    question: "Is smoking allowed?",
    answer:
      "Not indoors, anywhere. Smoking is fine in the courtyard and on the terraces, where there are ashtrays. Music outdoors stops at 10:30 PM.",
  },
  {
    id: "cancellation",
    group: "Cancellation",
    question: "What is the cancellation policy?",
    answer:
      "Cancel 30 days or more before check-in and 90% comes back; 50% between 15 and 29 days; 25% between 7 and 14 days; nothing inside 7 days. The full schedule is on the accommodation page.",
  },
  {
    id: "refund-timing",
    group: "Cancellation",
    question: "How long does a refund take?",
    answer:
      "Seven to ten working days from the written confirmation, back to the account you paid from. If we ever cancel on you, the refund is in full whatever the notice.",
  },
  {
    id: "change-dates",
    group: "Cancellation",
    question: "Can we move our dates instead?",
    answer:
      "One free date change if you tell us 21 days or more before check-in, subject to the villa being open on the new dates. Any difference in rate is payable.",
  },
  {
    id: "platform-bookings",
    group: "Cancellation",
    question: "What if we booked through Airbnb or Booking.com?",
    answer:
      "That platform's cancellation terms apply instead of ours, and the refund is processed by them. Cancel through the platform you booked on rather than writing to us.",
  },
];

/** Grouped in the order the groups first appear above. */
export const faqGroups = Array.from(new Set(faqs.map((faq) => faq.group))).map((group) => ({
  group,
  items: faqs.filter((faq) => faq.group === group),
}));
