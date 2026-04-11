"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  TrendingDown,
  Activity,
  DollarSign,
  AlertTriangle,
  Calendar,
  ArrowDown,
  ArrowUp,
  Minus,
  RefreshCw,
} from "lucide-react";
import {
  getCoachKPIs,
  getStudentOverview,
  type CoachKPIs,
  type StudentOverviewRow,
} from "./analytics-actions";

// ─── KPI Card ────────────────────────────────────────────────

function KPICard({
  label,
  value,
  subtitle,
  icon,
  accentColor,
}: {
  label: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  accentColor?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[var(--color-grey-200)] p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-grey-500)]">
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            backgroundColor: accentColor
              ? `color-mix(in srgb, ${accentColor} 10%, transparent)`
              : "var(--color-grey-100)",
          }}
        >
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-[var(--color-grey-900)]">{value}</p>
      {subtitle && (
        <p className="text-xs text-[var(--color-grey-500)]">{subtitle}</p>
      )}
    </div>
  );
}

// ─── Trend indicator ─────────────────────────────────────────

function HcpTrend({ change }: { change: number | null }) {
  if (change === null) {
    return <Minus className="w-3.5 h-3.5 text-[var(--color-grey-400)]" />;
  }
  if (change < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-[var(--color-success-text)]">
        <ArrowDown className="w-3 h-3" />
        {Math.abs(change).toFixed(1)}
      </span>
    );
  }
  if (change > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-[var(--color-error)]">
        <ArrowUp className="w-3 h-3" />
        {change.toFixed(1)}
      </span>
    );
  }
  return <Minus className="w-3.5 h-3.5 text-[var(--color-grey-400)]" />;
}

// ─── Main component ──────────────────────────────────────────

