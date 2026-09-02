"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import Container from "@/components/layout/Container";
import ExternalLink from "@/components/ui/ExternalLink";
import Monogram from "@/components/ui/Monogram";
import { primaryBookingPlatform } from "@/data/booking-platforms";
import { IMAGES } from "@/lib/constants";
import { siteConfig } from "@/lib/site-config";

/** The transparent hero header settles into a compact olive bar on scroll. */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 72);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  return (
    <header
      className="site-header"
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
          <Monogram className="brand-symbol" />
        </Link>

        <div className="header-actions">
          <ExternalLink href={primaryBookingPlatform.url} data-variant="header">
            Book Your Stay <span aria-hidden="true">↗</span>
          </ExternalLink>
        </div>
      </Container>
    </header>
  );
}
