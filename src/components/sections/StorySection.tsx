import Image from "next/image";

import Container from "@/components/layout/Container";
import Monogram from "@/components/ui/Monogram";
import Reveal from "@/components/ui/Reveal";
import type { SiteContent } from "@/lib/cms/types";
import { SECTION_IDS } from "@/lib/constants";

/**
 * A simple dark chapter with one owner-supplied photo slot.
 */
export default function StorySection({ content }: { content: SiteContent }) {
  const story = content.home.story;

  return (
    <section id={SECTION_IDS.story} className="story band-dark" aria-labelledby="story-title">
      <Container>
        <div className="story-layout">
          <Reveal variant="scale" className="story-image-frame">
            <Image
              className="story-photo"
              src={story.image}
              alt={story.imageAlt}
              width={1536}
              height={1024}
              sizes="(max-width: 759px) 100vw, 54vw"
            />
          </Reveal>

          <div className="story-text">
            <Reveal as="p" variant="fade" className="section-eyebrow">
              <span className="section-index">{story.index}</span>
              <Monogram size={0.85} className="section-mark" />
              <span>{story.eyebrow}</span>
            </Reveal>

            <Reveal as="h2" variant="mask" id="story-title" className="story-title">
              <span>{story.title}</span>
            </Reveal>

            {story.paragraphs.map((paragraph, i) => (
              <Reveal as="p" key={i} variant="up" delay={0.08 + i * 0.08} className="story-para">
                {paragraph}
              </Reveal>
            ))}

            {story.specs.length > 0 ? (
              <Reveal variant="up" delay={0.24}>
                <ul className="story-specs">
                  {story.specs.map((spec) => (
                    <li key={spec.id}>
                      <span>{spec.label}</span> {spec.value}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}

            {story.note ? (
              <Reveal as="p" variant="up" delay={0.28} className="story-note">
                <Monogram size={1.05} />
                <span>{story.note}</span>
              </Reveal>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
