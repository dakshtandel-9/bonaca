import { galleryItems } from "@/data/gallery";
import type { AccordionGalleryItem } from "@/components/ui/AccordionGallery";

/**
 * Eight of the gallery's twelve frames, re-labelled for the accordion — the
 * captions there are read at a glance, so they are shorter than the alt text.
 * Swap ids freely; anything listed here must exist in `galleryItems`.
 */
const FRAMES: { id: string; label: string }[] = [
  { id: "compound-dusk", label: "The compound" },
  { id: "lounge-pit", label: "The lounge" },
  { id: "bedroom-courtyard", label: "The garden room" },
  { id: "pool-walk", label: "The water walk" },
  { id: "lawn-elevation", label: "The lawn" },
  { id: "courtyard-lanterns", label: "The courtyard" },
  { id: "bedroom-terrace", label: "The upper room" },
  { id: "aerial-night", label: "After dark" },
];

export const showcaseFrames: AccordionGalleryItem[] = FRAMES.map(({ id, label }) => {
  const source = galleryItems.find((item) => item.id === id);
  if (!source?.src) throw new Error(`showcase: no gallery item with a source for "${id}"`);

  return { id, label, image: source.src, alt: source.alt };
});
