"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Brain, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface MyelinItem {
  phaseId: string;
  phaseTitle: string;
  daysSinceLastSession: number;
  daysSinceFormatted: string;
  status: "warning" | "critical" | "decayed";
  progressRetention: number;
  recommendedAction: string;
}

interface MyelinData {
  items: MyelinItem[];
  summary: {
    healthy: number;
    warning: number;
    critical: number;
    decayed: number;
  };
  totalPhases: number;
}

interface MyelinAlertProps {
  planId: string;
}

export function MyelinAlert({ planId }: MyelinAlertProps) {
  const [data, setData] = useState<MyelinData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/portal/technical-plans/${planId}/myelin`)
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
        <div className="h-2 bg-surface-soft animate-pulse rounded-full w-full" />
      </Card>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <Card className="p-5 border border-line rounded-xl bg-success/5">
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-success" />
          <div>
            <h3 className="font-medium text-ink text-sm">Myelin-status</h3>
            <p className="text-xs text-ink-muted mt-0.5">
              Alle {data?.totalPhases ?? 0} faser er innenfor optimal treningsfrekvens
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const topIssues = data.items.slice(0, 3);
  const hasCritical = data.summary.critical > 0 || data.summary.decayed > 0;

  return (
    <Card
      className={cn(
        "p-5 border rounded-xl",
        hasCritical ? "border-danger/30 bg-danger/5" : "border-warning/30 bg-warning/5"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle
            className={cn("w-5 h-5", hasCritical ? "text-danger" : "text-warning")}
          />
          <h3 className="font-medium text-ink text-sm">
            {data.items.length} fase{data.items.length > 1 ? "r" : ""} trenger oppmerksomhet
          </h3>
        </div>
        <Link
          href={`/portal/teknisk-plan?tab=myelin`}
          className="text-xs text-primary hover:underline flex items-center gap-0.5"
        >
          Se alle <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-2">
        {topIssues.map((item) => (
          <div
            key={item.phaseId}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={cn(
                  "w-2 h-2 rounded-full shrink-0",
                  item.status === "decayed"
                    ? "bg-danger"
                    : item.status === "critical"
                      ? "bg-warning"
                      : "bg-warning/60"
                )}
              />
              <span className="text-ink truncate">{item.phaseTitle}</span>
            </div>
            <span className="text-xs text-ink-muted shrink-0 font-mono">
              {item.daysSinceFormatted}
            </span>
          </div>
        ))}
      </div>

      {data.items.length > 3 && (
        <p className="text-xs text-ink-subtle mt-2">
          +{data.items.length - 3} flere faser
        </p>
      )}
    </Card>
  );
}

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
