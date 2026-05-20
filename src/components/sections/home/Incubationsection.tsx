import type { z } from "zod";
import type { incubationDataSchema } from "@/schemas/sections";

type IncubationContent = z.infer<typeof incubationDataSchema>;

export default function IncubationSection({ content }: { content: IncubationContent }) {
  const heroTitleLines =
    content.heroTitleLines && content.heroTitleLines.length > 0
      ? content.heroTitleLines
      : content.title
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);

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
            <a className="incubation-hero__action incubation-hero__action--primary" href={content.primaryAction.href}>
              {content.primaryAction.label}
            </a>
          ) : content.secondaryAction ? (
            <a className="incubation-hero__action incubation-hero__action--primary" href={content.secondaryAction.href}>
              {content.secondaryAction.label}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}

