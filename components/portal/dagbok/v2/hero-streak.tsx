"use client";

interface HeroStreakProps {
  streakDays: number;
  longestStreak: number;
  sessions90d: number;
  hours90d: number;
  rounds90d: number;
  sessionsDelta?: string | null;
  hoursDelta?: string | null;
  roundsDelta?: string | null;
}

function Delta({ value }: { value: string | null | undefined }) {
  if (!value) return null;
  const isNegative = value.startsWith("-");
  return (
    <small
      className="text-[11px] font-medium ml-1.5"
      style={{ color: isNegative ? "#F49283" : "#D1F843" }}
    >
      {value}
    </small>
  );
}

export function HeroStreak({
  streakDays,
  longestStreak,
  sessions90d,
  hours90d,
  rounds90d,
  sessionsDelta,
  hoursDelta,
  roundsDelta,
}: HeroStreakProps) {
  const nextMilestone = streakDays < 60 ? 60 : streakDays < 100 ? 100 : 200;
  const daysToMilestone = Math.max(0, nextMilestone - streakDays);

  return (
    <div
      className="rounded-2xl text-white p-7"
      style={{
        background: "linear-gradient(135deg, var(--color-sidebar), #172B22)",
      }}
    >
      <div className="font-mono text-[10px] tracking-[0.14em] text-accent uppercase">
        Streak · aktiv
      </div>
      <h2 className="mt-2 mb-1 text-[44px] font-bold tracking-tight leading-none font-[family-name:var(--font-inter-tight)]">
        {streakDays}{" "}
        <span className="text-accent text-[30px] font-semibold">dager</span>
      </h2>
      <div className="text-ink-subtle text-[13px]">
        Forrige rekord: {longestStreak} dager. Neste milepæl:{" "}
        {nextMilestone} dager — {daysToMilestone} dager igjen.
      </div>

      <div className="grid grid-cols-3 gap-3 mt-6">
        <div className="p-3 rounded-xl bg-white/5">
          <div className="font-mono text-[9px] text-white/50 tracking-[0.14em] uppercase">
            Økter 90d
          </div>
          <div className="text-[22px] font-bold mt-0.5 tracking-tight">
            {sessions90d}
            <Delta value={sessionsDelta} />
          </div>
        </div>
        <div className="p-3 rounded-xl bg-white/5">
          <div className="font-mono text-[9px] text-white/50 tracking-[0.14em] uppercase">
            Timer 90d
          </div>
          <div className="text-[22px] font-bold mt-0.5 tracking-tight">
            {hours90d}
            <Delta value={hoursDelta} />
          </div>
        </div>
        <div className="p-3 rounded-xl bg-white/5">
          <div className="font-mono text-[9px] text-white/50 tracking-[0.14em] uppercase">
            Runder 90d
          </div>
          <div className="text-[22px] font-bold mt-0.5 tracking-tight">
            {rounds90d}
            <Delta value={roundsDelta} />
          </div>
        </div>
      </div>
    </div>
  );
}
