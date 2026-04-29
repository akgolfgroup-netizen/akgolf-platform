interface BookingHeroProps {
  step: 1 | 2;
}

const STEPS = [
  { n: 1, label: "Velg coach" },
  { n: 2, label: "Tid + betaling" },
] as const;

export function BookingHero({ step }: BookingHeroProps) {
  return (
    <section className="pt-[180px] pb-10">
      <div className="mx-auto max-w-[1200px] px-10">
        <div
          className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--akgolf-primary,#005840)]"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          Booking
        </div>
        <h1
          className="m-0 max-w-[18ch] text-balance text-[clamp(48px,6vw,80px)] font-extrabold leading-[1.0] tracking-[-0.035em] text-[var(--akgolf-ink,#0A1F18)]"
          style={{ fontFamily: "var(--font-inter-tight), Inter, sans-serif" }}
        >
          Velg coach. Velg time.{" "}
          <em
            className="font-medium not-italic text-[var(--akgolf-primary,#005840)]"
            style={{
              fontFamily: "Fraunces, serif",
              fontStyle: "italic",
              letterSpacing: "-0.025em",
            }}
          >
            Du er i gang.
          </em>
        </h1>
        <p className="mt-[18px] max-w-[56ch] text-[17px] leading-[1.5] text-[var(--akgolf-text,#324D45)]">
          Velg coach, og book deretter tid direkte i kalenderen. Du kan flytte timen gratis inntil 12 timer før.
        </p>

        {/* Stepper */}
        <div
          className="mt-8 flex items-center gap-[14px] text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--akgolf-muted,#A5B2AD)]"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          {STEPS.map((s, idx) => (
            <div key={s.n} className="flex items-center gap-[14px]">
              <div className="flex items-center gap-2">
                <div
                  className={`grid h-[22px] w-[22px] place-items-center rounded-full text-[11px] font-bold ${
                    s.n === step
                      ? "bg-[var(--akgolf-ink,#0A1F18)] text-white"
                      : "bg-[var(--akgolf-line-light,#E0E8E5)] text-[var(--akgolf-text,#324D45)]"
                  }`}
                >
                  {s.n}
                </div>
                <span>{s.label}</span>
              </div>
              {idx < STEPS.length - 1 ? (
                <div className="h-px w-9 bg-[var(--akgolf-line-light,#E0E8E5)]" />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
