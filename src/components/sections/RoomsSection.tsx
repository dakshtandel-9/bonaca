"use client";

import Image from "next/image";
import { useState } from "react";

import Container from "@/components/layout/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import type { SiteContent } from "@/lib/cms/types";
import { SECTION_IDS } from "@/lib/constants";

/**
 * A switcher rather than a grid: the list on the left drives one large frame
 * on the right, and every image stays mounted so swapping between spaces is a
 * crossfade rather than a fresh network request.
 *
 * On narrow screens the same markup becomes a snap-scrolling row of cards, so
 * there is no second layout to keep in sync.
 */
export default function RoomsSection({ content }: { content: SiteContent }) {
  const section = content.home.rooms;
  const rooms = section.items;
  const [activeId, setActiveId] = useState(rooms[0]?.id ?? "");

  if (rooms.length === 0) return null;

  return (
    <section id={SECTION_IDS.rooms} className="rooms" aria-labelledby="rooms-title">
      <Container>
        <SectionHeader
          index={section.index}
          eyebrow={section.eyebrow}
          headingId="rooms-title"
          title={section.title}
          description={section.description}
          layout="split"
        />

        <div className="rooms-body">
          <ul className="rooms-list" role="tablist" aria-label={`Spaces at ${content.site.name}`}>
            {rooms.map((room) => {
              const selected = room.id === activeId;
              return (
                <li key={room.id}>
                  <button
                    type="button"
                    role="tab"
                    id={`room-tab-${room.id}`}
                    aria-selected={selected}
                    aria-controls={`room-panel-${room.id}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActiveId(room.id)}
                    onMouseEnter={() => setActiveId(room.id)}
                    onFocus={() => setActiveId(room.id)}
                  >
                    <span className="room-index">{room.index}</span>
                    <span className="room-name">{room.name}</span>
                    <span className="room-kind">{room.kind}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="rooms-stage">
            {rooms.map((room) => {
              const selected = room.id === activeId;
              return (
                <figure
                  key={room.id}
                  id={`room-panel-${room.id}`}
                  role="tabpanel"
                  aria-labelledby={`room-tab-${room.id}`}
                  data-active={selected ? "" : undefined}
                  aria-hidden={!selected}
                >
                  <Image
                    src={room.image}
                    alt={`${room.name} at ${content.site.name}`}
                    width={1536}
                    height={1024}
                    sizes="(max-width: 900px) 100vw, 58vw"
                    style={{ objectPosition: room.focus }}
                  />
                  <figcaption>
                    <p>{room.description}</p>
                    <ul>
                      {room.facts.map((fact) => (
                        <li key={fact}>{fact}</li>
                      ))}
                    </ul>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
