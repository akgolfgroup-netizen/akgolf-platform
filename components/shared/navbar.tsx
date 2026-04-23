"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Hjem", href: "/" },
  { label: "Pakker", href: "/landing/pricing" },
  { label: "Om oss", href: "/landing/about" },
  { label: "Kontakt", href: "/landing/contact" },
];

interface NavbarProps {
  variant?: "light" | "dark";
  showCTA?: boolean;
}

export function Navbar({ variant = "light", showCTA = true }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-300 ${
        variant === "light" 
          ? "bg-[grey-50]/80 border-b border-[black]/5" 
          : "bg-[black]/90 border-b border-white/10"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Logo 
            variant={variant === "light" ? "dark" : "light"} 
            size="md" 
          />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium uppercase tracking-wider text-sm transition-colors pb-1 ${
                  isActive(item.href)
                    ? variant === "light"
                      ? "text-[black] border-b-2 border-[accent-cta]"
                      : "text-surface border-b-2 border-[accent-cta]"
                    : variant === "light"
                      ? "text-[black]/70 hover:text-[black]"
                      : "text-surface/70 hover:text-surface"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          {showCTA && (
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/portal/login"
                className={`font-medium uppercase tracking-wider text-sm transition-colors ${
                  variant === "light" 
                    ? "text-[black]/70 hover:text-[black]" 
                    : "text-surface/70 hover:text-surface"
                }`}
              >
                Logg inn
              </Link>
              <Link
                href="/booking"
                className="bg-[accent-cta] text-[black] px-6 py-2.5 rounded-lg font-medium uppercase tracking-wider text-sm hover:opacity-90 transition-all scale-95 active:scale-90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
              >
                Book nå
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              variant === "light" 
                ? "text-[black] hover:bg-[black]/5" 
                : "text-surface hover:bg-surface-container-lowest/10"
            }`}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                 
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                 
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          className={`md:hidden border-t ${
            variant === "light" 
              ? "bg-[grey-50] border-[black]/5" 
              : "bg-[black] border-white/10"
          }`}
        >
          <div className="px-6 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 font-medium uppercase tracking-wider text-sm ${
                  isActive(item.href)
                    ? variant === "light"
                      ? "text-[black] border-l-2 border-[accent-cta] pl-3"
                      : "text-surface border-l-2 border-[accent-cta] pl-3"
                    : variant === "light"
                      ? "text-[black]/70 hover:text-[black]"
                      : "text-surface/70 hover:text-surface"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {showCTA && (
              <div className="pt-3 border-t border-[black]/10 space-y-3">
                <Link
                  href="/portal/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 font-medium uppercase tracking-wider text-sm ${
                    variant === "light" 
                      ? "text-[black]/70" 
                      : "text-surface/70"
                  }`}
                >
                  Logg inn
                </Link>
                <Link
                  href="/booking"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-[accent-cta] text-[black] px-6 py-3 rounded-lg font-medium uppercase tracking-wider text-sm"
                >
                  Book nå
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
