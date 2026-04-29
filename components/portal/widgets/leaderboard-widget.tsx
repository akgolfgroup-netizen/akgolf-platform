"use client";

import { Icon } from "@/components/ui/icon";
import { getLeaderboard } from "@/lib/portal/widgets/actions";
import { useWidgetData } from "./use-widget-data";

/**
 * LeaderboardWidget — rangering blant AK-spillere.
 *
 * Data-kilde: User + HandicapEntry aggregert via getLeaderboard()
 * Brukes pa: P1 (Dashboard), PB06 (Benchmark), PB13, PB14, N08
 */
export function LeaderboardWidget() {
  const { data: players, loading } = useWidgetData(getLeaderboard, []);

  if (loading) return <SkeletonRows count={5} />;
  if (players.length === 0) return <EmptyState />;

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
            <span
              className={
                "text-xs " +
                (p.isMe ? "font-semibold text-text" : "text-muted")
              }
            >
              {p.isMe ? "Deg" : p.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-text">
              HCP {p.hcp.toFixed(1)}
            </span>
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
              {Math.abs(p.trend).toFixed(1)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonRows({ count }: { count: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-8 bg-surface-container animate-pulse rounded-lg"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <p className="text-xs text-muted py-4 text-center">
      Ingen ranking-data tilgjengelig.
    </p>
  );
}
