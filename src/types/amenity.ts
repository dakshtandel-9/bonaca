/** Icon identifier for an amenity, resolved to an inline SVG in ui/Icon.tsx. */
export type AmenityIconKey =
  | "home"
  | "wifi"
  | "climate"
  | "kitchen"
  | "parking"
  | "water"
  | "leaf"
  | "bell";

export interface Amenity {
  id: string;
  name: string;
  description: string;
  iconKey: AmenityIconKey;
}
