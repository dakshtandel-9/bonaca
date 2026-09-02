"use client";

import { useCallback, useEffect, useState } from "react";

import Container from "@/components/layout/Container";
import Monogram from "@/components/ui/Monogram";
import Reveal from "@/components/ui/Reveal";
import { reviews } from "@/data/reviews";
import { SECTION_IDS } from "@/lib/constants";

const ROTATE_MS = 7000;

/**
 * One quote at a time, set large. Advances on its own until the visitor takes
 * over, then stays where they put it — an auto-rotating carousel that ignores
 * you is worse than no carousel.
 *
 * Renders nothing at all when `reviews` is empty, so the section disappears
 * cleanly rather than showing an empty frame.
 */
export default function ReviewsSection() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((next: number) => {
    setPaused(true);
    setIndex(next);
  }, []);

  useEffect(() => {
    if (paused || reviews.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % reviews.length),
      ROTATE_MS,
    );
    return () => window.clearInterval(timer);
  }, [paused]);

  if (reviews.length === 0) return null;

  const review = reviews[index];

  return (
    <section id={SECTION_IDS.reviews} className="reviews" aria-labelledby="reviews-title">
      <Container>
        <Reveal as="p" variant="fade" className="section-eyebrow">
          <span className="section-index">07</span>
          <Monogram size={0.85} className="section-mark" />
          <span>Guests</span>
        </Reveal>

        <h2 id="reviews-title" className="sr-only">
          What guests say
        </h2>

        <Reveal variant="up" className="reviews-stage">
          <figure key={review.id}>
            <div className="review-rating" aria-label={`${review.rating} out of 5`}>
              {Array.from({ length: review.rating }).map((_, i) => (
                <Monogram key={i} size={0.62} />
              ))}
            </div>

            <blockquote>
              <p>{review.quote}</p>
            </blockquote>

            <figcaption>
              <span className="review-author">{review.author}</span>
              <span className="review-meta">
                {review.origin} · via {review.platform}
              </span>
            </figcaption>
          </figure>
        </Reveal>

        {reviews.length > 1 && (
          <div className="reviews-nav">
            <button
              type="button"
              onClick={() => go((index - 1 + reviews.length) % reviews.length)}
              aria-label="Previous review"
            >
              ←
            </button>

            <ol className="reviews-dots">
              {reviews.map((item, i) => (
                <li key={item.id}>
                  <button
                    type="button"
                    data-active={i === index ? "" : undefined}
                    aria-current={i === index}
                    aria-label={`Review ${i + 1} of ${reviews.length}`}
                    onClick={() => go(i)}
                  />
                </li>
              ))}
            </ol>

            <button
              type="button"
              onClick={() => go((index + 1) % reviews.length)}
              aria-label="Next review"
            >
              →
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}
