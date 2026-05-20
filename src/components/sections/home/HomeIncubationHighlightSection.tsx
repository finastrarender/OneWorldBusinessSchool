import type { z } from "zod";
import type { homeIncubationHighlightDataSchema } from "@/schemas/sections";

type HomeIncubationHighlightContent = z.infer<typeof homeIncubationHighlightDataSchema>;

export default function HomeIncubationHighlightSection({
  content,
}: {
  content: HomeIncubationHighlightContent;
}) {
  return (
    <section className="home-incubation-highlight ">
      <div className="home-incubation-highlight__copy">
        <h2 className="home-incubation-highlight__title">{content.title}</h2>
        <p className="home-incubation-highlight__description">{content.description}</p>
        <ol className="home-incubation-highlight__steps">
          {content.steps.map((step) => (
            <li key={`${step.number}-${step.title}`} className="home-incubation-highlight__step">
              <span className="home-incubation-highlight__step-number">{step.number}</span>
              <div>
                <h3 className="home-incubation-highlight__step-title">{step.title}</h3>
                <p className="home-incubation-highlight__step-description">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="home-incubation-highlight__media">
        <img src={content.image} alt={content.title} className="home-incubation-highlight__image" />
        <div className="home-incubation-highlight__stat">
          <span className="home-incubation-highlight__stat-value">{content.stat.value}</span>
          <span className="home-incubation-highlight__stat-label">{content.stat.label}</span>
        </div>
      </div>
    </section>
  );
}
