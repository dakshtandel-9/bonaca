import Link from "next/link";

import Container from "@/components/layout/Container";
import ExternalLink from "@/components/ui/ExternalLink";
import { primaryBookingPlatform } from "@/data/booking-platforms";
import { footerLinkGroups, legalLinks, socialLinks } from "@/data/navigation";
import { property } from "@/data/property";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <Container>
        <div className="footer-brand">
          <p className="wordmark">{siteConfig.name.toLowerCase()}</p>
          <p>{property.tagline}</p>
          <ul className="footer-socials">
            {socialLinks.map((link) => (
              <li key={link.id}><ExternalLink href={link.url}>{link.label}</ExternalLink></li>
            ))}
          </ul>
        </div>

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
          <p><span>Phone</span>{siteConfig.contact.phone}</p>
          <p><span>Email</span>{siteConfig.contact.email}</p>
          <p>{property.locality}</p>
          <ExternalLink href={primaryBookingPlatform.url}>Book Your Stay <span aria-hidden="true">↗</span></ExternalLink>
        </div>

        <div className="footer-bottom">
          <ul>
            {legalLinks.map((item) => (
              <li key={item.id}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
          <p>
            &copy; {currentYear} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
