"use client";

/* eslint-disable @next/next/no-img-element */
import type { z } from "zod";
import type { ElementType } from "react";
import { useState } from "react";
import * as LucideIcons from "lucide-react";
import type { servicesAccordionDataSchema } from "@/schemas/sections";
import SimpleIcon from "../SimpleIcon";

type ServicesAccordionContent = z.infer<typeof servicesAccordionDataSchema>;

function resolveAccordionIcon(name: string | undefined): ElementType | null {
  const trimmed = name?.trim() ?? "";
  if (trimmed && /^[A-Z]/.test(trimmed)) {
    const LucideIcon = LucideIcons[trimmed as keyof typeof LucideIcons] as ElementType | undefined;
    if (LucideIcon) return LucideIcon;
  }
  return null;
}

export default function ServicesAccordionSection({ content }: { content: ServicesAccordionContent }) {
  const [openIndex, setOpenIndex] = useState(-1);

  const getIconName = (cardTitle: string) => {
    const lower = cardTitle.toLowerCase();
    if (lower.includes("management")) return "trading";
    if (lower.includes("research")) return "innovation";
    if (lower.includes("membership")) return "clientFocus";
    if (lower.includes("manpower")) return "professionalism";
    return "online";
  };

  return (
    <section className="services-accordion-page">
      <div className="section-shell">
        <div className="services-accordion-page__list">
          {content.cards.map((card, index) => {
            const isOpen = openIndex === index;
            const fallbackIcon = getIconName(card.title);
            const iconName = card.icon?.trim() || fallbackIcon;
            const LucideIcon = resolveAccordionIcon(card.icon);
            const panelId = `services-accordion-panel-${index}`;
            const triggerId = `services-accordion-trigger-${index}`;
            const titleId = `services-accordion-title-${index}`;
            return (
              <article key={card.title} className={`services-accordion-page__item${isOpen ? " is-open" : ""}`}>
                <div className="services-accordion-page__header">
                  <div className="services-accordion-page__lead">
                    <span className="services-accordion-page__icon-wrap">
                      {LucideIcon ? (
                        <LucideIcon className="services-accordion-page__icon" aria-hidden="true" />
                      ) : (
                        <SimpleIcon name={iconName} className="services-accordion-page__icon" />
                      )}
                    </span>
                    <h3 id={titleId} className="services-accordion-page__title">{card.title}</h3>
                  </div>
                  <button
                    type="button"
                    id={triggerId}
                    className="services-accordion-page__chevron-btn"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    aria-label={`${isOpen ? "Collapse" : "Expand"} ${card.title}`}
                    onClick={() => setOpenIndex((prev) => (prev === index ? -1 : index))}
                  >
                    <svg
                      className={`services-accordion-page__chevron${isOpen ? " is-open" : ""}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                {isOpen ? (
                  <div
                    id={panelId}
                    className="services-accordion-page__panel"
                    role="region"
                    aria-labelledby={titleId}
                  >
                    <div className="services-accordion-page__copy">
                      <p className="services-accordion-page__description">{card.description}</p>
                      {Array.isArray(card.points) && card.points.length > 0 && (
                        <>
                          <p className="services-accordion-page__points-label">Key offerings</p>
                          <ul className="services-accordion-page__points">
                            {card.points.map((point) => (
                              <li key={point}>{point}</li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>

                    <div className="services-accordion-page__media">
                      <img
                        src={card.iconImage ?? "/home/headquarters.png"}
                        alt=""
                        className="services-accordion-page__image"
                      />
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
