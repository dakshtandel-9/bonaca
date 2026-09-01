import Link from "next/link";

import Container from "@/components/layout/Container";
import ExternalLink from "@/components/ui/ExternalLink";
import SectionHeader from "@/components/ui/SectionHeader";
import { bookingPlatforms } from "@/data/booking-platforms";
import { SECTION_IDS } from "@/lib/constants";
import { siteConfig } from "@/lib/site-config";

export default function BookingSection() {
  return (
    <section id={SECTION_IDS.booking} aria-labelledby="booking-title">
      <Container>
        <SectionHeader
          headingId="booking-title"
          eyebrow="Book Your Stay"
          title={`Ready to stay at ${siteConfig.name}?`}
          description="Check availability and reserve through your preferred platform."
        />

        <ul>
          {bookingPlatforms.map((platform) => (
            <li
              key={platform.id}
              data-variant={platform.primary ? "primary" : undefined}
            >
              {platform.external ? (
                <ExternalLink href={platform.url}>
                  <span className="platform-mark" aria-hidden="true">{platform.name.slice(0, 1)}</span>
                  <span>
                    <strong>{platform.name}</strong>
                    <small>{platform.description}</small>
                  </span>
                  <span className="platform-arrow" aria-hidden="true">↗</span>
                </ExternalLink>
              ) : (
                <Link href={platform.url}>{platform.name}</Link>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
