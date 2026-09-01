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
    description: "Check availability on Airbnb",
    external: true,
    primary: true,
  },
  {
    id: "booking",
    name: "Booking.com",
    url: siteConfig.links.booking,
    description: "View the listing on Booking.com",
    external: true,
    primary: false,
  },
  {
    id: "agoda",
    name: "Agoda",
    url: siteConfig.links.agoda,
    description: "View the listing on Agoda",
    external: true,
    primary: false,
  },
  {
    id: "google-maps",
    name: "Google Maps",
    url: siteConfig.links.googleMaps,
    description: "Find the property on Google Maps",
    external: true,
    primary: false,
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    url: siteConfig.contact.whatsapp,
    description: "Send a direct enquiry on WhatsApp",
    external: true,
    primary: false,
  },
];

/** The single preferred booking destination, used by the header and hero. */
export const primaryBookingPlatform: BookingPlatform =
  bookingPlatforms.find((platform) => platform.primary) ?? bookingPlatforms[0];
