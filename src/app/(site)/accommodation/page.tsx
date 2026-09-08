import type { Metadata } from "next";
import Image from "next/image";

import Container from "@/components/layout/Container";
import PageHero from "@/components/layout/PageHero";
import ExternalLink from "@/components/ui/ExternalLink";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { getSiteContent } from "@/lib/cms/content";
import { formatPrice, isComingSoon, primaryPlatform, telHref } from "@/lib/cms/derive";
import { ROUTES } from "@/lib/constants";
import { absoluteUrl } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();

  /* A holding page should not describe the page it is standing in for — the
     root layout's title and description carry the site instead, so a link
     shared while the site is down previews the property, not its rates. */
  if (isComingSoon(content)) return {};

  const { meta } = content.accommodation;

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: ROUTES.accommodation },
    openGraph: {
      title: `${meta.title} — ${content.site.name}`,
      description: meta.description,
      url: absoluteUrl(ROUTES.accommodation),
    },
  };
}

/**
 * The page a visitor lands on once they have decided they like the look of the
 * house and want the terms. It opens on three frames and then stops selling:
 * everything below the fold is a number, a rule or a time.
 */
export default async function AccommodationPage() {
  const content = await getSiteContent();

  /* The layout draws the holding page; this segment must render nothing,
     or its copy still reaches the browser in the RSC payload. */
  if (isComingSoon(content)) return null;
  const { site, accommodation } = content;
  const { rates, about, policies } = accommodation;

  const booking = primaryPlatform(content);
  const phoneHref = telHref(site.contact.phone);
  const price = (amount: number) => formatPrice(amount, rates.currency);

  const [lead, ...rest] = accommodation.featuredImages;

  return (
    <main id="main-content">
      <PageHero
        index={accommodation.hero.index}
        eyebrow={accommodation.hero.eyebrow}
        title={accommodation.hero.title}
        lede={accommodation.hero.lede}
        headingId="accommodation-title"
      >
        <Reveal variant="fade" delay={0.18} className="page-hero-facts">
          <ul>
            {content.home.overview.stats.map((stat) => (
              <li key={stat.id}>
                <strong>
                  {stat.value}
                  {stat.suffix}
                </strong>
                <span>{stat.label}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* The three frames the page opens on: one tall, two stacked beside it.
            The rest of the shoot waits until #gallery, further down. */}
        {lead ? (
          <Reveal variant="fade" delay={0.24} className="villa-triptych">
            <figure className="villa-triptych-lead">
              <Image
                src={lead.src}
                alt={lead.alt}
                width={lead.width}
                height={lead.height}
                sizes="(max-width: 900px) 100vw, 58vw"
                preload
              />
            </figure>

            <div className="villa-triptych-stack">
              {rest.map((image, i) => (
                <figure key={`${image.src}-${i}`}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    sizes="(max-width: 900px) 50vw, 30vw"
                    loading="eager"
                  />
                </figure>
              ))}
            </div>
          </Reveal>
        ) : null}
      </PageHero>

      <section id="rates" className="villa-rates" aria-labelledby="rates-title">
        <Container>
          <SectionHeader
            index={rates.index}
            eyebrow={rates.eyebrow}
            headingId="rates-title"
            title={rates.title}
            description={rates.description}
            layout="split"
          />

          <div className="rate-lead">
            <Reveal variant="up" className="rate-headline">
              <p className="rate-from">{rates.leadPrefix}</p>
              <p className="rate-amount">
                {price(rates.leadAmount)}
                <span>{rates.leadUnit}</span>
              </p>
              <p className="rate-note">{rates.leadNote}</p>
              <p className="rate-minimum">
                {rates.minimumStayLabel}: {rates.minimumStay}
              </p>
            </Reveal>

            <Reveal variant="up" delay={0.08} className="rate-actions">
              <ExternalLink href={booking?.url ?? "#"} data-variant="primary">
                {rates.primaryCtaLabel} <span aria-hidden="true">↗</span>
              </ExternalLink>
              <a href={phoneHref} data-variant="outline">
                {rates.callCtaLabel} <span aria-hidden="true">↗</span>
              </a>
              <p className="rate-actions-note">{rates.ctaNote}</p>
            </Reveal>
          </div>

          {rates.rows.length > 0 ? (
            <Reveal variant="up" delay={0.05} className="rate-table-wrap">
              <h3 className="villa-subhead">{rates.tableTitle}</h3>
              <table className="rate-table">
                <caption className="sr-only">
                  Nightly rates for {site.name} by night type
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Rate</th>
                    <th scope="col">When it applies</th>
                    <th scope="col">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {rates.rows.map((row) => (
                    <tr key={row.id}>
                      <th scope="row">{row.label}</th>
                      <td>{row.detail}</td>
                      <td className="rate-cell">
                        <strong>{price(row.amount)}</strong>
                        <span>per {row.unit}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
          ) : null}

          <div className="rate-scope">
            <Reveal variant="up" className="rate-scope-col">
              <h3 className="villa-subhead">{rates.inclusionsTitle}</h3>
              <ul className="tick-list">
                {rates.inclusions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>

            <Reveal variant="up" delay={0.08} className="rate-scope-col" data-tone="exclusions">
              <h3 className="villa-subhead">{rates.exclusionsTitle}</h3>
              <ul className="tick-list" data-tone="exclusions">
                {rates.exclusions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="rate-exclusion-note">{rates.exclusionsNote}</p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section id="about" className="villa-about band-sand" aria-labelledby="about-title">
        <Container>
          <SectionHeader
            index={about.index}
            eyebrow={about.eyebrow}
            headingId="about-title"
            title={about.title}
            layout="split"
          />

          <div className="villa-about-body">
            {about.paragraphs.map((paragraph, i) => (
              <Reveal as="p" key={i} variant="up" delay={i * 0.05}>
                {paragraph}
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section id="rooms" className="villa-rooms" aria-labelledby="villa-rooms-title">
        <Container>
          <SectionHeader
            index={accommodation.rooms.index}
            eyebrow={accommodation.rooms.eyebrow}
            headingId="villa-rooms-title"
            title={accommodation.rooms.title}
            description={accommodation.rooms.description}
            layout="split"
          />

          <ul className="bedroom-list">
            {accommodation.rooms.items.map((room, i) => (
              <Reveal as="li" key={room.id} variant="up" delay={(i % 3) * 0.06}>
                <article className="bedroom-card">
                  <figure>
                    <Image
                      src={room.image}
                      alt={`${room.name} at ${site.name}`}
                      width={room.width}
                      height={room.height}
                      sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 32vw"
                    />
                  </figure>

                  <div className="bedroom-body">
                    <p className="bedroom-index">{room.index}</p>
                    <h3>{room.name}</h3>
                    <p className="bedroom-kind">{room.kind}</p>
                    <p className="bedroom-copy">{room.description}</p>
                    <ul className="bedroom-features">
                      {room.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section id="amenities" className="amenities band-dark" aria-labelledby="villa-amenities-title">
        <span className="grain" aria-hidden="true" />

        <Container>
          <SectionHeader
            index={accommodation.amenities.index}
            eyebrow={accommodation.amenities.eyebrow}
            headingId="villa-amenities-title"
            title={accommodation.amenities.title}
            description={accommodation.amenities.description}
            layout="split"
          />

          <ul className="amenities-list">
            {content.amenities.items.map((amenity, i) => (
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

      <section id="gallery" className="villa-gallery" aria-labelledby="villa-gallery-title">
        <Container>
          <SectionHeader
            index={accommodation.gallery.index}
            eyebrow={accommodation.gallery.eyebrow}
            headingId="villa-gallery-title"
            title={accommodation.gallery.title}
            description={accommodation.gallery.description}
            layout="split"
          />

          <ul className="villa-grid">
            {accommodation.gallery.images.map((image, i) => (
              <Reveal as="li" key={`${image.src}-${i}`} variant="fade" delay={(i % 3) * 0.05}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                  loading="lazy"
                />
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section id="policies" className="villa-policies band-dark" aria-labelledby="policies-title">
        <span className="grain" aria-hidden="true" />

        <Container>
          <SectionHeader
            index={policies.index}
            eyebrow={policies.eyebrow}
            headingId="policies-title"
            title={policies.title}
            description={policies.description}
            layout="split"
          />

          <div className="policy-grid">
            <Reveal variant="up" className="policy-block">
              <h3 className="villa-subhead">{policies.timesTitle}</h3>
              <dl className="time-list">
                <div>
                  <dt>{policies.checkInLabel}</dt>
                  <dd>
                    <strong>{policies.checkIn}</strong>
                    <span>{policies.checkInNote}</span>
                  </dd>
                </div>
                <div>
                  <dt>{policies.checkOutLabel}</dt>
                  <dd>
                    <strong>{policies.checkOut}</strong>
                    <span>{policies.checkOutNote}</span>
                  </dd>
                </div>
              </dl>
              <p className="policy-note">{policies.earlyCheckIn}</p>
            </Reveal>

            <Reveal variant="up" delay={0.06} className="policy-block">
              <h3 className="villa-subhead">{policies.cancellationTitle}</h3>
              <ol className="policy-list">
                {policies.cancellation.map((clause) => (
                  <li key={clause.id}>
                    <span className="policy-window">{clause.window}</span>
                    <span className="policy-outcome">{clause.outcome}</span>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal variant="up" delay={0.12} className="policy-block">
              <h3 className="villa-subhead">{policies.refundTitle}</h3>
              <ul className="policy-prose">
                {policies.refund.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal variant="up" delay={0.08} className="policy-cta">
            <p>{policies.ctaText}</p>
            <div className="rate-actions">
              <ExternalLink href={booking?.url ?? "#"} data-variant="primary">
                {policies.primaryCtaLabel} <span aria-hidden="true">↗</span>
              </ExternalLink>
              <a href={phoneHref} data-variant="outline">
                {policies.callCtaLabel} <span aria-hidden="true">↗</span>
              </a>
            </div>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
