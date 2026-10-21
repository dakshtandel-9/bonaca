import type { AmenityIconKey } from "@/types/amenity";

/**
 * Hairline icon set drawn to one grid: 24×24, 1.15px strokes, round caps, no
 * fills. Inline so they take `currentColor` and cost no extra request — an
 * icon library would be heavier than the whole set.
 */
const PATHS: Record<AmenityIconKey, React.ReactNode> = {
  home: (
    <>
      <path d="M3.5 10.4 12 4l8.5 6.4V20H3.5z" />
      <path d="M9.4 20v-6.2h5.2V20" />
    </>
  ),
  wifi: (
    <>
      <path d="M2.5 9.2a14 14 0 0 1 19 0" />
      <path d="M6 12.7a9 9 0 0 1 12 0" />
      <path d="M9.4 16.2a4.2 4.2 0 0 1 5.2 0" />
      <circle cx="12" cy="19.4" r=".9" />
    </>
  ),
  climate: (
    <>
      <rect x="3.2" y="4.6" width="17.6" height="7.4" rx="1.4" />
      <path d="M7 15.2v1.6M12 15.2v3.2M17 15.2v1.6" />
    </>
  ),
  kitchen: (
    <>
      <path d="M7 3.4v7.2a2.6 2.6 0 0 0 5.2 0V3.4" />
      <path d="M9.6 10.6V20.6" />
      <path d="M17.4 3.4c-1.6 1.4-2.2 3.4-2.2 5.6 0 1.6.8 2.6 2.2 2.6V20.6" />
    </>
  ),
  parking: (
    <>
      <rect x="3.6" y="3.6" width="16.8" height="16.8" rx="2.2" />
      <path d="M9.6 16.4V7.8h3a2.9 2.9 0 0 1 0 5.8h-3" />
    </>
  ),
  water: (
    <>
      <path d="M12 3.4s6 6.2 6 10.2a6 6 0 0 1-12 0c0-4 6-10.2 6-10.2Z" />
      <path d="M9.4 14.2a2.6 2.6 0 0 0 2.6 2.6" />
    </>
  ),
  leaf: (
    <>
      <path d="M20 4.2c0 8.6-4.2 12.8-10.4 12.8A5.6 5.6 0 0 1 4 11.4C4 6.4 9.6 4.2 20 4.2Z" />
      <path d="M4.6 20.4C7 15.6 10.4 12.2 14.6 9.8" />
    </>
  ),
  bell: (
    <>
      <path d="M6.4 17.2V11a5.6 5.6 0 0 1 11.2 0v6.2z" />
      <path d="M4.6 17.2h14.8" />
      <path d="M10.2 20a2 2 0 0 0 3.6 0" />
    </>
  ),
  pool: (
    <>
      <path d="M8.4 14.2V6.2a2 2 0 0 1 3.8-.9" />
      <path d="M14.4 14.2V6.2a2 2 0 0 1 3.8-.9" />
      <path d="M8.4 8.6h6M8.4 11.6h6" />
      <path d="M2.8 17.4c1.5 0 1.5-1.1 3-1.1s1.5 1.1 3 1.1 1.6-1.1 3.2-1.1 1.6 1.1 3.2 1.1 1.5-1.1 3-1.1 1.5 1.1 3 1.1" />
      <path d="M2.8 20.6c1.5 0 1.5-1.1 3-1.1s1.5 1.1 3 1.1 1.6-1.1 3.2-1.1 1.6 1.1 3.2 1.1 1.5-1.1 3-1.1 1.5 1.1 3 1.1" />
    </>
  ),
  guests: (
    <>
      <circle cx="9" cy="8.2" r="3.2" />
      <path d="M3.4 19.6c.4-3.3 2.6-5.4 5.6-5.4s5.2 2.1 5.6 5.4" />
      <path d="M15.4 5.4a3.1 3.1 0 0 1 0 5.8" />
      <path d="M17.2 14.5c2 .7 3.2 2.5 3.4 5.1" />
    </>
  ),
  stairs: (
    <>
      <path d="M3.6 20.4h4.6v-4.4h4.4v-4.4H17V7.2h3.4" />
      <path d="M3.6 20.4h16.8V7.2" />
    </>
  ),
  bed: (
    <>
      <path d="M3.2 18.6V6.4M3.2 14.4h17.6v4.2" />
      <path d="M3.2 11.6h5.6v2.8M8.8 11.6h8.4a3.6 3.6 0 0 1 3.6 2.8" />
    </>
  ),
  binoculars: (
    <>
      <circle cx="6.8" cy="15.6" r="3.6" />
      <circle cx="17.2" cy="15.6" r="3.6" />
      <path d="M10.4 15.2h3.2M4.2 12.8 6.4 5.6h3l1 6.4M19.8 12.8l-2.2-7.2h-3l-1 6.4" />
    </>
  ),
  tea: (
    <>
      <path d="M12 20.6c0-4.4-.4-8.2-2-11.4" />
      <path d="M11.4 13.6C7.6 13.8 4.6 11.6 4 7.6c3.8-.2 6.8 2 7.4 6Z" />
      <path d="M12.2 11.4c.4-3.8 3.2-6.4 7.4-6.6-.2 4-3.2 6.6-7.4 6.6Z" />
    </>
  ),
  forest: (
    <>
      <path d="M12 3.4c-2.2 2.4-3.2 5.2-3.2 7.8a3.2 3.2 0 0 0 6.4 0c0-2.6-1-5.4-3.2-7.8Z" />
      <path d="M12 14.4v6.2" />
      <path d="M6 7c-1.7 1.9-2.5 4.1-2.5 6.1a2.5 2.5 0 0 0 5 0c0-2-.8-4.2-2.5-6.1Z" />
      <path d="M6 15.6v5" />
      <path d="M18 7c-1.7 1.9-2.5 4.1-2.5 6.1a2.5 2.5 0 0 0 5 0c0-2-.8-4.2-2.5-6.1Z" />
      <path d="M18 15.6v5" />
    </>
  ),
  mountain: (
    <>
      <path d="M2.4 18.6 9.2 7.4l5.4 8.8" />
      <path d="M12.4 12.6l2.8-4.2 6.4 10.2" />
      <path d="M7.4 10.4l1.8 1.2 1.6-1.2" />
    </>
  ),
};

/**
 * `name` is a plain string because it arrives from the CRM, where an icon can
 * be picked for an amenity that was added after this set was drawn. Anything
 * unrecognised falls back to the house rather than rendering an empty square.
 */
export default function Icon({ name }: { name: string }) {
  const paths = PATHS[name as AmenityIconKey] ?? PATHS.home;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.15"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths}
    </svg>
  );
}
