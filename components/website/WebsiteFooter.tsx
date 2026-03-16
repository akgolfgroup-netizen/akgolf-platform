import Link from "next/link";
import { FOOTER_LINKS } from "@/lib/website-constants";
import { AKLogo } from "./AKLogo";
import { NewsletterSignup } from "./NewsletterSignup";

export function WebsiteFooter() {
  return (
    <footer className="relative bg-ink-100 text-ink-30 overflow-hidden">
      {/* Gold gradient top edge */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* Large brand watermark */}
      <div className="absolute bottom-0 right-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <span className="block font-display text-[20rem] md:text-[28rem] font-normal leading-none text-white/[0.015] translate-x-[15%] translate-y-[25%]">
          AK
        </span>
      </div>

      <div className="w-container relative py-16 md:py-20">
        {/* Newsletter */}
        <div className="pb-12 mb-12 border-b border-ink-80/50">
          <div className="max-w-xl">
            <h3 className="font-display text-lg font-semibold text-white mb-2">
              Hold deg oppdatert
            </h3>
            <p className="text-sm text-ink-40 mb-5">
              Få treningstips og nyheter fra AK Golf rett i innboksen.
            </p>
            <NewsletterSignup />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <AKLogo variant="gold" size={28} />
              <span className="font-display text-sm font-semibold text-white tracking-tight">
                AK Golf Group
              </span>
            </div>
            <p className="text-sm leading-relaxed text-ink-40 max-w-[280px]">
              Premium golfutvikling for ambisiose spillere som krever resultater.
            </p>
          </div>

          {/* Divisions */}
          <div>
            <h4 className="w-meta text-gold mb-5">
              Divisjoner
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.divisions.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-40 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="w-meta text-gold mb-5">
              Selskap
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-40 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="w-meta text-gold mb-5">
              Kontakt
            </h4>
            <ul className="space-y-3 text-sm text-ink-40">
              <li>
                <a
                  href={`mailto:${FOOTER_LINKS.contact.email}`}
                  className="hover:text-white transition-colors duration-300"
                >
                  {FOOTER_LINKS.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${FOOTER_LINKS.contact.phone.replace(/\s/g, "")}`}
                  className="hover:text-white transition-colors duration-300"
                >
                  {FOOTER_LINKS.contact.phone}
                </a>
              </li>
              <li>{FOOTER_LINKS.contact.location}</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-ink-80/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-ink-50">
            &copy; {new Date().getFullYear()} AK Golf Group. Alle rettigheter forbeholdt.
          </p>
          <p className="text-[10px] font-mono uppercase tracking-[0.12em] text-ink-60">
            Crafted with precision
          </p>
        </div>
      </div>
    </footer>
  );
}
