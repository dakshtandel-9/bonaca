interface SectionHeaderProps {
  /** Small label above the heading, e.g. "OUR STORY". */
  eyebrow?: string;
  title: string;
  description?: string;
  /** Id for the <h2>, referenced by the section's aria-labelledby. */
  headingId: string;
}

/**
 * The shared heading block for homepage sections. Sections always use an
 * <h2>; the only <h1> on the page belongs to the hero.
 */
export default function SectionHeader({
  eyebrow,
  title,
  description,
  headingId,
}: SectionHeaderProps) {
  return (
    <header>
      {eyebrow ? <p data-role="eyebrow">{eyebrow}</p> : null}
      <h2 id={headingId}>{title}</h2>
      {description ? <p>{description}</p> : null}
    </header>
  );
}
