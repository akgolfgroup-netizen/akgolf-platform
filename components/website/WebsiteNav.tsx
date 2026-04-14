"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { NAV_LINKS, BOOKING_URL } from "@/lib/website-constants";
import { AKLogo } from "./AKLogo";

export function WebsiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrollY = useScrollPosition();
  const pathname = usePathname();
  const scrolled = scrollY > 60;
  const isHome = pathname === "/";

  // Prevent body scroll when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // On homepage before scroll: transparent with white text
  const isDarkMode = isHome && !scrolled && !mobileOpen;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.06)]"
            : isDarkMode
              ? "bg-transparent"
              : "bg-white/70 backdrop-blur-md"
        }`}
        style={{ height: 48 }}
      >
        <div className="w-container flex h-[48px] items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="AK Golf — Hjem">
            <AKLogo
              variant={isDarkMode ? "inverted" : "black"}
              size={28}
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-[13px] font-medium tracking-wide transition-colors duration-300 py-1 ${
                  pathname === link.href
                    ? isDarkMode ? "text-white" : "text-black"
                    : isDarkMode
                      ? "text-white/70 hover:text-white"
                      : "text-grey-500 hover:text-black"
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.span
                    layoutId="nav-indicator"
                    className={`absolute -bottom-1 left-0 right-0 h-[2px] rounded-full ${isDarkMode ? "bg-white" : "bg-black"}`}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
            <a
              href={BOOKING_URL}
              className="text-[13px] font-medium px-5 py-2 rounded-full bg-accent-cta text-accent-cta-text transition-opacity duration-300 hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cta"
            >
              Book coaching
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-11 h-11 gap-[5px] group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Lukk meny" : "Apne meny"}
          >
            <span
              className={`block h-[1.5px] w-5 transition-[transform,opacity] duration-300 ${isDarkMode ? "bg-white" : "bg-black"} ${
                mobileOpen ? "rotate-45 translate-y-[6.5px] !bg-black" : ""
              }`}
            />
            <span
              className={`block h-[1.5px] w-5 transition-[transform,opacity] duration-300 ${isDarkMode ? "bg-white" : "bg-black"} ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-[1.5px] w-5 transition-[transform,opacity] duration-300 ${isDarkMode ? "bg-white" : "bg-black"} ${
                mobileOpen ? "-rotate-45 -translate-y-[6.5px] !bg-black" : ""
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
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-2xl md:hidden"
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
                        ? "text-black"
                        : "text-grey-400 hover:text-black"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Separator */}
              <div className="w-12 h-px bg-grey-200 mx-auto" />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + NAV_LINKS.length * 0.05, duration: 0.4 }}
              >
                <a
                  href={BOOKING_URL}
                  onClick={() => setMobileOpen(false)}
                  className="text-lg font-semibold px-8 py-4 mt-4 rounded-[980px] bg-black text-white hover:opacity-85 transition-opacity"
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
