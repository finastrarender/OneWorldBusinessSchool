"use client";

import { useState } from "react";
import type { z } from "zod";
import type { incubationDataSchema } from "@/schemas/sections";

type IncubationContent = z.infer<typeof incubationDataSchema>;

export default function IncubationPageSection({ content }: { content: IncubationContent }) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");
  const heroTitleLines =
    content.heroTitleLines && content.heroTitleLines.length > 0
      ? content.heroTitleLines
      : content.title
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);

  const roadmapItems =
    content.roadmapItems && content.roadmapItems.length > 0
      ? content.roadmapItems
      : content.steps.map((step) => ({
          title: step.title,
          description: step.description,
          points: [],
          image: content.image,
        }));

  const portfolioCards = content.portfolioCards ?? [];
  const applicationFields =
    content.applicationFields && content.applicationFields.length > 0
      ? content.applicationFields
      : [
          { label: "Full Name", placeholder: "Jane Doe" },
          { label: "Startup Name", placeholder: "Acme Inc." },
          { label: "Email Address", placeholder: "jane@startup.com" },
          {
            label: "Pitch Deck URL",
            placeholder: "https://dropbox.com/your-pitch-deck",
          },
        ];

  async function onApplicationSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const fields = applicationFields.map((field, index) => ({
      label: field.label,
      value: String(fd.get(`field-${index}`) ?? ""),
    }));

    try {
      const res = await fetch("/api/v1/incubation-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("err");
        setMessage(json?.error?.message ?? "Something went wrong");
        return;
      }
      setStatus("ok");
      setMessage("Thank you - your application has been submitted.");
      form.reset();
    } catch {
      setStatus("err");
      setMessage("Network error");
    }
  }

  return (
    <section className="incubation-section section-shell">
      <div className="incubation-hero">
        {content.badge ? <p className="incubation-hero__badge">{content.badge}</p> : null}
        <h2 className="incubation-hero__title">
          {heroTitleLines.map((line, index) => (
            <span key={`${line}-${index}`}>{line}</span>
          ))}
        </h2>
        <p className="incubation-hero__description">
          {content.heroDescription ?? content.description}
        </p>
        <div className="incubation-hero__actions">
          {content.primaryAction ? (
            <a
              className="incubation-hero__action incubation-hero__action--primary"
              href={content.primaryAction.href}
            >
              {content.primaryAction.label}
            </a>
          ) : content.secondaryAction ? (
            <a
              className="incubation-hero__action incubation-hero__action--primary"
              href={content.secondaryAction.href}
            >
              {content.secondaryAction.label}
            </a>
          ) : null}
        </div>
      </div>

      <div className="incubation-roadmap">
        <div className="incubation-roadmap__heading">
          <h3 className="incubation-roadmap__title">
            {content.roadmapTitle ?? "The Incubation Roadmap"}
          </h3>
          <p className="incubation-roadmap__subtitle">
            {content.roadmapSubtitle ?? "A structured transition from idea to global scale."}
          </p>
        </div>
        <ol className="incubation-roadmap__list">
          {roadmapItems.map((item, index) => (
            <li key={`${item.title}-${index}`} className="incubation-roadmap__row">
              <article className="incubation-roadmap__card">
                <h4 className="incubation-roadmap__card-title">{item.title}</h4>
                <p className="incubation-roadmap__card-description">{item.description}</p>
                <ul className="incubation-roadmap__points">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
              <span className="incubation-roadmap__index">{index + 1}</span>
              <div className="incubation-roadmap__image-wrap">
                <img src={item.image} alt={item.title} className="incubation-roadmap__image" />
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="incubation-portfolio">
        <div className="incubation-portfolio__header">
          <div>
            <h3 className="incubation-portfolio__title">
              {content.portfolioTitle ?? "Portfolio Highlights"}
            </h3>
            <p className="incubation-portfolio__description">
              {content.portfolioDescription ??
                "See how we've helped disruptive startups navigate international business growth."}
            </p>
          </div>
          {content.portfolioAction ? (
            <a className="incubation-portfolio__action" href={content.portfolioAction.href}>
              {content.portfolioAction.label}
            </a>
          ) : null}
        </div>
        <div className="incubation-portfolio__grid">
          {portfolioCards.map((card, cardIndex) => (
            <article key={`${card.title}-${cardIndex}`} className="incubation-portfolio__card">
              <div className="incubation-portfolio__overlay" />
              <div className="incubation-portfolio__content">
                <p className="incubation-portfolio__category">{card.category}</p>
                <h4 className="incubation-portfolio__card-title">{card.title}</h4>
                <p className="incubation-portfolio__card-description">{card.description}</p>
                <div className="incubation-portfolio__metrics">
                  {card.metrics.map((metric) => (
                    <div
                      key={`${metric.value}-${metric.label}`}
                      className="incubation-portfolio__metric"
                    >
                      <p>{metric.value}</p>
                      <span>{metric.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              {card.image ? <img src={card.image} alt="" className="incubation-portfolio__bg" /> : null}
            </article>
          ))}
        </div>
      </div>

      <div className="incubation-application">
        <div className="incubation-application__header">
          <h3 className="incubation-application__title">
            {content.applicationTitle ?? "Ready to Build Your Legacy?"}
          </h3>
          <p className="incubation-application__description">
            {content.applicationDescription ??
              "We are looking for bold founders solving hard problems. Our next cohort application window is now open. Apply today and get access to the ecosystem you need to win."}
          </p>
        </div>
        <form className="incubation-application__form" onSubmit={onApplicationSubmit}>
          <div className="incubation-application__grid">
            {applicationFields.map((field, index) => (
              <label
                key={`${field.label}-${index}`}
                className={`incubation-application__field ${index < 2 ? "incubation-application__field--half" : ""}`}
              >
                <span>{field.label}</span>
                <input name={`field-${index}`} type="text" placeholder={field.placeholder} />
              </label>
            ))}
          </div>
          <button
            type="submit"
            className="incubation-application__submit"
            disabled={status === "loading"}
          >
            {status === "loading"
              ? "Submitting..."
              : content.applicationSubmitLabel ?? "Submit Application"}
          </button>
          <p className="incubation-application__note">
            {content.applicationNote ??
              "Our team typically responds within 5-7 business days for initial screening."}
          </p>
          {message ? (
            <p className={status === "ok" ? "contact-form__ok" : "contact-form__err"}>
              {message}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}

