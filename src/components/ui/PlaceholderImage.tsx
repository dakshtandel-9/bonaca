import Image from "next/image";

interface PlaceholderImageProps {
  /** Image path under /public, or `null` while no real asset exists. */
  src: string | null;
  alt: string;
  width: number;
  height: number;
  /** Note shown in the placeholder box describing the expected photo. */
  note?: string;
  /** Set on the single largest above-the-fold image only. */
  preload?: boolean;
  sizes?: string;
}

/**
 * Renders a real image with next/image when an asset path is supplied, and a
 * clearly marked empty box when it is not. This keeps the layout honest: no
 * stock photography, no invented images, and no broken image requests.
 */
export default function PlaceholderImage({
  src,
  alt,
  width,
  height,
  note,
  preload = false,
  sizes,
}: PlaceholderImageProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        preload={preload}
        sizes={sizes}
      />
    );
  }

  return (
    <div className="placeholder" role="img" aria-label={alt} data-placeholder="image">
      <p>Image placeholder</p>
      <p>{note ?? alt}</p>
    </div>
  );
}
