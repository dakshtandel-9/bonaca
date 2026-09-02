interface MonogramProps {
  /** Rendered size in rem. */
  size?: number;
  className?: string;
}

/**
 * The Bonaca "o" mark, traced from public/images/bonaca/branding/symbol-light.png
 * so the outline is the real artwork rather than an approximation of it.
 *
 * It lives here as inline SVG rather than as the PNG because the mark has to
 * sit inside text on every band — the supplied symbol files have their
 * background baked in, whereas this inherits `currentColor` at any size and
 * costs no request. Re-trace from the PNG if the artwork changes; do not
 * hand-edit the path.
 */
const MARK =
  "M 44.19 16.19 c -8.23 1.31 -15.75 9.92 -18.74 21.44 l -0.38 1.44 -2.69 -0 -2.68 -0 0 5.65 c 0 7.31 0.33 10.46 1.48 14.48 3.94 13.76 14.04 23.05 26.68 24.55 1.99 0.23 6.35 0.1 8.24 -0.25 8.08 -1.49 15.58 -10.48 18.44 -22.07 l 0.18 -0.69 2.69 -0 2.71 -0 0 -5.39 c 0 -7.34 -0.33 -10.62 -1.48 -14.71 -3.55 -12.61 -12.63 -21.74 -24.14 -24.25 -2.12 -0.46 -8.01 -0.59 -10.33 -0.21 z m 5.65 1.15 c 12.94 2.68 21.76 22.76 18.37 41.87 -0.67 3.79 -0.66 3.51 -0.21 3.51 0.9 -0.02 2.96 -0.49 4.15 -0.95 0.72 -0.28 1.33 -0.49 1.36 -0.46 0.1 0.08 -1.07 3.78 -1.66 5.21 -7.45 18.51 -24.11 21.79 -34.22 6.73 -5.68 -8.44 -8.08 -21.58 -6.01 -32.86 0.25 -1.31 0.48 -2.59 0.53 -2.86 l 0.08 -0.48 -1.22 0.11 c -1.17 0.11 -2.84 0.59 -4.12 1.15 -0.76 0.33 -0.74 0.39 -0.11 -1.69 3.99 -13.35 13.46 -21.28 23.05 -19.29 z";

export default function Monogram({ size = 2, className }: MonogramProps) {
  return (
    <svg
      className={className}
      width={`${size}rem`}
      height={`${size}rem`}
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
    >
      <path d={MARK} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}
