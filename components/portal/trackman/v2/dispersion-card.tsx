"use client";

import { ApproachIllustration, TeeIllustration } from "./dispersion-illustrations";

export interface DispersionStat {
  label: string;
  value: string;
  hint?: string;
  tone?: "lime" | "red" | "neutral";
}

export interface DispersionCardProps {
  title: string;
  subtitle: string;
  tabs?: { key: string; label: string }[];
  activeTab?: string;
  onTabChange?: (k: string) => void;
  variant: "approach" | "tee";
  cornerInfo?: string;
  cornerSecondary?: string;
  stats: DispersionStat[];
}

export function DispersionCard({
  title,
  subtitle,
  tabs = [],
  activeTab,
  onTabChange,
  variant,
  cornerInfo,
  cornerSecondary,
  stats,
}: DispersionCardProps) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#121614] p-5">
      <div className="flex justify-between items-start mb-2.5 gap-3">
        <div>
          <h3 className="m-0 mb-1 text-[13px] font-bold text-[#F7FAF8]">{title}</h3>
          <div className="font-mono text-[10px] text-white/45 tracking-[0.10em] uppercase">
            {subtitle}
          </div>
        </div>
        {tabs.length > 0 && (
          <div className="flex gap-1 p-0.5 bg-white/[0.04] border border-white/[0.06] rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onTabChange?.(tab.key)}
                className={[
                  "bg-transparent border-0 px-3 py-1 text-[11px] font-semibold rounded-md cursor-pointer transition",
                  activeTab === tab.key
                    ? "bg-[#D1F843] text-[#0A1F18]"
                    : "text-white/55 hover:text-white",
                ].join(" ")}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div
        className="relative overflow-hidden rounded-xl border border-white/[0.08]"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 100%, rgba(209,248,67,0.05), transparent 65%), linear-gradient(180deg, #0d1110 0%, #0a0d0c 100%)",
          aspectRatio: "5/6",
        }}
      >
        {variant === "approach" ? <ApproachIllustration /> : <TeeIllustration />}

        {cornerInfo && (
          <div className="absolute top-2.5 left-2.5 font-mono text-[9px] text-white/55 tracking-[0.14em] uppercase flex gap-2 items-center bg-black/40 backdrop-blur-md border border-white/[0.06] px-2.5 py-1.5 rounded-md">
            <span className="w-2 h-2 rounded-full bg-[#D1F843]" />
            {cornerInfo}
          </div>
        )}
        {cornerSecondary && (
          <div className="absolute top-2.5 right-2.5 font-mono text-[9px] text-white/55 tracking-[0.14em] uppercase bg-black/40 backdrop-blur-md border border-white/[0.06] px-2.5 py-1.5 rounded-md">
            {cornerSecondary}
          </div>
        )}

        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex gap-3.5 flex-wrap font-mono text-[9px] text-white/65 tracking-[0.10em] uppercase bg-black/50 backdrop-blur-md border border-white/[0.06] px-2.5 py-1.5 rounded-md">
          <Legend swatch="bg-[#D1F843]/50" label="50%" />
          <Legend swatch="border-[1.5px] border-dashed border-[#D1F843]/60" label="90%" hollow />
          <Legend swatch="bg-[#3BAF6E]" label="Fairway/Green" />
          {variant === "tee" && <Legend swatch="bg-[#E5D9B8]" label="Bunker" />}
          <Legend swatch="bg-[#E85D4E]" label="Miss" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3.5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="px-3 py-2.5 bg-white/[0.025] rounded-lg border border-white/[0.05]"
          >
            <div className="font-mono text-[9px] text-white/45 tracking-[0.14em] uppercase">
              {s.label}
            </div>
            <div
              className={[
                "text-lg font-bold tracking-[-0.01em] tabular-nums mt-0.5",
                s.tone === "lime"
                  ? "text-[#D1F843]"
                  : s.tone === "red"
                    ? "text-[#E85D4E]"
                    : "text-white",
              ].join(" ")}
            >
              {s.value}
            </div>
            {s.hint && (
              <div className="font-mono text-[10px] text-white/45 mt-0.5">{s.hint}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Legend({
  swatch,
  label,
  hollow,
}: {
  swatch: string;
  label: string;
  hollow?: boolean;
}) {
  return (
    <div className="flex gap-1.5 items-center">
      <span
        className={[
          "rounded-sm h-2 w-3.5",
          hollow ? "" : "",
          swatch,
        ].join(" ")}
      />
      {label}
    </div>
  );
}
