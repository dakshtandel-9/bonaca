import { siteConfig } from "@/lib/site-config";
import type { NearbyLocation } from "@/types/location";

/** PLACEHOLDER: replace with the real setting description. */
export const locationSummary = {
  heading: "Close to nature. Connected to everything.",
  description:
    "Bonaca sits on a quiet stretch away from through-traffic, within easy reach of the places worth seeing. Exact directions are shared with confirmed guests.",
  /** PLACEHOLDER address line. */
  addressLine: "Full address available on booking",
  directionsUrl: siteConfig.links.googleMaps,
};

/** PLACEHOLDER travel times — confirm all values with the client. */
export const nearbyLocations: NearbyLocation[] = [
  {
    id: "airport",
    name: "Nearest Airport",
    travelTime: "Time to be confirmed",
    type: "airport",
  },
  {
    id: "railway-station",
    name: "Railway Station",
    travelTime: "Time to be confirmed",
    type: "railway-station",
  },
  {
    id: "city-center",
    name: "City Center",
    travelTime: "Time to be confirmed",
    type: "city-center",
  },
  {
    id: "local-attractions",
    name: "Local Attractions",
    travelTime: "Time to be confirmed",
    type: "attraction",
  },
];