export function CoachKPIClient() {
  const router = useRouter();
  const [kpis, setKpis] = useState<CoachKPIs | null>(null);
  const [students, setStudents] = useState<StudentOverviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [kpiData, studentData] = await Promise.all([
        getCoachKPIs(),
        getStudentOverview(),
      ]);
      if (!cancelled) {
        setKpis(kpiData);
        setStudents(studentData);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleRefresh() {
    startTransition(async () => {
      const [kpiData, studentData] = await Promise.all([
        getCoachKPIs(),
        getStudentOverview(),
      ]);
      setKpis(kpiData);
      setStudents(studentData);
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 border-2 border-[var(--color-grey-300)] border-t-[var(--color-brand)] rounded-full animate-spin" />
      </div>
    );
  }

  if (!kpis) return null;

  const now = new Date();
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-grey-900)]">
            Coach KPI Dashboard
          </h2>
          <p className="text-sm text-[var(--color-grey-500)] mt-0.5">
            Oversikt over elever, progresjon og inntekter
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isPending}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--color-grey-700)] bg-[var(--color-grey-100)] rounded-lg hover:bg-[var(--color-grey-200)] transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isPending ? "animate-spin" : ""}`}
          />
          Oppdater
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Aktive elever"
          value={String(kpis.activeStudentCount)}
          subtitle="Booking siste 60 dager"
          icon={
            <Users
              className="w-4 h-4"
              style={{ color: "var(--color-brand)" }}
            />
          }
          accentColor="var(--color-brand)"
        />
        <KPICard
          label="HCP-forbedring"
          value={
            kpis.avgHcpImprovement > 0
              ? `-${kpis.avgHcpImprovement}`
              : String(kpis.avgHcpImprovement)
          }
          subtitle="Snitt siste 3 mnd"
          icon={
            <TrendingDown
              className="w-4 h-4"
              style={{ color: "var(--color-success)" }}
            />
          }
          accentColor="var(--color-success)"
        />
        <KPICard
          label="Treningsetterlevelse"
          value={`${kpis.trainingAdherence}%`}
          subtitle={
            kpis.topFocusArea
              ? `Mest fokus: ${kpis.topFocusArea}`
              : "Denne uken"
          }
          icon={
            <Activity
              className="w-4 h-4"
              style={{ color: "var(--color-warning)" }}
            />
          }
          accentColor="var(--color-warning)"
        />
        <KPICard
          label="Inntekter"
          value={`kr ${kpis.totalRevenueThisMonth.toLocaleString("nb-NO")}`}
          subtitle={`${kpis.totalBookingsThisMonth} bookinger denne mnd`}
          icon={
            <DollarSign
              className="w-4 h-4"
              style={{ color: "var(--color-grey-700)" }}
            />
          }
        />
      </div>

      {/* Student table */}
      <div className="bg-white rounded-xl border border-[var(--color-grey-200)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-grey-100)]">
          <h3 className="text-sm font-semibold text-[var(--color-grey-900)]">
            Elevoversikt
          </h3>
          <p className="text-xs text-[var(--color-grey-500)] mt-0.5">
            {students.length} elever med bookinghistorikk
          </p>
        </div>

        {students.length === 0 ? (
          <p className="text-sm text-[var(--color-grey-400)] p-6 text-center">
            Ingen elever funnet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--color-grey-100)] border-b border-[var(--color-grey-200)]">
                <tr>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-[var(--color-grey-500)] uppercase">
                    Navn
                  </th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-[var(--color-grey-500)] uppercase">
                    HCP
                  </th>
                  <th className="text-center px-4 py-2.5 text-xs font-medium text-[var(--color-grey-500)] uppercase">
                    HCP trend
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-[var(--color-grey-500)] uppercase">
                    Sist aktiv
                  </th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-[var(--color-grey-500)] uppercase">
                    Etterlevelse
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-[var(--color-grey-500)] uppercase">
                    Storste gap
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-[var(--color-grey-500)] uppercase">
                    Neste booking
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-grey-100)]">
                {students.map((student) => {
                  const adherencePct =
                    student.planAdherence.total > 0
                      ? Math.round(
                          (student.planAdherence.completed /
                            student.planAdherence.total) *
                            100
                        )
                      : null;

                  const isInactive =
                    student.lastTrainingDate &&
                    new Date(student.lastTrainingDate) < fourteenDaysAgo;

                  const isHighAdherence =
                    adherencePct !== null && adherencePct >= 80;

                  return (
                    <tr
                      key={student.id}
                      onClick={() =>
                        router.push(`/admin/elever/${student.id}`)
                      }
                      className="hover:bg-[var(--color-grey-100)] cursor-pointer transition-colors"
                    >
                      {/* Name */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          {student.image ? (
                            <img
                              src={student.image}
                              alt=""
                              className="w-7 h-7 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-[var(--color-grey-200)] flex items-center justify-center text-xs font-medium text-[var(--color-grey-600)]">
                              {(student.name ?? "?").charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="text-sm font-medium text-[var(--color-grey-900)]">
                            {student.name}
                          </span>
                        </div>
                      </td>

                      {/* HCP */}
                      <td className="px-4 py-3 text-right text-sm font-semibold text-[var(--color-grey-900)]">
                        {student.latestHandicap !== null
                          ? student.latestHandicap.toFixed(1)
                          : "-"}
                      </td>

                      {/* HCP trend */}
                      <td className="px-4 py-3 text-center">
                        <HcpTrend change={student.handicapChange3m} />
                      </td>

                      {/* Last active */}
                      <td className="px-4 py-3">
                        <span
                          className={`text-sm ${
                            isInactive
                              ? "text-[var(--color-error)] font-medium"
                              : "text-[var(--color-grey-600)]"
                          }`}
                        >
                          {student.lastTrainingDate
                            ? formatRelativeDate(
                                new Date(student.lastTrainingDate)
                              )
                            : "-"}
                        </span>
                        {isInactive && (
                          <AlertTriangle className="inline-block w-3 h-3 ml-1 text-[var(--color-error)]" />
                        )}
                      </td>

                      {/* Adherence */}
                      <td className="px-4 py-3 text-right">
                        {adherencePct !== null ? (
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                              isHighAdherence
                                ? "bg-[var(--color-success)]/10 text-[var(--color-success-text)]"
                                : "bg-[var(--color-grey-100)] text-[var(--color-grey-600)]"
                            }`}
                          >
                            {adherencePct}%
                          </span>
                        ) : (
                          <span className="text-xs text-[var(--color-grey-400)]">
                            -
                          </span>
                        )}
                      </td>

                      {/* Biggest SG gap */}
                      <td className="px-4 py-3">
                        {student.biggestSGGap ? (
                          <span className="text-sm text-[var(--color-grey-700)]">
                            {student.biggestSGGap}
                          </span>
                        ) : (
                          <span className="text-xs text-[var(--color-grey-400)]">
                            -
                          </span>
                        )}
                      </td>

                      {/* Next booking */}
                      <td className="px-4 py-3">
                        {student.nextBooking ? (
                          <span className="inline-flex items-center gap-1 text-sm text-[var(--color-grey-700)]">
                            <Calendar className="w-3 h-3 text-[var(--color-grey-400)]" />
                            {new Date(student.nextBooking).toLocaleDateString(
                              "nb-NO",
                              { day: "numeric", month: "short" }
                            )}
                          </span>
                        ) : (
                          <span className="text-xs text-[var(--color-grey-400)]">
                            Ingen
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "I dag";
  if (diffDays === 1) return "I gar";
  if (diffDays < 7) return `${diffDays} dager siden`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} uker siden`;
  return date.toLocaleDateString("nb-NO", { day: "numeric", month: "short" });
}
