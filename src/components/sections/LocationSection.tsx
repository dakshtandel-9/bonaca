import Container from "@/components/layout/Container";
import ExternalLink from "@/components/ui/ExternalLink";
import SectionHeader from "@/components/ui/SectionHeader";
import { locationSummary, nearbyLocations } from "@/data/location";
import { SECTION_IDS } from "@/lib/constants";

export default function LocationSection() {
  return (
    <section id={SECTION_IDS.location} aria-labelledby="location-title">
      <Container>
        <SectionHeader
          headingId="location-title"
          eyebrow="Location"
          title={locationSummary.heading}
          description={locationSummary.description}
        />

        <div data-role="content">
          <p>{locationSummary.addressLine}</p>

          <ExternalLink
            href={locationSummary.directionsUrl}
            data-variant="primary"
          >
            Get Directions <span aria-hidden="true">↗</span>
          </ExternalLink>

          <h3>Getting here</h3>
          <ul>
            {nearbyLocations.map((location) => (
              <li key={location.id} data-location-type={location.type}>
                <span>{location.name}</span>
                <span>{location.travelTime}</span>
              </li>
            ))}
          </ul>
        </div>

        <div data-role="media">
          <div className="map-visual" role="img" aria-label="Decorative location map; exact Bonaca location is pending">
            <span className="map-road map-road-one" />
            <span className="map-road map-road-two" />
            <span className="map-road map-road-three" />
            <span className="map-water" />
            <span className="map-marker"><i />Bonaca</span>
            <span className="map-caption">Exact location to be confirmed</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
