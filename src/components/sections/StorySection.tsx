import Image from "next/image";

import Container from "@/components/layout/Container";
import Monogram from "@/components/ui/Monogram";
import Parallax from "@/components/ui/Parallax";
import Reveal from "@/components/ui/Reveal";
import { property } from "@/data/property";
import { IMAGES, SECTION_IDS } from "@/lib/constants";

/**
 * Dark band. The text column sticks while the tall image drifts past it, so
 * the two halves move at different speeds — the section reads as one long
 * held frame rather than a row of two boxes.
 */
export default function StorySection() {
  return (
    <section id={SECTION_IDS.story} className="story band-dark" aria-labelledby="story-title">
      <span className="grain" aria-hidden="true" />

      <Container>
        <div className="story-text">
          <Reveal as="p" variant="fade" className="section-eyebrow">
            <span className="section-index">02</span>
            <Monogram size={0.85} className="section-mark" />
            <span>The house</span>
          </Reveal>

          <Reveal as="h2" variant="mask" id="story-title">
            <span>Built slowly, on purpose.</span>
          </Reveal>

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

        <div className="story-media">
          <Parallax strength={0.16} className="story-image">
            <Image
              src={IMAGES.living}
              alt="The sunken living room, lit from a wall of glass onto the courtyard"
              width={1800}
              height={1350}
              sizes="(max-width: 900px) 100vw, 55vw"
            />
          </Parallax>

          <Reveal variant="scale" delay={0.2}>
            <blockquote className="story-quote">
              <Monogram size={1.4} />
              <p>The quiet is the amenity.</p>
            </blockquote>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
