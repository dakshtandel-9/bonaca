import Image from "next/image";

import Container from "@/components/layout/Container";
import Monogram from "@/components/ui/Monogram";
import Reveal from "@/components/ui/Reveal";
import type { SiteContent } from "@/lib/cms/types";
import { SECTION_IDS } from "@/lib/constants";

/**
 * A restrained, one-viewport introduction with one owner-supplied photo slot.
 */
export default function OverviewSection({ content }: { content: SiteContent }) {
  const overview = content.home.overview;

  return (
    <section id={SECTION_IDS.overview} className="overview" aria-labelledby="overview-title">
      <Container>
        <Reveal as="p" variant="fade" className="section-eyebrow">
          <span className="section-index">{overview.index}</span>
          <Monogram size={0.85} className="section-mark" />
          <span>{overview.eyebrow}</span>
        </Reveal>

        <div className="premise-layout">
          <div className="premise-copy">
            <Reveal as="h2" variant="mask" id="overview-title" className="premise-title">
              <span>{overview.title}</span>
            </Reveal>

            <Reveal as="p" variant="up" delay={0.08} className="premise-intro-copy">
              {overview.statement}
            </Reveal>

            <ul className="premise-ledger" aria-label="Property details">
              {overview.stats.map((stat, index) => (
                <Reveal as="li" key={stat.id} variant="up" delay={0.12 + index * 0.04}>
                  <span className="ledger-value">{stat.value}{stat.suffix}</span>
                  <span className="ledger-label">{stat.label}</span>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal variant="scale" delay={0.08} className="premise-image-frame">
            <Image
              className="premise-image"
              src={overview.image}
              alt={overview.imageAlt}
              width={1536}
              height={1024}
              sizes="(max-width: 759px) 100vw, 58vw"
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
