/**
 * Icon identifier for an amenity. Resolved to an actual icon during the
 * design phase; no icon library is installed yet.
 */
export type AmenityIconKey =
  | "wifi"
  | "air-conditioning"
  | "tv"
  | "kitchen"
  | "parking"
  | "water"
  | "garden"
  | "support";

export interface Amenity {
  id: string;
  name: string;
  description: string;
  iconKey: AmenityIconKey;
}
