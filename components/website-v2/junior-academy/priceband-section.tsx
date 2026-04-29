import { JUNIOR_PRICEBAND_V3 } from "@/lib/website-constants";

export function JuniorPricebandSection() {
  const s = JUNIOR_PRICEBAND_V3;
  if (s.prices.length === 0 && !s.title) return null;
  return (
    <section
      className="px-10 py-[60px]"
      style={{
        background: "var(--akgolf-accent, #D1F843)",
        color: "var(--akgolf-ink, #0A1F18)",
      }}
    >
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <h3
            className="mb-1.5 text-[28px] font-extrabold tracking-[-0.025em]"
            style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            {s.title}
          </h3>
          <p className="text-[14px] text-[rgba(10,31,24,0.7)]">
            {s.description}
          </p>
        </div>
        {s.prices.map((p) => (
          <div key={p.l} className="flex flex-col gap-0.5">
            <div
              className="text-[26px] font-extrabold tracking-[-0.025em] tabular-nums"
              style={{
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {p.v}
            </div>
            <div
              className="text-[10px] font-bold uppercase tracking-[0.12em]"
              style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
            >
              {p.l}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
