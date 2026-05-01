"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { AKLogo } from "@/components/website/AKLogo";
import { useMCSidebar } from "./mc-layout";

/**
 * Mobil-header for CoachHQ (legacy MCLayout-ruter).
 *
 * Vises kun pa mobil/tablet (< lg breakpoint = 1024px). Sidebar i CoachHQ
 * er `hidden lg:flex`, sa uten denne headeren har mobil-brukere ingen
 * mate a navigere admin-flaten.
 *
 * Hamburger-knapp togglar `useMCSidebar()`-state — drawer rendres separat
 * fra sidebaren selv (kommer i neste iterasjon hvis behov).
 */
export function CoachHQMobileHeader() {
  const { toggle } = useMCSidebar();

  return (
    <header
      className="fixed top-0 left-0 right-0 h-14 z-30 flex items-center justify-between px-4 lg:hidden backdrop-blur-sm border-b"
      style={{
        background: "rgba(15, 31, 24, 0.95)",
        borderColor: "#1F3329",
      }}
    >
      {/* Logo venstre */}
      <Link href="/admin" className="flex items-center gap-2">
        <AKLogo variant="inverted" size={24} />
        <span
          className="text-sm font-bold"
          style={{ color: "#FFFFFF", fontFamily: "var(--font-inter-tight), sans-serif" }}
        >
          CoachHQ
        </span>
      </Link>

      {/* Hamburger-knapp */}
      <button
        onClick={toggle}
        className="p-2 rounded-lg transition-colors cursor-pointer"
        style={{ color: "#A4B1AA" }}
        aria-label="Meny"
      >
        <Menu className="w-5 h-5" />
      </button>
    </header>
  );
}
