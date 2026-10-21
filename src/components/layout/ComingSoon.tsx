import Image from "next/image";

import ExternalLink from "@/components/ui/ExternalLink";
import {
  isPlaceholderEmail,
  isPlaceholderLink,
  isPlaceholderLocation,
  isPlaceholderPhone,
  telHref,
  whatsappNumber,
} from "@/lib/cms/derive";
import type { SiteContent } from "@/lib/cms/types";

/**
 * The holding page, shown in place of the entire site.
 *
 * It stands on its own — no header, no footer, no page loader — because while
 * it is up there is nowhere else to navigate to. Everything it shows is
 * content, so it can be rewritten in the CRM without touching this file, and
 * the contact details reuse the same placeholder guards as the footer rather
 * than printing a half-filled address to the one page anybody can see.
 */
export default function ComingSoon({ content }: { content: SiteContent }) {
  const { comingSoon, site, navigation } = content;

  const { contact, place } = site;
  const show = comingSoon.showContact;
  const phone = show && !isPlaceholderPhone(contact.phone) ? contact.phone : null;
  const whatsapp = show ? whatsappNumber(contact.whatsapp) : null;
  const email = show && !isPlaceholderEmail(contact.email) ? contact.email : null;
  const address = !show
    ? null
    : place.address.trim() ||
      (isPlaceholderLocation(place.locality)
        ? null
        : [place.locality, place.region].filter(Boolean).join(", "));
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    [site.name, address].filter(Boolean).join(", "),
  )}`;
  const socials = comingSoon.showSocial
    ? navigation.social.filter((link) => !isPlaceholderLink(link.url))
    : [];

  return (
    <main className="coming-soon" id="main-content">
      {comingSoon.image ? (
        <Image
          src={comingSoon.image}
          alt={comingSoon.imageAlt}
          fill
          priority
          sizes="100vw"
          className="coming-soon-photo"
        />
      ) : null}

      <span className="coming-soon-veil" aria-hidden="true" />
      <span className="grain" aria-hidden="true" />

      <div className="coming-soon-inner">
        {site.branding.logoLight ? (
          <Image
            src={site.branding.logoLight}
            alt={site.name}
            width={468}
            height={118}
            className="coming-soon-logo"
            priority
          />
        ) : (
          <p className="coming-soon-wordmark">{site.name}</p>
        )}

        {comingSoon.eyebrow ? (
          <p className="coming-soon-eyebrow">{comingSoon.eyebrow}</p>
        ) : null}

        <h1 className="coming-soon-title">{comingSoon.title}</h1>

        {phone || whatsapp || email || address ? (
          <dl className="coming-soon-contact">
            {phone ? (
              <div>
                <dt>Call</dt>
                <dd>
                  <a href={telHref(phone)}>{phone}</a>
                </dd>
              </div>
            ) : null}
            {whatsapp ? (
              <div>
                <dt>WhatsApp</dt>
                <dd>
                  <ExternalLink href={contact.whatsapp}>{whatsapp}</ExternalLink>
                </dd>
              </div>
            ) : null}
            {email ? (
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${email}`}>{email}</a>
                </dd>
              </div>
            ) : null}
            {address ? (
              <div className="coming-soon-address">
                <dt>Visit</dt>
                <dd>
                  <ExternalLink href={mapHref}>{address}</ExternalLink>
                </dd>
              </div>
            ) : null}
          </dl>
        ) : null}

        {socials.length > 0 ? (
          <ul className="coming-soon-socials">
            {socials.map((link) => (
              <li key={link.id}>
                <ExternalLink href={link.url}>{link.label}</ExternalLink>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </main>
  );
}
