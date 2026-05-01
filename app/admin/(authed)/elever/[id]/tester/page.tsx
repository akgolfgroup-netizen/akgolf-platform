import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, CheckCircle2, AlertCircle, Circle } from "lucide-react";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { CoachHQDarkShell } from "@/components/admin/coachhq-dark";
import { getCoachTestRegister } from "./actions";

export const metadata: Metadata = {
  title: "Test-register | CoachHQ",
};

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

const CATEGORY_ORDER = ["TRACKMAN", "SHORT_GAME", "PUTTING", "PHYSICAL", "MENTAL"] as const;
const CATEGORY_LABELS: Record<string, string> = {
  TRACKMAN: "TrackMan",
  SHORT_GAME: "Kortspill",
  PUTTING: "Putting",
  PHYSICAL: "Fysisk",
  MENTAL: "Mental",
};

export default async function StudentTesterPage({ params }: PageProps) {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) redirect("/portal");

  const { id } = await params;
  const data = await getCoachTestRegister(id);
  if (!data) notFound();

  const { studentName, rows, stats } = data;
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    tests: rows.filter((r) => r.category === cat),
  })).filter((g) => g.tests.length > 0);

  return (
    <CoachHQDarkShell
      user={{ id: user.id, name: user.name, email: user.email, role: user.role, image: user.image }}
      title={`${studentName ?? "Spiller"} · Test-register`}
      meta={`${stats.completedTests}/${stats.totalTests} utfort · ${stats.overdueTests} forfalt`}
    >
      <div className="space-y-6">
        <Link
          href={`/admin/elever?id=${id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold"
          style={{ color: "#D1F843" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Tilbake til spillerprofil
        </Link>

        {/* Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard label="Utfort" value={`${stats.completedTests}/${stats.totalTests}`} accent />
          <StatCard label="Forfalt" value={String(stats.overdueTests)} alert={stats.overdueTests > 0} />
          <StatCard label="Bestatt" value={String(stats.passedTests)} />
          <StatCard label="Ikke startet" value={String(stats.totalTests - stats.completedTests)} />
        </section>

        {/* Test-grupper */}
        {grouped.map((group) => (
          <section
            key={group.category}
            className="rounded-2xl p-6"
            style={{ background: "#0D2E23", border: "1px solid #1a4a3a" }}
          >
            <header className="mb-4 flex items-center justify-between">
              <div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "10px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#D1F843",
                    fontWeight: 700,
                  }}
                >
                  / {group.label} · {group.tests.length} tester
                </div>
                <h2
                  className="mt-1 text-[20px] font-bold tracking-tight"
                  style={{ color: "#FFFFFF" }}
                >
                  {group.label}
                </h2>
              </div>
            </header>

            <div className="space-y-2">
              {group.tests.map((t) => (
                <TestRow key={t.testNumber} test={t} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </CoachHQDarkShell>
  );
}

function StatCard({
  label,
  value,
  accent,
  alert,
}: {
  label: string;
  value: string;
  accent?: boolean;
  alert?: boolean;
}) {
  return (
    <div
      className="rounded-xl px-4 py-3.5"
      style={{
        background: alert
          ? "rgba(184,66,51,0.10)"
          : accent
            ? "rgba(209,248,67,0.08)"
            : "#0D2E23",
        border: `1px solid ${alert ? "rgba(184,66,51,0.45)" : "#1a4a3a"}`,
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "10px",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.55)",
        }}
      >
        {label}
      </div>
      <div
        className="mt-1 text-[24px] font-bold leading-none tracking-tight"
        style={{
          color: alert ? "#F49283" : accent ? "#D1F843" : "#FFFFFF",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
    </div>
  );
}

interface TestRowProps {
  test: {
    testNumber: number;
    name: string;
    unit: string;
    latest: { value: number; passed: boolean; createdAt: Date } | null;
    historyCount: number;
    daysSinceLatest: number | null;
    retestDue: boolean;
  };
}

function TestRow({ test }: TestRowProps) {
  const status = !test.latest
    ? "not-started"
    : test.retestDue
      ? "overdue"
      : test.latest.passed
        ? "passed"
        : "failed";

  return (
    <div
      className="grid items-center gap-3 px-3 py-2.5 rounded-lg"
      style={{
        gridTemplateColumns: "32px 1fr 100px 120px 90px",
        background: "rgba(255,255,255,0.025)",
      }}
    >
      <div className="grid place-items-center">
        {status === "passed" ? (
          <CheckCircle2 className="w-5 h-5" style={{ color: "#6FCBA1" }} />
        ) : status === "failed" ? (
          <AlertCircle className="w-5 h-5" style={{ color: "#E8B967" }} />
        ) : status === "overdue" ? (
          <AlertCircle className="w-5 h-5" style={{ color: "#F49283" }} />
        ) : (
          <Circle className="w-5 h-5" style={{ color: "rgba(255,255,255,0.3)" }} />
        )}
      </div>

      <div className="min-w-0">
        <div className="text-[13px] font-semibold text-white truncate">
          T{test.testNumber}. {test.name}
        </div>
        <div
          className="text-[10px]"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.06em",
          }}
        >
          {test.historyCount > 0
            ? `${test.historyCount} resultat${test.historyCount === 1 ? "" : "er"}`
            : "Ikke utfort"}
        </div>
      </div>

      <div className="text-right">
        {test.latest ? (
          <span
            className="text-[14px] font-bold tabular-nums"
            style={{ color: "#FFFFFF" }}
          >
            {test.latest.value.toFixed(1)}{" "}
            <small
              className="font-medium"
              style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)" }}
            >
              {test.unit}
            </small>
          </span>
        ) : (
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>—</span>
        )}
      </div>

      <div className="text-right">
        {test.daysSinceLatest !== null ? (
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              color: test.retestDue
                ? "#E8B967"
                : "rgba(255,255,255,0.55)",
            }}
          >
            {test.daysSinceLatest}d siden
          </span>
        ) : (
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>—</span>
        )}
      </div>

      <div className="text-right">
        <StatusPill status={status} />
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: "passed" | "failed" | "overdue" | "not-started" }) {
  const config = {
    passed: { bg: "rgba(42,125,90,0.20)", color: "#6FCBA1", label: "Bestatt" },
    failed: { bg: "rgba(232,185,103,0.20)", color: "#E8B967", label: "Ikke best." },
    overdue: { bg: "rgba(244,146,131,0.20)", color: "#F49283", label: "Forfalt" },
    "not-started": { bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", label: "Ikke startet" },
  }[status];

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded uppercase font-bold"
      style={{
        background: config.bg,
        color: config.color,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "9px",
        letterSpacing: "0.10em",
      }}
    >
      {config.label}
    </span>
  );
}
