import { siteConfig } from "@/lib/site-config";
import type { NearbyLocation } from "@/types/location";

export const locationSummary = {
  heading: "Far enough to feel it. Close enough to reach.",
  description:
    "Bonaca sits back from through-traffic on a quiet stretch of road, within an easy drive of everything worth seeing and nothing you came to get away from.",
  addressLine: siteConfig.place.addressNote,
  directionsUrl: siteConfig.links.googleMaps,
};

/** ⚠️ REPLACE every `travelTime` with a confirmed figure. */
export const nearbyLocations: NearbyLocation[] = [
  { id: "airport", name: "Nearest airport", travelTime: "— to confirm", type: "airport" },
  { id: "railway-station", name: "Railway station", travelTime: "— to confirm", type: "railway-station" },
  { id: "city-center", name: "City centre", travelTime: "— to confirm", type: "city-center" },
  { id: "local-attractions", name: "Local attractions", travelTime: "— to confirm", type: "attraction" },
];
