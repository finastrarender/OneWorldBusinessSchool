import type { z } from "zod";
import type { globalStandardsDataSchema } from "@/schemas/sections";

type GlobalStandardsContent = z.infer<typeof globalStandardsDataSchema>;

export default function GlobalStandardsSection({ content }: { content: GlobalStandardsContent }) {
  return (
    <section className="global-standards-section section-shell">
      <div className="global-standards-section__header">
        <h2 className="global-standards-section__title">{content.title}</h2>
        <p className="global-standards-section__description">{content.description}</p>
      </div>

      <div className="global-standards-section__grid">
        {content.pillars.map((pillar, i) => (
          <article key={i} className="global-standards-card">
            <h3 className="global-standards-card__title">{pillar.title}</h3>
            <p className="global-standards-card__description">{pillar.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}