import Image from "next/image";

import Container from "@/components/layout/Container";
import ExternalLink from "@/components/ui/ExternalLink";
import Monogram from "@/components/ui/Monogram";
import { socialLinks } from "@/data/navigation";
import { IMAGES } from "@/lib/constants";
import { isPlaceholderLink, siteConfig } from "@/lib/site-config";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const mapQuery = encodeURIComponent(
    [siteConfig.name, siteConfig.place.locality, siteConfig.place.region].join(", "),
  );
  const mapUrl = isPlaceholderLink(siteConfig.links.googleMaps)
    ? `https://www.google.com/maps/search/?api=1&query=${mapQuery}`
    : siteConfig.links.googleMaps;
  const mapEmbedUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

  return (
    <footer className="site-footer band-dark">
      <span className="grain" aria-hidden="true" />

      <Container>
        <div className="footer-top">
          <div className="footer-brand">
            <Image
              src={IMAGES.logoLight}
              alt={siteConfig.name}
              width={468}
              height={118}
              className="footer-logo"
            />
            <p className="footer-tagline">{siteConfig.tagline}</p>
          </div>

          <div className="footer-details">
            <div className="footer-contact">
              <h2>Contact</h2>
              <ul>
                <li>
                  <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}>
                    {siteConfig.contact.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
                </li>
                <li>{siteConfig.place.locality}</li>
              </ul>

              <ul className="footer-socials">
                {socialLinks.map((link) => (
                  <li key={link.id}>
                    <ExternalLink href={link.url}>{link.label}</ExternalLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-map">
              <iframe
                src={mapEmbedUrl}
                title={`Google map showing ${siteConfig.name}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <ExternalLink href={mapUrl} data-variant="map">
                Open in Google Maps <span aria-hidden="true">↗</span>
              </ExternalLink>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            <Monogram size={0.9} /> &copy; {currentYear} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </Container>

      <p className="footer-watermark" aria-hidden="true">
        bonaca
      </p>
    </footer>
  );
}
