import type { z } from "zod";
import type { aboutValuesDataSchema } from "@/schemas/sections";
import * as Icons from 'lucide-react';
import SimpleIcon from "../SimpleIcon";
import React from "react";

type AboutValuesContent = z.infer<typeof aboutValuesDataSchema>;

export default function AboutValuesSection({ content }: { content: AboutValuesContent }) {
  return (
    <section className="about-values">
      <div className="section-shell">
        <div className="section-heading about-values__heading">
          <h2 className="section-heading__title about-values__title">{content.title}</h2>
          <div className="section-accent about-values__acent-blue"></div>
        </div>
        <div className="about-values__grid">
          {content.items.map((item) => {
            const Icon=Icons[item.icon as keyof typeof Icons] as React.ElementType;
            return<article key={`${item.title}-${item.description}`} className="about-value-card">
              <div className="about-value-card__icon" aria-hidden="true">
                {Icon ? <Icon size={28}/>:""}
              </div>
              <h3 className="about-value-card__title">{item.title}</h3>
              <p className="about-value-card__description">{item.description}</p>
            </article>
          })}
        </div>
      </div>
    </section>
  );
}
