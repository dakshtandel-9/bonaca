import Container from "@/components/layout/Container";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import SectionHeader from "@/components/ui/SectionHeader";
import { SECTION_IDS } from "@/lib/constants";

/**
 * Two fixed editorial blocks. The copy lives here rather than in /data
 * because it is not reused anywhere else on the site.
 */
const experiences = [
  {
    id: "interiors",
    title: "Interiors of thoughtful luxury.",
    description:
      "Rooms that stay cool and quiet, furnished simply and made for long, unhurried stays.",
    imageAlt: "Interior living space at Bonaca",
    imageSrc: "/images/bonaca/experience/interior-main.jpg",
    linkLabel: "Explore Interiors",
  },
  {
    id: "outdoors",
    title: "Open to nature. Yours to unwind.",
    description:
      "A private garden, shaded seating and open sky — the outdoor half of the house.",
    imageAlt: "Garden and outdoor seating at Bonaca",
    imageSrc: "/images/bonaca/experience/outdoor-main.jpg",
    linkLabel: "Explore Outdoors",
  },
];

export default function ExperienceSection() {
  return (
    <section id={SECTION_IDS.experience} aria-labelledby="experience-title">
      <Container>
        <SectionHeader
          headingId="experience-title"
          eyebrow="Experience"
          title="A stay shaped by space."
        />

        {experiences.map((experience) => (
          <article key={experience.id} data-experience={experience.id}>
            <div data-role="content">
              <h3>{experience.title}</h3>
              <p>{experience.description}</p>
              <a className="text-link" href="#gallery">{experience.linkLabel} <span aria-hidden="true">↗</span></a>
            </div>

            <div data-role="media">
              <PlaceholderImage
                src={experience.imageSrc}
                alt={experience.imageAlt}
                width={1800}
                height={1350}
                sizes="(max-width: 800px) 100vw, 65vw"
              />
            </div>
          </article>
        ))}
      </Container>
    </section>
  );
}
