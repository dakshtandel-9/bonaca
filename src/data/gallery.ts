import type { GalleryItem } from "@/types/gallery";

/** Provisional architectural visualisations based on Bonaca reference photos. */
export const galleryItems: GalleryItem[] = [
  {
    id: "courtyard",
    src: "/images/bonaca/gallery/exterior-01.jpg",
    alt: "The white Bonaca courtyard at sunset",
    category: "exterior",
    width: 2000,
    height: 1500,
  },
  {
    id: "living-room",
    src: "/images/bonaca/gallery/living-room.jpg",
    alt: "Warm, light-filled living room with an arched doorway",
    category: "interior",
    width: 1800,
    height: 1350,
  },
  {
    id: "dining-area",
    src: "/images/bonaca/gallery/dining.jpg",
    alt: "Calm gathering space finished in stone and warm timber",
    category: "interior",
    width: 1800,
    height: 1350,
  },
  {
    id: "primary-bedroom",
    src: "/images/bonaca/gallery/bedroom.jpg",
    alt: "Serene Bonaca bedroom with cream linen and olive accents",
    category: "bedroom",
    width: 1400,
    height: 1866,
  },
  {
    id: "fields",
    src: "/images/bonaca/gallery/exterior-02.jpg",
    alt: "Bonaca opening onto green fields in the early morning",
    category: "outdoor",
    width: 1800,
    height: 1350,
  },
  {
    id: "garden",
    src: "/images/bonaca/gallery/garden.jpg",
    alt: "Quiet outdoor terrace framed by greenery",
    category: "outdoor",
    width: 1800,
    height: 1350,
  },
];
