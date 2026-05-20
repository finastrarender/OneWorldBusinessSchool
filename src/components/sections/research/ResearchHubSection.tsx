import type { z } from "zod";
import type { researchHubDataSchema } from "@/schemas/sections";
import SimpleIcon from "@/components/sections/SimpleIcon";

type ResearchContent = z.infer<typeof researchHubDataSchema>;

export default function ResearchHubSection({ content }: { content: ResearchContent }) {
  return (
    <section className="research-section">
      <div className="research-hero">
        <img src={content.heroImage} alt="" className="research-hero__bg" />
        <div className="research-hero__overlay" />
        <div className="research-hero__inner section-shell">
          <div className="research-hero__content">
            <p className="research-hero__badge">{content.heroBadge}</p>
            <h1 className="research-hero__title">
              {content.heroTitleLines.map((line, index) => (
                <span key={`${line}-${index}`}>{line}</span>
              ))}
            </h1>
            <p className="research-hero__description">{content.heroDescription}</p>
            <div className="research-hero__actions">
              <a href={content.heroPrimaryAction.href} className="research-hero__action research-hero__action--primary">
                {content.heroPrimaryAction.label}
              </a>
              <a href={content.heroSecondaryAction.href} className="research-hero__action research-hero__action--secondary">
                {content.heroSecondaryAction.label}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="research-overview section-shell">
        <div className="research-overview__image-wrap">
          <img src={content.overviewImage} alt="" className="research-overview__image" />
          <div className="research-overview__shape" />
        </div>
        <div className="research-overview__copy">
          <h2>{content.overviewTitle}</h2>
          <p>{content.overviewDescription}</p>
          <ul>
            {content.overviewPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="research-pillars">
        <div className="section-shell">
          <h2 className="research-pillars__title">{content.pillarsTitle}</h2>
          <div className="research-pillars__underline" />
          <div className="research-pillars__grid">
            {content.pillars.map((pillar) => (
              <article key={pillar.title} className="research-pillars__card">
                <div className="research-pillars__icon">
                  <SimpleIcon name={pillar.icon} />
                </div>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
                <div className="research-pillars__divider" />
                <span>{pillar.project}</span>
              </article>
            ))}
          </div>
        </div>
        <div className="research-metrics">
          <div className="section-shell research-metrics__grid">
            {content.metrics.map((metric) => (
              <div key={`${metric.value}-${metric.label}`} className="research-metric">
                <p>{metric.value}</p>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="research-simulation section-shell">
        <div className="research-simulation__copy">
          <h3>{content.simulationTitle}</h3>
          <p>{content.simulationDescription}</p>
          <div className="research-progress">
            <div className="research-progress__row">
              <span>{content.accuracyLabel}</span>
              <strong>{content.accuracyValue}</strong>
            </div>
            <div className="research-progress__bar"><i style={{ width: content.accuracyValue }} /></div>
            <div className="research-progress__row">
              <span>{content.velocityLabel}</span>
              <strong>{content.velocityValue}</strong>
            </div>
            <div className="research-progress__bar"><i style={{ width: content.velocityValue }} /></div>
          </div>
        </div>
        <div className="research-simulation__visual">
          <img src={content.simulationImage} alt="" />
        </div>
      </div>
    </section>
  );
}
