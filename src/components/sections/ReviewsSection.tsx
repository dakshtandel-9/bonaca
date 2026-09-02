import Container from "@/components/layout/Container";
import Reveal from "@/components/ui/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { reviews, type Review } from "@/data/reviews";
import { SECTION_IDS } from "@/lib/constants";

const COLUMNS = 3;
/** Seconds for a column to travel its own length. Staggered so they never sync. */
const COLUMN_SPEEDS = [72, 58, 66];

/**
 * A wall of quotes in three columns that scroll past each other, the middle one
 * against the other two. Pure CSS animation, so this stays a server component
 * and the wall still reads as three plain lists with no JavaScript at all.
 *
 * Renders nothing when `reviews` is empty, so the section disappears cleanly
 * rather than showing an empty frame.
 */
export default function ReviewsSection() {
  if (reviews.length === 0) return null;

  /* Dealt round-robin rather than sliced, so short lists thin every column
     evenly instead of leaving the last one empty. */
  const columns: Review[][] = Array.from({ length: COLUMNS }, (_, column) =>
    reviews.filter((_, i) => i % COLUMNS === column),
  ).filter((column) => column.length > 0);

  return (
    <section id={SECTION_IDS.reviews} className="reviews" aria-labelledby="reviews-title">
      <Container>
        <SectionHeader
          index="08"
          eyebrow="Guests"
          headingId="reviews-title"
          title="In their words."
          description="Every quote below is left exactly as the guest wrote it, on the platform they booked through."
          layout="split"
        />

        <Reveal variant="fade" className="wall">
          {columns.map((column, i) => (
            <div className="wall-column" key={i} data-direction={i % 2 === 1 ? "down" : "up"}>
              <div
                className="wall-scroller"
                style={{ animationDuration: `${COLUMN_SPEEDS[i % COLUMN_SPEEDS.length]}s` }}
              >
                <ul className="wall-track">
                  {column.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </ul>

                {/* The loop's second half. Same cards, hidden from assistive
                    tech so the quotes are not announced twice. */}
                <ul className="wall-track" aria-hidden="true">
                  {column.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <li className="wall-card">
      <figure>
        <div className="review-rating" aria-label={`${review.rating} out of 5`}>
          {Array.from({ length: review.rating }).map((_, i) => (
            <svg
              className="review-star"
              key={i}
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path d="m12 2.75 2.83 5.73 6.32.92-4.58 4.46 1.08 6.3L12 17.19l-5.65 2.97 1.08-6.3L2.85 9.4l6.32-.92L12 2.75Z" />
            </svg>
          ))}
        </div>

        <blockquote>
          <p>{review.quote}</p>
        </blockquote>

        <figcaption>
          <span className="review-author">{review.author}</span>
          <span className="review-meta">
            {review.origin} · via {review.platform}
          </span>
        </figcaption>
      </figure>
    </li>
  );
}
