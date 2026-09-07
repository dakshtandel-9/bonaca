import Image from "next/image";

import Container from "@/components/layout/Container";
import ExternalLink from "@/components/ui/ExternalLink";
import Monogram from "@/components/ui/Monogram";
import { isPlaceholderLink, telHref } from "@/lib/cms/derive";
import type { SiteContent } from "@/lib/cms/types";

export default function Footer({ content }: { content: SiteContent }) {
  const { site, footer, navigation } = content;
  const currentYear = new Date().getFullYear();

  const mapQuery = encodeURIComponent(
    [site.name, site.place.locality, site.place.region].filter(Boolean).join(", "),
  );
  const mapUrl = isPlaceholderLink(site.links.googleMaps)
    ? `https://www.google.com/maps/search/?api=1&query=${mapQuery}`
    : site.links.googleMaps;
  const mapEmbedUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

  return (
    <footer className="site-footer band-dark">
      <span className="grain" aria-hidden="true" />

      <Container>
        <div className="footer-top">
          <div className="footer-brand">
            <Image
              src={site.branding.logoLight}
              alt={site.name}
              width={468}
              height={118}
              className="footer-logo"
            />
            <p className="footer-tagline">{site.tagline}</p>
          </div>

          <div className="footer-details">
            <div className="footer-contact">
              <h2>{footer.contactTitle}</h2>
              <ul>
                <li>
                  <a href={telHref(site.contact.phone)}>{site.contact.phone}</a>
                </li>
                <li>
                  <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
                </li>
                <li>{site.place.locality}</li>
              </ul>

              <ul className="footer-socials">
                {navigation.social.map((link) => (
                  <li key={link.id}>
                    <ExternalLink href={link.url}>{link.label}</ExternalLink>
                  </li>
                ))}
              </ul>
            </div>

            {footer.showMap ? (
              <div className="footer-map">
                <iframe
                  src={mapEmbedUrl}
                  title={`Google map showing ${site.name}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                <ExternalLink href={mapUrl} data-variant="map">
                  {footer.mapLinkLabel} <span aria-hidden="true">↗</span>
                </ExternalLink>
              </div>
            ) : null}
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            <Monogram size={0.9} /> &copy; {currentYear} {site.name}. {footer.copyright}
          </p>
        </div>
      </Container>

      <p className="footer-watermark" aria-hidden="true">
        {footer.watermark}
      </p>
    </footer>
  );
}
