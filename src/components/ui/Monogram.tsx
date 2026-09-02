interface MonogramProps {
  /** Rendered size in rem. */
  size?: number;
  className?: string;
}

/**
 * The Bonaca "o" mark, traced as inline SVG rather than loaded as a PNG so it
 * inherits `currentColor` and can be used at any size, on any band, without a
 * network request. Two counter-rotated strokes, matching the wordmark's
 * high-contrast serif axis.
 */
export default function Monogram({ size = 2, className }: MonogramProps) {
  return (
    <svg
      className={className}
      width={`${size}rem`}
      height={`${size}rem`}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx="50" cy="50" rx="26" ry="34" stroke="currentColor" strokeWidth="1.1" />
      <path
        d="M28.5 34.5c-3.4 6.2-3.4 24.8 0 31 3.2 5.8 9.4 9.6 9.4 9.6V25.2s-6.2 3.5-9.4 9.3Z"
        fill="currentColor"
      />
      <path
        d="M71.5 65.5c3.4-6.2 3.4-24.8 0-31-3.2-5.8-9.4-9.6-9.4-9.6v49.9s6.2-3.5 9.4-9.3Z"
        fill="currentColor"
      />
    </svg>
  );
}
