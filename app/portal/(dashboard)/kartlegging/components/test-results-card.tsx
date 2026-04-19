"use client";

import { ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import type { TestHistory } from "@/lib/portal/kartlegging";

interface TestResultsCardProps {
  history: TestHistory;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "short",
  });
}

export function TestResultsCard({ history }: TestResultsCardProps) {
  const shown = history.recent.slice(0, 5);

  return (
    <div className="bg-portal-card rounded-2xl p-5 shadow-portal-card border border-portal-border-subtle">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-portal-muted">
          Siste testresultater
        </span>
        {history.missingTests.length > 0 && (
          <span className="text-[11px] text-portal-muted tabular-nums">
            {history.missingTests.length} mangler
          </span>
        )}
      </div>

      <div className="mt-3 divide-y divide-portal-border-subtle">
        {shown.length === 0 && (
          <p className="py-4 text-sm text-portal-muted">
            Ingen tester registrert ennå. Snakk med treneren din om å gjennomføre
            en testøkt.
          </p>
        )}
        {shown.map((t) => (
          <div
            key={`${t.testNumber}-${t.conductedAt}`}
            className="flex items-center justify-between py-2.5"
          >
            <div className="flex items-center gap-2">
              {t.passed ? (
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-error flex-shrink-0" />
              )}
              <div>
                <div className="text-sm text-portal-text">{t.testName}</div>
                <div className="text-[11px] text-portal-muted">
                  {formatDate(t.conductedAt)}
                </div>
              </div>
            </div>
            <span className="text-sm font-semibold tabular-nums text-portal-text">
              {t.value} {t.unit}
            </span>
          </div>
        ))}
      </div>

      <Link
        href="/portal/tester"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
      >
        Se alle tester
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
