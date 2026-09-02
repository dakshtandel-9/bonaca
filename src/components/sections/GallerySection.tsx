"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import Container from "@/components/layout/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import { galleryCategories, galleryItems } from "@/data/gallery";
import { SECTION_IDS } from "@/lib/constants";

/**
 * Editorial grid on a dark band, with a lightbox that supports arrow keys and
 * Escape. Filtering only changes which figures are shown, so the lightbox
 * always steps through what the visitor can actually see.
 */
export default function GallerySection() {
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
          index="04"
          eyebrow="Gallery"
          headingId="gallery-title"
          title="Spaces that photograph honestly."
          description="Every picture here is the house as it stands. Nothing staged elsewhere, nothing borrowed."
          layout="split"
        />

        {galleryCategories.length > 2 && (
          <div className="gallery-filters" role="group" aria-label="Filter the gallery">
            {galleryCategories.map((category) => (
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

        <ul className="gallery-grid">
          {visible.map((item, i) => (
            <li key={item.id} data-category={item.category}>
              <button type="button" onClick={() => setOpenIndex(i)}>
                <figure>
                  <Image
                    src={item.src as string}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    sizes="(max-width: 700px) 86vw, (max-width: 1100px) 50vw, 40vw"
                  />
                  <figcaption>
                    <span>{item.category}</span>
                    <span className="gallery-zoom" aria-hidden="true">
                      View
                    </span>
                  </figcaption>
                </figure>
              </button>
            </li>
          ))}
        </ul>
      </Container>

      {current && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={current.alt}>
          <button type="button" className="lightbox-backdrop" onClick={close} tabIndex={-1} aria-hidden="true" />

          <figure>
            <Image
              src={current.src as string}
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
