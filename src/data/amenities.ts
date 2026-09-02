import type { Amenity } from "@/types/amenity";

/** `iconKey` maps to an inline SVG in components/ui/Icon.tsx — no icon library. */
export const amenities: Amenity[] = [
  {
    id: "entire-home",
    name: "The whole house",
    description: "One booking at a time. You will not meet another guest.",
    iconKey: "home",
  },
  {
    id: "wifi",
    name: "High-speed Wi-Fi",
    description: "Strong enough to work from, across every room and the courtyard.",
    iconKey: "wifi",
  },
  {
    id: "air-conditioning",
    name: "Air conditioning",
    description: "In every bedroom, with ceiling fans through the living spaces.",
    iconKey: "climate",
  },
  {
    id: "kitchen",
    name: "Full kitchen",
    description: "Cook as you would at home, or hand it to the caretaker.",
    iconKey: "kitchen",
  },
  {
    id: "parking",
    name: "Private parking",
    description: "Off-street, inside the gate, room for two cars.",
    iconKey: "parking",
  },
  {
    id: "hot-water",
    name: "Hot water, always",
    description: "Round-the-clock in all three bathrooms.",
    iconKey: "water",
  },
  {
    id: "garden",
    name: "Courtyard & garden",
    description: "Walled, planted and lit for the evening.",
    iconKey: "leaf",
  },
  {
    id: "support",
    name: "Caretaker on call",
    description: "On the property, reachable at any hour, invisible unless wanted.",
    iconKey: "bell",
  },
];
