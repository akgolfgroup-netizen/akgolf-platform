"use client";




import { Icon } from "@/components/ui/icon";
/**
 * LeaderboardWidget — rangering blant AK-elever.
 *
 * Data-kilde: User + Round aggregert
 * Brukes på: P1 (Dashboard), PB06 (Benchmark), PB13, PB14, N08
 */
export function LeaderboardWidget() {
  // TODO: Koble til reelle data via server action
  const players = [
    { name: "Ola N.", hcp: 4.2, trend: -0.8, rank: 1 },
    { name: "Kari L.", hcp: 5.1, trend: -0.3, rank: 2 },
    { name: "Deg", hcp: 6.5, trend: -1.2, rank: 3, isMe: true },
    { name: "Per H.", hcp: 7.8, trend: 0.5, rank: 4 },
    { name: "Mia S.", hcp: 8.3, trend: -0.4, rank: 5 },
  ];

  return (
    <div className="space-y-2">
      {players.map((p) => (
        <div
          key={p.rank}
          className={
            "flex items-center justify-between py-1.5 px-2 rounded-lg " +
            (p.isMe ? "bg-primary-soft" : "")
          }
        >
          <div className="flex items-center gap-2.5">
            <span
              className={
                "w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold " +
                (p.rank <= 3
                  ? "bg-primary text-surface"
                  : "bg-surface-container text-on-surface-variant/80")
              }
            >
              {p.rank}
            </span>
            <span className={"text-xs " + (p.isMe ? "font-semibold text-text" : "text-muted")}>
              {p.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-text">HCP {p.hcp}</span>
            <span
              className={
                "flex items-center gap-0.5 text-[10px] font-medium " +
                (p.trend < 0 ? "text-success" : "text-error")
              }
            >
              {p.trend < 0 ? (
                <Icon name="south_east" className="w-3 h-3" />
              ) : (
                <Icon name="arrow_outward" className="w-3 h-3" />
              )}
              {Math.abs(p.trend)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
