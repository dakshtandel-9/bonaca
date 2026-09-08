import type { Metadata } from "next";
import Image from "next/image";

import Container from "@/components/layout/Container";
import PageHero from "@/components/layout/PageHero";
import ExternalLink from "@/components/ui/ExternalLink";
import Reveal from "@/components/ui/Reveal";
import StarRating from "@/components/ui/StarRating";
import { getSiteContent } from "@/lib/cms/content";
import { isComingSoon, primaryPlatform, telHref } from "@/lib/cms/derive";
import { ROUTES } from "@/lib/constants";
import { absoluteUrl } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();

  /* A holding page should not describe the page it is standing in for — the
     root layout's title and description carry the site instead, so a link
     shared while the site is down previews the property, not its rates. */
  if (isComingSoon(content)) return {};

  const { meta } = content.experiences;

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: ROUTES.experiences },
    openGraph: {
      title: `${meta.title} — ${content.site.name}`,
      description: meta.description,
      url: absoluteUrl(ROUTES.experiences),
    },
  };
}

/**
 * A card grid rather than another scroll narrative: a visitor on this page is
 * comparing, not being told a story. Every card carries the one photograph the
 * experience actually happens in, so nothing here is illustrated with a room
 * it does not take place in.
 */
export default async function ExperiencesPage() {
  const content = await getSiteContent();

  /* The layout draws the holding page; this segment must render nothing,
     or its copy still reaches the browser in the RSC payload. */
  if (isComingSoon(content)) return null;
  const { site, experiences } = content;
  const booking = primaryPlatform(content);

  return (
    <main id="main-content">
      <PageHero
        index={experiences.hero.index}
        eyebrow={experiences.hero.eyebrow}
        title={experiences.hero.title}
        lede={experiences.hero.lede}
        headingId="experiences-title"
      />

      <section className="experience-band" aria-labelledby="experience-list-title">
        <Container>
          <h2 id="experience-list-title" className="sr-only">
            Experiences at {site.name}
          </h2>

          <ul className="experience-grid">
            {experiences.items.map((experience, i) => (
              <Reveal as="li" key={experience.id} variant="up" delay={(i % 3) * 0.06}>
                <article className="experience-card">
                  <figure className="experience-media">
                    <Image
                      src={experience.image}
                      alt={experience.alt}
                      width={experience.width}
                      height={experience.height}
                      sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 32vw"
                      loading={i < 3 ? "eager" : "lazy"}
                    />
                    <figcaption className="experience-tag">{experience.tag}</figcaption>
                  </figure>

                  <div className="experience-body">
                    <h3>{experience.title}</h3>
                    <p>{experience.description}</p>

                    <div className="experience-rating">
                      <StarRating rating={experience.rating} />
                      <span>{experience.rating.toFixed(1)} · guest rated</span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section className="experience-cta band-dark" aria-labelledby="experience-cta-title">
        <span className="grain" aria-hidden="true" />

        <Container>
          <Reveal as="h2" variant="mask" id="experience-cta-title" className="page-hero-title">
            <span>{experiences.cta.title}</span>
          </Reveal>

          <Reveal variant="up" delay={0.08} className="rate-actions">
            <ExternalLink href={booking?.url ?? "#"} data-variant="primary">
              {experiences.cta.primaryCtaLabel} <span aria-hidden="true">↗</span>
            </ExternalLink>
            <a href={telHref(site.contact.phone)} data-variant="outline">
              {experiences.cta.callCtaLabel} <span aria-hidden="true">↗</span>
            </a>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
