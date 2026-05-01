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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lukk meny ved navigasjon (route change)
  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-[100] flex items-center gap-4 md:gap-9 transition-all duration-300 ${
          solid
            ? "bg-white/90 px-4 sm:px-6 md:px-10 py-3 shadow-[0_1px_0_rgba(10,31,24,0.06)] backdrop-blur-xl"
            : "bg-transparent px-4 sm:px-6 md:px-10 py-[18px]"
        }`}
      >
        <Link
          href="/?v=2"
          className={`flex items-center gap-2.5 text-[18px] font-extrabold tracking-[-0.02em] ${
            solid ? "text-[var(--akgolf-ink,#0A1F18)]" : "text-white"
          }`}
          style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
          onClick={() => setMenuOpen(false)}
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

        {/* Desktop nav */}
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

        {/* Logg inn-link (desktop) */}
        <Link
          href="/portal/login"
          className={`hidden text-[13px] font-medium md:inline-flex ${
            solid ? "text-[var(--akgolf-text,#324D45)]" : "text-white/85"
          }`}
        >
          Logg inn
        </Link>

        {/* CTA "Bli medlem" — bade desktop og mobil */}
        <Link
          href="/booking-v2?v=2"
          className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-2 sm:px-4 sm:py-2.5 text-[12px] sm:text-[13px] font-bold tracking-[-0.005em] transition-all hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(209,248,67,0.35)] md:ml-0"
          style={{ background: "var(--akgolf-accent, #D1F843)", color: "#0A1F18" }}
        >
          Bli medlem
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
        </Link>

        {/* Hamburger-knapp — kun mobil */}
        <button
          type="button"
          aria-label={menuOpen ? "Lukk meny" : "Apne meny"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className={`md:hidden inline-flex items-center justify-center rounded-lg p-2 transition-colors ${
            solid ? "text-[var(--akgolf-ink,#0A1F18)] hover:bg-black/5" : "text-white hover:bg-white/10"
          }`}
        >
          {menuOpen ? (
            <X className="h-6 w-6" strokeWidth={2.2} />
          ) : (
            <Menu className="h-6 w-6" strokeWidth={2.2} />
          )}
        </button>
      </nav>

      {/* Mobil-drawer-overlay */}
      {menuOpen ? (
        <div className="fixed inset-0 z-[99] md:hidden">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Lukk meny"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0"
            style={{ background: "rgba(10,31,24,0.92)", backdropFilter: "blur(8px)" }}
          />
          {/* Innhold */}
          <div
            className="relative flex h-full flex-col items-center justify-center gap-6 px-6 pt-24 pb-12"
            style={{ color: "white" }}
          >
            <ul className="flex flex-col items-center gap-5">
              {NAV_ITEMS.map((item) => {
                const isActive = item.key === active;
                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={`block text-[28px] font-bold tracking-[-0.02em] transition-colors ${
                        isActive ? "text-[var(--akgolf-accent,#D1F843)]" : "text-white hover:text-[var(--akgolf-accent,#D1F843)]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 flex w-full max-w-[280px] flex-col items-stretch gap-3">
              <Link
                href="/portal/login"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:border-white hover:bg-white/5"
              >
                Logg inn
              </Link>
              <Link
                href="/booking-v2?v=2"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-3 text-[14px] font-bold tracking-[-0.005em]"
                style={{ background: "var(--akgolf-accent, #D1F843)", color: "#0A1F18" }}
              >
                Bli medlem
                <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
