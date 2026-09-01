import Container from "@/components/layout/Container";
import ExternalLink from "@/components/ui/ExternalLink";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import {
  bookingPlatforms,
  primaryBookingPlatform,
} from "@/data/booking-platforms";
import { SECTION_IDS } from "@/lib/constants";
import { siteConfig } from "@/lib/site-config";

/** Platforms shown alongside the primary call to action. */
const HERO_PLATFORM_IDS = ["booking", "agoda", "google-maps"];

const heroPlatforms = bookingPlatforms.filter((platform) =>
  HERO_PLATFORM_IDS.includes(platform.id),
);

export default function HeroSection() {
  return (
    <section id={SECTION_IDS.stay} aria-labelledby="hero-title">
      <Container>
        <div data-role="content">
          <p data-role="eyebrow">{siteConfig.name.toUpperCase()} · PRIVATE RETREAT</p>

          <h1 id="hero-title">
            A Private Retreat
            <br />
            Rooted in Calm.
          </h1>

          <p>
            A thoughtfully designed private stay surrounded by greenery,
            comfort and quiet.
          </p>

          <div data-role="booking-links">
            <ExternalLink
              href={primaryBookingPlatform.url}
              data-variant="primary"
            >
              View on {primaryBookingPlatform.name} <span aria-hidden="true">↗</span>
            </ExternalLink>

            <ul>
              {heroPlatforms.map((platform) => (
                <li key={platform.id}>
                  <ExternalLink href={platform.url}>
                    {platform.name} <span aria-hidden="true">↗</span>
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div data-role="media">
          <PlaceholderImage
            src="/images/bonaca/hero/hero-main.jpg"
            alt="Bonaca's white courtyard retreat at golden hour"
            width={2000}
            height={1500}
            sizes="100vw"
            preload
          />
        </div>

        <p className="hero-note">
          Reservations are completed securely through our trusted listing partners.
        </p>
      </Container>
    </section>
  );
}
