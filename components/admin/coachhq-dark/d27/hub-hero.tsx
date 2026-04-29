import { format } from "date-fns";
import { nb } from "date-fns/locale";
import type { HubStats } from "@/app/admin/(authed)/hub/hub-actions";

interface HubHeroProps {
  userName: string;
  stats: HubStats;
  /** Kontekst-setning under heading. Generert fra modul-tellere. */
  contextLine: string;
}

/**
 * Hub-hero med greeting + 4 stat-kort (mockup d27).
 * Mork gradient + lime accent-border for fremheving.
 */
export function HubHero({ userName, stats, contextLine }: HubHeroProps) {
  const now = new Date();
  const dateLabel = format(now, "EEEE d. MMMM · HH:mm", { locale: nb }).toUpperCase();
  const isMorning = now.getHours() < 12;
  const isAfternoon = now.getHours() < 18;
  const greeting = isMorning ? "God morgen" : isAfternoon ? "God dag" : "God kveld";

  return (
    <section
      className="rounded-2xl p-7 grid items-center gap-7 md:grid-cols-[1.4fr_1fr]"
      style={{
        background:
          "linear-gradient(160deg, rgba(209,248,67,0.08), rgba(13,46,35,0)), #0D2E23",
        border: "1.5px solid rgba(209,248,67,0.25)",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "9px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#D1F843",
            fontWeight: 700,
          }}
        >
          / HUB · {dateLabel}
        </div>
        <h2
          className="mt-1.5 text-[28px] md:text-[30px] font-extrabold tracking-[-0.025em]"
          style={{ color: "#FFFFFF" }}
        >
          {greeting}, {userName}.{" "}
          <em className="not-italic" style={{ color: "#D1F843" }}>
            Tett dag foran deg.
          </em>
        </h2>
        <p
          className="mt-3.5 text-[14px] leading-[1.6] max-w-[55ch]"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          {contextLine}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Spillere · aktive" value={stats.activeStudents} />
        <StatCard label="Økter · denne uka" value={stats.weeklySessionsCount} />
        <StatCard label="Belegg" value={stats.utilizationPct} suffix="%" />
        <StatCard label="Inntekt · md" value={stats.mtdRevenueK} suffix="k" />
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div
      className="rounded-xl px-4 py-3.5"
      style={{ background: "rgba(0,0,0,0.20)" }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "9px",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.5)",
          fontWeight: 700,
        }}
      >
        {label}
      </div>
      <div
        className="mt-1.5 text-[22px] font-extrabold leading-none tracking-[-0.02em]"
        style={{ color: "#FFFFFF", fontVariantNumeric: "tabular-nums" }}
      >
        {value}
        {suffix ? (
          <span
            className="ml-0.5 text-[12px] font-medium"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
}
