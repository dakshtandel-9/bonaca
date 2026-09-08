import Image from "next/image";

import ExternalLink from "@/components/ui/ExternalLink";
import { isPlaceholderEmail, isPlaceholderLink, isPlaceholderPhone, telHref } from "@/lib/cms/derive";
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

  const showEmail = comingSoon.showContact && !isPlaceholderEmail(site.contact.email);
  const showPhone = comingSoon.showContact && !isPlaceholderPhone(site.contact.phone);
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

        {showEmail || showPhone ? (
          <ul className="coming-soon-contact">
            {showPhone ? (
              <li>
                <a href={telHref(site.contact.phone)}>{site.contact.phone}</a>
              </li>
            ) : null}
            {showEmail ? (
              <li>
                <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
              </li>
            ) : null}
          </ul>
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
