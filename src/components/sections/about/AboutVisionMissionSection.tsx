import type { z } from "zod";
import type { aboutVisionMissionDataSchema } from "@/schemas/sections";
import * as Icons from "lucide-react";
import React from "react";

type AboutVisionMissionContent = z.infer<typeof aboutVisionMissionDataSchema>;

export default function AboutVisionMissionSection({
  content,
}: {
  content: AboutVisionMissionContent;
}) {
  const legacyCards = (
    content as unknown as { cards?: Array<Record<string, unknown>> }
  ).cards;
  const items =
    Array.isArray(content?.items) && content.items.length > 0
      ? content.items
      : Array.isArray(legacyCards)
        ? legacyCards.map((card) => ({
            title: String(card.title ?? ""),
            description: String(card.description ?? ""),
            icon: String(card.icon ?? ""),
            accentColor: String(card.accentColor ?? "#0b3d91"),
          }))
        : [];

  return (
    <section className="about-panels">
      <div className="section-shell">
        <div className="about-panels__grid">
          {items.map((item, index) => {
            const Icon = Icons[item.icon as keyof typeof Icons] as React.ElementType;
            const toneClass = index % 2 === 0 ? "about-panel--mission" : "about-panel--vision";
          return (
          <article
            key={`${item.title}-${item.description}`}
            className={`about-panel ${toneClass}`}
          >
            <div className="about-panel__icon" aria-hidden="true">
              {Icon ? <Icon size={16} /> : null}
            </div>
            <h2 className="about-panel__title">{item.title}</h2>
            <p className="about-panel__description">{item.description}</p>
          </article>
          );
        })}
        </div>
      </div>
    </section>
  );
}
