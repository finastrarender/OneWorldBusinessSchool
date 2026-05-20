import type { z } from "zod";
import type { aboutFrameworkDataSchema } from "@/schemas/sections";

type AboutFrameworkContent = z.infer<typeof aboutFrameworkDataSchema>;

export default function AboutFrameworkSection({ content }: { content: AboutFrameworkContent }) {
  return (
    <section className="about-framework">
      <div className="section-shell">
        <header className="about-framework__header">
          <h2 className="about-framework__title">{content.title}</h2>
          <p className="about-framework__description">{content.description}</p>
        </header>

        <div className="about-framework__grid">
          {content.pillars.map((pillar) => (
            <article key={`${pillar.letter}-${pillar.title}`} className="about-framework-card">
              <div className="about-framework-card__badge">{pillar.letter}</div>
              <h3 className="about-framework-card__title">{pillar.title}</h3>
              <p className="about-framework-card__description">{pillar.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
