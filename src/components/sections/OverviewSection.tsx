import Image from "next/image";

import Container from "@/components/layout/Container";
import Counter from "@/components/ui/Counter";
import Monogram from "@/components/ui/Monogram";
import Reveal from "@/components/ui/Reveal";
import { overviewPanel, overviewStatement, propertyStats } from "@/data/property";
import { publicAssetExists } from "@/lib/asset";
import { IMAGES, SECTION_IDS } from "@/lib/constants";

/**
 * The premise, composed as plates rather than stacked rows.
 *
 * The statement holds the left, and the pull-quote panel fills the right —
 * the half that used to sit empty while the paragraph ran down in seven short
 * lines. Underneath, one ledger states each fact once, replacing the numbers
 * grid and the highlights grid that repeated it.
 *
 * The photo band uses the hero panel's corner radius so the two read as the
 * same object. It renders a labelled slot until the file exists, so the page
 * is never showing a broken image or a stand-in borrowed from elsewhere.
 */
export default function OverviewSection() {
  const words = overviewStatement.split(" ");
  const hasPhoto = publicAssetExists(IMAGES.premise);

  return (
    <section id={SECTION_IDS.overview} className="overview" aria-labelledby="overview-title">
      <Container>
        <h2 id="overview-title" className="sr-only">
          About Bonaca
        </h2>

        <Reveal as="p" variant="fade" className="section-eyebrow">
          <span className="section-index">01</span>
          <Monogram size={0.85} className="section-mark" />
          <span>The premise</span>
        </Reveal>

        <div className="premise-top">
          <p className="statement">
            {words.map((word, i) => (
              <Reveal
                as="span"
                key={`${word}-${i}`}
                variant="fade"
                delay={i * 0.02}
                className="statement-word"
              >
                {word}{" "}
              </Reveal>
            ))}
          </p>

          <Reveal variant="scale" delay={0.15} className="premise-panel">
            <span className="grain" aria-hidden="true" />
            <Monogram size={15} className="premise-mark" />

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

        <Reveal variant="scale" className="premise-photo">
          {hasPhoto ? (
            <Image
              src={IMAGES.premise}
              alt="Bonaca in daylight — the house seen across its own ground"
              width={2520}
              height={1080}
              sizes="(max-width: 900px) 92vw, 90vw"
            />
          ) : (
            <div className="photo-slot">
              <Monogram size={2.6} />
              <p className="photo-slot-title">Photograph goes here</p>
              <p className="photo-slot-spec">
                <span>2520 × 1080</span>
                <span>21:9</span>
                <span>JPEG</span>
              </p>
              <p className="photo-slot-path">public/images/bonaca/premise/premise-wide.jpg</p>
            </div>
          )}
        </Reveal>

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
