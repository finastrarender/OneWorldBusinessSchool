import type { z } from "zod";
import type { contactHeroDataSchema } from "@/schemas/sections";

type ContactHeroContent = z.infer<typeof contactHeroDataSchema>;

export default function ContactHeroSection({ content }: { content: ContactHeroContent }) {
  const titleText = Array.isArray(content.title) ? content.title.join(" ") : content.title;

  return (
    <section className="contact-hero">
      <div className="contact-hero__content section-shell">
        <div className="contact-hero__copy">
          <h1 className="contact-hero__title">{titleText}</h1>
          <p className="contact-hero__description">{content.description}</p>
        </div>
      </div>
    </section>
  );
}
