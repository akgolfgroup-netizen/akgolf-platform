import { COLORS, SubHeader } from "./primitives";
import type { MoodLevel, MoodLog } from "./types";

const LEVEL_BG: Record<MoodLevel, string> = {
  0: "rgba(255,255,255,0.04)",
  1: "rgba(209,248,67,0.20)",
  2: "rgba(209,248,67,0.40)",
  3: "rgba(209,248,67,0.65)",
  4: "#D1F843",
};

const TAG_PALETTE: Record<"up" | "warn" | "neutral", { bg: string; color: string }> = {
  up: { bg: "rgba(209,248,67,0.16)", color: COLORS.accent },
  warn: { bg: "rgba(196,138,50,0.20)", color: COLORS.warn },
  neutral: { bg: "rgba(175,82,222,0.16)", color: COLORS.violet },
};

export function MentalCardLong({
  moodDays,
  logs,
  preRound,
}: {
  moodDays: MoodLevel[];
  logs: MoodLog[];
  preRound: { label: string; tone: "up" | "neutral" }[];
}) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-[14px]">
        <div>
          <SubHeader first>Stemning · 30 dager</SubHeader>
          <div
            className="grid gap-[3px]"
            style={{ gridTemplateColumns: "repeat(30, 1fr)" }}
          >
            {moodDays.map((level, idx) => (
              <div
                key={idx}
                className="rounded-[2px]"
                style={{ aspectRatio: "1", background: LEVEL_BG[level] }}
              />
            ))}
          </div>
          <div
            className="mt-[10px] flex items-center gap-[14px] font-mono text-[11px]"
            style={{ color: COLORS.textSubtle }}
          >
            <Legend swatch="rgba(255,255,255,0.04)" label="—" />
            <Legend swatch="rgba(209,248,67,0.20)" label="OK" />
            <Legend swatch={COLORS.accent} label="Topp" />
          </div>
        </div>
        <div>
          <SubHeader first>Selvrapportering · siste 3 økter</SubHeader>
          <div className="flex flex-col gap-[8px]">
            {logs.map((log, idx) => (
              <div
                key={`${log.date}-${idx}`}
                className="rounded-[8px] px-[12px] py-[10px]"
                style={{ background: "rgba(255,255,255,0.025)" }}
              >
                <div
                  className="mb-[4px] font-mono text-[11px]"
                  style={{ color: COLORS.textSubtle }}
                >
                  {log.date} · {log.context}
                </div>
                <div className="text-[12px]" style={{ color: "rgba(255,255,255,0.85)" }}>
                  {log.body}
                </div>
                <div className="mt-[6px]">
                  {log.tags.map((tag) => (
                    <Mtag key={tag.label} label={tag.label} tone={tag.tone} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SubHeader>Pre-runde-rutine</SubHeader>
      <div className="flex flex-wrap gap-[8px]">
        {preRound.map((p) => (
          <Mtag key={p.label} label={p.label} tone={p.tone} />
        ))}
      </div>
    </div>
  );
}

function Mtag({
  label,
  tone,
}: {
  label: string;
  tone: "up" | "warn" | "neutral";
}) {
  const c = TAG_PALETTE[tone];
  return (
    <span
      className="mr-1 mb-1 inline-block rounded-full px-[10px] py-[4px] text-[11px] font-medium"
      style={{ background: c.bg, color: c.color }}
    >
      {label}
    </span>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span
        className="rounded-[2px]"
        style={{ width: 10, height: 10, background: swatch }}
      />
      {label}
    </span>
  );
}
