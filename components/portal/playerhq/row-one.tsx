"use client";

import Image from "next/image";
import { Icon } from "@/components/ui/icon";

interface ProfileCardProps {
  name: string | null;
  role: string;
  handicap: number | null;
  avatarUrl?: string | null;
}

export function ProfileCard({ name, role, handicap, avatarUrl }: ProfileCardProps) {
  return (
    <div className="relative h-[320px] overflow-hidden rounded-[20px] border border-outline-variant bg-surface-container">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={name ?? "Spiller"}
          fill
          sizes="(max-width: 1240px) 30vw, 300px"
          className="object-cover object-[50%_18%]"
          style={{ filter: "saturate(1.05) contrast(1.02)" }}
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background:
              "linear-gradient(180deg, var(--color-primary-container) 0%, var(--color-primary) 100%)",
          }}
        >
          <span className="text-7xl font-bold text-on-primary opacity-60">
            {(name?.[0] ?? "S").toUpperCase()}
          </span>
        </div>
      )}
      <div
        className="absolute inset-x-0 bottom-0 h-[52%]"
        style={{
          background:
            "linear-gradient(180deg, rgba(28,28,22,0) 0%, rgba(28,28,22,0.55) 55%, rgba(28,28,22,0.85) 100%)",
        }}
      />
      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-2.5">
        <div>
          <div className="text-[18px] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
            {name ?? "Spiller"}
          </div>
          <div className="mt-1 text-[11px] text-white/70">{role}</div>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[12px] font-semibold text-on-surface">
          <span className="text-[10px] font-medium text-on-surface-variant">HCP</span>
          {handicap != null ? (handicap >= 0 ? `+${handicap.toFixed(1)}` : handicap.toFixed(1)) : "—"}
        </div>
      </div>
    </div>
  );
}

interface ProgressCardProps {
  weeklyHours: number;
  bars: { d: string; v: number; peak?: boolean; peakLabel?: string }[];
}

