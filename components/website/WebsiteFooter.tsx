import Link from "next/link";
import { FOOTER_LINKS } from "@/lib/website-constants";
import { AKLogo } from "./AKLogo";
import { NewsletterSignup } from "./NewsletterSignup";

export function WebsiteFooter() {
  return (
    <footer className="relative bg-ink-100 text-ink-30 overflow-hidden">
      {/* Gold gradient top edge */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="w-container relative py-10 md:py-16">
        {/* Newsletter — compact on mobile */}
        <div className="pb-8 mb-8 border-b border-ink-80/50">
          <h3 className="font-display text-base font-semibold text-white mb-1">
            Hold deg oppdatert
          </h3>
          <p className="text-xs text-ink-40 mb-3">
            Treningstips og nyheter rett i innboksen.
          </p>
          <NewsletterSignup />
        </div>

        {/* Links grid — 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <AKLogo variant="gold" size={24} />
              <span className="font-display text-sm font-semibold text-white tracking-tight">
                AK Golf
              </span>
            </div>
            <p className="text-xs leading-relaxed text-ink-40 max-w-[240px]">
              Premium golfcoaching for ambisiøse spillere.
            </p>
          </div>

          {/* Tjenester */}
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-gold mb-3">
              Tjenester
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.divisions.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-ink-40 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Selskap */}
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-gold mb-3">
              Selskap
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-ink-40 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-gold mb-3">
              Kontakt
            </h4>
            <ul className="space-y-2 text-xs text-ink-40">
              <li>
                <a
                  href={`mailto:${FOOTER_LINKS.contact.email}`}
                  className="hover:text-white transition-colors"
                >
                  {FOOTER_LINKS.contact.email}
                </a>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="hover:text-white transition-colors"
                >
                  Send oss en melding
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-ink-80/50 flex justify-between items-center">
          <p className="text-[10px] text-ink-50">
            &copy; {new Date().getFullYear()} AK Golf Group
          </p>
        </div>
      </div>
    </footer>
  );
}
