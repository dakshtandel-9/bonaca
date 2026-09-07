import { getImageProps } from "next/image";

import ExternalLink from "@/components/ui/ExternalLink";
import { primaryPlatform } from "@/lib/cms/derive";
import type { SiteContent } from "@/lib/cms/types";
import { SECTION_IDS } from "@/lib/constants";

function AirbnbMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M16 5.1c-2.2 0-3.5 1.9-4.4 4l-5.4 11.5c-.8 1.8-.3 4 1.3 5.1 1.6 1.1 3.7.8 5-.6l3.5-3.8 3.5 3.8c1.3 1.4 3.4 1.7 5 .6 1.6-1.1 2.1-3.3 1.3-5.1L20.4 9.1c-.9-2-2.2-4-4.4-4Zm0 12.4c-1.5-1.9-2.4-3.6-2.4-5a2.4 2.4 0 1 1 4.8 0c0 1.4-.9 3.1-2.4 5Zm-5.1 5.9c-.6.7-1.6.8-2.3.3-.7-.5-.9-1.4-.5-2.3l3.8-8.1c.2 2 1.3 4.1 2.7 5.9l-3.7 4.2Zm12.5.3c-.7.5-1.7.4-2.3-.3l-3.7-4.2c1.4-1.8 2.5-3.9 2.7-5.9l3.8 8.1c.4.9.2 1.8-.5 2.3Z" />
    </svg>
  );
}

/** Art-directed full-bleed hero: landscape on larger screens, portrait on phones. */
export default function HeroSection({ content }: { content: SiteContent }) {
  const hero = content.home.hero;
  const booking = primaryPlatform(content);
  const common = { alt: hero.imageAlt, sizes: "100vw", quality: 88 };

  const { props: wide } = getImageProps({
    ...common,
    src: hero.imageWide,
    width: 1672,
    height: 941,
  });
  const { props: tall } = getImageProps({
    ...common,
    src: hero.imageTall,
    width: 941,
    height: 1672,
  });

  return (
    <section id={SECTION_IDS.stay} className="hero" aria-labelledby="hero-title">
      <div className="hero-media">
        <picture>
          <source media="(min-width: 760px)" srcSet={wide.srcSet ?? wide.src} />
          <img {...tall} loading="eager" fetchPriority="high" alt={hero.imageAlt} />
        </picture>
        <span className="hero-scrim" aria-hidden="true" />
      </div>

      <div className="hero-inner">
        <div className="hero-copy">
          <p className="hero-eyebrow">{hero.eyebrow}</p>

          <h1 id="hero-title" className="hero-title">
            {hero.titleLines.map((line, i) => (
              <span className="hero-title-line" key={i}>
                {line}
              </span>
            ))}
          </h1>

          <span className="hero-accent" aria-hidden="true" />

          <p className="hero-lede">
            {hero.lede.map((line, i) => (
              <span key={i}>
                {line}
                {i < hero.lede.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>

          <div className="hero-actions">
            <ExternalLink href={booking?.url ?? "#"} data-variant="primary">
              <AirbnbMark />
              <span>{hero.ctaLabel}</span>
              <span className="hero-cta-arrow" aria-hidden="true">↗</span>
            </ExternalLink>

            {hero.quickLinks.length > 0 ? (
              <ul className="hero-platforms" aria-label="Other booking and location links">
                {hero.quickLinks.map((link) => (
                  <li key={link.id}>
                    <ExternalLink href={link.url}>{link.label}</ExternalLink>
                  </li>
                ))}
              </ul>
            ) : null}

            {hero.trustNote ? (
              <div className="hero-trust">
                <span className="hero-shield" aria-hidden="true">✓</span>
                <p>{hero.trustNote}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
