"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import Container from "@/components/layout/Container";
import ExternalLink from "@/components/ui/ExternalLink";
import Monogram from "@/components/ui/Monogram";
import { primaryBookingPlatform } from "@/data/booking-platforms";
import { mainNavigation } from "@/data/navigation";
import { IMAGES } from "@/lib/constants";
import { siteConfig } from "@/lib/site-config";

/** The transparent hero header settles into a compact olive bar on scroll. */
export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 72);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  /** Lock the page behind the overlay, and let Escape close it. */
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <header
      className="site-header"
      data-menu={open ? "open" : undefined}
      data-scrolled={scrolled ? "" : undefined}
    >
      <Container>
        <Link className="wordmark" href="/" aria-label={`${siteConfig.name} — home`}>
          <Image
            className="brand-wordmark"
            src={IMAGES.logoLight}
            alt={siteConfig.name}
            width={468}
            height={118}
            preload
          />
          <span className="brand-symbol" aria-hidden="true" />
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

        <div className="header-actions">
          <ExternalLink href={primaryBookingPlatform.url} data-variant="header">
            Book Your Stay <span aria-hidden="true">↗</span>
          </ExternalLink>

          <button
            type="button"
            className="menu-toggle"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            <span className="menu-toggle-label">{open ? "Close" : "Menu"}</span>
            <span className="menu-toggle-bars" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </Container>

      <div id="mobile-nav" className="mobile-nav" data-open={open ? "" : undefined} hidden={!open}>
        <nav aria-label="Mobile navigation">
          <ul>
            {mainNavigation.map((item, i) => (
              <li key={item.id} style={{ "--i": i } as React.CSSProperties}>
                <Link href={item.href} onClick={close}>
                  <span className="mobile-nav-index">{String(i + 1).padStart(2, "0")}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mobile-nav-foot">
            <Monogram size={2.4} />
            <ExternalLink href={primaryBookingPlatform.url} data-variant="primary">
              Book Your Stay <span aria-hidden="true">↗</span>
            </ExternalLink>
            <p>{siteConfig.contact.email}</p>
          </div>
        </nav>
      </div>
    </header>
  );
}
