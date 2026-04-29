"use client";

import { useEffect, useState } from "react";
import { getClubAggregates, type ClubAggregate } from "@/lib/portal/trackman/aggregate";
import { DispersionPlot } from "./dispersion-plot";
import { Target, Gauge, RotateCw, Wind } from "lucide-react";

interface AdminTrackManViewProps {
  userId: string;
}

export function AdminTrackManView({ userId }: AdminTrackManViewProps) {
  const [aggregates, setAggregates] = useState<ClubAggregate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getClubAggregates(userId);
        setAggregates(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Feil ved lasting");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId]);

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-ink-muted">
        Laster TrackMan-data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-sm text-error">
        {error}
      </div>
    );
  }

  if (aggregates.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-ink-muted">
        Ingen TrackMan-data registrert for denne spilleren.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {aggregates.map((agg) => (
          <div
            key={agg.club}
            className="bg-card rounded-xl border border-line p-4 shadow-card"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-ink">{agg.club}</h4>
              <span className="text-xs text-ink-subtle">{agg.shotCount} slag</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <MiniStat icon={<Target className="w-3 h-3 text-primary" />} label="Carry" value={agg.avgCarry !== null ? `${agg.avgCarry}m` : "–"} />
              <MiniStat icon={<Gauge className="w-3 h-3 text-warning" />} label="Ballfart" value={agg.avgBallSpeed !== null ? `${agg.avgBallSpeed} mph` : "–"} />
              <MiniStat icon={<RotateCw className="w-3 h-3 text-success" />} label="Smash" value={agg.avgSmashFactor !== null ? `${agg.avgSmashFactor}` : "–"} />
              <MiniStat icon={<Wind className="w-3 h-3 text-info" />} label="Spin" value={agg.avgSpinRate !== null ? `${agg.avgSpinRate} rpm` : "–"} />
            </div>
            <a
              href={`/portal/trackman/${encodeURIComponent(agg.club)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-primary hover:text-primary-hover transition-colors"
            >
              Se detaljer →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div>
        <p className="text-[10px] text-ink-muted uppercase">{label}</p>
        <p className="text-sm font-medium text-ink">{value}</p>
      </div>
    </div>
  );
}
