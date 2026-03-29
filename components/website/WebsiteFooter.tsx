import Link from "next/link";
import { FOOTER_LINKS } from "@/lib/website-constants";
import { AKLogo } from "./AKLogo";
import { NewsletterSignup } from "./NewsletterSignup";

export function WebsiteFooter() {
  return (
    <footer className="relative bg-grey-100 text-grey-600 overflow-hidden">
      {/* Subtle top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-grey-200" />

      <div className="w-container relative py-10 md:py-16">
        {/* Newsletter — compact on mobile */}
        <div className="pb-8 mb-8 border-b border-grey-200">
          <h3 className="font-display text-base font-semibold text-black mb-1">
            Hold deg oppdatert
          </h3>
          <p className="text-xs text-grey-500 mb-3">
            Treningstips og nyheter rett i innboksen.
          </p>
          <NewsletterSignup />
        </div>

        {/* Links grid — 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <AKLogo variant="black" size={24} />
              <span className="font-display text-sm font-semibold text-black tracking-tight">
                AK Golf
              </span>
            </div>
            <p className="text-xs leading-relaxed text-grey-500 max-w-[240px] mb-4">
              Premium golfcoaching for ambisiøse spillere.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {FOOTER_LINKS.social.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-grey-200 text-grey-500 hover:bg-black hover:text-white transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon === "instagram" && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="18" cy="6" r="1.5" fill="currentColor" stroke="none" />
                    </svg>
                  )}
                  {social.icon === "facebook" && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  )}
                  {social.icon === "linkedin" && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Tjenester */}
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-grey-400 mb-3">
              Tjenester
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.divisions.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-grey-500 hover:text-black transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Selskap */}
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-grey-400 mb-3">
              Selskap
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-grey-500 hover:text-black transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-grey-400 mb-3">
              Kontakt
            </h4>
            <ul className="space-y-2 text-xs text-grey-500">
              <li>
                <a
                  href={`mailto:${FOOTER_LINKS.contact.email}`}
                  className="hover:text-black transition-colors"
                >
                  {FOOTER_LINKS.contact.email}
                </a>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="hover:text-black transition-colors"
                >
                  Send oss en melding
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-grey-200 flex justify-between items-center">
          <p className="text-[10px] text-grey-400">
            &copy; {new Date().getFullYear()} AK Golf Group
          </p>
        </div>
      </div>
    </footer>
  );
}
