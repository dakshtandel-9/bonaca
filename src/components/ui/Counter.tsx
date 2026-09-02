"use client";

import { useEffect, useRef } from "react";

interface CounterProps {
  value: number;
  suffix?: string;
  /** Animation length in milliseconds. */
  duration?: number;
}

/**
 * Counts up to `value` once, the first time it is scrolled into view. The final
 * value is rendered on the server too, so the number is correct before (and
 * without) JavaScript.
 */
export default function Counter({ value, suffix = "", duration = 1400 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          // easeOutExpo — fast off the line, long settle.
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          node.textContent = `${Math.round(eased * value)}${suffix}`;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, suffix, duration]);

  return (
    <span ref={ref} className="counter">
      {value}
      {suffix}
    </span>
  );
}
