import type { z } from "zod";
import type { investmentDataSchema } from "@/schemas/sections";
import * as Icons from "lucide-react"

type InvestmentContent = z.infer<typeof investmentDataSchema>;

export default function InvestmentSection({ content }: { content: InvestmentContent }) {
  const legacyContent = content as unknown as Record<string, unknown>;
  const sectionId =
    typeof legacyContent.id === "string" && legacyContent.id.length > 0
      ? legacyContent.id
      : "investment";

  const heading = Array.isArray(legacyContent.heading)
    ? (legacyContent.heading as string[]).filter((line) => typeof line === "string" && line)
    : typeof legacyContent.title === "string" && legacyContent.title
      ? [legacyContent.title]
      : ["Why Partners Choose", "One World Capital"];

  const legacyDescription =
    typeof legacyContent.description === "string" ? legacyContent.description : "";
  const items = Array.isArray(legacyContent.items)
    ? (legacyContent.items as Array<Record<string, unknown>>).map((item) => ({
        icon: typeof item.icon === "string" ? item.icon : "✓",
        title: typeof item.title === "string" ? item.title : "",
        description: typeof item.description === "string" ? item.description : "",
      }))
    : Array.isArray(legacyContent.stats)
      ? (legacyContent.stats as Array<Record<string, unknown>>).map((stat) => ({
          icon: "✓",
          title: typeof stat.label === "string" ? stat.label : "",
          description: legacyDescription,
        }))
      : [];

  const quoteText =
    typeof legacyContent.quoteText === "string" && legacyContent.quoteText
      ? legacyContent.quoteText
      : '"One World Capital provides the vision and the vehicle for international expansion that few others can match."';
  const quoteAuthor =
    typeof legacyContent.quoteAuthor === "string" && legacyContent.quoteAuthor
      ? legacyContent.quoteAuthor
      : "Strategic Portfolio Insight";
  const quoteRole =
    typeof legacyContent.quoteRole === "string" && legacyContent.quoteRole
      ? legacyContent.quoteRole
      : "Global Division";

  return (
    <section className="investment-section" id={sectionId}>
      <div className="section-shell investment-section__content">
        <div className="investment-section__left">
          <h2 className="investment-section__title">
            {heading.map((line, index) => (
              <span key={`${line}-${index}`} className="investment-section__title-line">
                {line}
              </span>
            ))}
          </h2>

          <div className="investment-section__list">
            {items.map((item, index) => {
              const Icon=Icons[item.icon as keyof typeof Icons] as React.ElementType
              return(
                <article key={`${item.title}-${index}`} className="investment-feature">
                <div className="investment-feature__icon" aria-hidden="true">
                  {Icon ? <Icon size={24}/>: null}
                 
                </div>
                <div className="investment-feature__body">
                  <h3 className="investment-feature__title">{item.title}</h3>
                  <p className="investment-feature__description">{item.description}</p>
                </div>
              </article>
              )
            })}
          </div>
        </div>

        <aside className="investment-section__quote-card">
          <p className="investment-section__quote">{quoteText}</p>
          <div className="investment-section__quote-divider" aria-hidden="true" />
          <p className="investment-section__quote-author">{quoteAuthor}</p>
          <p className="investment-section__quote-role">{quoteRole}</p>
        </aside>
      </div>
    </section>
  );
}
