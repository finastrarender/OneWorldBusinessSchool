import type { z } from "zod";
import type { heroDataSchema } from "@/schemas/sections";

type HeroContent = z.infer<typeof heroDataSchema>;

export default function HeroSection({
  content,
  anchorId,
}: {
  content: HeroContent;
  anchorId?: string;
}) {
  const heroBackgroundImage =
    typeof content.backgroundImage === "string" && content.backgroundImage.trim() !== ""
      ? content.backgroundImage
      : "/home/hero-bg.jpg";

  const normalizedTitleLines = (() => {
    const joined = content.title.join(" ").replace(/\s+/g, " ").trim().toLowerCase();
    const target = "empowering businesses & professionals for a smarter future";

    if (joined === target) {
      return ["Empowering", "Businesses &", "Professionals for a", "Smarter Future"];
    }

    return content.title;
  })();

  return (
    <section className="hero-section" id={anchorId ?? undefined}>
      <div className="hero-section__background" aria-hidden="true">
        <img
          className="hero-section__background-image"
          src={heroBackgroundImage}
          alt=""
          width={1600}
          height={900}
          decoding="async"
          fetchPriority="high"
        />
      </div>
      <div className="hero-section__gradient" aria-hidden="true" />
      <div className="hero-section__overlay" aria-hidden="true" />

      <div className="hero-section__content section-shell">
        <div className="hero-section__copy">
          <h1 className="hero-section__title">
            {normalizedTitleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className="hero-section__description">{content.description}</p>
          <div className="hero-section__actions">
            <a className="button hero-section__button hero-section__button--primary" href={content.primaryAction.href}>
              {content.primaryAction.label}
            </a>
            <a className="button hero-section__button hero-section__button--secondary" href={content.secondaryAction.href}>
              {content.secondaryAction.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
