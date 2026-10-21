import Image from "next/image";

import Container from "@/components/layout/Container";
import ActionLink from "@/components/ui/ActionLink";
import Icon from "@/components/ui/Icon";
import Monogram from "@/components/ui/Monogram";
import Reveal from "@/components/ui/Reveal";
import type { SiteContent } from "@/lib/cms/types";
import { SECTION_IDS } from "@/lib/constants";

/**
 * Where the house is: the Dooars, told in two short paragraphs beside one large
 * landscape. Sits straight after the day so "head out and explore" has a place
 * to point to, and the three markers under the copy name what is out there.
 */
export default function RegionSection({ content }: { content: SiteContent }) {
  const region = content.home.region;

  return (
    <section id={SECTION_IDS.region} className="region" aria-labelledby="region-title">
      <Container>
        <div className="region-layout">
          <div className="region-copy">
            <Reveal as="p" variant="fade" className="section-eyebrow">
              <span className="section-index">{region.index}</span>
              <Monogram size={0.85} className="section-mark" />
              <span>{region.eyebrow}</span>
            </Reveal>

            <Reveal as="h2" variant="mask" id="region-title" className="region-title">
              <span>{region.title}</span>
            </Reveal>

            {region.paragraphs.map((paragraph, index) => (
              <Reveal as="p" key={index} variant="up" delay={0.06 + index * 0.04} className="region-para">
                {paragraph}
              </Reveal>
            ))}

            {region.ctaLabel ? (
              <Reveal variant="up" delay={0.14} className="region-action">
                <ActionLink href={region.ctaHref} className="pill-link">
                  {region.ctaLabel}
                  <span aria-hidden="true">↗</span>
                </ActionLink>
              </Reveal>
            ) : null}

            {region.highlights.length > 0 ? (
              <ul className="region-highlights">
                {region.highlights.map((highlight, index) => (
                  <Reveal as="li" key={highlight.id} variant="up" delay={0.18 + index * 0.04}>
                    <span className="region-highlight-icon">
                      <Icon name={highlight.iconKey} />
                    </span>
                    <span className="region-highlight-label">{highlight.label}</span>
                  </Reveal>
                ))}
              </ul>
            ) : null}
          </div>

          <Reveal variant="scale" delay={0.08} className="region-image-frame">
            {region.image ? (
              <Image
                className="region-image"
                src={region.image}
                alt={region.imageAlt}
                fill
                sizes="(max-width: 900px) 100vw, 56vw"
              />
            ) : null}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
