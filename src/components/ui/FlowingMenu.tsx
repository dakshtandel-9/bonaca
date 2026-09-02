"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { gsap } from "gsap";

export interface FlowingMenuItem {
  id: string;
  /** Small label in the left gutter — a time, an index, a category. */
  label?: string;
  /** The line that reads as the menu row, and repeats inside the marquee. */
  text: string;
  /** Supporting copy. Stays readable in the row; the marquee covers it on hover. */
  note?: string;
  image: string;
  /** Omit and the row renders as plain text rather than a dead link. */
  link?: string;
}

interface FlowingMenuProps {
  items: FlowingMenuItem[];
  /** Seconds for the marquee to travel one content width. Lower is faster. */
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
  className?: string;
}

type Edge = "top" | "bottom";

const MOTION = { duration: 0.6, ease: "expo" } as const;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Rows that reveal a scrolling marquee of themselves on hover, entering from
 * whichever edge the pointer crossed. Adapted from React Bits' FlowingMenu:
 * colours are passed in rather than hard-coded so it can sit on any band, and
 * each marquee only runs while its row is actually hovered.
 *
 * Everything the marquee shows is already in the row, so nothing is lost on
 * devices without a pointer — the effect is enrichment, not content.
 */
export default function FlowingMenu({
  items,
  speed = 18,
  textColor = "var(--fg)",
  bgColor = "transparent",
  marqueeBgColor = "var(--ink)",
  marqueeTextColor = "var(--sand)",
  borderColor = "var(--rule)",
  className,
}: FlowingMenuProps) {
  return (
    <div
      className={className ? `flowmenu ${className}` : "flowmenu"}
      style={{ backgroundColor: bgColor }}
    >
      {items.map((item) => (
        <MenuRow
          key={item.id}
          item={item}
          speed={speed}
          textColor={textColor}
          marqueeBgColor={marqueeBgColor}
          marqueeTextColor={marqueeTextColor}
          borderColor={borderColor}
        />
      ))}
    </div>
  );
}

function MenuRow({
  item,
  speed,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
}: {
  item: FlowingMenuItem;
  speed: number;
  textColor: string;
  marqueeBgColor: string;
  marqueeTextColor: string;
  borderColor: string;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<gsap.core.Tween | null>(null);
  const [repetitions, setRepetitions] = useState(3);

  const { text, image } = item;

  /* Enough copies to cover the widest viewport, plus a spare so the loop never
     shows its seam. Re-measured on resize because the type is fluid. */
  useEffect(() => {
    const measure = () => {
      const part = innerRef.current?.querySelector(".flowmenu-part");
      if (!(part instanceof HTMLElement) || part.offsetWidth === 0) return;
      setRepetitions(Math.max(3, Math.ceil(window.innerWidth / part.offsetWidth) + 1));
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [text, image]);

  /* One paused tween per row, travelling exactly one content width so the
     restart is invisible. Paused until hover, so idle rows cost nothing. */
  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    const start = () => {
      const part = inner.querySelector(".flowmenu-part");
      if (!(part instanceof HTMLElement) || part.offsetWidth === 0) return;

      scrollRef.current?.kill();
      scrollRef.current = gsap.to(inner, {
        x: -part.offsetWidth,
        duration: speed,
        ease: "none",
        repeat: -1,
        paused: true,
      });
    };

    /* A beat's grace so the fresh copies have been laid out before measuring. */
    const timer = window.setTimeout(start, 50);
    return () => {
      window.clearTimeout(timer);
      scrollRef.current?.kill();
      scrollRef.current = null;
    };
  }, [text, image, repetitions, speed]);

  /** Which horizontal edge the pointer is nearest — the side the panel uses. */
  const closestEdge = (event: ReactPointerEvent<HTMLElement>): Edge => {
    const rect = itemRef.current?.getBoundingClientRect();
    if (!rect) return "bottom";
    return event.clientY - rect.top < rect.height / 2 ? "top" : "bottom";
  };

  const reveal = useCallback((edge: Edge) => {
    const marquee = marqueeRef.current;
    const inner = innerRef.current;
    if (!marquee || !inner) return;

    scrollRef.current?.play();
    gsap
      .timeline({ defaults: { ...MOTION, duration: prefersReducedMotion() ? 0 : MOTION.duration } })
      .set(marquee, { y: edge === "top" ? "-101%" : "101%" }, 0)
      .set(inner, { y: edge === "top" ? "101%" : "-101%" }, 0)
      .to([marquee, inner], { y: "0%" }, 0);
  }, []);

  const hide = useCallback((edge: Edge) => {
    const marquee = marqueeRef.current;
    const inner = innerRef.current;
    if (!marquee || !inner) return;

    gsap
      .timeline({
        defaults: { ...MOTION, duration: prefersReducedMotion() ? 0 : MOTION.duration },
        onComplete: () => scrollRef.current?.pause(),
      })
      .to(marquee, { y: edge === "top" ? "-101%" : "101%" }, 0)
      .to(inner, { y: edge === "top" ? "101%" : "-101%" }, 0);
  }, []);

  const Row = item.link ? "a" : "div";

  return (
    <div
      className="flowmenu-item"
      ref={itemRef}
      style={{ borderColor }}
      onPointerEnter={(event) => reveal(closestEdge(event))}
      onPointerLeave={(event) => hide(closestEdge(event))}
    >
      <Row className="flowmenu-row" href={item.link} style={{ color: textColor }}>
        {item.label ? <span className="flowmenu-label">{item.label}</span> : null}
        <span className="flowmenu-text">{item.text}</span>
        {item.note ? <span className="flowmenu-note">{item.note}</span> : null}
      </Row>

      <div className="flowmenu-marquee" ref={marqueeRef} style={{ backgroundColor: marqueeBgColor }}>
        <div className="flowmenu-marquee-wrap">
          <div className="flowmenu-marquee-inner" ref={innerRef} aria-hidden="true">
            {Array.from({ length: repetitions }, (_, i) => (
              <div className="flowmenu-part" key={i} style={{ color: marqueeTextColor }}>
                <span>{text}</span>
                <div className="flowmenu-img" style={{ backgroundImage: `url(${image})` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
