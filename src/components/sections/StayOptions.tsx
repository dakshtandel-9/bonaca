"use client";

import Image from "next/image";
import { useState } from "react";

import ExternalLink from "@/components/ui/ExternalLink";
import Icon from "@/components/ui/Icon";
import type { SiteContent, StayOption } from "@/lib/cms/types";

type Stays = SiteContent["accommodation"]["stays"];

interface StayOptionsProps {
  section: Stays;
  /** Check-in and check-out, read from the fine print so they are only typed once. */
  times: { label: string; value: string }[];
  bookingUrl: string;
  phoneHref: string;
}

function StayCard({
  option,
  section,
  selected,
  onSelect,
}: {
  option: StayOption;
  section: Stays;
  selected: boolean;
  onSelect: () => void;
}) {
  const [active, setActive] = useState(0);
  const photos = option.photos.filter((photo) => photo.src);
  const photo = photos[Math.min(active, photos.length - 1)];

  return (
    <article className="stay-card" data-selected={selected ? "" : undefined}>
      <div className="stay-media">
        <div className="stay-photo">
          {photo ? (
            <Image
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 900px) 100vw, 26vw"
            />
          ) : null}
        </div>

        {photos.length > 1 ? (
          <div className="stay-thumbs" role="group" aria-label={`Photographs of ${option.name}`}>
            {photos.map((item, i) => (
              <button
                key={`${item.id}-${i}`}
                type="button"
                aria-label={`Show photograph ${i + 1} of ${photos.length}`}
                aria-pressed={i === active}
                onClick={() => setActive(i)}
              >
                <Image src={item.src} alt="" fill sizes="5rem" />
              </button>
            ))}
          </div>
        ) : null}

        {option.facts.length > 0 ? (
          <ul className="stay-facts">
            {option.facts.map((fact, i) => (
              <li key={`${fact.id}-${i}`}>
                <Icon name={fact.iconKey} />
                <span>{fact.label}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {section.detailsLabel ? (
          <a className="stay-details-link" href="#rooms">
            {section.detailsLabel}
          </a>
        ) : null}
      </div>

      <div className="stay-body">
        {option.tag ? <p className="stay-tag">{option.tag}</p> : null}
        <h3 className="stay-name">{option.name}</h3>
        {option.availability ? <p className="stay-availability">{option.availability}</p> : null}

        <div className="stay-plan">
          <div className="stay-plan-copy">
            {option.planTitle ? <h4>{option.planTitle}</h4> : null}
            {option.inclusions.length > 0 ? (
              <ul className="stay-inclusions">
                {option.inclusions.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            ) : null}
            {option.note ? <p className="stay-note">{option.note}</p> : null}
          </div>

          <div className="stay-choose">
            {option.highlightLabel ? <p className="stay-choose-label">{option.highlightLabel}</p> : null}
            {option.highlightValue ? <p className="stay-choose-value">{option.highlightValue}</p> : null}
            <button type="button" className="stay-select" aria-pressed={selected} onClick={onSelect}>
              {selected ? (
                <>
                  <span aria-hidden="true">✓</span> {section.selectedLabel}
                </>
              ) : (
                section.selectLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * The ways to book the place, laid out like a hotel's room picker without the
 * prices: a card per option, and a summary beside them that fills in as soon
 * as one is chosen and ends on the booking buttons.
 */
export default function StayOptions({ section, times, bookingUrl, phoneHref }: StayOptionsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = section.items.find((item) => item.id === selectedId) ?? null;

  return (
    <div className="stay-layout">
      <ul className="stay-list">
        {section.items.map((option, i) => (
          <li key={`${option.id}-${i}`}>
            <StayCard
              option={option}
              section={section}
              selected={option.id === selectedId}
              onSelect={() => setSelectedId(option.id === selectedId ? null : option.id)}
            />
          </li>
        ))}
      </ul>

      <aside className="stay-summary" aria-label={section.summaryTitle}>
        <h3>{section.summaryTitle}</h3>

        <div className="stay-summary-choice" aria-live="polite">
          {selected ? (
            <>
              <strong>{selected.name}</strong>
              {selected.facts[0] ? <span>{selected.facts[0].label}</span> : null}
            </>
          ) : (
            <span className="stay-summary-empty">{section.emptyLabel}</span>
          )}
        </div>

        <dl className="stay-summary-rows">
          {[...times, ...section.summaryRows].map((row, i) => (
            <div key={`${row.label}-${i}`}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>

        {section.summaryNote ? <p className="stay-summary-note">{section.summaryNote}</p> : null}

        <div className="stay-summary-actions">
          <ExternalLink href={bookingUrl} data-variant="primary">
            {section.primaryCtaLabel} <span aria-hidden="true">↗</span>
          </ExternalLink>
          <a href={phoneHref} data-variant="outline">
            {section.callCtaLabel} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </aside>
    </div>
  );
}
