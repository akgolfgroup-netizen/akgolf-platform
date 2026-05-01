"use client";

import { useEffect, useState } from "react";
import { Clock, Target, Dumbbell, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PhaseVolume {
  phaseId: string;
  title: string;
  status: string;
  targetReps: number;
  targetHours: number | null;
  targetBalls: number | null;
  completedReps: number;
  completedHours: number;
  completedBalls: number;
  progressPct: number;
  repsStatus: "optimal" | "warning" | "danger";
  lastSession: string | null;
  sessionCount: number;
}

interface VolumeData {
  weekly: {
    hours: number;
    reps: number;
    balls: number;
    targetHours: number;
    targetReps: number;
    status: "under" | "optimal" | "over";
  };
  spacing: {
    ok: boolean;
    gaps: number[];
    warning: string | null;
  };
  phases: PhaseVolume[];
  category: string;
}

interface VolumeDashboardProps {
  planId: string;
}

export function VolumeDashboard({ planId }: VolumeDashboardProps) {
  const [data, setData] = useState<VolumeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/portal/technical-plans/${planId}/volume`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [planId]);

  if (loading) {
    return (
      <Card className="p-5 border border-line rounded-xl">
        <div className="h-4 bg-surface-soft animate-pulse rounded w-1/3 mb-3" />
        <div className="grid grid-cols-3 gap-3">
          <div className="h-16 bg-surface-soft animate-pulse rounded-lg" />
          <div className="h-16 bg-surface-soft animate-pulse rounded-lg" />
          <div className="h-16 bg-surface-soft animate-pulse rounded-lg" />
        </div>
      </Card>
    );
  }

  if (!data) return null;

  const { weekly, spacing, phases } = data;
  const statusConfig = {
    under: { icon: TrendingDown, color: "text-warning", bg: "bg-warning/10", label: "Under mål" },
    optimal: { icon: TrendingUp, color: "text-success", bg: "bg-success/10", label: "På mål" },
    over: { icon: AlertIcon, color: "text-danger", bg: "bg-danger/10", label: "Over mål" },
  };
  const status = statusConfig[weekly.status];
  const StatusIcon = status.icon;

  return (
    <Card className="p-5 border border-line rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-ink text-sm">Ukentlig volum</h3>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${status.bg}`}>
          <StatusIcon className={`w-3.5 h-3.5 ${status.color}`} />
          <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
        </div>
      </div>

      {/* KPI-rad */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <KpiCard
          icon={<Clock className="w-4 h-4 text-primary" />}
          label="Timer"
          value={`${weekly.hours}t`}
          target={`/ ${weekly.targetHours}t`}
        />
        <KpiCard
          icon={<Dumbbell className="w-4 h-4 text-primary" />}
          label="Reps"
          value={`${weekly.reps}`}
          target={`/ ${weekly.targetReps}`}
        />
        <KpiCard
          icon={<Target className="w-4 h-4 text-primary" />}
          label="Baller"
          value={`${weekly.balls}`}
          target=""
        />
      </div>

      {/* Spacing-advarsel */}
      {spacing.warning && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/5 border border-warning/20 mb-4">
          <Clock className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <p className="text-xs text-ink-muted">{spacing.warning}</p>
        </div>
      )}

      {/* Per-fase progress */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-ink-muted uppercase tracking-wide">
          Fase-fremdrift
        </h4>
        {phases.slice(0, 4).map((p) => (
          <div key={p.phaseId} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink truncate">{p.title}</span>
              <span className="text-ink-muted font-mono shrink-0">
                {p.progressPct}%
              </span>
            </div>
            <div className="h-1.5 bg-surface-soft rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  p.repsStatus === "danger"
                    ? "bg-danger"
                    : p.repsStatus === "warning"
                      ? "bg-warning"
                      : "bg-primary"
                )}
                style={{ width: `${Math.min(100, p.progressPct)}%` }}
              />
            </div>
          </div>
        ))}
        {phases.length > 4 && (
          <p className="text-xs text-ink-subtle">
            +{phases.length - 4} flere faser
          </p>
        )}
      </div>
    </Card>
  );
}

function KpiCard({
  icon,
  label,
  value,
  target,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  target: string;
}) {
  return (
    <div className="p-3 rounded-lg bg-surface-soft/50 border border-line-soft">
      <div className="flex items-center gap-1.5 mb-1.5">
        {icon}
        <span className="text-[11px] text-ink-muted uppercase tracking-wide">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-semibold text-ink font-mono">{value}</span>
        {target && <span className="text-xs text-ink-subtle font-mono">{target}</span>}
      </div>
    </div>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  );
}

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
