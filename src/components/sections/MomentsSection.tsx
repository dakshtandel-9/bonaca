"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import Container from "@/components/layout/Container";
import ActionLink from "@/components/ui/ActionLink";
import Reveal from "@/components/ui/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import type { SiteContent } from "@/lib/cms/types";
import { SECTION_IDS } from "@/lib/constants";

function Arrow({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={direction === "prev" ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/**
 * The day at Bonaca, told as a row of portrait cards from first light to dark.
 * It also carries the second pass at the photography, so there is no separate
 * showcase band. On a wide screen the whole day fits; narrower, the row scrolls
 * sideways — by swipe, by trackpad, or one card at a time with the arrows.
 */
export default function MomentsSection({ content }: { content: SiteContent }) {
  const section = content.home.moments;
  const trackRef = useRef<HTMLOListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanPrev(track.scrollLeft > 2);
    setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    measure();
    track.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(track);

    return () => {
      track.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [measure]);

  const step = (direction: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return;

    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: reduce ? "auto" : "smooth" });
  };

  if (section.items.length === 0) return null;

  return (
    <section id={SECTION_IDS.moments} className="moments" aria-labelledby="moments-title">
      <Container>
        <SectionHeader
          index={section.index}
          eyebrow={section.eyebrow}
          headingId="moments-title"
          title={section.title}
          description={section.description}
          layout="split"
        />

        <ol
          ref={trackRef}
          className="day-track"
          aria-label={`A day at ${content.site.name}, hour by hour`}
          tabIndex={0}
        >
          {/* Ids are editable in the CRM and have been saved twice before, so the
              index keeps keys unique whatever the owner types. */}
          {section.items.map((moment, index) => (
            <Reveal as="li" key={`${moment.id}-${index}`} variant="up" delay={Math.min(index, 5) * 0.05} className="day-card">
              <div className="day-card-media">
                {moment.image ? (
                  <Image
                    src={moment.image}
                    alt=""
                    fill
                    sizes="(max-width: 520px) 72vw, (max-width: 760px) 44vw, (max-width: 1100px) 28vw, 16vw"
                  />
                ) : null}
              </div>
              <p className="day-card-time">{moment.time}</p>
              <h3 className="day-card-title">{moment.title}</h3>
              <p className="day-card-body">{moment.body}</p>
            </Reveal>
          ))}
        </ol>

        <div className="day-foot">
          <div className="day-nav">
            <button
              type="button"
              className="day-nav-button"
              onClick={() => step(-1)}
              disabled={!canPrev}
              aria-label="Earlier in the day"
            >
              <Arrow direction="prev" />
            </button>
            <button
              type="button"
              className="day-nav-button"
              onClick={() => step(1)}
              disabled={!canNext}
              aria-label="Later in the day"
            >
              <Arrow direction="next" />
            </button>
            {section.navLabel ? <span className="day-nav-label">{section.navLabel}</span> : null}
          </div>

          {section.ctaLabel ? (
            <ActionLink href={section.ctaHref} className="pill-link">
              {section.ctaLabel}
              <span aria-hidden="true">↗</span>
            </ActionLink>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
