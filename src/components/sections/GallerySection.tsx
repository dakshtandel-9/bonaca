import Container from "@/components/layout/Container";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import SectionHeader from "@/components/ui/SectionHeader";
import { galleryItems } from "@/data/gallery";
import { SECTION_IDS } from "@/lib/constants";

/**
 * Static, semantic gallery. No carousel, slider or lightbox yet: each item is
 * a self-contained <figure>, so a lightbox trigger can later wrap the figure
 * without changing the data or the surrounding markup.
 */
export default function GallerySection() {
  return (
    <section id={SECTION_IDS.gallery} aria-labelledby="gallery-title">
      <Container>
        <SectionHeader
          headingId="gallery-title"
          eyebrow="Gallery"
          title="Spaces that feel like home."
          description="Quiet corners, considered rooms and a landscape that invites you outside."
        />

        <ul id="gallery-grid">
          {galleryItems.map((item) => (
            <li key={item.id} data-category={item.category}>
              <figure>
                <PlaceholderImage
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                />
                <figcaption>
                  <span>{item.category}</span>
                  <span aria-hidden="true">↗</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <a className="text-link gallery-link" href="#gallery-grid">View Full Gallery <span aria-hidden="true">↗</span></a>
      </Container>
    </section>
  );
}
