"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { z } from "zod";
import type { servicesDataSchema } from "@/schemas/sections";

type ServicesContent = z.infer<typeof servicesDataSchema>;

export default function ServicesSection({ content }: { content: ServicesContent }) {
  return (
    <section className="services-section">
      <div className="section-shell">
        <div className="section-heading ">
          <div className="services-section__heading-copy">
            <h2 className="section-heading__title">{content.title}</h2>
            <p className="section-heading__description">{content.description}</p>
          </div>
          <Link href="/courses" className="services-section__action">
            View All Courses
            <span aria-hidden="true"> →</span>
          </Link>
        </div>

        <div className="services-grid services-grid--cards">
          {content.cards.slice(0, 3).map((card) => (
            <article key={card.title} className="service-card service-card--featured">
              <div className="service-card__media">
                <img src={card.iconImage ?? "/home/hero-bg.jpg"} alt={card.title} className="service-card__image" />
              </div>
              <div className="service-card__body">
                <span className="service-card__badge">{card.category || "PROGRAM"}</span>
                <h3 className="service-card__title">{card.title}</h3>
                <p className="service-card__text">{card.description}</p>
                <a href="?apply=1" className="service-card__button">Enroll Now</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
