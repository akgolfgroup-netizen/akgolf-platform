import { TrendingUp } from "lucide-react";
import type { ArbeidsflateKpis } from "@/app/admin/(authed)/elever/arbeidsflate-actions";

interface KpiRowProps {
  kpis: ArbeidsflateKpis;
}

/**
 * 4 KPI-kort pa toppen av arbeidsflaten:
 *  1. Aktive spillere — med kapasitet-progress
 *  2. Okter denne uken — med 7-dagers heatmap
 *  3. Fast inntekt MTD — med mal-progress
 *  4. Anbefaling-score (NPS) — i mork accent-stil
 */
export function KpiRow({ kpis }: KpiRowProps) {
  const capacityFilled = Math.min(
    1,
    kpis.activeStudents / kpis.capacity,
  );
  const capacityBars = 6;
  const filledBars = Math.round(capacityFilled * capacityBars);

  const revenueProgress = Math.min(
    100,
    Math.round((kpis.monthlyRevenueKr / kpis.monthlyRevenueGoalKr) * 100),
  );

  const npsBars = 10;
  const npsFilledBars = Math.round((kpis.npsScore / 100) * npsBars);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1: Aktive spillere */}
      <article
        className="rounded-xl p-5 transition cursor-pointer hover:-translate-y-0.5"
        style={{
          background: "#FFFFFF",
          boxShadow:
            "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
          border: "1px solid transparent",
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#8A958E",
            }}
          >
            Aktive spillere
          </span>
          <TrendDelta value={`+${kpis.activeStudentsTrend}`} />
        </div>
        <div
          className="text-[36px] leading-none tracking-tight font-semibold"
          style={{
            color: "#0A1F18",
            fontFamily: "'JetBrains Mono', monospace",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {kpis.activeStudents}
        </div>
        <div
          className="mt-2"
          style={{ fontSize: "11px", color: "#8A958E" }}
        >
          +{kpis.activeStudentsTrend} nye denne måneden
        </div>
        <div className="mt-4 flex items-center gap-1">
          {Array.from({ length: capacityBars }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1.5 rounded"
              style={{
                background:
                  i < filledBars
                    ? "#005840"
                    : i === filledBars && capacityFilled > i / capacityBars
                      ? "rgba(0,88,64,0.6)"
                      : "#EDF1EE",
              }}
            />
          ))}
        </div>
        <div
          className="mt-2 text-right"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            color: "#8A958E",
          }}
        >
          kapasitet {kpis.capacity}
        </div>
      </article>

      {/* KPI 2: Økter / uke */}
      <article
        className="rounded-xl p-5 transition cursor-pointer hover:-translate-y-0.5"
        style={{
          background: "#FFFFFF",
          boxShadow:
            "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
          border: "1px solid transparent",
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#8A958E",
            }}
          >
            Økter / uke
          </span>
          <TrendDelta value={`${kpis.weeklySessionsTrendPct >= 0 ? "+" : ""}${kpis.weeklySessionsTrendPct}%`} />
        </div>
        <div
          className="text-[36px] leading-none tracking-tight font-semibold"
          style={{
            color: "#0A1F18",
            fontFamily: "'JetBrains Mono', monospace",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {kpis.weeklySessions}
        </div>
        <div className="mt-2" style={{ fontSize: "11px", color: "#8A958E" }}>
          {kpis.weeklyHoursLabel}
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1">
          {["M", "T", "O", "T", "F", "L", "S"].map((d, i) => (
            <div
              key={i}
              className="h-5 rounded"
              style={{
                background: i < 5 ? "#005840" : i === 5 ? "rgba(0,88,64,0.4)" : "#EDF1EE",
              }}
            />
          ))}
        </div>
        <div
          className="mt-2 grid grid-cols-7 gap-1 text-center"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "9px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#8A958E",
          }}
        >
          {["M", "T", "O", "T", "F", "L", "S"].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
      </article>

      {/* KPI 3: Fast inntekt */}
      <article
        className="rounded-xl p-5 transition cursor-pointer hover:-translate-y-0.5"
        style={{
          background: "#FFFFFF",
          boxShadow:
            "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
          border: "1px solid transparent",
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#8A958E",
            }}
          >
            Fast inntekt
          </span>
          <TrendDelta value={`${kpis.monthlyRevenueTrendPct >= 0 ? "+" : ""}${kpis.monthlyRevenueTrendPct}%`} />
        </div>
        <div
          className="text-[36px] leading-none tracking-tight font-semibold"
          style={{
            color: "#0A1F18",
            fontFamily: "'JetBrains Mono', monospace",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.round(kpis.monthlyRevenueKr / 1000)}
          <span
            className="text-[18px] font-medium"
            style={{ color: "#8A958E" }}
          >
            {" "}
            kr
          </span>
        </div>
        <div className="mt-2" style={{ fontSize: "11px", color: "#8A958E" }}>
          {Math.round(kpis.monthlyRevenueKr).toLocaleString("nb-NO")} kr · MTD
        </div>
        <div
          className="mt-4 h-1.5 rounded-full overflow-hidden"
          style={{ background: "#EDF1EE" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              background: "#005840",
              width: `${revenueProgress}%`,
            }}
          />
        </div>
        <div
          className="mt-2 flex justify-between"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            color: "#8A958E",
          }}
        >
          <span>
            mål {kpis.monthlyRevenueGoalKr.toLocaleString("nb-NO")}
          </span>
          <span>{revenueProgress}%</span>
        </div>
      </article>

      {/* KPI 4: Anbefaling-score (mork accent) */}
      <article
        className="rounded-xl p-5 cursor-pointer relative overflow-hidden border transition"
        style={{
          background: "#0F1F18",
          color: "#FFFFFF",
          borderColor: "#1F3329",
        }}
      >
        <div
          className="absolute -right-10 -top-10 w-36 h-36 rounded-full blur-3xl"
          style={{ background: "rgba(209,248,67,0.15)" }}
        />
        <div className="flex items-start justify-between mb-3 relative">
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#A4B1AA",
            }}
          >
            Anbefaling-score
          </span>
          <TrendDelta value={`+${kpis.npsTrend}`} dark />
        </div>
        <div
          className="text-[36px] leading-none tracking-tight font-semibold relative"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <span style={{ color: "#D1F843" }}>{kpis.npsScore}</span>
          <span
            className="text-[18px] font-medium"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            {" "}
            / 100
          </span>
        </div>
        <div
          className="mt-2 relative"
          style={{ fontSize: "11px", color: "#A4B1AA" }}
        >
          {kpis.npsResponses} svar siste 30 dager
        </div>
        <div className="mt-4 flex gap-1 relative">
          {Array.from({ length: npsBars }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1.5 rounded"
              style={{
                background: i < npsFilledBars ? "#D1F843" : "rgba(209,248,67,0.30)",
              }}
            />
          ))}
        </div>
        <div
          className="mt-2 text-right relative"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            color: "#A4B1AA",
          }}
        >
          over 70 = verdensklasse
        </div>
      </article>
    </section>
  );
}

function TrendDelta({ value, dark }: { value: string; dark?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded"
      style={{
        background: dark ? "rgba(209,248,67,0.15)" : "#E0EFE7",
        color: dark ? "#D1F843" : "#2A7D5A",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "10px",
      }}
    >
      <TrendingUp className="w-3 h-3" />
      {value}
    </span>
  );
}
