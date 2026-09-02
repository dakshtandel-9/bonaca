import Container from "@/components/layout/Container";
import ExternalLink from "@/components/ui/ExternalLink";
import Monogram from "@/components/ui/Monogram";
import Reveal from "@/components/ui/Reveal";
import { primaryBookingPlatform, secondaryBookingPlatforms } from "@/data/booking-platforms";
import { faqItems } from "@/data/faq";
import { SECTION_IDS } from "@/lib/constants";
import { siteConfig } from "@/lib/site-config";

/**
 * The closing section carries both jobs a visitor has left: book, or ask.
 * The FAQ uses native <details> so it works with no JavaScript and stays
 * keyboard- and screen-reader-correct for free.
 */
export default function BookingSection() {
  return (
    <section id={SECTION_IDS.booking} className="booking band-sand" aria-labelledby="booking-title">
      <Container>
        <Reveal variant="scale" className="booking-card">
          <span className="grain" aria-hidden="true" />

          <p className="section-eyebrow">
            <span className="section-index">09</span>
            <Monogram size={0.85} className="section-mark" />
            <span>Reserve</span>
          </p>

          <h2 id="booking-title">The house is yours.</h2>

          <p className="booking-lede">
            Availability and payment are handled by our listing partners, so your
            reservation is protected end to end.
          </p>

          <ExternalLink href={primaryBookingPlatform.url} data-variant="primary">
            Book on {primaryBookingPlatform.name} <span aria-hidden="true">↗</span>
          </ExternalLink>

          <ul className="booking-platforms">
            {secondaryBookingPlatforms.map((platform) => (
              <li key={platform.id}>
                <ExternalLink href={platform.url}>
                  <span className="platform-name">{platform.name}</span>
                  <span className="platform-desc">{platform.description}</span>
                  <span className="platform-arrow" aria-hidden="true">↗</span>
                </ExternalLink>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="faq" id="faq">
          <Reveal as="h3" variant="mask" className="faq-title">
            <span>Before you ask.</span>
          </Reveal>

          <ul className="faq-list">
            {faqItems.map((item, i) => (
              <Reveal as="li" key={item.id} variant="up" delay={i * 0.04}>
                <details name="bonaca-faq">
                  <summary>
                    <span>{item.question}</span>
                    <i aria-hidden="true" />
                  </summary>
                  <p>{item.answer}</p>
                </details>
              </Reveal>
            ))}
          </ul>

          <p className="faq-contact">
            Still unsure?{" "}
            <ExternalLink href={siteConfig.contact.whatsapp} data-variant="ghost">
              Message us directly <span aria-hidden="true">↗</span>
            </ExternalLink>
          </p>
        </div>
      </Container>
    </section>
  );
}
