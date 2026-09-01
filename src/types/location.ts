export type NearbyLocationType =
  | "airport"
  | "railway-station"
  | "city-center"
  | "attraction";

export interface NearbyLocation {
  id: string;
  name: string;
  /** Approximate travel time, e.g. "45 min by car". */
  travelTime: string;
  type: NearbyLocationType;
}
