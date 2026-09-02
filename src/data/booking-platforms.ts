import { siteConfig } from "@/lib/site-config";
import type { BookingPlatform } from "@/types/booking";

/**
 * External platforms where visitors complete a booking or enquiry.
 * URLs come from siteConfig so there is a single place to update them.
 */
export const bookingPlatforms: BookingPlatform[] = [
  {
    id: "airbnb",
    name: "Airbnb",
    url: siteConfig.links.airbnb,
    description: "Live calendar, instant confirmation",
    external: true,
    primary: true,
  },
  {
    id: "booking",
    name: "Booking.com",
    url: siteConfig.links.booking,
    description: "Free cancellation options",
    external: true,
    primary: false,
  },
  {
    id: "agoda",
    name: "Agoda",
    url: siteConfig.links.agoda,
    description: "Seasonal rates",
    external: true,
    primary: false,
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    url: siteConfig.contact.whatsapp,
    description: "Ask us anything, directly",
    external: true,
    primary: false,
  },
];

/** The single preferred booking destination, used by the header and hero. */
export const primaryBookingPlatform: BookingPlatform =
  bookingPlatforms.find((platform) => platform.primary) ?? bookingPlatforms[0];

/** Everything except the primary, for the secondary tile row. */
export const secondaryBookingPlatforms = bookingPlatforms.filter(
  (platform) => !platform.primary,
);
