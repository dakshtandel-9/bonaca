import Monogram from "@/components/ui/Monogram";
import Reveal from "@/components/ui/Reveal";

interface SectionHeaderProps {
  /** Two-digit chapter number, e.g. "03". */
  index?: string;
  /** Small label above the heading, e.g. "The House". */
  eyebrow?: string;
  title: string;
  description?: string;
  /** Id for the <h2>, referenced by the section's aria-labelledby. */
  headingId: string;
  /** "split" puts the description beside the title instead of beneath it. */
  layout?: "stacked" | "split" | "centred";
}

/**
 * The shared heading block. Sections always use an <h2>; the only <h1> on the
 * page belongs to the hero. The chapter number and mark give each section an
 * anchor point without repeating the same eyebrow-then-heading rhythm.
 */
export default function SectionHeader({
  index,
  eyebrow,
  title,
  description,
  headingId,
  layout = "stacked",
}: SectionHeaderProps) {
  return (
    <header className="section-header" data-layout={layout}>
      {(index || eyebrow) && (
        <Reveal as="p" variant="fade" className="section-eyebrow">
          {index ? <span className="section-index">{index}</span> : null}
          <Monogram size={0.85} className="section-mark" />
          {eyebrow ? <span>{eyebrow}</span> : null}
        </Reveal>
      )}

      <Reveal as="h2" variant="mask" delay={0.05} id={headingId}>
        <span>{title}</span>
      </Reveal>

      {description ? (
        <Reveal as="p" variant="up" delay={0.12} className="section-lede">
          {description}
        </Reveal>
      ) : null}
    </header>
  );
}
