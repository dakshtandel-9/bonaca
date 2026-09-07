"use client";

import Container from "@/components/layout/Container";
import AccordionGallery from "@/components/ui/AccordionGallery";
import SectionHeader from "@/components/ui/SectionHeader";
import type { SiteContent } from "@/lib/cms/types";
import { SECTION_IDS } from "@/lib/constants";

/**
 * A second pass at the photography, read as one row rather than a grid: the
 * panel under the pointer opens and the rest fall back, tilted and drained of
 * colour. Deliberately placed after the gallery, where a visitor has already
 * seen everything and is browsing rather than surveying.
 */
export default function ShowcaseSection({ content }: { content: SiteContent }) {
  const section = content.home.showcase;
  if (section.frames.length === 0) return null;

  return (
    <section id={SECTION_IDS.showcase} className="showcase" aria-labelledby="showcase-title">
      <Container>
        <SectionHeader
          index={section.index}
          eyebrow={section.eyebrow}
          headingId="showcase-title"
          title={section.title}
          description={section.description}
          layout="split"
        />

        <div className="showcase-stage">
          <AccordionGallery
            items={section.frames}
            label={`${content.site.name} in ${section.frames.length} frames`}
            defaultIndex={Math.min(2, section.frames.length - 1)}
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
