"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { gsap } from "gsap";

export interface MasonryItem {
  id: string;
  /** Intrinsic dimensions. Tile height is derived from this ratio, so the
   *  layout is correct before a single image has downloaded. */
  width: number;
  height: number;
}

export type MasonryAnimateFrom = "top" | "bottom" | "left" | "right" | "center" | "random";

interface MasonryProps<T extends MasonryItem> {
  items: T[];
  /** Renders the inside of a tile. The caller owns the markup and the click
   *  target; this component only measures, places and animates. */
  children: (item: T, index: number) => ReactNode;
  /** Column counts by viewport min-width, widest first. */
  breakpoints?: ReadonlyArray<{ min: number; columns: number }>;
  /** Gutter in pixels, folded into the placement maths. */
  gap?: number;
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: MasonryAnimateFrom;
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
  className?: string;
}

interface Placed<T> {
  item: T;
  x: number;
  y: number;
  w: number;
  h: number;
}

const DEFAULT_BREAKPOINTS = [
  { min: 1500, columns: 5 },
  { min: 1000, columns: 4 },
  { min: 600, columns: 3 },
  { min: 400, columns: 2 },
] as const;

/** React logs a warning for useLayoutEffect during the prerender pass. */
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * A measured masonry: tiles are absolutely positioned by script and moved with
 * GSAP, so they can slide between layouts instead of snapping. Adapted from
 * React Bits' Masonry with three changes this site needs — heights come from
 * each item's intrinsic ratio rather than a hand-set number, the entrance waits
 * until the grid scrolls into view the way the rest of the page does, and the
 * tiles render in normal flow until script takes over so the markup still
 * stands up without JavaScript.
 */
