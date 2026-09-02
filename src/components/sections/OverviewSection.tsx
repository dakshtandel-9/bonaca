import Container from "@/components/layout/Container";
import Counter from "@/components/ui/Counter";
import Monogram from "@/components/ui/Monogram";
import Reveal from "@/components/ui/Reveal";
import { overviewPanel, overviewStatement, propertyStats } from "@/data/property";
import { SECTION_IDS } from "@/lib/constants";

/**
 * The first section after the hero carries its editorial scale forward while
 * deliberately leaving the main photography slot empty for the owner.
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

        <div className="premise-intro">
          <Reveal as="h2" variant="mask" id="overview-title" className="premise-title">
            <span>A home made for slower days.</span>
          </Reveal>
          <Reveal as="p" variant="up" delay={0.12} className="premise-intro-copy">
            {overviewStatement}
          </Reveal>
        </div>

        <div className="premise-composition">
          <Reveal variant="scale" className="image-placeholder premise-image-placeholder">
            <span className="placeholder-kicker">Exterior photograph</span>
            <div className="placeholder-spec">
              <span>Recommended upload</span>
              <strong>2400 × 1500 px</strong>
              <small>Landscape · 8:5 · JPG or WebP</small>
            </div>
          </Reveal>

          <Reveal variant="up" delay={0.14} className="premise-panel">
            <Monogram size={10} className="premise-mark" />

            <p className="premise-label">
              <Monogram size={0.8} />
              <span>{overviewPanel.label}</span>
            </p>

            <blockquote>
              {overviewPanel.quoteLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </blockquote>

            <p className="premise-claim">{overviewPanel.claim}</p>
          </Reveal>
        </div>

        <ul className="premise-ledger">
          {propertyStats.map((stat, i) => (
            <Reveal as="li" key={stat.id} variant="up" delay={i * 0.07}>
              <span className="ledger-value">
                <Counter value={stat.value} suffix={stat.suffix} />
              </span>
              <span className="ledger-label">{stat.label}</span>
              <span className="ledger-detail">{stat.detail}</span>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
