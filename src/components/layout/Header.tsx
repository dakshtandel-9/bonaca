"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import Container from "@/components/layout/Container";
import ExternalLink from "@/components/ui/ExternalLink";
import Monogram from "@/components/ui/Monogram";
import { primaryPlatform, telHref } from "@/lib/cms/derive";
import type { SiteContent } from "@/lib/cms/types";
import { ROUTES } from "@/lib/constants";

/** The home link is the only one that must match exactly — it prefixes everything. */
const isCurrent = (pathname: string, href: string) =>
  href === ROUTES.home ? pathname === href : pathname.startsWith(href);

/** The transparent hero header settles into a compact olive bar on scroll. */
export default function Header({ content }: { content: SiteContent }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { site, navigation } = content;
  const booking = primaryPlatform(content);

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 72);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header
      className="site-header"
      data-scrolled={scrolled ? "" : undefined}
      data-menu-open={menuOpen ? "" : undefined}
    >
      <Container>
        <Link className="wordmark" href={ROUTES.home} aria-label={`${site.name} — home`}>
          <Image
            className="brand-wordmark"
            src={site.branding.logoLight}
            alt={site.name}
            width={468}
            height={118}
            preload
          />
          <Monogram className="brand-symbol" />
        </Link>

        <nav className="site-nav" aria-label="Primary">
          <ul>
            {navigation.main.map((item) => {
              const current = isCurrent(pathname, item.href);
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    data-current={current ? "" : undefined}
                    data-has-short={item.shortLabel ? "" : undefined}
                    aria-current={current ? "page" : undefined}
                  >
                    <span className="nav-label-full">{item.label}</span>
                    {item.shortLabel ? (
                      <span className="nav-label-short" aria-hidden="true">
                        {item.shortLabel}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="header-actions">
          <ExternalLink href={booking?.url ?? "#"} data-variant="header">
            Book Your Stay <span aria-hidden="true">↗</span>
          </ExternalLink>

          <button
            type="button"
            className="nav-toggle"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="nav-toggle-bars" aria-hidden="true">
              <span />
              <span />
            </span>
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </Container>

      {/* Kept mounted so the panel can transition rather than snap. `inert`
          takes the links out of the tab order while it is closed, which
          `visibility: hidden` alone would not do reliably. */}
      <div className="site-menu" id="site-menu" inert={!menuOpen}>
        <nav aria-label="Primary, mobile">
          <ul>
            {navigation.main.map((item) => {
              const current = isCurrent(pathname, item.href);
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    data-current={current ? "" : undefined}
                    aria-current={current ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <a
          className="site-menu-call"
          href={telHref(site.contact.phone)}
          onClick={() => setMenuOpen(false)}
        >
          Call {site.contact.phone}
        </a>
      </div>
    </header>
  );
}
