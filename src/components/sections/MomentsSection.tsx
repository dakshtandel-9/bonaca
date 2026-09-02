import Container from "@/components/layout/Container";
import Monogram from "@/components/ui/Monogram";
import Reveal from "@/components/ui/Reveal";
import { moments } from "@/data/moments";
import { SECTION_IDS } from "@/lib/constants";

/**
 * The Experience section, told as a single day. Rendered as a timeline with a
 * rule that draws itself down the page — a different rhythm from every other
 * section, and no photography required.
 */
export default function MomentsSection() {
  return (
    <section id={SECTION_IDS.moments} className="moments band-sand" aria-labelledby="moments-title">
      <Container>
        <div className="moments-head">
          <Reveal as="p" variant="fade" className="section-eyebrow">
            <span className="section-index">05</span>
            <Monogram size={0.85} className="section-mark" />
            <span>A day here</span>
          </Reveal>

          <Reveal as="h2" variant="mask" id="moments-title">
            <span>Sunrise to properly dark.</span>
          </Reveal>
        </div>

        <ol className="moments-list">
          {moments.map((moment, i) => (
            <Reveal as="li" key={moment.id} variant="up" delay={i * 0.06}>
              <span className="moment-time">{moment.time}</span>
              <span className="moment-dot" aria-hidden="true" />
              <div className="moment-body">
                <h3>{moment.title}</h3>
                <p>{moment.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
