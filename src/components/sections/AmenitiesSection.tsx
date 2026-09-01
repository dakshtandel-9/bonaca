import Container from "@/components/layout/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import { amenities } from "@/data/amenities";
import { SECTION_IDS } from "@/lib/constants";

const amenityMarks: Record<string, string> = {
  wifi: "⌁",
  "air-conditioning": "✣",
  tv: "▣",
  kitchen: "◇",
  parking: "P",
  water: "≈",
  garden: "⌇",
  support: "24",
};

export default function AmenitiesSection() {
  return (
    <section id={SECTION_IDS.amenities} aria-labelledby="amenities-title">
      <Container>
        <SectionHeader
          headingId="amenities-title"
          eyebrow="Comfort, considered"
          title="Everything you need. Nothing you don’t."
          description="Thoughtful essentials, quietly taken care of."
        />

        <ul>
          {amenities.map((amenity) => (
            /* data-icon-key is where an icon will be attached in the design phase. */
            <li key={amenity.id} data-icon-key={amenity.iconKey}>
              <span className="amenity-mark" aria-hidden="true">{amenityMarks[amenity.iconKey]}</span>
              <h3>{amenity.name}</h3>
              <p>{amenity.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
