import Container from "@/components/layout/Container";
import Monogram from "@/components/ui/Monogram";
import Reveal from "@/components/ui/Reveal";
import { property } from "@/data/property";
import { SECTION_IDS } from "@/lib/constants";

/**
 * A dark editorial chapter with a deliberately empty interior-photo slot.
 */
export default function StorySection() {
  return (
    <section id={SECTION_IDS.story} className="story band-dark" aria-labelledby="story-title">
      <Container>
        <div className="story-heading">
          <Reveal as="p" variant="fade" className="section-eyebrow">
            <span className="section-index">02</span>
            <Monogram size={0.85} className="section-mark" />
            <span>The house</span>
          </Reveal>

          <Reveal as="h2" variant="mask" id="story-title" className="story-title">
            <span>Designed around light, air and quiet.</span>
          </Reveal>
        </div>

        <div className="story-layout">
          <div className="story-media">
            <Reveal variant="scale" className="image-placeholder story-image-placeholder">
              <span className="placeholder-kicker">Interior photograph</span>
              <div className="placeholder-spec">
                <span>Recommended upload</span>
                <strong>1800 × 2250 px</strong>
                <small>Portrait · 4:5 · JPG or WebP</small>
              </div>
            </Reveal>

            <Reveal as="blockquote" variant="up" delay={0.18} className="story-quote">
              <Monogram size={1.25} />
              <p>The quiet is the amenity.</p>
            </Reveal>
          </div>

          <div className="story-text">
            <p className="story-copy-label">A considered stay</p>

            {property.intro.map((paragraph, i) => (
              <Reveal as="p" key={i} variant="up" delay={0.08 + i * 0.08} className="story-para">
                {paragraph}
              </Reveal>
            ))}

            <Reveal variant="up" delay={0.24}>
              <ul className="story-specs">
                <li><span>Walls</span> Lime-washed, 18 inches deep</li>
                <li><span>Floors</span> Local limestone, honed</li>
                <li><span>Frames</span> Solid teak, oiled</li>
              </ul>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
