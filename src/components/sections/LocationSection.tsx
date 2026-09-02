import Container from "@/components/layout/Container";
import ExternalLink from "@/components/ui/ExternalLink";
import Monogram from "@/components/ui/Monogram";
import Reveal from "@/components/ui/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { locationSummary, nearbyLocations } from "@/data/location";
import { SECTION_IDS } from "@/lib/constants";
import { siteConfig } from "@/lib/site-config";

/**
 * Shows a real embedded map when `siteConfig.mapEmbedUrl` is set, and a
 * typographic panel when it is not. The previous version drew fake roads in
 * CSS, which read as a placeholder no matter how carefully it was styled.
 */
export default function LocationSection() {
  return (
    <section id={SECTION_IDS.location} className="location" aria-labelledby="location-title">
      <Container>
        <div className="location-text">
          <SectionHeader
            index="08"
            eyebrow="Location"
            headingId="location-title"
            title={locationSummary.heading}
            description={locationSummary.description}
          />

          <Reveal variant="up" delay={0.1}>
            <ul className="location-times">
              {nearbyLocations.map((place) => (
                <li key={place.id}>
                  <span>{place.name}</span>
                  <span className="location-dots" aria-hidden="true" />
                  <span className="location-time">{place.travelTime}</span>
                </li>
              ))}
            </ul>

            <p className="location-note">{locationSummary.addressLine}</p>

            <ExternalLink href={locationSummary.directionsUrl} data-variant="ghost">
              Open in Google Maps <span aria-hidden="true">↗</span>
            </ExternalLink>
          </Reveal>
        </div>

        <Reveal variant="scale" className="location-media">
          {siteConfig.mapEmbedUrl ? (
            <iframe
              src={siteConfig.mapEmbedUrl}
              title={`Map showing ${siteConfig.name}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          ) : (
            <div className="location-panel">
              <Monogram size={3.4} />
              <p className="location-place">{siteConfig.place.locality}</p>
              <p className="location-region">{siteConfig.place.region}</p>
              <p className="location-hint">
                {/* ⚠️ Set siteConfig.mapEmbedUrl to replace this panel with a live map. */}
                A map appears here once the property pin is published.
              </p>
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
