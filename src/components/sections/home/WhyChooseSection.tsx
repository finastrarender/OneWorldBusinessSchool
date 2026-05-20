import type { z } from "zod";
import type { whyChooseDataSchema } from "@/schemas/sections";
import * as Icons from "lucide-react";
import React from "react";

type WhyContent = z.infer<typeof whyChooseDataSchema>;

export default function WhyChooseSection({ content }: { content: WhyContent }) {
 
  return (
    <section className="why-section section-shell">
      <div className="why-section__header">
        <h2>{content.title}</h2>
        <p className="why-section__subheading">{content.subheading}</p>
      </div>
      <div className="why-section__grid">
        {content.items.map((item, i) => {
          const Icon = Icons[item.icon as keyof typeof Icons] as React.ElementType;
          return (
            <article key={i} className="why-card">
              <div className="why-card__icon">
                {Icon ? <Icon size={24} /> : null}
                
              </div>
              <h3 className="why-card__title">{item.title}</h3>
            </article>
          );
        })}
      </div>
    </section>
  );
}
