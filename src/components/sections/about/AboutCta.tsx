import type { aboutCtaDataSchema } from "@/schemas/sections";
import type { z } from "zod";

type AboutCtaContent = z.infer<typeof aboutCtaDataSchema>;

const AboutCta = ({ content }: { content: AboutCtaContent }) => {
  const titleLines = Array.isArray(content.title)
    ? content.title
    : [String(content.title ?? "")];
  const legacyActions = (content as unknown as {
    actions?: Array<{ label?: string; href?: string }>;
  }).actions;
  const primaryAction =
    content.primaryAction ??
    (Array.isArray(legacyActions) ? legacyActions[0] : undefined) ??
    { label: "Join the School", href: "/courses" };
  const secondaryAction =
    content.secondaryAction ??
    (Array.isArray(legacyActions) ? legacyActions[1] : undefined) ??
    { label: "Enter the Incubator", href: "/incubation" };

  return (
    <section className="about-cta">
      <div className="section-shell">
        <div className="about-cta__card">
          <h2 className="about-cta__title">
            {titleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <p className="about-cta__description">{content.description}</p>
          <div className="about-cta__actions">
            <a
              className="button about-cta__button about-cta__button-primary"
              href={primaryAction.href}
            >
              {primaryAction.label}
            </a>
            {content.secondaryAction && (
              <a
                className="button about-cta__button about-cta__button-secondary"
                href={secondaryAction?.href}
              >
                {secondaryAction?.label}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCta;
