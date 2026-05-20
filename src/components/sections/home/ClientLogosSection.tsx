import type { z } from "zod";
import type { clientLogosDataSchema } from "@/schemas/sections";
import Link from "next/link";

type LogosContent = z.infer<typeof clientLogosDataSchema>;

export default function ClientLogosSection({ content }: { content: LogosContent }) {
  const legacyContent = content as unknown as Record<string, unknown>;
  const title =
    typeof legacyContent.title === "string" && legacyContent.title
      ? legacyContent.title
      : typeof legacyContent.heading === "string" && legacyContent.heading
        ? legacyContent.heading
        : "Ready to scale your vision?";
  const subtitle =
    typeof legacyContent.subtitle === "string" && legacyContent.subtitle
      ? legacyContent.subtitle
      : "Connect with our strategic advisors for a confidential consultation.";

  const rawAction =
    legacyContent.action && typeof legacyContent.action === "object"
      ? (legacyContent.action as Record<string, unknown>)
      : {};
  const actionLabel =
    typeof rawAction.label === "string" && rawAction.label
      ? rawAction.label
      : "PARTNER WITH US";
  const actionHref =
    typeof rawAction.href === "string" && rawAction.href ? rawAction.href : "/contact";

  return (
    <section className="logos-section">
      <div className="section-shell">
        <div className="logos-section__card">
          <div className="logos-section__copy">
            <h2 className="logos-section__title">{title}</h2>
            <p className="logos-section__subtitle">{subtitle}</p>
          </div>
          <Link href={actionHref} className="logos-section__action">
            {actionLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
