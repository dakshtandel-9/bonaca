import Container from "@/components/layout/Container";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import SectionHeader from "@/components/ui/SectionHeader";
import { property } from "@/data/property";
import { SECTION_IDS } from "@/lib/constants";

export default function StorySection() {
  return (
    <section id={SECTION_IDS.story} aria-labelledby="story-title">
      <Container>
        <div data-role="content">
          <SectionHeader
            headingId="story-title"
            eyebrow="The Bonaca Experience"
            title="Created for rest, crafted with care."
          />

          {/* Static, ordered copy: the index is a stable key here. */}
          {property.intro.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}

          <a className="text-link" href="#experience">Discover Bonaca <span aria-hidden="true">↗</span></a>
        </div>

        <div data-role="media">
          <PlaceholderImage
            src="/images/bonaca/story/story-main.jpg"
            alt="Bonaca living room with soft neutral furnishings"
            width={1800}
            height={1350}
            sizes="(max-width: 800px) 100vw, 52vw"
          />
          <blockquote>“Where nature meets thoughtful living.”</blockquote>
        </div>
      </Container>
    </section>
  );
}
