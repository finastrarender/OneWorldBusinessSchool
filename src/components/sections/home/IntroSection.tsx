import type { z } from "zod";
import type { introDataSchema } from "@/schemas/sections";

type IntroContent = z.infer<typeof introDataSchema>;

export default function IntroSection({
  content,
  anchorId,
}: {
  content: IntroContent;
  anchorId?: string;
}) {
  const titleLines = Array.isArray(content.title) ? content.title : [String(content.title ?? "")];

  return (
    <section className="intro-section" id={anchorId ?? undefined}>
      <div className="intro-section__content section-shell">
        <div className="intro-section__copy">
          <h2 className="intro-section__title">
            {titleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <p className="intro-section__description">{content.description}</p>
        </div>
        <div className="intro-section__media">
          <div className="intro-section__media-frame">
            <span className="intro-section__accent" aria-hidden="true"></span>
            <img
              src={content.image}
              alt="Modern One World Trade Centre FZE headquarters interior"
              width={1200}
              height={800}
              decoding="async"
              className="intro-section__image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
