import Image from "next/image";

import Container from "@/components/layout/Container";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import type { SiteContent } from "@/lib/cms/types";

/**
 * What the kitchen does through the day: one card per meal with its photograph,
 * when it is served and how to ask for it, then a single line on dietary needs.
 */
export default function MealsSection({ content }: { content: SiteContent }) {
  const section = content.accommodation.meals;
  if (section.items.length === 0) return null;

  return (
    <section id="meals" className="villa-meals" aria-labelledby="meals-title">
      <Container>
        <SectionHeader
          index={section.index}
          eyebrow={section.eyebrow}
          headingId="meals-title"
          title={section.title}
          description={section.description}
          layout="split"
        />

        <ul className="meal-grid">
          {section.items.map((meal, i) => (
            <Reveal as="li" key={`${meal.id}-${i}`} variant="up" delay={(i % 4) * 0.06} className="meal-card">
              <div className="meal-photo">
                {meal.image ? (
                  <Image
                    src={meal.image}
                    alt={meal.imageAlt}
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 25vw"
                  />
                ) : (
                  <span className="meal-photo-empty" aria-hidden="true">
                    <Icon name="kitchen" />
                  </span>
                )}
                {meal.tag ? <span className="meal-tag">{meal.tag}</span> : null}
              </div>
              {meal.time ? <p className="meal-time">{meal.time}</p> : null}
              <h3 className="meal-name">{meal.name}</h3>
              <p className="meal-copy">{meal.description}</p>
            </Reveal>
          ))}
        </ul>

        {section.note ? (
          <Reveal as="p" variant="up" className="meal-note">
            <span className="meal-note-icon" aria-hidden="true">
              <Icon name="leaf" />
            </span>
            {section.note}
          </Reveal>
        ) : null}
      </Container>
    </section>
  );
}