export function ProgressCard({ weeklyHours, bars }: ProgressCardProps) {
  const whole = Math.floor(weeklyHours);
  const frac = weeklyHours - whole;
  return (
    <div className="flex h-[320px] flex-col rounded-[20px] border border-outline-variant bg-surface-container p-[22px]">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[15px] font-semibold tracking-[-0.01em] text-on-surface">Fremdrift</div>
          <div className="mt-3.5 flex items-baseline gap-2">
            <span
              className="text-[46px] font-medium leading-none tabular-nums text-on-surface"
              style={{ letterSpacing: "-0.03em" }}
            >
              {whole}
              {frac > 0 && <span className="text-[28px] font-medium">.{Math.round(frac * 10)}</span>}
              <span className="text-[28px] font-medium">t</span>
            </span>
            <span className="pb-0.5 text-[11px] leading-[1.25] text-on-surface-variant">
              Treningstid
              <br />
              denne uken
            </span>
          </div>
        </div>
        <button className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-full border border-outline-variant bg-transparent">
          <Icon name="arrow_outward" size={14} className="text-on-surface" />
        </button>
      </div>

      <div
        className="relative grid flex-1 items-end gap-2.5 pt-4"
        style={{ gridTemplateColumns: `repeat(${bars.length}, 1fr)` }}
      >
        {bars.map((b, i) => (
          <div key={i} className="relative flex flex-col items-center gap-2">
            {b.peak && b.peakLabel && (
              <span
                className="absolute -top-1 inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold"
                style={{
                  background: "var(--color-secondary-fixed)",
                  color: "var(--color-on-secondary-fixed)",
                  transform: "translateY(-100%)",
                }}
              >
                <Icon name="local_fire_department" size={11} />
                {b.peakLabel}
              </span>
            )}
            <div
              className="rounded-full"
              style={{
                width: b.peak ? 20 : 6,
                height: `${b.v * 140}px`,
                background: b.peak ? "var(--color-secondary-fixed)" : "var(--color-on-surface)",
              }}
            />
            <span className="text-[10px] font-medium text-on-surface-variant">{b.d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface TimeTrackerCardProps {
  doneMinutes: number;
  planMinutes: number;
  label?: string;
}

export function TimeTrackerCard({ doneMinutes, planMinutes, label = "Dagens trening" }: TimeTrackerCardProps) {
  const pct = planMinutes > 0 ? Math.min(1, doneMinutes / planMinutes) : 0;
  const r = 60;
  const C = 2 * Math.PI * r;
  const hh = String(Math.floor(doneMinutes / 60)).padStart(2, "0");
  const mm = String(doneMinutes % 60).padStart(2, "0");

  return (
    <div className="flex h-[320px] flex-col rounded-[20px] border border-outline-variant bg-surface-container p-[22px]">
      <div className="flex items-start justify-between">
        <div className="text-[15px] font-semibold tracking-[-0.01em] text-on-surface">Økt-tracker</div>
        <button className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-full border border-outline-variant bg-transparent">
          <Icon name="arrow_outward" size={14} className="text-on-surface" />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center">
        <svg width={170} height={170} viewBox="0 0 170 170" className="block">
          {Array.from({ length: 60 }).map((_, i) => {
            const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
            const r1 = 78;
            const r2 = i % 5 === 0 ? 68 : 72;
            const x1 = 85 + Math.cos(a) * r1;
            const y1 = 85 + Math.sin(a) * r1;
            const x2 = 85 + Math.cos(a) * r2;
            const y2 = 85 + Math.sin(a) * r2;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="var(--color-on-surface)"
                strokeOpacity={i % 5 === 0 ? 0.55 : 0.22}
                strokeWidth={i % 5 === 0 ? 1.4 : 1}
                strokeLinecap="round"
              />
            );
          })}
          <circle
            cx={85}
            cy={85}
            r={r}
            fill="none"
            stroke="var(--color-secondary-fixed)"
            strokeWidth={14}
            strokeDasharray={`${C * pct} ${C}`}
            strokeDashoffset={C * 0.25}
            strokeLinecap="round"
            transform="rotate(-90 85 85)"
          />
          <circle
            cx={85}
            cy={85}
            r={r}
            fill="none"
            stroke="var(--color-on-surface)"
            strokeOpacity={0.12}
            strokeWidth={14}
            strokeDasharray={`${C * (1 - pct)} ${C}`}
            strokeDashoffset={-C * pct + C * 0.25}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="text-[32px] font-medium leading-none tabular-nums text-on-surface"
            style={{ letterSpacing: "-0.03em" }}
          >
            {hh}:{mm}
          </div>
          <div className="mt-1 text-[10px] text-on-surface-variant">{label}</div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <button className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-outline-variant bg-transparent">
            <Icon name="play_arrow" size={14} className="text-on-surface" />
          </button>
          <button className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-outline-variant bg-transparent">
            <Icon name="pause" size={14} className="text-on-surface" />
          </button>
        </div>
        <button className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-on-surface">
          <Icon name="stop" size={13} className="text-white" />
        </button>
      </div>
    </div>
  );
}

interface FormCardProps {
  overallPct: number;
  segments: { label: string; pct: number; tone: "accent" | "dark" | "muted" }[];
}

export function FormCard({ overallPct, segments }: FormCardProps) {
  const total = segments.reduce((sum, s) => sum + s.pct, 0) || 1;
  return (
    <div className="flex h-[320px] flex-col rounded-[20px] border border-outline-variant bg-surface-container p-[22px]">
      <div className="flex items-start justify-between">
        <div className="text-[15px] font-semibold tracking-[-0.01em] text-on-surface">Formsjekk</div>
        <div
          className="text-[24px] font-medium tabular-nums text-on-surface"
          style={{ letterSpacing: "-0.02em" }}
        >
          {Math.round(overallPct * 100)}%
        </div>
      </div>

      <div className="mb-4 mt-5 flex items-center gap-[3px]">
        {segments.map((s, i) => {
          const bg =
            s.tone === "accent"
              ? "var(--color-secondary-fixed)"
              : s.tone === "dark"
                ? "var(--color-on-surface)"
                : "var(--color-surface-container-high)";
          const text =
            s.tone === "accent"
              ? "var(--color-on-secondary-fixed)"
              : s.tone === "dark"
                ? "#fff"
                : "var(--color-on-surface)";
          return (
            <div
              key={i}
              className="relative h-[26px] rounded-full"
              style={{ background: bg, flex: (s.pct * 100) / total }}
            >
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold whitespace-nowrap"
                style={{ color: text }}
              >
                {s.label} {Math.round(s.pct * 100)}%
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-auto space-y-3">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center justify-between text-[11px] text-on-surface-variant">
            <span>{s.label}</span>
            <span className="tabular-nums text-on-surface">{Math.round(s.pct * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface PlayerHQRowOneProps {
  name: string | null;
  role: string;
  handicap: number | null;
  avatarUrl?: string | null;
  weeklyHours: number;
  weekBars: { d: string; v: number; peak?: boolean; peakLabel?: string }[];
  doneMinutes: number;
  planMinutes: number;
  formPct: number;
  formSegments: { label: string; pct: number; tone: "accent" | "dark" | "muted" }[];
}

export function PlayerHQRowOne(props: PlayerHQRowOneProps) {
  return (
    <div
      className="grid gap-3.5 pb-3.5"
      style={{ gridTemplateColumns: "1fr 1.2fr 1fr 1fr" }}
    >
      <ProfileCard
        name={props.name}
        role={props.role}
        handicap={props.handicap}
        avatarUrl={props.avatarUrl}
      />
      <ProgressCard weeklyHours={props.weeklyHours} bars={props.weekBars} />
      <TimeTrackerCard doneMinutes={props.doneMinutes} planMinutes={props.planMinutes} />
      <FormCard overallPct={props.formPct} segments={props.formSegments} />
    </div>
  );
}
