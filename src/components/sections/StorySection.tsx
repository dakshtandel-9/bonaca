import Image from "next/image";

import Container from "@/components/layout/Container";
import Monogram from "@/components/ui/Monogram";
import Reveal from "@/components/ui/Reveal";
import { property } from "@/data/property";
import { IMAGES, SECTION_IDS } from "@/lib/constants";

/**
 * A simple dark chapter with one owner-supplied photo slot.
 */
export default function StorySection() {
  return (
    <section id={SECTION_IDS.story} className="story band-dark" aria-labelledby="story-title">
      <Container>
        <div className="story-layout">
          <Reveal variant="scale" className="story-image-frame">
            <Image
              className="story-photo"
              src={IMAGES.story}
              alt="Bonaca's pool courtyard and warmly illuminated villa at blue hour"
              width={1536}
              height={1024}
              sizes="(max-width: 759px) 100vw, 54vw"
            />
          </Reveal>

          <div className="story-text">
            <Reveal as="p" variant="fade" className="section-eyebrow">
              <span className="section-index">02</span>
              <Monogram size={0.85} className="section-mark" />
              <span>The house</span>
            </Reveal>

            <Reveal as="h2" variant="mask" id="story-title" className="story-title">
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

            <Reveal as="p" variant="up" delay={0.28} className="story-note">
              <Monogram size={1.05} />
              <span>The quiet is the amenity.</span>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
