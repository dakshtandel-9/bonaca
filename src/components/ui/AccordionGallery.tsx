"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { gsap } from "gsap";

export interface AccordionGalleryItem {
  id: string;
  image: string;
  /** Caption revealed on the open panel. */
  label?: string;
  alt: string;
}

interface AccordionGalleryProps {
  items: AccordionGalleryItem[];
  /** Panel open on load, so the gallery never looks dead. */
  defaultIndex?: number;
  accentColor?: string;
  overlayColor?: string;
  textColor?: string;
  /** Row height in px — the column's width when vertical. */
  height?: number;
  gap?: number;
  radius?: number;
  /** Fraction of the row the open panel takes, clamped to 0.2–0.9. */
  expandRatio?: number;
  orientation?: "horizontal" | "vertical";
  duration?: number;
  ease?: string;
  /** Strength of the image drift as panels resize; 0 disables it. */
  parallax?: number;
  /** Degrees of 3D rotation on collapsed panels. */
  tilt?: number;
  stagger?: number;
  /** How a panel opens on pointer devices. Focus and tap always open it. */
  trigger?: "hover" | "click";
  showLabels?: boolean;
  grayscale?: boolean;
  className?: string;
  /** Describes the set for screen readers. */
  label: string;
}

/**
 * Panels that share a row, one open at a time, the rest tilted and desaturated
 * beside it. Adapted from React Bits' AccordionGallery: the panels are real
 * buttons rather than focusable divs, images go through next/image, and the
 * reduced-motion check happens after mount instead of during render.
 */
export default function AccordionGallery({
  items,
  defaultIndex = 2,
  accentColor = "var(--sand)",
  overlayColor = "var(--ink-deep)",
  textColor = "var(--sand-soft)",
  height = 460,
  gap = 10,
  radius = 16,
  expandRatio = 0.52,
  orientation = "horizontal",
  duration = 0.6,
  ease = "power3.out",
  parallax = 0.5,
  tilt = 8,
  stagger = 0.06,
  trigger = "hover",
  showLabels = true,
  grayscale = true,
  className,
  label,
}: AccordionGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const firstRun = useRef(true);
  const mediaSize = useRef(320);
  const reduced = useRef(false);

  const vertical = orientation === "vertical";
  const count = items.length;
  const [active, setActive] = useState(Math.min(Math.max(defaultIndex, 0), count - 1));

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const applyLayout = useCallback(
    (animate: boolean) => {
      const panels = panelRefs.current;
      if (!panels.length) return;

      const ratio = Math.min(Math.max(expandRatio, 0.2), 0.9);
      const grow = count > 1 ? (ratio * (count - 1)) / (1 - ratio) : 1;

      timeline.current?.kill();
      const dur = animate && !reduced.current ? duration : 0;
      const tl = gsap.timeline();

      panels.forEach((panel, i) => {
        if (!panel) return;
        const isActive = i === active;
        const media = mediaRefs.current[i];
        const bar = barRefs.current[i];
        const text = textRefs.current[i];

        const rot = isActive ? 0 : i < active ? tilt : -tilt;
        tl.to(
          panel,
          {
            flexGrow: isActive ? grow : 1,
            ...(vertical ? { rotateX: -rot } : { rotateY: rot }),
            duration: dur,
            ease,
          },
          0,
        );

        if (media) {
          const drift = Math.max(-1.5, Math.min(1.5, active - i));
          const shift = drift * parallax * mediaSize.current * 0.06;

          tl.to(
            media,
            {
              xPercent: -50,
              yPercent: -50,
              x: vertical || isActive ? 0 : shift,
              y: vertical && !isActive ? shift : 0,
              "--ag-gray": grayscale && !isActive ? 1 : 0,
              "--ag-dim": isActive ? 0 : 0.35,
              duration: dur,
              ease,
            },
            0,
          );
        }

        if (showLabels && bar && text) {
          tl.to(
            [bar, text],
            isActive
              ? { opacity: 1, x: 0, duration: dur, ease, stagger: reduced.current ? 0 : stagger }
              : { opacity: 0, x: -14, duration: dur * 0.6, ease },
            0,
          );
        }
      });

      timeline.current = tl;
    },
    [active, count, expandRatio, duration, ease, vertical, tilt, parallax, grayscale, showLabels, stagger],
  );

  /* The media is deliberately wider than its panel, which is what gives the
     drift something to travel across. Re-measured whenever the row resizes. */
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const measure = () => {
      const rect = node.getBoundingClientRect();
      const total = vertical ? rect.height : rect.width;
      const usable = Math.max(total - gap * (count - 1), 120);
      const size = Math.max(140, usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.22);

      mediaSize.current = size;
      node.style.setProperty("--ag-media-size", `${size}px`);
      applyLayout(!firstRun.current);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [applyLayout, gap, count, expandRatio, vertical]);

  useEffect(() => {
    applyLayout(!firstRun.current);
    firstRun.current = false;
  }, [applyLayout]);

  useEffect(() => () => void timeline.current?.kill(), []);

  const onKeyDown = (index: number, event: KeyboardEvent<HTMLButtonElement>) => {
    const forward = vertical ? "ArrowDown" : "ArrowRight";
    const back = vertical ? "ArrowUp" : "ArrowLeft";

    if (event.key !== forward && event.key !== back) return;
    event.preventDefault();

    const next = (index + (event.key === forward ? 1 : count - 1)) % count;
    setActive(next);
    panelRefs.current[next]?.focus();
  };

  return (
    <div
      ref={rootRef}
      className={[
        "accordion-gallery",
        vertical ? "accordion-gallery--vertical" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          "--ag-accent": accentColor,
          "--ag-overlay": overlayColor,
          "--ag-text": textColor,
          "--ag-gap": `${gap}px`,
          "--ag-radius": `${radius}px`,
          height: vertical ? `${Math.round(height * 1.6)}px` : `${height}px`,
        } as CSSProperties
      }
      role="group"
      aria-label={label}
    >
      {items.map((item, i) => (
        <button
          key={item.id}
          type="button"
          ref={(el) => {
            panelRefs.current[i] = el;
          }}
          className={`ag-panel${i === active ? " ag-panel--active" : ""}`}
          style={{ borderRadius: `${radius}px` }}
          aria-pressed={i === active}
          onClick={() => setActive(i)}
          onPointerEnter={() => trigger === "hover" && setActive(i)}
          onFocus={() => setActive(i)}
          onKeyDown={(event) => onKeyDown(i, event)}
        >
          <span className="ag-panel__frame">
            <span
              className="ag-panel__media"
              ref={(el) => {
                mediaRefs.current[i] = el;
              }}
            >
              <Image src={item.image} alt={item.alt} fill sizes="(max-width: 520px) 92vw, 60vw" />
            </span>
            <span className="ag-panel__overlay" aria-hidden="true" />
          </span>

          {showLabels && item.label ? (
            <span className="ag-panel__label" aria-hidden="true">
              <span
                className="ag-panel__bar"
                ref={(el) => {
                  barRefs.current[i] = el;
                }}
              />
              <span
                className="ag-panel__text"
                ref={(el) => {
                  textRefs.current[i] = el;
                }}
              >
                {item.label}
              </span>
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
}
