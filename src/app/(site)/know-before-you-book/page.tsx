import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/layout/Container";
import PageHero from "@/components/layout/PageHero";
import ExternalLink from "@/components/ui/ExternalLink";
import Reveal from "@/components/ui/Reveal";
import { getSiteContent } from "@/lib/cms/content";
import { faqGroups, groupSlug, isComingSoon, primaryPlatform, telHref } from "@/lib/cms/derive";
import { ROUTES } from "@/lib/constants";
import { absoluteUrl } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();

  /* A holding page should not describe the page it is standing in for — the
     root layout's title and description carry the site instead, so a link
     shared while the site is down previews the property, not its rates. */
  if (isComingSoon(content)) return {};

  const { meta } = content.knowBeforeYouBook;

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: ROUTES.knowBeforeYouBook },
    openGraph: {
      title: `${meta.title} — ${content.site.name}`,
      description: meta.description,
      url: absoluteUrl(ROUTES.knowBeforeYouBook),
    },
  };
}

/**
 * Every answer is open. An accordion here would hide exactly the terms a
 * visitor came to read, and would make the page useless to anyone scanning it
 * with ⌘F before they commit money to a date.
 */
export default async function KnowBeforeYouBookPage() {
  const content = await getSiteContent();

  /* The layout draws the holding page; this segment must render nothing,
     or its copy still reaches the browser in the RSC payload. */
  if (isComingSoon(content)) return null;
  const { site, knowBeforeYouBook: page } = content;
  const groups = faqGroups(page.items);
  const booking = primaryPlatform(content);

  return (
    <main id="main-content">
      <PageHero
        index={page.hero.index}
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        lede={page.hero.lede}
        headingId="faq-title"
      >
        {groups.length > 0 ? (
          <Reveal variant="fade" delay={0.18} className="faq-jump">
            <ul>
              {groups.map((section) => (
                <li key={section.group}>
                  <a href={`#${groupSlug(section.group)}`}>{section.group}</a>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}
      </PageHero>

      {groups.map((section, groupIndex) => (
        <section
          key={section.group}
          id={groupSlug(section.group)}
          className="faq-band"
          data-tone={groupIndex % 2 === 1 ? "warm" : undefined}
          aria-labelledby={`${groupSlug(section.group)}-title`}
        >
          <Container>
            <div className="faq-layout">
              <Reveal
                as="h2"
                variant="up"
                id={`${groupSlug(section.group)}-title`}
                className="faq-group-title"
              >
                <span className="faq-group-index">
                  {String(groupIndex + 1).padStart(2, "0")}
                </span>
                {section.group}
              </Reveal>

              <dl className="faq-list">
                {section.items.map((faq, i) => (
                  <Reveal key={faq.id} variant="up" delay={(i % 4) * 0.04}>
                    <dt id={faq.id}>{faq.question}</dt>
                    <dd>{faq.answer}</dd>
                  </Reveal>
                ))}
              </dl>
            </div>
          </Container>
        </section>
      ))}

      <section className="faq-cta band-dark" aria-labelledby="faq-cta-title">
        <span className="grain" aria-hidden="true" />

        <Container>
          <Reveal as="h2" variant="mask" id="faq-cta-title" className="page-hero-title">
            <span>{page.cta.title}</span>
          </Reveal>

          <Reveal as="p" variant="up" delay={0.06} className="page-hero-lede">
            {page.cta.body}{" "}
            <Link href={ROUTES.accommodation}>See the full tariff</Link>.
          </Reveal>

          <Reveal variant="up" delay={0.12} className="rate-actions">
            <a href={telHref(site.contact.phone)} data-variant="primary">
              {page.cta.primaryCtaLabel} <span aria-hidden="true">↗</span>
            </a>
            <ExternalLink href={booking?.url ?? "#"} data-variant="outline">
              {page.cta.secondaryCtaLabel} <span aria-hidden="true">↗</span>
            </ExternalLink>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
