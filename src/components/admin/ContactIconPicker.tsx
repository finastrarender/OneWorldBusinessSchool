"use client";

import { useMemo, useState } from "react";
import SimpleIcon from "@/components/sections/SimpleIcon";

type Props = {
  value: unknown;
  onChange: (val: string) => void;
};

/** Icons rendered on the public site via SimpleIcon (custom + Lucide fallback). */
const CONTACT_ICON_OPTIONS = [
  "location",
  "phone",
  "mail",
  "corporate",
  "spark",
  "check",
  "trading",
  "security",
  "fintech",
  "online",
  "investment",
  "vision",
  "mission",
  "professionalism",
  "integrity",
  "innovation",
  "clientFocus",
  "compliance",
  "MapPin",
  "Phone",
  "Mail",
  "MessageSquare",
  "MessageCircle",
  "Inbox",
  "Send",
  "AtSign",
  "Contact",
  "Headphones",
  "Clock",
  "Calendar",
  "CalendarDays",
  "Globe",
  "Globe2",
  "Map",
  "Navigation",
  "Home",
  "Building",
  "Building2",
  "Landmark",
  "School",
  "GraduationCap",
  "Briefcase",
  "Users",
  "User",
  "UserRound",
  "Handshake",
  "HeartHandshake",
  "HelpCircle",
  "Info",
  "CircleHelp",
  "Zap",
  "Eye",
  "Target",
  "Rocket",
  "TrendingUp",
  "Shield",
  "Lightbulb",
  "BookOpen",
  "Cpu",
  "LineChart",
  "Star",
  "Award",
  "BadgeCheck",
  "Store",
  "Factory",
  "Truck",
  "Package",
  "Wifi",
  "Link",
  "ExternalLink",
  "Share2",
  "Printer",
  "Smartphone",
  "Laptop",
  "Monitor",
  "Video",
  "Mic",
  "Camera",
  "FileText",
  "ClipboardList",
  "PenLine",
  "Languages",
  "Plane",
  "Car",
  "Bus",
  "Train",
  "Anchor",
  "Compass",
  "Flag",
  "Megaphone",
  "Bell",
  "Lock",
  "Key",
  "Settings",
  "Wrench",
  "Hammer",
  "Leaf",
  "Sun",
  "Moon",
  "Cloud",
  "Droplets",
  "Flame",
  "Recycle",
] as const;

function formatIconLabel(name: string) {
  if (name === "location") return "Location";
  if (name === "phone") return "Phone";
  if (name === "mail") return "Email";
  return name.replace(/([a-z])([A-Z])/g, "$1 $2");
}

export default function ContactIconPicker({ value, onChange }: Props) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const selectedValue = typeof value === "string" ? value : "";

  const iconEntries = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return CONTACT_ICON_OPTIONS;
    return CONTACT_ICON_OPTIONS.filter((name) =>
      formatIconLabel(name).toLowerCase().includes(query) ||
      name.toLowerCase().includes(query),
    );
  }, [search]);

  return (
    <div className="admin-icon-picker">
      <button
        type="button"
        className="admin-icon-picker__trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Choose icon"
      >
        <span className="admin-icon-picker__trigger-content">
          {selectedValue ? (
            <SimpleIcon name={selectedValue} className="admin-icon-picker__preview-icon" />
          ) : null}
          {selectedValue ? formatIconLabel(selectedValue) : "Select icon"}
        </span>
        <span className="admin-icon-picker__caret" aria-hidden="true">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div className="admin-icon-picker__panel admin-icon-picker__panel--contact">
          <input
            placeholder="Search icon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-icon-picker__search"
          />

          <div className="admin-icon-picker__grid">
            {iconEntries.map((name) => (
              <button
                key={name}
                type="button"
                className={`admin-icon-picker__item ${selectedValue === name ? "is-selected" : ""}`}
                title={formatIconLabel(name)}
                aria-label={formatIconLabel(name)}
                onClick={() => {
                  onChange(name);
                  setOpen(false);
                }}
              >
                <SimpleIcon name={name} className="admin-icon-picker__preview-icon" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
