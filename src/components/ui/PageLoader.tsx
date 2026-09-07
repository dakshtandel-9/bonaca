"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import Monogram from "@/components/ui/Monogram";

/**
 * How long the curtain holds before it lifts, in milliseconds. The meter takes
 * its duration from the same number through a custom property, so the bar
 * always lands exactly as the panel goes — change it here and nothing else
 * needs touching.
 */
const HOLD_MS = 1000;

/**
 * The curtain that plays on a refresh and on every route change.
 *
 * It renders visible on the server, so a refresh opens on the mark rather than
 * flashing the page underneath first. The `<noscript>` rule in the root layout
 * hides it outright when scripts are off, since nothing would be left to take
 * it away again.
 *
 * The meter is a CSS animation rather than a JavaScript-driven count: a
 * requestAnimationFrame counter stalls the moment the tab goes to the
 * background and comes back reading a number the bar has long passed.
 */
export default function PageLoader({
  name,
  tagline,
  logo,
}: {
  name: string;
  tagline: string;
  logo: string;
}) {
  const pathname = usePathname();
  const [loadedRoute, setLoadedRoute] = useState(pathname);
  const [visible, setVisible] = useState(true);

  /* Adjusting state during the render that saw the new pathname, rather than in
     an effect afterwards: the curtain is back up in the same commit the new
     page paints in, instead of a frame late. */
  if (loadedRoute !== pathname) {
    setLoadedRoute(pathname);
    setVisible(true);
  }

  useEffect(() => {
    if (!visible) return;

    /* Locked through an attribute rather than an inline style, so this and the
       header's mobile menu can each hold the lock without clobbering the
       other's cleanup. */
    document.documentElement.dataset.loading = "";
    const lift = setTimeout(() => setVisible(false), HOLD_MS);

    return () => {
      clearTimeout(lift);
      delete document.documentElement.dataset.loading;
    };
  }, [visible, loadedRoute]);

  return (
    <div
      className="page-loader"
      data-visible={visible ? "" : undefined}
      style={{ "--loader-hold": `${HOLD_MS}ms` } as React.CSSProperties}
    >
      <p className="sr-only" role="status">
        {visible ? `Loading ${name}` : ""}
      </p>

      <div className="page-loader-inner" aria-hidden="true">
        <Monogram size={3.6} className="page-loader-mark" />

        <Image
          className="page-loader-wordmark"
          src={logo}
          alt=""
          width={468}
          height={118}
          preload
        />

        <p className="page-loader-tagline">{tagline}</p>

        {/* Keyed on the route so the fill restarts from empty even when the
            visitor navigates again before the previous hold has run out. */}
        <span className="page-loader-track">
          <span className="page-loader-fill" key={loadedRoute} />
        </span>
      </div>
    </div>
  );
}
