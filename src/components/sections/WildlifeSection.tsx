import Image from "next/image";

import Container from "@/components/layout/Container";
import Icon from "@/components/ui/Icon";
import Monogram from "@/components/ui/Monogram";
import Reveal from "@/components/ui/Reveal";
import type { SiteContent } from "@/lib/cms/types";

/**
 * How far the wild is. Each park is a row with its distance by road, and a bar
 * drawn to scale against the farthest one, so "close" reads at a glance before
 * anyone looks at the numbers.
 */
export default function WildlifeSection({ content }: { content: SiteContent }) {
  const section = content.accommodation.wildlife;
  if (section.items.length === 0) return null;

  const farthest = Math.max(...section.items.map((item) => item.distanceKm), 1);
  const nearest = section.items.reduce((best, item) =>
    item.distanceKm < best.distanceKm ? item : best,
  );

  return (
    <section id="wildlife" className="villa-wildlife band-sand" aria-labelledby="wildlife-title">
      <Container>
        <div className="wildlife-layout">
          <div className="wildlife-copy">
            <Reveal as="p" variant="fade" className="section-eyebrow">
              <span className="section-index">{section.index}</span>
              <Monogram size={0.85} className="section-mark" />
              <span>{section.eyebrow}</span>
            </Reveal>

            <Reveal as="h2" variant="mask" id="wildlife-title" className="wildlife-title">
              <span>{section.title}</span>
            </Reveal>

            {section.description ? (
              <Reveal as="p" variant="up" delay={0.06} className="wildlife-lede">
                {section.description}
              </Reveal>
            ) : null}

            <Reveal variant="up" delay={0.1} className="wildlife-nearest">
              <span className="wildlife-nearest-icon" aria-hidden="true">
                <Icon name="binoculars" />
              </span>
              <span>
                <strong>{nearest.distanceKm} km</strong>
                <small>to {nearest.name}</small>
              </span>
            </Reveal>

            {section.image ? (
              <Reveal variant="scale" delay={0.12} className="wildlife-image">
                <Image src={section.image} alt={section.imageAlt} fill sizes="(max-width: 900px) 100vw, 40vw" />
              </Reveal>
            ) : null}
          </div>

          <div className="wildlife-list-wrap">
            <ol className="wildlife-list">
              {section.items.map((item, i) => (
                <Reveal as="li" key={`${item.id}-${i}`} variant="up" delay={i * 0.05}>
                  <div className="wildlife-row">
                    <div>
                      <h3>{item.name}</h3>
                      {item.highlight ? <p>{item.highlight}</p> : null}
                    </div>
                    <p className="wildlife-distance">
                      <strong>{item.distanceKm} km</strong>
                      {item.driveTime ? <span>{item.driveTime}</span> : null}
                    </p>
                  </div>
                  <span className="wildlife-bar" aria-hidden="true">
                    <span style={{ width: `${Math.max(6, (item.distanceKm / farthest) * 100)}%` }} />
                  </span>
                </Reveal>
              ))}
            </ol>

            {section.note ? <p className="wildlife-note">{section.note}</p> : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
