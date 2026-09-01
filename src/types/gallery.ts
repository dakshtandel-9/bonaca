export type GalleryCategory = "exterior" | "interior" | "bedroom" | "outdoor";

export interface GalleryItem {
  id: string;
  /**
   * Path to the image under /public. `null` while no real photography exists
   * in the repository, which makes the item render as a PlaceholderImage.
   */
  src: string | null;
  /** Always required, including for placeholders, for accessibility. */
  alt: string;
  category: GalleryCategory;
  /** Intrinsic dimensions, used by next/image once a real `src` is set. */
  width: number;
  height: number;
}
