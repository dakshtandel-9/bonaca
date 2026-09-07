/**
 * A row of filled stars, drawn inline so it takes `currentColor` and costs no
 * extra request. The count is announced once on the wrapper; the stars
 * themselves are decorative.
 */
export default function StarRating({
  rating,
  outOf = 5,
  className,
}: {
  rating: number;
  outOf?: number;
  className?: string;
}) {
  const filled = Math.round(rating);

  return (
    <div
      className={className ? `star-rating ${className}` : "star-rating"}
      role="img"
      aria-label={`Rated ${rating} out of ${outOf}`}
    >
      {Array.from({ length: outOf }).map((_, i) => (
        <svg
          className="review-star"
          key={i}
          data-empty={i < filled ? undefined : ""}
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path d="m12 2.75 2.83 5.73 6.32.92-4.58 4.46 1.08 6.3L12 17.19l-5.65 2.97 1.08-6.3L2.85 9.4l6.32-.92L12 2.75Z" />
        </svg>
      ))}
    </div>
  );
}
