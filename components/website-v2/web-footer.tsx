import Link from "next/link";
import { Instagram, Facebook, Youtube, Linkedin } from "lucide-react";

const SECTIONS = [
  {
    title: "Tjenester",
    links: [
      { label: "Academy", href: "/academy?v=2" },
      { label: "Booking & priser", href: "/pricing?v=2" },
      { label: "Klubber & baner", href: "/?v=2" },
    ],
  },
  {
    title: "Selskapet",
    links: [
      { label: "Om oss", href: "/?v=2" },
      { label: "Coacher", href: "/?v=2" },
      { label: "Karriere", href: "/?v=2" },
      { label: "Presse", href: "/?v=2" },
    ],
  },
  {
    title: "Hjelp",
    links: [
      { label: "Kontakt", href: "/kontakt?v=2" },
      { label: "FAQ", href: "/?v=2" },
      { label: "Personvern", href: "/personvern?v=2" },
      { label: "Vilkår", href: "/?v=2" },
    ],
  },
];

const SOCIALS = [
  { Icon: Instagram, href: "https://www.instagram.com/akgolfacademy/", label: "Instagram" },
  { Icon: Facebook, href: "https://www.facebook.com/akgolfacademy", label: "Facebook" },
  { Icon: Youtube, href: "https://www.youtube.com/@akgolfacademy", label: "YouTube" },
  { Icon: Linkedin, href: "https://www.linkedin.com/company/ak-golf-group/", label: "LinkedIn" },
];

export function WebFooter() {
  return (
    <footer
      className="pt-20 pb-10 text-white/65"
      style={{ background: "var(--akgolf-ink, #0A1F18)" }}
    >
      <div className="mx-auto max-w-[1280px] px-10">
        <div className="grid gap-15 border-b border-white/10 pb-15 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div
              className="flex items-center gap-2.5 text-[18px] font-extrabold tracking-[-0.02em] text-white"
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
            </div>
            <p className="mt-3.5 max-w-[32ch] text-sm leading-[1.6] text-white/55">
              Coaching, akademi og bane. Bærum · Holtsmark · Pinx. Personlige
              coacher og PlayerHQ-app.
            </p>
          </div>
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h4
                className="mb-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-white"
                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
              >
                {s.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {s.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/65 transition-colors hover:text-[var(--akgolf-accent,#D1F843)]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="flex items-center justify-between pt-7 text-[11px] uppercase tracking-[0.10em] text-white/45"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          <span>© 2026 AK Golf Group AS · ORG 925 884 102</span>
          <div className="flex gap-3">
            {SOCIALS.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="grid h-8 w-8 place-items-center rounded-full bg-white/[0.06] text-white/70 transition-all hover:bg-[var(--akgolf-accent,#D1F843)] hover:text-[#0A1F18]"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
