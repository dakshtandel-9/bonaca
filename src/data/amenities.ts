import type { Amenity } from "@/types/amenity";

/**
 * PLACEHOLDER amenities. `iconKey` is a plain identifier for now — icons are
 * chosen during the design phase, so no icon library is installed.
 */
export const amenities: Amenity[] = [
  {
    id: "wifi",
    name: "High-Speed Wi-Fi",
    description: "Reliable connectivity throughout the house.",
    iconKey: "wifi",
  },
  {
    id: "air-conditioning",
    name: "Air Conditioning",
    description: "Climate control in every bedroom and living area.",
    iconKey: "air-conditioning",
  },
  {
    id: "smart-tv",
    name: "Smart TV",
    description: "Streaming-ready screen in the main living space.",
    iconKey: "tv",
  },
  {
    id: "kitchen",
    name: "Fully Equipped Kitchen",
    description: "Cook as you would at home, with everything to hand.",
    iconKey: "kitchen",
  },
  {
    id: "parking",
    name: "Private Parking",
    description: "Off-street parking on the property.",
    iconKey: "parking",
  },
  {
    id: "hot-water",
    name: "Hot Water",
    description: "Round-the-clock hot water in all bathrooms.",
    iconKey: "water",
  },
  {
    id: "garden",
    name: "Garden Space",
    description: "Private outdoor seating surrounded by greenery.",
    iconKey: "garden",
  },
  {
    id: "support",
    name: "24/7 Support",
    description: "A caretaker on call for anything you need.",
    iconKey: "support",
  },
];
