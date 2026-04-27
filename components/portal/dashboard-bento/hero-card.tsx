"use client";

interface HeroStat {
  label: string;
  value: string;
  unit?: string;
}

interface HeroCardProps {
  weekLabel: string;
  statusLabel: string;
  headline: string;
  highlight?: string;
  subline?: string | null;
  stats: HeroStat[];
}

export function HeroCard({
  weekLabel,
  statusLabel,
  headline,
  highlight,
  subline,
  stats,
}: HeroCardProps) {
  return (
    <div
      className="col-span-12 lg:col-span-8 relative overflow-hidden rounded-[22px] p-7 text-white"
      style={{
        background:
          "linear-gradient(135deg, #0A1F18 0%, #0F2E22 60%, #1a3f30 100%)",
        minHeight: "260px",
      }}
    >
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-60px",
          right: "-60px",
          width: "280px",
          height: "280px",
          background:
            "radial-gradient(circle, rgba(209, 248, 67, 0.16), transparent 70%)",
        }}
      />
      <div className="relative z-10">
        <div
          className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: "#D1F843" }}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full animate-pulse"
            style={{
              background: "#D1F843",
              boxShadow: "0 0 8px #D1F843",
            }}
          />
          {weekLabel} · {statusLabel}
        </div>
        <h1 className="mt-4 mb-2.5 text-[32px] font-bold leading-[1.1] tracking-[-0.03em]">
          {headline}
          {highlight ? (
            <>
              {" "}
              <span style={{ color: "#D1F843" }}>{highlight}</span>
            </>
          ) : null}
        </h1>
        {subline ? (
          <p
            className="m-0 max-w-[380px] text-sm leading-[1.55]"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            {subline}
          </p>
        ) : null}
        <div
          className="mt-5 flex gap-8 border-t pt-5"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          {stats.map((s) => (
            <div key={s.label}>
              <div
                className="text-[10px] font-bold uppercase tracking-[0.16em]"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {s.label}
              </div>
              <div
                className="mt-1 text-2xl font-semibold tabular-nums tracking-[-0.02em]"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {s.value}
                {s.unit ? (
                  <span
                    className="ml-1 text-[13px] font-medium"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {s.unit}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
