import type { z } from "zod";
import type { ctaDataSchema } from "@/schemas/sections";

type CtaContent = z.infer<typeof ctaDataSchema>;

export default function CtaSection({
  content,
  anchorId = "contact",
}: {
  content: CtaContent;
  anchorId?: string;
}) {
  return (
    <section className="cta-section section-shell" id={anchorId}>
      <div className="cta-section__card">
        <h2 className="cta-section__title">{content.title}</h2>
        <p className="cta-section__description">{content.description}</p>
        <a className="button button--gold button--compact" href={content.action.href}>
          {content.action.label}
        </a>
      </div>
    </section>
  );
}
