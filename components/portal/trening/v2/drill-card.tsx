"use client";

import {
  Clock,
  MapPin,
  Repeat,
  Lock,
  Play,
  Check,
  CheckCircle2,
  ArrowUp,
} from "lucide-react";

export type DrillStep = 1 | 2 | 3 | 4 | 5;

export interface Drill {
  id: string;
  step: DrillStep;
  name: string;
  description: string;
  duration: string;
  location: string;
  cadence: string;
  progressPct: number | null;
  loggedText?: string;
  locked?: boolean;
  lockReason?: string;
  mastered?: boolean;
}

const STEP_STYLES: Record<DrillStep, string> = {
  1: "bg-[rgba(107,177,255,0.18)] text-[#91C4FF]",
  2: "bg-[rgba(107,177,255,0.22)] text-[#6BB1FF]",
  3: "bg-[rgba(209,248,67,0.18)] text-[#D1F843]",
  4: "bg-[rgba(232,185,103,0.20)] text-[#E8B967]",
  5: "bg-[rgba(232,93,78,0.22)] text-[#F49283]",
};

export function DrillCard({ drill }: { drill: Drill }) {
  const ringCircumference = 138.2;
  const ringOffset =
    drill.progressPct !== null
      ? ringCircumference - (ringCircumference * drill.progressPct) / 100
      : ringCircumference;

  return (
    <div
      className={[
        "relative rounded-2xl border border-[#1a4a3a] bg-[#0D2E23] px-5 py-4 flex flex-col gap-3",
        drill.locked ? "opacity-55" : "",
      ].join(" ")}
    >
      <div className="flex justify-between items-start gap-2.5">
        <span
          className={[
            "font-mono text-[9px] font-bold uppercase tracking-[0.14em] px-2 py-1 rounded",
            STEP_STYLES[drill.step],
          ].join(" ")}
        >
          Steg {drill.step}
        </span>
        <ProgressRing
          pct={drill.progressPct}
          offset={ringOffset}
          circumference={ringCircumference}
        />
      </div>

      <div>
        <div className="text-sm text-white font-bold leading-[1.3] tracking-[-0.01em]">
          {drill.name}
        </div>
        <div className="text-xs text-white/55 leading-[1.5] mt-1">
          {drill.description}
        </div>
      </div>

      <div className="flex gap-2.5 pt-3 border-t border-white/[0.05] text-[11px] text-white/60">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-white/40" />
          {drill.duration}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-white/40" />
          {drill.location}
        </span>
        {drill.locked ? (
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-white/40" />
            Låst
          </span>
        ) : drill.mastered ? (
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-white/40" />
            Bestått
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <Repeat className="w-3 h-3 text-white/40" />
            {drill.cadence}
          </span>
        )}
      </div>

      {!drill.locked && (
        <div className="flex justify-between items-center gap-2">
          <div
            className={`text-[11px] flex-1 ${
              drill.mastered ? "text-[#6FCBA1]" : "text-white/55"
            }`}
          >
            {drill.mastered ? (
              "Mestret · klar for neste steg"
            ) : drill.loggedText ? (
              <>
                Logget{" "}
                <strong className="text-white font-bold font-mono text-xs">
                  {drill.loggedText}
                </strong>
              </>
            ) : null}
          </div>
          <div className="flex gap-1.5">
            {drill.mastered ? (
              <DrillButton>
                <ArrowUp className="w-3.5 h-3.5" />
              </DrillButton>
            ) : (
              <>
                <DrillButton>
                  <Play className="w-3.5 h-3.5" />
                </DrillButton>
                <DrillButton primary>
                  <Check className="w-3.5 h-3.5" strokeWidth={2.4} />
                </DrillButton>
              </>
            )}
          </div>
        </div>
      )}

      {drill.locked && drill.lockReason && (
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="bg-black/65 border border-white/10 text-white/75 font-mono text-[10px] uppercase tracking-[0.10em] px-2.5 py-1.5 rounded-md font-bold flex items-center gap-1.5">
            <Lock className="w-3 h-3" />
            {drill.lockReason}
          </div>
        </div>
      )}
    </div>
  );
}

function DrillButton({
  primary,
  children,
}: {
  primary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      className={[
        "w-[34px] h-[34px] rounded-lg grid place-items-center transition",
        primary
          ? "bg-[#D1F843] text-[#0A1F18] border border-[#D1F843] hover:bg-[#C7EE3F]"
          : "bg-white/[0.04] text-white/85 border border-white/10 hover:bg-white/10",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function ProgressRing({
  pct,
  offset,
  circumference,
}: {
  pct: number | null;
  offset: number;
  circumference: number;
}) {
  return (
    <div className="w-[52px] h-[52px] relative flex-shrink-0">
      <svg
        viewBox="0 0 52 52"
        width="52"
        height="52"
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx="26"
          cy="26"
          r="22"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="4"
        />
        {pct !== null && (
          <circle
            cx="26"
            cy="26"
            r="22"
            fill="none"
            stroke="#D1F843"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        )}
      </svg>
      <div className="absolute inset-0 grid place-items-center font-mono text-xs font-bold text-white tabular-nums tracking-[-0.02em]">
        {pct !== null ? `${pct}%` : <span className="text-white/50">—</span>}
      </div>
    </div>
  );
}
