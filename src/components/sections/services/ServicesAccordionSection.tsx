"use client";

/* eslint-disable @next/next/no-img-element */
import type { z } from "zod";
import { useState } from "react";
import type { servicesAccordionDataSchema } from "@/schemas/sections";
import SimpleIcon from "../SimpleIcon";

type ServicesAccordionContent = z.infer<typeof servicesAccordionDataSchema>;

export default function ServicesAccordionSection({ content }: { content: ServicesAccordionContent }) {
  const [openIndex, setOpenIndex] = useState(-1);

  const getIconName = (cardTitle: string, explicitIcon?: string) => {
    if (explicitIcon && explicitIcon.trim().length > 0) {
      return explicitIcon;
    }
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
            return (
              <article key={card.title} className={`services-accordion-page__item${isOpen ? " is-open" : ""}`}>
                <button
                  type="button"
                  className="services-accordion-page__trigger"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex((prev) => (prev === index ? -1 : index))}
                >
                  <span className="services-accordion-page__lead">
                    <span className="services-accordion-page__icon-wrap">
                      <SimpleIcon
                        name={getIconName(card.title, card.icon)}
                        className="services-accordion-page__icon"
                      />
                    </span>
                    <span className="services-accordion-page__title">{card.title}</span>
                  </span>
                  <span className="services-accordion-page__chevron" aria-hidden="true">
                    {isOpen ? "^" : "v"}
                  </span>
                </button>

                {isOpen && (
                  <div className="services-accordion-page__panel">
                    <div className="services-accordion-page__copy">
                      <p className="services-accordion-page__description">{card.description}</p>
                      {Array.isArray(card.points) && card.points.length > 0 && (
                        <ul className="services-accordion-page__points">
                          {card.points.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="services-accordion-page__media">
                      <img
                        src={card.iconImage ?? "/home/headquarters.png"}
                        alt={card.title}
                        className="services-accordion-page__image"
                      />
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
