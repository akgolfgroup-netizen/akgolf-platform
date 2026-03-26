"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { NAV_LINKS, BOOKING_URL, PORTAL_URL } from "@/lib/website-constants";
import { AKLogo } from "./AKLogo";

export function WebsiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrollY = useScrollPosition();
  const pathname = usePathname();
  const scrolled = scrollY > 20;
  // Always dark text — hero image is light
  const useDarkText = true;

  // Prevent body scroll when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-surface-warm/90 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.04)]"
            : "bg-white/70 backdrop-blur-md"
        }`}
        style={{ height: 52 }}
      >
        <div className="w-container flex h-[52px] items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="AK Golf — Hjem">
            <AKLogo variant={useDarkText ? "midnight" : "white"} size={28} />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-[13px] font-medium tracking-wide transition-colors duration-300 py-1 ${
                  pathname === link.href
                    ? useDarkText ? "text-ink-90" : "text-white"
                    : useDarkText ? "text-ink-70 hover:text-ink-90" : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gold rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
            <Link
              href={PORTAL_URL}
              className={`text-[13px] font-medium tracking-wide transition-colors duration-300 ${
                useDarkText ? "text-ink-70 hover:text-ink-90" : "text-white/70 hover:text-white"
              }`}
            >
              Logg inn
            </Link>
            <a
              href={BOOKING_URL}
              className="text-[13px] font-medium px-4 py-1.5 rounded-full bg-gold text-white transition-all duration-300 hover:bg-gold-dark w-btn-shimmer"
            >
              Book coaching
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-11 h-11 gap-[5px] group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Lukk meny" : "Apne meny"}
          >
            <span
              className={`block h-[1.5px] w-5 transition-all duration-300 ${useDarkText ? "bg-ink-80" : "bg-white"} ${
                mobileOpen ? "rotate-45 translate-y-[6.5px]" : ""
              }`}
            />
            <span
              className={`block h-[1.5px] w-5 transition-all duration-300 ${useDarkText ? "bg-ink-80" : "bg-white"} ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-[1.5px] w-5 transition-all duration-300 ${useDarkText ? "bg-ink-80" : "bg-white"} ${
                mobileOpen ? "-rotate-45 -translate-y-[6.5px]" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-surface-warm/95 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`font-display text-2xl font-normal tracking-tight transition-colors ${
                      pathname === link.href
                        ? "text-ink-90"
                        : "text-ink-40 hover:text-ink-80"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Separator */}
              <div className="w-12 h-px bg-ink-20 mx-auto" />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + NAV_LINKS.length * 0.05, duration: 0.4 }}
              >
                <Link
                  href={PORTAL_URL}
                  onClick={() => setMobileOpen(false)}
                  className="font-display text-lg font-normal tracking-tight text-ink-50 hover:text-ink-80 transition-colors"
                >
                  Logg inn
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + (NAV_LINKS.length + 1) * 0.05, duration: 0.4 }}
              >
                <a
                  href={BOOKING_URL}
                  onClick={() => setMobileOpen(false)}
                  className="w-btn w-btn-primary w-btn-shimmer text-lg px-8 py-4 mt-4"
                >
                  Book coaching
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
