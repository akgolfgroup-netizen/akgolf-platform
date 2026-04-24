"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";

interface TestRegisterProps {
  studentId: string;
}

interface TestRow {
  testNumber: number;
  name: string;
  category: string;
  unit: string;
  formula: string;
  comparison: string;
  latest: {
    value: number;
    passed: boolean;
    categoryReq: number;
    createdAt: string;
  } | null;
  daysSince: number | null;
  retestDue: boolean;
  historyCount: number;
}

export function TestRegister({ studentId }: TestRegisterProps) {
  const [tests, setTests] = useState<TestRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(`/api/portal/admin/test-register?studentId=${studentId}`);
        if (resp.ok) {
          const data = await resp.json();
          setTests(data.tests ?? []);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [studentId]);

  if (loading) {
    return (
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6">
        <div className="text-sm text-on-surface-variant">Laster tester...</div>
      </div>
    );
  }

  const dueTests = tests.filter((t) => t.retestDue || t.latest === null);
  const completedTests = tests.filter((t) => t.latest !== null && !t.retestDue);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-on-surface tracking-tight">Test-register</h3>
            <p className="text-sm text-on-surface-variant mt-1">
              Testprotokoll 2.0 — retest anbefales hver 8. uke.
            </p>
          </div>
          <div className="flex gap-4 text-xs text-on-surface-variant">
            <div>
              <span className="font-bold text-on-surface">{completedTests.length}</span> utført
            </div>
            <div>
              <span className="font-bold text-error">{dueTests.length}</span> skyldig
            </div>
          </div>
        </div>

        {dueTests.length > 0 && (
          <Section label="Skyldig / mangler" color="error">
            {dueTests.map((t) => (
              <TestRow key={t.testNumber} test={t} />
            ))}
          </Section>
        )}

        {completedTests.length > 0 && (
          <Section label="Fullført" color="primary">
            {completedTests.map((t) => (
              <TestRow key={t.testNumber} test={t} />
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({
  label,
  color,
  children,
}: {
  label: string;
  color: "primary" | "error";
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4">
      <div
        className={`text-[10px] uppercase tracking-[0.12em] font-bold mb-2 ${
          color === "error" ? "text-error" : "text-primary"
        }`}
      >
        {label}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function TestRow({ test }: { test: TestRow }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-surface-container-low px-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-sm text-on-surface truncate">
          T{test.testNumber}. {test.name}
        </div>
        <div className="text-xs text-on-surface-variant truncate">
          {test.category} · {test.formula}
        </div>
      </div>
      <div className="text-right shrink-0">
        {test.latest ? (
          <>
            <div className="flex items-center gap-1 justify-end">
              <span className="font-mono font-bold text-on-surface tabular-nums">
                {test.latest.value.toFixed(1)}
              </span>
              <span className="text-xs text-on-surface-variant">{test.unit}</span>
              {test.latest.passed ? (
                <Icon name="check_circle" size={14} className="text-primary ml-1" filled />
              ) : (
                <Icon name="cancel" size={14} className="text-error ml-1" filled />
              )}
            </div>
            <div className="text-[10px] text-on-surface-variant">
              {test.daysSince !== null
                ? `${test.daysSince}d siden`
                : new Date(test.latest.createdAt).toLocaleDateString("no-NO")}
            </div>
          </>
        ) : (
          <div className="text-xs text-error font-semibold">Ikke utført</div>
        )}
      </div>
    </div>
  );
}
