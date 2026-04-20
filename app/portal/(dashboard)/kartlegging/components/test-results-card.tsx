"use client";


import { Icon } from "@/components/ui/icon";
/**
 * TestResultsCard — siste testresultater + manglende-indikator.
 * Bruker design-system tokens + p-list-mønsteret fra portal-profil wireframe.
 */

import Link from "next/link";

import { MonoLabel } from "@/components/portal/patterns";
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
    <div className="rounded-xl bg-surface-container-lowest shadow-card p-5">
      <div className="flex items-baseline justify-between mb-3">
        <MonoLabel size="xs" uppercase className="text-on-surface-variant">
          Siste testresultater
        </MonoLabel>
        {history.missingTests.length > 0 && (
          <span className="text-[11px] text-on-surface-variant tabular-nums">
            {history.missingTests.length} mangler
          </span>
        )}
      </div>

      {shown.length === 0 && (
        <p className="py-4 text-sm text-on-surface-variant/80">
          Ingen tester registrert ennå. Snakk med treneren din om å gjennomføre
          en testøkt.
        </p>
      )}

      <ul className="divide-y divide-grey-100">
        {shown.map((t) => (
          <li
            key={`${t.testNumber}-${t.conductedAt}`}
            className="flex items-center justify-between py-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 ${
                  t.passed
                    ? "bg-success-light text-success-text"
                    : "bg-error-light text-error-text"
                }`}
              >
                {t.passed ? (
                  <Icon name="check" className="w-3.5 h-3.5" />
                ) : (
                  <Icon name="close" className="w-3.5 h-3.5" />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-sm text-on-surface truncate">{t.testName}</div>
                <div className="text-[11px] text-on-surface-variant">
                  {formatDate(t.conductedAt)}
                </div>
              </div>
            </div>
            <span className="text-sm font-semibold tabular-nums text-on-surface shrink-0 ml-3">
              {t.value} {t.unit}
            </span>
          </li>
        ))}
      </ul>

      <Link
        href="/portal/tester"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
      >
        Se alle tester
        <Icon name="chevron_right" className="w-4 h-4" />
      </Link>
    </div>
  );
}
