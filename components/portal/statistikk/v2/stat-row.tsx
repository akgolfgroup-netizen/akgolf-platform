"use client";

import type { ReactNode } from "react";

interface StatRowProps {
  label: string;
  value: ReactNode;
  sub?: string;
  variant?: "default" | "highlight" | "accent";
}

export function StatRow({ label, value, sub, variant = "default" }: StatRowProps) {
  let cls =
    "grid grid-cols-[1fr_auto] items-center px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white";
  if (variant === "highlight") {
    cls = "grid grid-cols-[1fr_auto] items-center px-4 py-3.5 rounded-2xl bg-[#0A1F18] border border-white/10 text-white";
  } else if (variant === "accent") {
    cls = "grid grid-cols-[1fr_auto] items-center px-4 py-3.5 rounded-2xl bg-[#D1F843] border border-transparent text-[#0A1F18]";
  }

  return (
    <div className={cls}>
      <div>
        <div className="text-[13px] font-medium">{label}</div>
        {sub ? (
          <div
            className={[
              "text-[11px] mt-0.5",
              variant === "accent" ? "text-[#0A1F18]/60" : "text-white/50",
            ].join(" ")}
          >
            {sub}
          </div>
        ) : null}
      </div>
      <div className="text-xl font-bold tracking-tight tabular-nums">
        {value}
      </div>
    </div>
  );
}

interface ExpandedStatRowProps {
  label: string;
  sub?: string;
  value: ReactNode;
  left: { eyebrow: string; main: ReactNode; rows?: { k: string; v: string }[] };
  right: { eyebrow: string; main: ReactNode; rows?: { k: string; v: string }[] };
}

export function ExpandedStatRow({
  label,
  sub,
  value,
  left,
  right,
}: ExpandedStatRowProps) {
  return (
    <div className="block px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white">
      <div className="flex justify-between items-baseline mb-3">
        <div>
          <div className="text-[13px] font-medium">{label}</div>
          {sub ? (
            <div className="text-[11px] mt-0.5 text-white/50">{sub}</div>
          ) : null}
        </div>
        <div className="text-xl font-bold tracking-tight tabular-nums">
          {value}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-dashed border-white/10">
        {[left, right].map((side, i) => (
          <div key={i}>
            <div className="font-mono text-[10px] tracking-[0.14em] text-white/55 uppercase mb-2">
              {side.eyebrow}
            </div>
            <div className="text-2xl font-bold tracking-tight leading-none">
              {side.main}
            </div>
            {side.rows
              ? side.rows.map((r, ri) => (
                  <div
                    key={ri}
                    className="flex justify-between text-[11px] text-white/55 py-0.5"
                  >
                    <span className="font-semibold uppercase tracking-wider">
                      {r.k}
                    </span>
                    <span className="font-semibold text-white tabular-nums">
                      {r.v}
                    </span>
                  </div>
                ))
              : null}
          </div>
        ))}
      </div>
    </div>
  );
}
