import { JUNIOR_GFGK_V2, JUNIOR_WANG_V2 } from "@/lib/website-constants";

const PARTNERS = [JUNIOR_GFGK_V2, JUNIOR_WANG_V2];

export function JuniorPartnerSection() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-10 max-w-xl">
          <div
            className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{
              color: "var(--color-primary)",
              fontFamily: "var(--font-jetbrains-mono)",
            }}
          >
            Samarbeidspartnere
          </div>
          <h2
            className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.025em]"
            style={{
              color: "var(--color-ink)",
              fontFamily: "var(--font-inter-tight)",
            }}
          >
            I tett samarbeid med klubb og skole.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {PARTNERS.map((partner) => (
            <article
              key={partner.heading}
              className="rounded-2xl border p-6"
              style={{
                background: "var(--color-card)",
                borderColor: "var(--color-line)",
                boxShadow:
                  "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
              }}
            >
              <div
                className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em]"
                style={{
                  color: "var(--color-primary)",
                  fontFamily: "var(--font-jetbrains-mono)",
                }}
              >
                {partner.label}
              </div>
              <h3
                className="mb-3 text-xl font-semibold"
                style={{
                  color: "var(--color-ink)",
                  fontFamily: "var(--font-inter-tight)",
                }}
              >
                {partner.heading}
              </h3>
              <p
                className="text-sm leading-relaxed whitespace-pre-line"
                style={{ color: "var(--color-ink-muted)" }}
              >
                {partner.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