export default function Masonry<T extends MasonryItem>({
  items,
  children,
  breakpoints = DEFAULT_BREAKPOINTS,
  gap = 16,
  ease = "power3.out",
  duration = 0.6,
  stagger = 0.05,
  animateFrom = "bottom",
  scaleOnHover = true,
  hoverScale = 0.97,
  blurToFocus = true,
  colorShiftOnHover = false,
  className,
}: MasonryProps<T>) {
  const containerRef = useRef<HTMLUListElement>(null);
  const placedIds = useRef(new Set<string>());
  const [width, setWidth] = useState(0);
  const [columns, setColumns] = useState(1);
  const [inView, setInView] = useState(false);

  /* Container width drives placement; the first read is synchronous so the
     tiles are positioned before the browser has painted the flow layout. */
  useIsomorphicLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    setWidth(node.getBoundingClientRect().width);

    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  /* Column count still keys off the viewport, matching the documented props. */
  useIsomorphicLayoutEffect(() => {
    const queries = breakpoints.map((point) => window.matchMedia(`(min-width: ${point.min}px)`));
    const read = () => {
      const hit = queries.findIndex((query) => query.matches);
      setColumns(hit === -1 ? 1 : breakpoints[hit].columns);
    };

    read();
    queries.forEach((query) => query.addEventListener("change", read));
    return () => queries.forEach((query) => query.removeEventListener("change", read));
  }, [breakpoints]);

  /* The entrance is worth nothing if it plays while the section is off-screen,
     so it waits for the same intersection cue every other section uses. */
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const layout = useMemo(() => {
    if (!width) return null;

    const columnWidth = (width - gap * (columns - 1)) / columns;
    const columnHeights = new Array<number>(columns).fill(0);

    const placed = items.map<Placed<T>>((item) => {
      const column = columnHeights.indexOf(Math.min(...columnHeights));
      const h = columnWidth * (item.height / item.width);
      const y = columnHeights[column];

      columnHeights[column] += h + gap;
      return { item, x: column * (columnWidth + gap), y, w: columnWidth, h };
    });

    return { placed, height: Math.max(...columnHeights, gap) - gap };
  }, [items, width, columns, gap]);

  const startPosition = useCallback(
    (spot: Placed<T>) => {
      const direction =
        animateFrom === "random"
          ? (["top", "bottom", "left", "right"] as const)[Math.floor(Math.random() * 4)]
          : animateFrom;

      const box = containerRef.current?.getBoundingClientRect();

      switch (direction) {
        case "top":
          return { x: spot.x, y: -200 };
        case "bottom":
          return { x: spot.x, y: window.innerHeight - (box?.top ?? 0) + 200 };
        case "left":
          return { x: -spot.w - 200, y: spot.y };
        case "right":
          return { x: (box?.width ?? 0) + 200, y: spot.y };
        case "center":
          return { x: ((box?.width ?? 0) - spot.w) / 2, y: ((box?.height ?? 0) - spot.h) / 2 };
        default:
          return { x: spot.x, y: spot.y + 100 };
      }
    },
    [animateFrom],
  );

  useIsomorphicLayoutEffect(() => {
    const node = containerRef.current;
    if (!node || !layout) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const known = placedIds.current;
    const first = known.size === 0;

    /* Hands layout over from CSS flow to absolute placement. */
    node.dataset.ready = "";

    layout.placed.forEach((spot, index) => {
      const tile = node.querySelector<HTMLElement>(`[data-tile="${spot.item.id}"]`);
      if (!tile) return;

      const box = { x: spot.x, y: spot.y, width: spot.w, height: spot.h };

      if (known.has(spot.item.id)) {
        gsap.to(tile, { ...box, duration, ease, overwrite: "auto" });
        return;
      }

      /* Nothing has scrolled into view yet — place it, hidden, and wait. */
      if (!inView) {
        gsap.set(tile, { ...box, opacity: 0 });
        return;
      }

      known.add(spot.item.id);

      if (reduced) {
        gsap.set(tile, { ...box, opacity: 1, filter: "none" });
        return;
      }

      const from = startPosition(spot);
      gsap.fromTo(
        tile,
        {
          ...box,
          ...from,
          opacity: 0,
          ...(blurToFocus && { filter: "blur(10px)" }),
        },
        {
          ...box,
          opacity: 1,
          ...(blurToFocus && { filter: "blur(0px)" }),
          duration: 0.8,
          ease: "power3.out",
          delay: first ? index * stagger : 0,
        },
      );
    });

    gsap.to(node, { height: layout.height, duration: first ? 0 : duration, ease });

    /* Forget tiles a filter has removed so they animate in again. */
    const live = new Set(layout.placed.map((spot) => spot.item.id));
    known.forEach((id) => {
      if (!live.has(id)) known.delete(id);
    });
  }, [layout, inView, duration, ease, stagger, blurToFocus, startPosition]);

  const hover = (event: ReactPointerEvent<HTMLLIElement>, entering: boolean) => {
    const tile = event.currentTarget;

    if (scaleOnHover) {
      gsap.to(tile, { scale: entering ? hoverScale : 1, duration: 0.3, ease: "power2.out" });
    }
    if (colorShiftOnHover) {
      const overlay = tile.querySelector(".masonry-shift");
      if (overlay) gsap.to(overlay, { opacity: entering ? 0.35 : 0, duration: 0.3 });
    }
  };

  return (
    <ul
      ref={containerRef}
      className={className ? `masonry ${className}` : "masonry"}
      style={{ "--masonry-gap": `${gap}px` } as CSSProperties}
    >
      {items.map((item, index) => (
        <li
          key={item.id}
          data-tile={item.id}
          className="masonry-item"
          style={{ aspectRatio: `${item.width} / ${item.height}` }}
          onPointerEnter={(event) => hover(event, true)}
          onPointerLeave={(event) => hover(event, false)}
        >
          {children(item, index)}
          {colorShiftOnHover && <span className="masonry-shift" aria-hidden="true" />}
        </li>
      ))}
    </ul>
  );
}
