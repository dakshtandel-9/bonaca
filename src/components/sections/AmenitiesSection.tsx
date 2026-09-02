import Container from "@/components/layout/Container";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { amenities } from "@/data/amenities";
import { SECTION_IDS } from "@/lib/constants";

/**
 * Dark band. A hairline register rather than a grid of boxes: each row is a
 * rule that lights up on hover, with the icon sitting in the left margin.
 */
export default function AmenitiesSection() {
  return (
    <section id={SECTION_IDS.amenities} className="amenities band-dark" aria-labelledby="amenities-title">
      <span className="grain" aria-hidden="true" />

      <Container>
        <SectionHeader
          index="06"
          eyebrow="Amenities"
          headingId="amenities-title"
          title="Everything, quietly handled."
          description="The list is short because everything on it actually works."
          layout="split"
        />

        <ul className="amenities-list">
          {amenities.map((amenity, i) => (
            <Reveal as="li" key={amenity.id} variant="up" delay={(i % 4) * 0.05}>
              <span className="amenity-icon">
                <Icon name={amenity.iconKey} />
              </span>
              <h3>{amenity.name}</h3>
              <p>{amenity.description}</p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
