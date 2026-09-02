"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

type RevealVariant = "up" | "fade" | "mask" | "scale" | "stagger";

interface RevealProps {
  children: ReactNode;
  /** Element to render. Defaults to a div so it never breaks list semantics. */
  as?: ElementType;
  variant?: RevealVariant;
  /** Seconds of delay before this element animates in. */
  delay?: number;
  className?: string;
  /** Passed through so headings can stay the aria-labelledby target. */
  id?: string;
}

/**
 * Adds `data-in` the first time an element scrolls into view; all the actual
 * motion lives in globals.css keyed off `[data-reveal]`. One observer per
 * element keeps this cheap, and it disconnects as soon as it has fired.
 *
 * Elements start visible in CSS and are only hidden once this component has
 * mounted (`data-armed`), so the page is fully readable without JavaScript.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  variant = "up",
  delay = 0,
  className,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.setAttribute("data-in", "");
      return;
    }

    node.setAttribute("data-armed", "");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        node.setAttribute("data-in", "");
        observer.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      id={id}
      className={className}
      data-reveal={variant}
      style={delay ? ({ "--reveal-delay": `${delay}s` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
