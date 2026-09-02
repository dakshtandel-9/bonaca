import Image from "next/image";

import Container from "@/components/layout/Container";
import Monogram from "@/components/ui/Monogram";
import Reveal from "@/components/ui/Reveal";
import { overviewStatement, propertyStats } from "@/data/property";
import { SECTION_IDS } from "@/lib/constants";

/**
 * A restrained, one-viewport introduction with one owner-supplied photo slot.
 */
export default function OverviewSection() {
  return (
    <section id={SECTION_IDS.overview} className="overview" aria-labelledby="overview-title">
      <Container>
        <Reveal as="p" variant="fade" className="section-eyebrow">
          <span className="section-index">01</span>
          <Monogram size={0.85} className="section-mark" />
          <span>The premise</span>
        </Reveal>

        <div className="premise-layout">
          <div className="premise-copy">
            <Reveal as="h2" variant="mask" id="overview-title" className="premise-title">
              <span>A home made for slower days.</span>
            </Reveal>

            <Reveal as="p" variant="up" delay={0.08} className="premise-intro-copy">
              {overviewStatement}
            </Reveal>

            <ul className="premise-ledger" aria-label="Property details">
              {propertyStats.map((stat, index) => (
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
              src="/images/bonaca/premise/sec2.png"
              alt="Bonaca's illuminated entrance and landscaped grounds at dusk"
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
