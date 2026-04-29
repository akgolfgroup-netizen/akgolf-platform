import type { Metadata } from "next";
import { Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import { LandingShell } from "@/components/website-v2/LandingShell";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Ta kontakt med AK Golf Academy. Vi svarer innen 24 timer.",
};

export default function LandingContactPage() {
  return (
    <LandingShell>
      <section className="px-4 pb-16 pt-28 md:px-8 md:pb-24 md:pt-36">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_420px]">
            {/* Left: Contact info */}
            <div>
              <div
                className="mb-3 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em]"
                style={{ color: "var(--color-primary)", fontFamily: "var(--font-jetbrains-mono)" }}
              >
                <span className="h-px w-5" style={{ background: "var(--color-ink)" }} />
                Kontakt
              </div>
              <h1
                className="mb-4 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.025em]"
                style={{ color: "var(--color-ink)", fontFamily: "var(--font-inter-tight)" }}
              >
                Snakker med deg{" "}
                <em
                  className="not-italic"
                  style={{ color: "var(--color-primary)", fontFamily: "var(--font-fraunces)", fontStyle: "italic" }}
                >
                  snart
                </em>
                .
              </h1>
              <p className="mb-10 max-w-md text-base leading-relaxed" style={{ color: "var(--color-ink-muted)" }}>
                Har du spørsmål om coaching, priser eller vil du booke en uforpliktende samtale? Send oss en melding.
              </p>

              <div className="flex flex-col gap-5">
                <ContactRow icon={<Mail className="h-5 w-5" />} label="E-post" value="post@akgolf.no" href="mailto:post@akgolf.no" />
                <ContactRow icon={<Phone className="h-5 w-5" />} label="Telefon" value="+47 909 67 995" href="tel:+4790967995" />
                <ContactRow icon={<MapPin className="h-5 w-5" />} label="Lokasjon" value="Gamle Fredrikstad GK, Kongleveien 142, 1615 Fredrikstad" />
              </div>
            </div>

            {/* Right: Form card */}
            <div
              className="rounded-3xl border p-6 md:p-8"
              style={{
                background: "var(--color-card)",
                borderColor: "var(--color-line)",
                boxShadow: "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
              }}
            >
              <h2 className="mb-6 text-lg font-semibold" style={{ color: "var(--color-ink)", fontFamily: "var(--font-inter-tight)" }}>
                Send melding
              </h2>
              <form className="flex flex-col gap-4" action="mailto:post@akgolf.no" method="post" encType="text/plain">
                <div>
                  <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--color-ink-muted)" }}>
                    Navn
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-primary)]"
                    style={{ background: "var(--color-surface)", borderColor: "var(--color-line)", color: "var(--color-ink)" }}
                    placeholder="Ditt navn"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--color-ink-muted)" }}>
                    E-post
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-primary)]"
                    style={{ background: "var(--color-surface)", borderColor: "var(--color-line)", color: "var(--color-ink)" }}
                    placeholder="din@epost.no"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--color-ink-muted)" }}>
                    Melding
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-primary)]"
                    style={{ background: "var(--color-surface)", borderColor: "var(--color-line)", color: "var(--color-ink)" }}
                    placeholder="Hva lurer du på?"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-all hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(209,248,67,0.35)]"
                  style={{ background: "var(--color-accent)", color: "var(--color-ink)" }}
                >
                  Send melding
                  <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </LandingShell>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-4">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ background: "var(--color-primary-soft)" }}
      >
        <span style={{ color: "var(--color-primary)" }}>{icon}</span>
      </div>
      <div>
        <div className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-ink-subtle)", fontFamily: "var(--font-jetbrains-mono)" }}>
          {label}
        </div>
        <div className="mt-0.5 text-sm font-medium" style={{ color: "var(--color-ink)" }}>
          {value}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="transition-opacity hover:opacity-80">
        {content}
      </a>
    );
  }
  return content;
}
