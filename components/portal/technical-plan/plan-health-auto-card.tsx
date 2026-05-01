"use client";

import { useEffect, useState } from "react";
import { Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PlanHealthCard } from "./plan-health-card";

interface PlanHealthAutoCardProps {
  emptyState?: React.ReactNode;
}

/**
 * Selv-henter wrapper for PlanHealthCard.
 * Henter spillerens tekniske planer fra API og viser
 * PlanHealthCard for første aktive plan.
 *
 * Brukes på dashboard hvor planId ikke er kjent på forhånd.
 */
export function PlanHealthAutoCard({ emptyState }: PlanHealthAutoCardProps) {
  const [planId, setPlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portal/technical-plans")
      .then((r) => r.json())
      .then((data) => {
        const plans = data.plans ?? [];
        const active = plans.find((p: { status: string }) => p.status === "ACTIVE");
        setPlanId(active?.id ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card className="p-5 border border-line rounded-xl">
        <div className="h-4 bg-surface-soft animate-pulse rounded w-1/3 mb-3" />
        <div className="h-2 bg-surface-soft animate-pulse rounded-full w-full" />
      </Card>
    );
  }

  if (!planId) {
    if (emptyState) return <>{emptyState}</>;
    return (
      <Card className="p-5 border border-line rounded-xl">
        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-ink-muted" />
          <div>
            <h3 className="font-medium text-ink text-sm">Teknisk plan</h3>
            <p className="text-xs text-ink-muted mt-0.5">Ingen aktive planer</p>
          </div>
        </div>
      </Card>
    );
  }

  return <PlanHealthCard planId={planId} />;
}
