"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ParallaxProps {
  children: ReactNode;
  /** How far the content drifts, as a fraction of the element's height. */
  strength?: number;
  className?: string;
}

/**
 * Drifts its child vertically as the element crosses the viewport. Reads are
 * batched into a single rAF and the listener is passive, so this stays off the
 * scroll critical path. Disabled outright under reduced motion.
 */
export default function Parallax({
  children,
  strength = 0.12,
  className,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let visible = false;

    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight;
      // -1 when the element is just below the fold, 1 when just above it.
      const progress = (rect.top + rect.height / 2 - viewport / 2) / viewport;
      const shift = -progress * rect.height * strength;
      node.style.setProperty("--parallax", `${shift.toFixed(2)}px`);
    };

    const onScroll = () => {
      if (frame || !visible) return;
      frame = requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) update();
      },
      { rootMargin: "20% 0px" },
    );

    observer.observe(node);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [strength]);

  return (
    <div ref={ref} className={className} data-parallax="">
      {children}
    </div>
  );
}
