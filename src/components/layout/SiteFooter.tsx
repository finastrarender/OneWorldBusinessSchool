import Link from "next/link";
import { Globe, Landmark, Mail, Phone, icons, type LucideIcon } from "lucide-react";

type FooterLink = { label: string; href: string };
type ContactRow = { type: "location" | "phone" | "mail"; value: string };

type FooterColumn =
  | { title: string; links: FooterLink[] }
  | { title: string; contact: ContactRow[] };

type FooterMetaLink = { label: string; href: string; icon?: string };

function normalizeMetaLinks(
  links: Array<string | FooterMetaLink>,
  defaultHref: string,
): FooterMetaLink[] {
  return links
    .map((item) => {
      if (typeof item === "string") {
        return { label: item, href: defaultHref };
      }
      return {
        label: item.label,
        href: typeof item.href === "string" && item.href.trim() !== "" ? item.href : defaultHref,
        icon: item.icon,
      };
    })
    .filter((item) => item.label);
}

function isValidFooterLink(link: FooterLink) {
  return typeof link.href === "string" && link.href.trim() !== "" && typeof link.label === "string" && link.label.trim() !== "";
}

function SocialIcon({ token }: { token?: string }) {
  const raw = (token ?? "").trim();
  const key = raw.toLowerCase();

  const fromPicker = (() => {
    if (!raw) return null;
    const exact = icons[raw as keyof typeof icons] as LucideIcon | undefined;
    if (exact) return exact;

    const pascal = raw
      .replace(/[-_\s]+/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");
    return (icons[pascal as keyof typeof icons] as LucideIcon | undefined) ?? null;
  })();

  if (fromPicker) {
    const Icon = fromPicker;
    return <Icon aria-hidden="true" />;
  }

  if (key.includes("mail") || key.includes("email")) {
    return <Mail aria-hidden="true" />;
  }
  if (key.includes("phone") || key.includes("call") || key.includes("whatsapp")) {
    return <Phone aria-hidden="true" />;
  }
  return <Globe aria-hidden="true" />;
}

export default function SiteFooter({
  columns,
  meta,
}: {
  columns: FooterColumn[];
  meta: {
    brand: string;
    description: string;
    social: Array<string | FooterMetaLink>;
    copyright: string;
    legal: Array<string | FooterMetaLink>;
  };
}) {
  const socialLinks = normalizeMetaLinks(meta.social ?? [], "/contact");
  const legalLinks = normalizeMetaLinks(meta.legal ?? [], "/contact");

  return (
  <footer className="site-footer">
    <div className="section-shell">
      <div className="site-footer__grid">
        
        {/* Brand */}
        <div className="site-footer__brand">
          <div className="site-footer__brand-line">
            <span>{meta.brand}</span>

            <span
              style={{
                background: "#0A3D61",
                color: "#0ffff",
                fontSize: "8px",
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: "4px",
                maxWidth: "26.88px",
              }}
            >
              FZE
            </span>
          </div>

          <p className="site-footer__brand-copy">
            {meta.description}
          </p>
        </div>

        {/* Footer Columns */}
        {columns.map((column) => (
          <div key={column.title} className="site-footer__column">
            <h3 className="site-footer__heading">{column.title}</h3>

            {"links" in column ? (
              <ul className="site-footer__list">
                {column.links
                  .filter(isValidFooterLink)
                  .map((item) => (
                    <li key={item.label}>
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}
              </ul>
            ) : (
              <ul className="site-footer__list site-footer__list--contact">
                {column.contact.map((item) => (
                  <li
                    key={item.value}
                    className="site-footer__contact-item"
                  >
                    <span>{item.value}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Footer */}
      <div className="site-footer__meta">
        <p>{meta.copyright}</p>

        <div className="site-footer__legal">
          {legalLinks.map((item) => (
            <Link
              key={`${item.label}-${item.href}`}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  </footer>
);
}
