// components/IconPicker.tsx
"use client";

import {
  Zap,
  Eye,
  Target,
  Rocket,
  TrendingUp,
  Shield,
  Globe,
  Lightbulb,
  BookOpen,
  Briefcase,
  Users,
  Building2,
  Cpu,
  LineChart,
  Handshake,
  Star,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

type Props = {
  value: unknown;
  onChange: (val: string) => void;
};

export default function IconPicker({ value, onChange }: Props) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const selectedValue = typeof value === "string" ? value : "";
  const ICON_OPTIONS: Array<{ name: string; Icon: LucideIcon }> = [
    { name: "Zap", Icon: Zap },
    { name: "Eye", Icon: Eye },
    { name: "Target", Icon: Target },
    { name: "Rocket", Icon: Rocket },
    { name: "TrendingUp", Icon: TrendingUp },
    { name: "Shield", Icon: Shield },
    { name: "Globe", Icon: Globe },
    { name: "Lightbulb", Icon: Lightbulb },
    { name: "BookOpen", Icon: BookOpen },
    { name: "Briefcase", Icon: Briefcase },
    { name: "Users", Icon: Users },
    { name: "Building2", Icon: Building2 },
    { name: "Cpu", Icon: Cpu },
    { name: "LineChart", Icon: LineChart },
    { name: "Handshake", Icon: Handshake },
    { name: "Star", Icon: Star },
  ];
  const SelectedIcon = ICON_OPTIONS.find((opt) => opt.name === selectedValue)?.Icon;

  const iconEntries = ICON_OPTIONS.filter((option) =>
    option.name.toLowerCase().includes(search.toLowerCase()),
  );

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
          {SelectedIcon ? <SelectedIcon size={16} /> : null}
          {selectedValue || "Select icon"}
        </span>
        <span className="admin-icon-picker__caret" aria-hidden="true">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div className="admin-icon-picker__panel">
          <input
            placeholder="Search icon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-icon-picker__search"
          />

          <div className="admin-icon-picker__grid">
            {iconEntries.map(({ name, Icon }) => (
              <button
                key={name}
                type="button"
                className={`admin-icon-picker__item ${selectedValue === name ? "is-selected" : ""}`}
                title={name}
                aria-label={name}
                onClick={() => {
                  onChange(name);
                  setOpen(false);
                }}
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
