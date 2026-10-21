import { getImageProps } from "next/image";

import ExternalLink from "@/components/ui/ExternalLink";
import { primaryPlatform } from "@/lib/cms/derive";
import type { SiteContent } from "@/lib/cms/types";
import { SECTION_IDS } from "@/lib/constants";

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
