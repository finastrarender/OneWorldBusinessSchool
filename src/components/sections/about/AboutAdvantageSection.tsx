import type { z } from "zod";
import type { aboutAdvantageDataSchema } from "@/schemas/sections";

type AboutAdvantageContent = z.infer<typeof aboutAdvantageDataSchema>;

export default function AboutAdvantageSection({
  content,
}: {
  content: AboutAdvantageContent;
}) {
  return (
    <section className="about-advantage">
      <div className="section-shell about-advantage__content">
        <div className="about-advantage__copy">
          <p className="section-label about-advantage__eyebrow">{content.eyebrow}</p>
          <h2 className="about-advantage__title">
            {content.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <p className="about-advantage__description">{content.description}</p>
        </div>

        <div className="about-advantage__media">
          <div className="about-advantage__image-frame">
            <img
              src={content.image}
              alt="Aerial business district with global expansion imagery"
              width={1200}
              height={800}
              decoding="async"
              className="about-advantage__image"
            />
          </div>

          <ul className="about-advantage__cards">
            {content.points.map((point, index) => (
              <li key={`${point}-${index}`} className="about-advantage__card">
                <span className="about-advantage__card-badge">{index + 1}</span>
                <p className="about-advantage__card-text">{point}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
