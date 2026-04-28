import { Calendar, MapPin, MessageCircle, CalendarPlus, Target, User, Phone } from "lucide-react";
import { COLORS } from "./primitives";
import type { PlayerHero } from "./types";

/**
 * Hero — full versjon brukt i d7 (tabs).
 * 240px høy med foto-overlay, avatar, status-pill, HCP-badge og handlinger.
 */
export function Hero360Full({ hero }: { hero: PlayerHero }) {
  const hcpDeltaPos = hero.hcpDelta < 0; // negativ delta = bedring
  return (
    <section
      className="relative overflow-hidden"
      style={{
        height: 240,
        borderRadius: 18,
        background: "linear-gradient(135deg, #0D2E23 0%, #143A2D 100%)",
        border: `1px solid ${COLORS.line}`,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1600')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          opacity: 0.32,
          filter: "saturate(0.9)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,46,35,0.5) 0%, rgba(13,46,35,0.95) 100%)",
        }}
      />
      <div
        className="relative z-[2] flex h-full items-end justify-between gap-6 px-8 py-[26px]"
      >
        <div className="flex items-end gap-[18px]">
          <div
            className="grid place-items-center text-[32px] font-extrabold tracking-[-0.02em]"
            style={{
              width: 92,
              height: 92,
              borderRadius: "50%",
              background: COLORS.accent,
              color: "#0A1F18",
              border: "3px solid #102B1E",
              flexShrink: 0,
            }}
          >
            {hero.initials}
          </div>
          <div className="pb-[4px]">
            <div
              className="mb-[6px] inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: COLORS.accent }}
            >
              <span
                className="inline-block"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: COLORS.accent,
                  boxShadow: `0 0 8px ${COLORS.accent}`,
                }}
              />
              {hero.status}
            </div>
            <h1
              className="m-0 text-[38px] font-medium tracking-[-0.025em] leading-none"
              style={{
                color: "#fff",
                fontFamily: "'Fraunces', 'Inter Tight', serif",
              }}
            >
              {hero.name}
            </h1>
            <div
              className="mt-2 flex gap-[14px] text-[13px]"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              <span className="inline-flex items-center gap-[5px]">
                <MapPin className="h-3 w-3" /> {hero.club}
              </span>
              <span className="inline-flex items-center gap-[5px]">
                <User className="h-3 w-3" /> {hero.age} år
              </span>
              <span className="inline-flex items-center gap-[5px]">
                <Calendar className="h-3 w-3" /> {hero.memberSince}
              </span>
              <span className="inline-flex items-center gap-[5px]">
                <Phone className="h-3 w-3" /> {hero.handle}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-end gap-[10px]">
          <div
            className="text-center"
            style={{
              background: "rgba(209,248,67,0.16)",
              border: "1px solid rgba(209,248,67,0.30)",
              borderRadius: 12,
              padding: "12px 18px",
            }}
          >
            <div
              className="font-mono text-[9px] uppercase tracking-[0.14em]"
              style={{ color: COLORS.accent }}
            >
              HCP
            </div>
            <div
              className="mt-[2px] text-[26px] font-bold tabular-nums tracking-[-0.02em]"
              style={{ color: "#fff" }}
            >
              {hero.hcp.toFixed(1)}
            </div>
            <div
              className="mt-[2px] font-mono text-[10px]"
              style={{ color: hcpDeltaPos ? COLORS.success : COLORS.danger }}
            >
              {hcpDeltaPos ? "↘" : "↗"} {hero.hcpDelta.toFixed(1)} (90d)
            </div>
          </div>
          <div className="flex gap-2 pb-[6px]">
            <HeaderBtn icon={<MessageCircle className="h-3.5 w-3.5" />} label="Melding" />
            <HeaderBtn icon={<CalendarPlus className="h-3.5 w-3.5" />} label="Bok økt" />
            <HeaderBtn icon={<Target className="h-3.5 w-3.5" />} label="Sett mål" accent />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Hero — kompakt versjon brukt i d8 (long page).
 * 64px avatar, 4 mini-stats, photo-fade på høyresiden.
 */
export function Hero360Compact({ hero }: { hero: PlayerHero }) {
  return (
    <section
      className="relative flex items-center gap-[18px] overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(13,46,35,1) 0%, rgba(20,58,45,1) 100%)",
        border: `1px solid ${COLORS.line}`,
        borderRadius: 14,
        padding: "18px 22px",
      }}
    >
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0"
        style={{
          width: 320,
          backgroundImage:
            "url('https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.18,
          maskImage: "linear-gradient(to right, transparent 0%, black 50%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 50%)",
        }}
      />
      <div
        className="relative z-[2] grid place-items-center text-[22px] font-extrabold tracking-[-0.02em]"
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: COLORS.accent,
          color: "#0A1F18",
          flexShrink: 0,
        }}
      >
        {hero.initials}
      </div>
      <div className="relative z-[2]">
        <h1
          className="m-0 text-[28px] font-extrabold tracking-[-0.03em] leading-none"
          style={{ color: "#fff" }}
        >
          {hero.name}
        </h1>
        <div
          className="mt-1 flex gap-[12px] text-[12px]"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          <span><MapPin className="mr-[2px] inline h-2.5 w-2.5 -translate-y-px" />{hero.club}</span>
          <span><User className="mr-[2px] inline h-2.5 w-2.5 -translate-y-px" />{hero.age} år · {hero.status.split("·")[0].trim()}</span>
          <span><Calendar className="mr-[2px] inline h-2.5 w-2.5 -translate-y-px" />{hero.memberSince}</span>
          <span><Target className="mr-[2px] inline h-2.5 w-2.5 -translate-y-px" />{hero.activeGoals} aktive mål</span>
        </div>
      </div>
      <div className="relative z-[2] ml-auto flex gap-2">
        <MiniStat label="HCP" value={hero.hcp.toFixed(1)} highlight />
        <MiniStat label="SG/Runde" value={`+${hero.sgPerRound.toFixed(2)}`} />
        <MiniStat label="30d økter" value={String(hero.sessionsLast30Days)} />
        <MiniStat label="Streak" value={`${hero.streakDays}d`} />
      </div>
    </section>
  );
}

function MiniStat({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="rounded-[10px] px-[12px] py-[8px]"
      style={{
        minWidth: 70,
        background: highlight ? "rgba(209,248,67,0.10)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${highlight ? "rgba(209,248,67,0.30)" : "rgba(255,255,255,0.08)"}`,
      }}
    >
      <div
        className="font-mono text-[8px] uppercase tracking-[0.14em]"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        {label}
      </div>
      <div
        className="mt-[2px] text-[16px] font-bold tabular-nums tracking-[-0.01em]"
        style={{ color: highlight ? COLORS.accent : "#fff" }}
      >
        {value}
      </div>
    </div>
  );
}

function HeaderBtn({
  icon,
  label,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  accent?: boolean;
}) {
  return (
    <button
      className="inline-flex items-center gap-[6px] rounded-[8px] px-[12px] py-[7px] text-[12px] font-medium transition"
      style={{
        background: accent ? COLORS.accent : "rgba(255,255,255,0.08)",
        color: accent ? "#0A1F18" : "#fff",
        border: accent ? "none" : "1px solid rgba(255,255,255,0.10)",
      }}
    >
      {icon} {label}
    </button>
  );
}
