"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import Container from "@/components/layout/Container";
import Masonry from "@/components/ui/Masonry";
import SectionHeader from "@/components/ui/SectionHeader";
import { galleryCategories } from "@/lib/cms/derive";
import type { SiteContent } from "@/lib/cms/types";
import { SECTION_IDS } from "@/lib/constants";

/** Four across on a desktop, stepping down to a single column on a phone. */
const GALLERY_COLUMNS = [
  { min: 1100, columns: 4 },
  { min: 760, columns: 3 },
  { min: 520, columns: 2 },
] as const;

/**
 * Masonry grid on a dark band, with a lightbox that supports arrow keys and
 * Escape. Filtering only changes which figures are shown, so the lightbox
 * always steps through what the visitor can actually see — and the grid
 * re-flows to the remaining photographs rather than re-rendering.
 */
export default function GallerySection({ content }: { content: SiteContent }) {
  const section = content.home.gallery;
  const galleryItems = section.items;
  const categories = galleryCategories(content);

  const [filter, setFilter] = useState<string>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const visible =
    filter === "all" ? galleryItems : galleryItems.filter((item) => item.category === filter);

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpenIndex((current) =>
        current === null ? null : (current + delta + visible.length) % visible.length,
      ),
    [visible.length],
  );

  useEffect(() => {
    if (openIndex === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [openIndex, close, step]);

  const current = openIndex === null ? null : visible[openIndex];

  return (
    <section id={SECTION_IDS.gallery} className="gallery band-dark" aria-labelledby="gallery-title">
      <span className="grain" aria-hidden="true" />

      <Container>
        <SectionHeader
          index={section.index}
          eyebrow={section.eyebrow}
          headingId="gallery-title"
          title={section.title}
          description={section.description}
          layout="split"
        />

        {categories.length > 2 && (
          <div className="gallery-filters" role="group" aria-label="Filter the gallery">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                data-active={filter === category ? "" : undefined}
                aria-pressed={filter === category}
                onClick={() => {
                  setFilter(category);
                  setOpenIndex(null);
                }}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        <Masonry
          items={visible}
          className="gallery-grid"
          breakpoints={GALLERY_COLUMNS}
          gap={20}
          animateFrom="bottom"
          hoverScale={0.975}
        >
          {(item, i) => (
            <button type="button" onClick={() => setOpenIndex(i)}>
              <figure>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 520px) 92vw, (max-width: 760px) 46vw, (max-width: 1100px) 31vw, 23vw"
                />
                <figcaption>
                  <span>{item.category}</span>
                  <span className="gallery-zoom" aria-hidden="true">
                    View
                  </span>
                </figcaption>
              </figure>
            </button>
          )}
        </Masonry>
      </Container>

      {current && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={current.alt}>
          <button type="button" className="lightbox-backdrop" onClick={close} tabIndex={-1} aria-hidden="true" />

          <figure>
            <Image
              src={current.src}
              alt={current.alt}
              width={current.width}
              height={current.height}
              sizes="92vw"
            />
            <figcaption>{current.alt}</figcaption>
          </figure>

          <div className="lightbox-bar">
            <button type="button" onClick={() => step(-1)} aria-label="Previous image">
              ←
            </button>
            <span aria-live="polite">
              {(openIndex ?? 0) + 1} / {visible.length}
            </span>
            <button type="button" onClick={() => step(1)} aria-label="Next image">
              →
            </button>
          </div>

          <button type="button" className="lightbox-close" onClick={close} autoFocus>
            Close <span aria-hidden="true">✕</span>
          </button>
        </div>
      )}
    </section>
  );
}
