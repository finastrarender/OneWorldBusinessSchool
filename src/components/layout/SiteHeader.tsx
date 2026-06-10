"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

export type NavItem = { label: string; href: string; active?: boolean };

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader({
  navItems,
}: {
  navItems: NavItem[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const applyParams = new URLSearchParams(searchParams.toString());
  applyParams.set("apply", "1");
  const applyHref = `${pathname}${applyParams.toString() ? `?${applyParams.toString()}` : ""}`;

  const validNavItems = navItems.filter(
    (item): item is { label: string; href: string; active?: boolean } =>
      typeof item?.href === "string" && item.href.trim() !== "" && typeof item?.label === "string" && item.label.trim() !== "",
  );

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" href="/" aria-label="One World home">
          <span className="brand__logo-frame">
            <span className="brand__logo-mark" aria-hidden="true">
              O
            </span>
          </span>
          <span className="brand__wordmark">
            <span className="brand__title">ONE WORLD</span>
          </span>
        </Link>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="site-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="menu-toggle__line"></span>
          <span className="menu-toggle__line"></span>
          <span className="menu-toggle__line"></span>
          <span className="visually-hidden">Toggle navigation</span>
        </button>

        {isMenuOpen && (
          <div 
            className="site-header__overlay" 
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        <nav
          className={`site-nav${isMenuOpen ? " is-open" : ""}`}
          id="site-navigation"
          aria-label="Primary"
        >
          {validNavItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.label}
                className={`site-nav__link${active ? " site-nav__link--active" : ""}`}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link href={applyHref} className="header-button" aria-label="Apply Now">
          Apply Now
        </Link>
      </div>
    </header>
  );
}
