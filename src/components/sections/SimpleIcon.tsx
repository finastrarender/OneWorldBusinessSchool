import type { ElementType } from "react";
import * as LucideIcons from "lucide-react";

type IconName =
  | "spark"
  | "check"
  | "trading"
  | "security"
  | "fintech"
  | "online"
  | "investment"
  | "corporate"
  | "location"
  | "phone"
  | "mail"
  | "vision"
  | "mission"
  | "professionalism"
  | "integrity"
  | "innovation"
  | "clientFocus"
  | "compliance";

export default function SimpleIcon({
  name,
  className = "",
}: {
  name: IconName | string;
  className?: string;
}) {
  switch (name) {
    case "spark":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 2l1.6 5.2L19 9l-5.4 1.8L12 16l-1.6-5.2L5 9l5.4-1.8L12 2z"
            fill="currentColor"
          />
        </svg>
      );
    case "check":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M9.55 16.2 5.7 12.35l1.4-1.4 2.45 2.45 7.35-7.35 1.4 1.4-8.75 8.75z"
            fill="currentColor"
          />
        </svg>
      );
    case "trading":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M4 17h4V7H4v10zm6 0h4V4h-4v13zm6 0h4V10h-4v7z"
            fill="currentColor"
          />
        </svg>
      );
    case "security":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 2 5 5v6c0 5 3 8.74 7 10 4-1.26 7-5 7-10V5l-7-3zm0 4 3.5 1.5V11c0 2.8-1.45 5.17-3.5 6.3C9.95 16.17 8.5 13.8 8.5 11V7.5L12 6z"
            fill="currentColor"
          />
        </svg>
      );
    case "fintech":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M7 5h10a2 2 0 0 1 2 2v10h-2V9H7V5zm-2 4h10a2 2 0 0 1 2 2v8H7a2 2 0 0 1-2-2V9zm3 3v2h6v-2H8z"
            fill="currentColor"
          />
        </svg>
      );
    case "online":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7V3zm1 1v8h8A8 8 0 0 0 13 4z"
            fill="currentColor"
          />
        </svg>
      );
    case "investment":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 3 4 7v5c0 5 3.4 8.88 8 10 4.6-1.12 8-5 8-10V7l-8-4zm1 5h3v2h-3v3h-2v-3H8V8h3V5h2v3z"
            fill="currentColor"
          />
        </svg>
      );
    case "corporate":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M3 20h18v2H3v-2zm2-2V7l7-4 7 4v11h-2v-3h-3v3h-4v-3H7v3H5zm4-8h2V8H9v2zm4 0h2V8h-2v2z"
            fill="currentColor"
          />
        </svg>
      );
    case "location":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 2a7 7 0 0 0-7 7c0 5.45 7 13 7 13s7-7.55 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
            fill="currentColor"
          />
        </svg>
      );
    case "phone":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6.6 10.8a15.8 15.8 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.08.36 2.24.56 3.42.56a1 1 0 0 1 1 1V21a1 1 0 0 1-1 1C10.85 22 2 13.15 2 2.2a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.18.2 2.34.56 3.42a1 1 0 0 1-.24 1l-2.22 2.18z"
            fill="currentColor"
          />
        </svg>
      );
    case "mail":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7L4 7v10h16V7l-8 5z"
            fill="currentColor"
          />
        </svg>
      );
    case "vision":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 5c5.5 0 9.8 5.9 10 6.1a1.5 1.5 0 0 1 0 1.8C21.8 13.1 17.5 19 12 19S2.2 13.1 2 12.9a1.5 1.5 0 0 1 0-1.8C2.2 10.9 6.5 5 12 5zm0 3.2A3.8 3.8 0 1 0 12 15.8 3.8 3.8 0 0 0 12 8.2zm0 2a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6z"
            fill="currentColor"
          />
        </svg>
      );
    case "mission":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 3a9 9 0 1 0 9 9h-2.2a6.8 6.8 0 1 1-2-4.8L15 9h6V3l-2.7 2.7A8.95 8.95 0 0 0 12 3zm.2 4.8 4 4-1.4 1.4-2.6-2.6-3.5 3.5-1.4-1.4 4.9-4.9z"
            fill="currentColor"
          />
        </svg>
      );
    case "professionalism":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M7 4h10l2 4v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8l2-4zm1.2 2L7.5 8h9L15.8 6H8.2zM9 11h6v2H9v-2zm0 4h4v2H9v-2z"
            fill="currentColor"
          />
        </svg>
      );
    case "integrity":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 3 5 6v5c0 5 3 8.7 7 10 4-1.3 7-5 7-10V6l-7-3zm0 3.2L16 8v3c0 3.1-1.5 5.7-4 7-2.5-1.3-4-3.9-4-7V8l4-1.8zm-1 2.8v2H9v2h2v2h2v-2h2v-2h-2V9h-2z"
            fill="currentColor"
          />
        </svg>
      );
    case "innovation":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 2a7 7 0 0 0-4.8 12.1c.9.8 1.6 2 1.8 3.2h6c.2-1.2.9-2.4 1.8-3.2A7 7 0 0 0 12 2zm-2 17h4v1.2A1.8 1.8 0 0 1 12.2 22h-.4A1.8 1.8 0 0 1 10 20.2V19zm1-14h2v5h-2V5zm0 7h2v2h-2v-2z"
            fill="currentColor"
          />
        </svg>
      );
    case "clientFocus":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 21s-6.7-4.3-9.2-8A5.6 5.6 0 0 1 12 6a5.6 5.6 0 0 1 9.2 7c-2.5 3.7-9.2 8-9.2 8zm0-12.5a3 3 0 0 0-3 3h2a1 1 0 1 1 1 1v2a3 3 0 1 0-3-3h2a1 1 0 1 1 1-1z"
            fill="currentColor"
          />
        </svg>
      );
    case "compliance":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 2 4 5v6c0 5.2 3.4 9.4 8 10.9C16.6 20.4 20 16.2 20 11V5l-8-3zm-1 6h2v5h-2V8zm0 6h2v2h-2v-2z"
            fill="currentColor"
          />
        </svg>
      );
    case "right-arrow":
      return (
       <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
  <path
    d="M5 12h11l-4-4 1-1 6 6-6 6-1-1 4-4H5z"
    fill="currentColor"
  />
</svg>
      );
    default: {
      const LucideIcon = LucideIcons[name as keyof typeof LucideIcons] as ElementType | undefined;
      if (LucideIcon && /^[A-Z]/.test(name)) {
        return <LucideIcon className={className} aria-hidden="true" />;
      }
      return null;
    }
  }
}
