import Link from "next/link";

import Container from "@/components/layout/Container";
import ExternalLink from "@/components/ui/ExternalLink";
import { primaryBookingPlatform } from "@/data/booking-platforms";
import { mainNavigation } from "@/data/navigation";
import { siteConfig } from "@/lib/site-config";

export default function Header() {
  return (
    <header className="site-header">
      <Container>
        <Link className="wordmark" href="/" aria-label="Bonaca home">
          {siteConfig.name.toLowerCase()}
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          <ul>
            {mainNavigation.map((item) => (
              <li key={item.id}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <ExternalLink href={primaryBookingPlatform.url} data-variant="header">
          Book Your Stay <span aria-hidden="true">↗</span>
        </ExternalLink>

        <details className="mobile-menu">
          <summary aria-label="Open navigation"><span>Menu</span></summary>
          <nav aria-label="Mobile navigation">
            <ul>
              {mainNavigation.map((item) => (
                <li key={item.id}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
            <ExternalLink href={primaryBookingPlatform.url} data-variant="primary">
              Book Your Stay <span aria-hidden="true">↗</span>
            </ExternalLink>
          </nav>
        </details>
      </Container>
    </header>
  );
}
