import Image from "next/image";
import Link from "next/link";

import Container from "@/components/layout/Container";
import ExternalLink from "@/components/ui/ExternalLink";
import Monogram from "@/components/ui/Monogram";
import { primaryBookingPlatform } from "@/data/booking-platforms";
import { footerLinkGroups, legalLinks, socialLinks } from "@/data/navigation";
import { IMAGES } from "@/lib/constants";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  const currentYear = new Date().getFullYear();

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

            <ExternalLink href={primaryBookingPlatform.url} data-variant="primary">
              Book Your Stay <span aria-hidden="true">↗</span>
            </ExternalLink>
          </div>

          <div className="footer-cols">
            {footerLinkGroups.map((group) => (
              <nav key={group.id} aria-label={group.title}>
                <h2>{group.title}</h2>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

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
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            <Monogram size={0.9} /> &copy; {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <ul>
            {legalLinks.map((item) => (
              <li key={item.id}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      {/* Oversized wordmark, cropped by the viewport edge. */}
      <p className="footer-watermark" aria-hidden="true">
        bonaca
      </p>
    </footer>
  );
}
