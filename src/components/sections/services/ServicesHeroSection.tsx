import type { z } from "zod";
import type { serviceHeroDataSchema } from "@/schemas/sections";

type ServicesHeroContent = z.infer<typeof serviceHeroDataSchema>;

export default function ServicesHeroSection({ content }: { content: ServicesHeroContent }) {
  return (
    <section
      className="services-hero"
      style={{ ["--services-hero-bg" as string]: `url(${content.backgroundImage})` }}
    >
      <div className="services-hero__overlay" aria-hidden="true" />
      <div className="section-shell services-hero__content">
        <h1 className="services-hero__title">
          {content.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        <p className="services-hero__description">{content.description}</p>
      </div>
    </section>
  );
}
