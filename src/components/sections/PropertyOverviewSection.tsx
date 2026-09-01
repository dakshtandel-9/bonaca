import Container from "@/components/layout/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import { property, propertyHighlights } from "@/data/property";
import { SECTION_IDS } from "@/lib/constants";

export default function PropertyOverviewSection() {
  return (
    <section id={SECTION_IDS.overview} aria-labelledby="overview-title">
      <Container>
        <SectionHeader
          headingId="overview-title"
          eyebrow="The Property"
          title="An entire home, yours alone."
          description={property.intro[0]}
        />

        <ul>
          {propertyHighlights.map((highlight) => (
            <li key={highlight.id}>
              <span className="fact-mark" aria-hidden="true" />
              <h3>{highlight.label}</h3>
              <p>{highlight.description}</p>
            </li>
          ))}
        </ul>

        <p className="data-note">Property details are provisional and awaiting final confirmation.</p>
      </Container>
    </section>
  );
}
