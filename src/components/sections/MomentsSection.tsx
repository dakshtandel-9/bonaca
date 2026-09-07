import Container from "@/components/layout/Container";
import FlowingMenu from "@/components/ui/FlowingMenu";
import Monogram from "@/components/ui/Monogram";
import Reveal from "@/components/ui/Reveal";
import type { SiteContent } from "@/lib/cms/types";
import { SECTION_IDS } from "@/lib/constants";

/**
 * The Experience section, told as a single day. The four hours are rows that
 * run the full width of the band; hovering one pulls its photograph across in
 * a marquee, entering from whichever edge the pointer crossed.
 */
export default function MomentsSection({ content }: { content: SiteContent }) {
  const section = content.home.moments;
  if (section.items.length === 0) return null;

  return (
    <section id={SECTION_IDS.moments} className="moments band-sand" aria-labelledby="moments-title">
      <Container>
        <div className="moments-head">
          <Reveal as="p" variant="fade" className="section-eyebrow">
            <span className="section-index">{section.index}</span>
            <Monogram size={0.85} className="section-mark" />
            <span>{section.eyebrow}</span>
          </Reveal>

          <Reveal as="h2" variant="mask" id="moments-title">
            <span>{section.title}</span>
          </Reveal>
        </div>
      </Container>

      <Reveal variant="fade" className="moments-menu">
        <FlowingMenu
          items={section.items.map((moment) => ({
            id: moment.id,
            label: moment.time,
            text: moment.title,
            note: moment.body,
            image: moment.image,
          }))}
          marqueeBgColor="var(--ink-deep)"
          marqueeTextColor="var(--sand)"
        />
      </Reveal>
    </section>
  );
}
