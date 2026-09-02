export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

/** ⚠️ Confirm every answer against your actual house policy before launch. */
export const faqItems: FaqItem[] = [
  {
    id: "whole-house",
    question: "Do we get the whole house?",
    answer:
      "Yes. Bonaca is only ever let to one group at a time, so the bedrooms, living spaces, courtyard and grounds are yours for the length of your stay.",
  },
  {
    id: "how-to-book",
    question: "How do I book?",
    answer:
      "Availability and payment are handled by our listing partners — Airbnb, Booking.com and Agoda — so your reservation is protected by their terms. For dates you cannot find online, message us on WhatsApp and we will check the calendar directly.",
  },
  {
    id: "check-in",
    question: "What are the check-in and check-out times?",
    answer:
      "Check-in is from 2pm and check-out is by 11am. Earlier arrivals and later departures are usually possible when the house is free either side — just ask ahead.",
  },
  {
    id: "food",
    question: "Is food included?",
    answer:
      "The kitchen is fully equipped if you would like to cook. The caretaker can also arrange simple home-style meals with a day's notice, charged separately at cost.",
  },
  {
    id: "getting-there",
    question: "How do we get there?",
    answer:
      "Driving is easiest and there is private parking inside the gate. Exact directions and a pin are sent once your booking is confirmed.",
  },
  {
    id: "children",
    question: "Are children and pets welcome?",
    answer:
      "Children are very welcome. Do get in touch before booking if you are travelling with pets so we can talk through the grounds and the ground-floor rooms.",
  },
];
