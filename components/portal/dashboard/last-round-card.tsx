"use client";

import { Flag } from "lucide-react";
import { PremiumCard } from "./premium-card";
import { NumberTicker } from "./number-ticker";

interface LastRoundCardProps {
  score?: number;
  par?: number;
  fairways?: string;
  gir?: string;
  putts?: number;
  courseName?: string;
  delay?: number;
}

export function LastRoundCard({
  score = 78,
  par = 72,
  fairways = "9/14",
  gir = "10/18",
  putts = 31,
  courseName = "Fredrikstad GK",
  delay = 0,
}: LastRoundCardProps) {
  const toPar = score - par;
  const toParStr = toPar > 0 ? `+${toPar}` : String(toPar);

  return (
    <PremiumCard delay={delay} className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
          Siste runde
        </p>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Flag className="h-3.5 w-3.5 text-primary" strokeWidth={1.75} />
        </div>
      </div>

      {/* Big score */}
      <div className="mb-1 text-center">
        <NumberTicker
          value={score}
          delay={delay + 0.2}
          className="text-5xl font-extrabold tracking-[-0.04em] text-black"
        />
        <p className="mt-1 text-sm font-medium text-muted">
          {toParStr} (par {par})
        </p>
      </div>

      {/* Bane */}
      <p className="mb-4 text-center text-[11px] text-muted">{courseName}</p>

      {/* Stats grid */}
      <div className="mt-auto grid grid-cols-3 gap-2">
        <MiniStat label="FW" value={fairways} />
        <MiniStat label="GIR" value={gir} />
        <MiniStat label="Putts" value={String(putts)} />
      </div>
    </PremiumCard>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-black/[0.04] bg-black/[0.02] p-2 text-center">
      <span className="block text-[10px] text-muted">{label}</span>
      <span className="block text-sm font-bold tracking-tight text-black tabular-nums">
        {value}
      </span>
    </div>
  );
}
