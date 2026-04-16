"use client";

import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { CancellationRule } from "./booking-types";

interface CancellationRulesCardProps {
  rules: readonly CancellationRule[];
}

export function CancellationRulesCard({ rules }: CancellationRulesCardProps) {
  return (
    <Card variant="elevated" padding="md">
      <div className="mb-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Clock className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-[13px] text-grey-900">
            Avbestillingsregler
          </h3>
          <p className="text-[10px] text-muted uppercase tracking-wider">
            Gjelder alle bookinger
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {rules.map((rule) => (
          <div
            key={rule.hours}
            className="rounded-2xl border border-grey-200 bg-white/50 p-3"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted mb-1">
              {rule.hours} timer
            </p>
            <p className="text-[12px] text-text mb-1">{rule.rule}</p>
            <p className="text-[11px] font-semibold text-primary tabular-nums">
              {rule.fee}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
