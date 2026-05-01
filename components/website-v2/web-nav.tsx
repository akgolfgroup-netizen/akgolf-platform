"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

interface WebNavProps {
  active?: "home" | "academy" | "junior" | "pricing" | "course" | "about";
}

const NAV_ITEMS: { key: NonNullable<WebNavProps["active"]>; label: string; href: string }[] = [
  { key: "home", label: "Hjem", href: "/?v=2" },
  { key: "academy", label: "Academy", href: "/academy?v=2" },
  { key: "pricing", label: "Priser", href: "/pricing?v=2" },
  { key: "course", label: "Bane", href: "/?v=2" },
  { key: "about", label: "Om oss", href: "/?v=2" },
];

export function WebNav({ active = "home" }: WebNavProps) {
  const [solid, setSolid] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-[100] transition-all duration-300 ${
        solid
          ? "bg-white/90 shadow-[0_1px_0_rgba(10,31,24,0.06)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center gap-9 px-4 sm:px-6 lg:px-10 py-3 lg:py-[18px]">
        <Link
          href="/?v=2"
          className={`flex items-center gap-2.5 text-[18px] font-extrabold tracking-[-0.02em] ${
            solid ? "text-[var(--akgolf-ink,#0A1F18)]" : "text-white"
          }`}
          style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
        >
          <span
            className="grid h-8 w-8 place-items-center rounded-lg text-[13px] font-extrabold tracking-[-0.04em]"
            style={{
              background: "var(--akgolf-accent, #D1F843)",
              color: "#0A1F18",
            }}
          >
            AK
          </span>
          AK Golf
        </Link>

        <div className="ml-auto hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = item.key === active;
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`text-sm transition-colors ${
                  isActive
                    ? solid
                      ? "font-bold text-[var(--akgolf-ink,#0A1F18)]"
                      : "font-semibold text-white"
                    : solid
                      ? "font-medium text-[var(--akgolf-text,#324D45)] hover:text-[var(--akgolf-ink,#0A1F18)]"
                      : "font-medium text-white/85 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <Link
          href="/portal/login"
          className={`hidden text-[13px] font-medium md:inline-flex ${
            solid ? "text-[var(--akgolf-text,#324D45)]" : "text-white/85"
          }`}
        >
          Logg inn
        </Link>

        <Link
          href="/booking-v2?v=2"
          className="hidden md:inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-bold tracking-[-0.005em] transition-all hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(209,248,67,0.35)]"
          style={{ background: "var(--akgolf-accent, #D1F843)", color: "#0A1F18" }}
        >
          Bli medlem
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden ml-auto p-2 rounded-lg transition-colors min-h-11 min-w-11 flex items-center justify-center ${
            solid ? "text-[var(--akgolf-ink,#0A1F18)] hover:bg-black/5" : "text-white hover:bg-white/10"
          }`}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-t px-4 py-4 space-y-3 ${
          solid ? "bg-white border-black/5" : "bg-[#0A1F18]/95 border-white/10 backdrop-blur-xl"
        }`}>
          {NAV_ITEMS.map((item) => {
            const isActive = item.key === active;
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-sm font-medium ${
                  isActive
                    ? solid
                      ? "font-bold text-[var(--akgolf-ink,#0A1F18)] border-l-2 border-[var(--akgolf-accent,#D1F843)] pl-3"
                      : "font-semibold text-white border-l-2 border-[var(--akgolf-accent,#D1F843)] pl-3"
                    : solid
                      ? "text-[var(--akgolf-text,#324D45)] hover:text-[var(--akgolf-ink,#0A1F18)]"
                      : "text-white/70 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className={`pt-3 space-y-3 ${solid ? "border-t border-black/10" : "border-t border-white/10"}`}>
            <Link
              href="/portal/login"
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 text-sm font-medium ${
                solid ? "text-[var(--akgolf-text,#324D45)]" : "text-white/70"
              }`}
            >
              Logg inn
            </Link>
            <Link
              href="/booking-v2?v=2"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center rounded-full px-4 py-3 text-[13px] font-bold"
              style={{ background: "var(--akgolf-accent, #D1F843)", color: "#0A1F18" }}
            >
              Bli medlem
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
