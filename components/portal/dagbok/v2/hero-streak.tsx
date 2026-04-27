"use client";

interface HeroStreakProps {
  streakDays: number;
  longestStreak: number;
  sessions90d: number;
  hours90d: number;
  rounds90d: number;
}

/**
 * Mort hero-kort for dagbok v2 — viser aktiv streak + 3 KPIer.
 */
export function HeroStreak({
  streakDays,
  longestStreak,
  sessions90d,
  hours90d,
  rounds90d,
}: HeroStreakProps) {
  const nextMilestone = streakDays < 60 ? 60 : streakDays < 100 ? 100 : 200;
  const daysToMilestone = Math.max(0, nextMilestone - streakDays);

  return (
    <div
      className="rounded-2xl text-white"
      style={{
        background: "linear-gradient(135deg, #0A1F18, #12302B)",
        padding: 28,
      }}
    >
      <div className="font-mono text-[10px] tracking-[0.14em] text-[#D1F843]">
        Streak · aktiv
      </div>
      <h2 className="mt-2 mb-1 text-[44px] font-bold tracking-tight leading-none">
        {streakDays}{" "}
        <span className="text-[#D1F843] text-[30px] font-semibold">dager</span>
      </h2>
      <div className="text-[#A5B2AD] text-[13px]">
        Forrige rekord: {longestStreak} dager. Neste milepel:{" "}
        {nextMilestone} dager — {daysToMilestone} dager igjen.
      </div>

      <div className="grid grid-cols-3 gap-3 mt-6">
        <div className="p-3 rounded-xl bg-white/5">
          <div className="font-mono text-[9px] text-[#A5B2AD] tracking-[0.14em] uppercase">
            okter 90d
          </div>
          <div className="text-[22px] font-bold mt-0.5 tracking-tight">
            {sessions90d}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-white/5">
          <div className="font-mono text-[9px] text-[#A5B2AD] tracking-[0.14em] uppercase">
            timer 90d
          </div>
          <div className="text-[22px] font-bold mt-0.5 tracking-tight">
            {hours90d}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-white/5">
          <div className="font-mono text-[9px] text-[#A5B2AD] tracking-[0.14em] uppercase">
            runder 90d
          </div>
          <div className="text-[22px] font-bold mt-0.5 tracking-tight">
            {rounds90d}
          </div>
        </div>
      </div>
    </div>
  );
}
