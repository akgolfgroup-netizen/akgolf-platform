"use client";

import { Target, AlertTriangle, CheckCircle } from "lucide-react";
import type { PlanMatchResult } from "@/lib/portal/trackman/plan-matcher";

interface SessionMatcherProps {
  result: PlanMatchResult;
}

export function SessionMatcher({ result }: SessionMatcherProps) {
  if (!result.phaseId) {
    return (
      <div className="flex items-center gap-2 text-error">
        <AlertTriangle className="h-4 w-4" />
        <span className="text-sm">Ingen passende fase funnet</span>
      </div>
    );
  }

  const isGood = result.matchScore >= 80;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {isGood ? (
          <CheckCircle className="h-4 w-4 text-success" />
        ) : (
          <Target className="h-4 w-4 text-warning" />
        )}
        <span className="text-sm font-medium">
          {result.phaseTitle ?? "Ukjent fase"}
        </span>
        <span className="text-xs text-muted-foreground">
          ({result.matchScore}% match)
        </span>
      </div>
      {result.matchWarnings.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {result.matchWarnings.map((warning: string, i: number) => (
            <span
              key={i}
              className="inline-flex items-center rounded bg-warning/10 px-1.5 py-0.5 text-[11px] text-warning"
            >
              {warning}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
