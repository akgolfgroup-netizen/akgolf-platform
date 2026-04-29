"use client";

interface PyramidLevel {
  level: string;
  name: string;
  sub: string;
  hcpRange: string;
  population: number;
}

interface AkPyramidCardProps {
  currentHcp: number | null;
  currentLevel: string;
  levelDescription: string;
  trend90d: number | null;
  hcpToNextLevel: number | null;
  forecast12m: { value: number; ci: number } | null;
}

const LEVELS: PyramidLevel[] = [
  {
    level: "A",
    name: "Tour-spiller",
    sub: "Hovedtour · topp 0,1 %",
    hcpRange: "+5.0 ↓",
    population: 12,
  },
  {
    level: "B",
    name: "Challenge-tour",
    sub: "Scratch · topp 1 %",
    hcpRange: "+2.0 ↓",
    population: 38,
  },
  {
    level: "C",
    name: "Elite amatør",
    sub: "Nordisk · topp 5 %",
    hcpRange: "0–4.0",
    population: 94,
  },
  {
    level: "D",
    name: "Klubbelite",
    sub: "Topp klubb-amatører",
    hcpRange: "4.1–7.5",
    population: 218,
  },
  {
    level: "E",
    name: "Kompetent klubbspiller",
    sub: "Hovedtyngde",
    hcpRange: "7.6–11.0",
    population: 412,
  },
  {
    level: "F",
    name: "Erfaren spiller",
    sub: "Jevn utvikling",
    hcpRange: "11.1–15.0",
    population: 684,
  },
  {
    level: "G",
    name: "Bogey-spiller",
    sub: "Aktive klubbspillere",
    hcpRange: "15.1–20.0",
    population: 540,
  },
  {
    level: "H–K",
    name: "Mosjonist · ny spiller",
    sub: "Opplæring og klubbliv",
    hcpRange: "20.1+",
    population: 820,
  },
];

/**
 * AK-pyramide-kort fra a13-sammenligning.html.
 * Brand Guide V2.0-stil — hvit `bg-card` med uthevet "din rad".
 */
export function AkPyramidCard({
  currentHcp,
  currentLevel,
  levelDescription,
  trend90d,
  hcpToNextLevel,
  forecast12m,
}: AkPyramidCardProps) {
  return (
    <section
      className="col-span-12 rounded-2xl border bg-card p-6 lg:p-7"
      style={{
        borderColor: "var(--color-line, #E4EAE6)",
        boxShadow:
          "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
      }}
    >
      <div className="grid gap-7 lg:grid-cols-2 lg:items-center">
        {/* Pyramide-stigen */}
        <div className="flex flex-col gap-1.5">
          {LEVELS.map((lvl) => {
            const isYou = lvl.level === currentLevel;
            return (
              <div
                key={lvl.level}
                className="grid items-center gap-3 rounded-lg border px-3 py-2.5"
                style={{
                  gridTemplateColumns: "32px 1fr 80px 60px",
                  borderColor: isYou
                    ? "rgba(0, 88, 64, 0.4)"
                    : "var(--color-line-soft, #EDF1EE)",
                  background: isYou
                    ? "var(--color-primary-soft, #E8F0EC)"
                    : "rgba(10, 31, 24, 0.02)",
                  boxShadow: isYou
                    ? "0 0 0 1px rgba(0, 88, 64, 0.15)"
                    : undefined,
                }}
              >
                <div
                  className="grid h-8 w-8 place-items-center rounded-md font-mono text-sm font-bold"
                  style={{
                    background: isYou
                      ? "var(--color-primary, #005840)"
                      : "rgba(10, 31, 24, 0.06)",
                    color: isYou
                      ? "#FFFFFF"
                      : "var(--color-ink-muted, #5C6B62)",
                  }}
                >
                  {lvl.level}
                </div>
                <div>
                  <div
                    className="text-[13px] font-medium"
                    style={{
                      color: isYou
                        ? "var(--color-ink, #0A1F18)"
                        : "var(--color-ink, #0A1F18)",
                      fontWeight: isYou ? 700 : 500,
                    }}
                  >
                    {lvl.name}
                    {isYou ? (
                      <span
                        className="ml-2 rounded-md px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.12em]"
                        style={{
                          background: "var(--color-primary, #005840)",
                          color: "#D1F843",
                        }}
                      >
                        Din posisjon
                      </span>
                    ) : null}
                  </div>
                  <div
                    className="mt-0.5 text-[10.5px] uppercase tracking-[0.04em]"
                    style={{
                      color: "var(--color-ink-subtle, #6F7A74)",
                    }}
                  >
                    {lvl.sub}
                  </div>
                </div>
                <div
                  className="font-mono text-[11px] tabular-nums"
                  style={{ color: "var(--color-ink-muted, #5C6B62)" }}
                >
                  {lvl.hcpRange}
                </div>
                <div
                  className="text-right font-mono text-[11px] tabular-nums"
                  style={{ color: "var(--color-ink-subtle, #6F7A74)" }}
                >
                  {lvl.population}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar-info */}
        <div>
          <h4
            className="text-lg font-bold tracking-[-0.02em]"
            style={{ color: "var(--color-ink, #0A1F18)" }}
          >
            Du er på{" "}
            <span style={{ color: "var(--color-primary, #005840)" }}>
              nivå {currentLevel}.
            </span>
          </h4>
          <p
            className="mt-2 text-sm leading-[1.6]"
            style={{ color: "var(--color-ink-muted, #5C6B62)" }}
          >
            {levelDescription}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <PyramidStat
              label="Din HCP"
              value={currentHcp !== null ? currentHcp.toFixed(1) : "—"}
            />
            <PyramidStat
              label="Til nivå opp"
              value={
                hcpToNextLevel !== null
                  ? `${hcpToNextLevel > 0 ? "−" : ""}${Math.abs(hcpToNextLevel).toFixed(1)}`
                  : "—"
              }
              suffix="HCP"
            />
            <PyramidStat
              label="Trend 90d"
              value={
                trend90d !== null
                  ? `${trend90d > 0 ? "+" : ""}${trend90d.toFixed(1)}`
                  : "—"
              }
              valueColor={
                trend90d !== null && trend90d < 0
                  ? "var(--color-success, #2A7D5A)"
                  : undefined
              }
            />
            <PyramidStat
              label="Prognose 12 mnd"
              value={
                forecast12m
                  ? `${forecast12m.value.toFixed(1)}`
                  : "—"
              }
              suffix={
                forecast12m ? `± ${forecast12m.ci.toFixed(1)}` : undefined
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function PyramidStat({
  label,
  value,
  suffix,
  valueColor,
}: {
  label: string;
  value: string;
  suffix?: string;
  valueColor?: string;
}) {
  return (
    <div
      className="rounded-lg border p-3.5"
      style={{
        borderColor: "var(--color-line-soft, #EDF1EE)",
        background: "rgba(10, 31, 24, 0.02)",
      }}
    >
      <div
        className="font-mono text-[9px] font-bold uppercase tracking-[0.14em]"
        style={{ color: "var(--color-ink-subtle, #6F7A74)" }}
      >
        {label}
      </div>
      <div
        className="mt-1 text-[22px] font-bold leading-none tabular-nums tracking-[-0.02em]"
        style={{
          color: valueColor ?? "var(--color-ink, #0A1F18)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
        {suffix ? (
          <span
            className="ml-1 text-[12px] font-medium"
            style={{ color: "var(--color-ink-subtle, #6F7A74)" }}
          >
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
}
