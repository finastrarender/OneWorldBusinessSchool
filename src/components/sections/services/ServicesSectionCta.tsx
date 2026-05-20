import type { z } from "zod";
import type { servicesCtaDataSchema } from "@/schemas/sections";

type ServicesCtaContent = z.infer<typeof servicesCtaDataSchema>;

const DEFAULT_CONTENT: ServicesCtaContent = {
  title: "Need a Bespoke Solution?",
  description:
    "Our experts are ready to provide tailored advice for your unique business needs. Contact us today to discuss how we can partner for your success.",
  primaryAction: { label: "Book a Consultation", href: "/contact" },
  secondaryAction: { label: "Download Brochure", href: "/brochure" },
};

export default function ServicesSectionCta({
  content,
}: {
  content: Partial<ServicesCtaContent>;
}) {
  const safeContent: ServicesCtaContent = {
    title: content.title || DEFAULT_CONTENT.title,
    description: content.description || DEFAULT_CONTENT.description,
    primaryAction: {
      label: content.primaryAction?.label || DEFAULT_CONTENT.primaryAction.label,
      href: content.primaryAction?.href || DEFAULT_CONTENT.primaryAction.href,
    },
    secondaryAction: {
      label: content.secondaryAction?.label || DEFAULT_CONTENT.secondaryAction.label,
      href: content.secondaryAction?.href || DEFAULT_CONTENT.secondaryAction.href,
    },
  };

  return (
    <section className="services-cta">
      <div className="section-shell">
        <div className="services-cta__content">
          <h2 className="services-cta__title">{safeContent.title}</h2>
          <p className="services-cta__description">{safeContent.description}</p>
          <div className="services-cta__actions">
            <a className="services-cta__button services-cta__button-primary" href={safeContent.primaryAction.href}>
              {safeContent.primaryAction.label}
            </a>
            <a className="services-cta__button services-cta__button-secondary" href={safeContent.secondaryAction.href}>
              {safeContent.secondaryAction.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
