import type { ReactNode } from "react";

import Container from "@/components/layout/Container";
import Monogram from "@/components/ui/Monogram";
import Reveal from "@/components/ui/Reveal";

interface PageHeroProps {
  /** Two-digit chapter number, matching the homepage's section numbering. */
  index?: string;
  eyebrow: string;
  title: string;
  lede?: string;
  /** Id for the <h1>, referenced by the section's aria-labelledby. */
  headingId: string;
  /** Anything that sits under the copy — a stat row, a pair of buttons. */
  children?: ReactNode;
  /** When given, sits to the right of the copy and the stat row instead of below them. */
  aside?: ReactNode;
}

/**
 * The opening band on every page that is not the homepage. It is dark on
 * purpose: the header is transparent until the visitor scrolls, so an interior
 * page needs something behind it that the cream wordmark can sit on.
 */
export default function PageHero({
  index,
  eyebrow,
  title,
  lede,
  headingId,
  children,
  aside,
}: PageHeroProps) {
  return (
    <section className="page-hero band-dark" aria-labelledby={headingId}>
      <span className="grain" aria-hidden="true" />

      <Container className={aside ? "page-hero-split" : undefined}>
        <div className="page-hero-copy">
        <Reveal as="p" variant="fade" className="section-eyebrow">
          {index ? <span className="section-index">{index}</span> : null}
          <Monogram size={0.85} className="section-mark" />
          <span>{eyebrow}</span>
        </Reveal>

        <Reveal as="h1" variant="mask" delay={0.05} id={headingId} className="page-hero-title">
          <span>{title}</span>
        </Reveal>

        {lede ? (
          <Reveal as="p" variant="up" delay={0.12} className="page-hero-lede">
            {lede}
          </Reveal>
        ) : null}

        {children}
        </div>

        {aside ? <div className="page-hero-aside">{aside}</div> : null}
      </Container>
    </section>
  );
}
