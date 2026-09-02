"use client";

import Container from "@/components/layout/Container";
import AccordionGallery from "@/components/ui/AccordionGallery";
import SectionHeader from "@/components/ui/SectionHeader";
import { showcaseFrames } from "@/data/showcase";
import { SECTION_IDS } from "@/lib/constants";

/**
 * A second pass at the photography, read as one row rather than a grid: the
 * panel under the pointer opens and the rest fall back, tilted and drained of
 * colour. Deliberately placed after the gallery, where a visitor has already
 * seen everything and is browsing rather than surveying.
 */
export default function ShowcaseSection() {
  return (
    <section id={SECTION_IDS.showcase} className="showcase" aria-labelledby="showcase-title">
      <Container>
        <SectionHeader
          index="05"
          eyebrow="In detail"
          headingId="showcase-title"
          title="One frame at a time."
          description="The same house, taken slowly. Hover a panel to open it."
          layout="split"
        />

        <div className="showcase-stage">
          <AccordionGallery
            items={showcaseFrames}
            label="Bonaca in eight frames"
            defaultIndex={2}
            height={540}
            gap={12}
            radius={4}
            expandRatio={0.42}
            accentColor="var(--sand)"
            overlayColor="#141908"
            textColor="var(--sand-soft)"
          />
        </div>
      </Container>
    </section>
  );
}
