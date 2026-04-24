"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit3 } from "lucide-react";
import { CoachHQTopbar, useCoachHQSidebar } from "@/components/portal/coach-hq";
import {
  AdminStatCard,
  AdminPageHeader,
  AdminTimeline,
  AdminLineChart,
  AdminBarChart,
  AdminProgressRing,
  type AdminTimelineItem,
  type AdminLineChartDatum,
  type AdminBarChartDatum,
} from "@/components/portal/coach-hq/ui";
import { Badge, Tabs } from "@/components/ui";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { getOrCreateConversation } from "@/app/admin/(authed)/meldinger/chat-actions";
import { TrainingDataTabs } from "./training-data-tabs";
import { StudentForecastTab } from "@/components/portal/coach-hq/student-forecast-tab";
import { StudentSummaryTab } from "@/components/portal/coach-hq/student-summary-tab";
import { DrillStudio } from "@/components/portal/coach-hq/drill-studio";
import { TestRegister } from "@/components/portal/coach-hq/test-register";
import { NextSessionPlanner } from "@/components/portal/coach-hq/next-session-planner";
import type { getStudentProfile } from "./actions";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Profile = NonNullable<Awaited<ReturnType<typeof getStudentProfile>>>;

interface Props {
  profile: Profile;
}

const TIER_LABEL: Record<string, string> = {
  ELITE: "Elite",
  PRO: "Pro",
  STARTER: "Starter",
  ACADEMY: "Academy",
  VISITOR: "Visitor",
};

function getInitials(name: string | null): string {
  if (!name) return "??";
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function StudentDetailClient({ profile }: Props) {
  const { toggle } = useCoachHQSidebar();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const router = useRouter();
  const [isSendingMessage, startSendingMessage] = useTransition();

  function handleSendMessage() {
    startSendingMessage(async () => {
      const result = await getOrCreateConversation(profile.id);
      if (result.conversationId) {
        router.push("/admin/meldinger");
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Beregn data for grafer
  // ---------------------------------------------------------------------------

  const handicapTrend: AdminLineChartDatum[] = profile.HandicapEntry.map((h) => ({
    label: format(new Date(h.date), "MMM yy", { locale: nb }),
    value: h.handicapIndex,
  }));

  const hcpChange =
    profile.HandicapEntry.length >= 2
      ? profile.HandicapEntry[profile.HandicapEntry.length - 1].handicapIndex -
        profile.HandicapEntry[0].handicapIndex
      : null;

  // Bookinger gruppert per maned (siste 8 maneder)
  const trainingVolume: AdminBarChartDatum[] = (() => {
    const months = new Map<string, number>();
    const now = new Date();
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = format(d, "MMM", { locale: nb });
      months.set(key, 0);
    }
    for (const b of profile.Booking) {
      const d = new Date(b.startTime);
      const key = format(d, "MMM", { locale: nb });
      if (months.has(key)) {
        months.set(key, (months.get(key) ?? 0) + 1);
      }
    }
    return Array.from(months.entries()).map(([label, value]) => ({ label, value }));
  })();

  // Aktivitetstimeline fra bookinger og coaching-sessions
  const activityTimeline: AdminTimelineItem[] = [
    ...profile.Booking.slice(0, 5).map((b) => ({
      id: `b-${b.id}`,
      title: `${(b.ServiceType as { name?: string })?.name ?? "Booking"} gjennomfort`,
      description: extractInstructorName(b.Instructor),
      date: format(new Date(b.startTime), "d. MMM", { locale: nb }),
      icon: <Icon name="check_circle" className="w-3 h-3" />,
      color: "var(--color-success)",
    })),
    ...profile.CoachingSession.slice(0, 3).map((cs) => ({
      id: `cs-${cs.id}`,
      title: cs.primaryFocus
        ? `Coaching: ${cs.primaryFocus}`
        : "Coaching-okt gjennomfort",
      description: cs.instructorNotes?.slice(0, 80) ?? undefined,
      date: format(new Date(cs.sessionDate), "d. MMM", { locale: nb }),
      icon: <Icon name="menu_book" className="w-3 h-3" />,
      color: "var(--color-primary)",
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8);

  // Mal fra Goal
  const goals = profile.Goal.filter((g) => g.status === "ACTIVE").map((g) => {
    const target = g.targetValue ?? 0;
    const current = g.currentValue ?? 0;
    const progress = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
    return { ...g, progress };
  });

  const monthlyGoal = 10; // Standard mal

  const tabs = [
    { id: "overview", label: "Oversikt" },
    { id: "training", label: "Trening" },
    { id: "sammendrag", label: "Sammendrag" },
    { id: "drills", label: "Drills" },
    { id: "tests", label: "Tester" },
    { id: "neste", label: "Planlegg neste" },
    { id: "forecast", label: "Forecast" },
    { id: "notes", label: "Notater og data" },
  ];

  return (
    <>
      <CoachHQTopbar
        title="Elev-profil"
        subtitle={profile.name ?? "Elev"}
        onMenuClick={toggle}
      />

      <div className="p-6 space-y-6">
        <AdminPageHeader
          title={profile.name ?? "Elev"}
          subtitle="Coaching-historikk, malsettinger og kommunikasjon"
          breadcrumbs={[
            { label: "Elever", href: "/admin/spillere" },
            { label: profile.name ?? "Elev" },
          ]}
          actions={
            <>
              <Link href="/admin/kalender">
                <button className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-on-surface text-surface hover:bg-inverse-surface transition-colors">
                  <Icon name="calendar_today" className="w-4 h-4" />
                  Book ny time
                </button>
              </Link>
              <button
                onClick={handleSendMessage}
                disabled={isSendingMessage}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-surface-container-lowest border border-outline-variant/30 text-on-surface hover:bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon name="chat" className="w-4 h-4" />
                {isSendingMessage ? "Starter samtale..." : "Send melding"}
              </button>
              <Link href={`/admin/treningsplan?studentId=${profile.id}`}>
                <button className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-surface-container-lowest border border-outline-variant/30 text-on-surface hover:bg-[var(--color-grey-50)] transition-colors">
                  <Icon name="description" className="w-4 h-4" />
                  Treningsplan
                </button>
              </Link>
              <button
                disabled
                title="Kommer snart"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface transition-colors cursor-not-allowed"
              >
                <Icon name="edit" className="w-4 h-4" />
                Rediger
              </button>
            </>
          }
        />

        {/* Profile Header Card */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-surface text-text flex items-center justify-center text-xl font-semibold">
                {getInitials(profile.name)}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-on-surface">
                  {profile.name ?? "Uten navn"}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <Badge variant="info">
                    {TIER_LABEL[profile.subscriptionTier] ?? profile.subscriptionTier}
                  </Badge>
                  <Badge variant={profile.isActive ? "success" : "muted"}>
                    {profile.isActive ? "Aktiv" : "Inaktiv"}
                  </Badge>
                  {profile.category && (
                    <Badge variant="muted">Kat {profile.category}</Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-on-surface-variant">
                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="flex items-center gap-1.5 hover:text-text transition-colors"
                    >
                      <Icon name="mail" className="w-4 h-4" />
                      {profile.email}
                    </a>
                  )}
                  {profile.phone && (
                    <a
                      href={`tel:${profile.phone}`}
                      className="flex items-center gap-1.5 hover:text-[var(--color-grey-700)] transition-colors"
                    >
                      <Icon name="phone" className="w-4 h-4" />
                      {profile.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-4 gap-4 lg:border-l lg:border-outline-variant/30 lg:pl-6 items-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-on-surface tabular-nums">
                  {profile.handicap !== null ? profile.handicap.toFixed(1) : "—"}
                </div>
                <div className="text-xs text-on-surface-variant mt-0.5">
                  Handicap
                </div>
                {hcpChange !== null && (
                  <div
                    className={`text-xs flex items-center justify-center gap-0.5 mt-1 ${
                      hcpChange < 0
                        ? "text-success-text"
                        : "text-error"
                    }`}
                  >
                    {hcpChange < 0 ? (
                      <Icon name="trending_down" className="w-3 h-3" />
                    ) : (
                      <Icon name="trending_up" className="w-3 h-3" />
                    )}
                    {hcpChange > 0 ? "+" : ""}
                    {hcpChange.toFixed(1)}
                  </div>
                )}
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-on-surface tabular-nums">
                  {profile.totalSessions}
                </div>
                <div className="text-xs text-on-surface-variant mt-0.5">
                  Okter totalt
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-success-text tabular-nums">
                  {profile.attendanceRate}%
                </div>
                <div className="text-xs text-on-surface-variant mt-0.5">
                  Oppmote
                </div>
              </div>
              <div className="flex items-center justify-center">
                <AdminProgressRing
                  value={profile.sessionsThisMonth}
                  max={monthlyGoal}
                  size={84}
                 
                  valueSuffix=""
                  label={`av ${monthlyGoal}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard
            label="Siste okt"
            value={
              profile.Booking.length > 0
                ? format(new Date(profile.Booking[0].startTime), "d. MMM", {
                    locale: nb,
                  })
                : "—"
            }
            icon={<Icon name="schedule" className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Neste okt"
            value={
              profile.UpcomingBooking.length > 0
                ? format(
                    new Date(profile.UpcomingBooking[0].startTime),
                    "d. MMM",
                    { locale: nb },
                  )
                : "—"
            }
            icon={<Icon name="calendar_today" className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Okter denne maneden"
            value={profile.sessionsThisMonth}
            icon={<Icon name="my_location" className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Kategori"
            value={profile.category ?? "—"}
            icon={<Icon name="workspace_premium" className="w-5 h-5" />}
          />
        </div>

        {/* Tabs */}
        <Tabs
          items={tabs}
          value={activeTab}
          onValueChange={setActiveTab}
        />

        {/* Tab: Oversikt */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {handicapTrend.length > 1 && (
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-on-surface">
                    Handicap-utvikling
                  </h3>
                  <span className="text-xs text-on-surface-variant">
                    {handicapTrend.length} maling{handicapTrend.length !== 1 ? "er" : ""}
                  </span>
                </div>
                <AdminLineChart
                  data={handicapTrend}
                  height={220}
                  color="var(--color-primary)"
                  valueLabel="Handicap"
                />
              </div>
            )}

            <div className="bg-surface-container-lowest rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-on-surface">
                  Manedlig mal
                </h3>
              </div>
              <div className="flex flex-col items-center gap-3">
                <AdminProgressRing
                  value={profile.sessionsThisMonth}
                  max={monthlyGoal}
                  size={140}
                 
                  valueSuffix=""
                  label={`av ${monthlyGoal} okter`}
                />
                <p className="text-xs text-center text-on-surface-variant">
                  {Math.max(0, monthlyGoal - profile.sessionsThisMonth)} okter
                  igjen denne maneden
                </p>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-on-surface">
                  Treningsvolum
                </h3>
                <span className="text-xs text-on-surface-variant">
                  Okter per maned
                </span>
              </div>
              <AdminBarChart
                data={trainingVolume}
                height={220}
                color="var(--color-primary)"
                valueLabel="Okter"
              />
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-on-surface">
                  Malsettinger
                </h3>
                <button
                  className="p-1.5 rounded-md text-on-surface-variant opacity-50 cursor-not-allowed"
                  disabled
                  title="Kommer snart"
                >
                  <Icon name="add" className="w-4 h-4" />
                </button>
              </div>
              {goals.length > 0 ? (
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <div
                      key={goal.id}
                      className="p-3 rounded-lg bg-surface border border-outline-variant/20"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-on-surface">
                          {goal.title}
                        </h4>
                        {goal.targetDate && (
                          <span className="text-xs text-on-surface-variant">
                            {format(new Date(goal.targetDate), "MMM yyyy", {
                              locale: nb,
                            })}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-on-surface tabular-nums">
                          {goal.currentValue ?? 0}
                        </span>
                        <span className="text-xs text-on-surface-variant">
                          / {goal.targetValue ?? "?"}
                        </span>
                        <span className="text-xs text-success-text ml-auto">
                          {goal.progress}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <div
                          className="h-full bg-on-surface rounded-full"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-on-surface-variant py-4 text-center">
                  Ingen aktive mal
                </p>
              )}
            </div>

            {activityTimeline.length > 0 && (
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 lg:col-span-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-on-surface">
                    Aktivitetslogg
                  </h3>
                  <span className="text-xs text-on-surface-variant">
                    Siste aktiviteter
                  </span>
                </div>
                <AdminTimeline items={activityTimeline} />
              </div>
            )}
          </div>
        )}

        {/* Tab: Trening (kommende + historikk) */}
        {activeTab === "training" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-surface-container-lowest rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-on-surface">
                  Kommende bookinger
                </h3>
                <Link
                  href="/admin/bookinger/ny"
                  className="text-xs text-on-surface hover:underline"
                >
                  + Ny
                </Link>
              </div>
              {profile.UpcomingBooking.length > 0 ? (
                <div className="space-y-3">
                  {profile.UpcomingBooking.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-3 rounded-lg bg-surface border border-outline-variant/20"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-on-surface">
                          {format(new Date(booking.startTime), "EEEE d. MMMM", {
                            locale: nb,
                          })}
                        </span>
                        <Badge variant="success">{booking.status}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                        <span className="flex items-center gap-1">
                          <Icon name="schedule" className="w-3 h-3" />
                          {format(new Date(booking.startTime), "HH:mm")}
                        </span>
                        <span>
                          {(booking.ServiceType as { name?: string })?.name}
                        </span>
                        <span>{extractInstructorName(booking.Instructor)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-on-surface-variant py-4 text-center">
                  Ingen kommende bookinger
                </p>
              )}
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-card p-6">
              <h3 className="text-lg font-semibold text-on-surface mb-4">
                Treningshistorikk
              </h3>
              {profile.Booking.length > 0 ? (
                <div className="space-y-3">
                  {profile.Booking.slice(0, 10).map((session) => (
                    <div
                      key={session.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-surface border border-outline-variant/20"
                    >
                      <div className="p-2 rounded-lg bg-surface-container-lowest text-on-surface border border-[var(--color-grey-100)]">
                        <Icon name="calendar_today" className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium text-on-surface">
                            {(session.ServiceType as { name?: string })?.name ??
                              "Okt"}
                          </h4>
                          <Badge variant="muted">{session.status}</Badge>
                        </div>
                        <p className="text-xs text-on-surface-variant">
                          {format(new Date(session.startTime), "d. MMMM yyyy", {
                            locale: nb,
                          })}{" "}
                          — {extractInstructorName(session.Instructor)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-on-surface-variant py-4 text-center">
                  Ingen treningshistorikk
                </p>
              )}
            </div>

            {/* Aktiv treningsplan */}
            {profile.ActivePlan && (
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-on-surface">
                    Aktiv treningsplan
                  </h3>
                  <Link
                    href={`/admin/treningsplan?studentId=${profile.id}`}
                    className="text-xs text-on-surface hover:underline"
                  >
                    Se full plan
                  </Link>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-outline-variant/20">
                  <Icon name="description" className="w-5 h-5 text-on-surface" />
                  <div>
                    <div className="text-sm font-medium text-on-surface">
                      {profile.ActivePlan.title}
                    </div>
                    <div className="text-xs text-on-surface-variant">
                      {profile.ActivePlan.periodType} —{" "}
                      {format(new Date(profile.ActivePlan.startDate), "d. MMM", {
                        locale: nb,
                      })}{" "}
                      til{" "}
                      {format(new Date(profile.ActivePlan.endDate), "d. MMM yyyy", {
                        locale: nb,
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Sammendrag */}
        {activeTab === "sammendrag" && (
          <StudentSummaryTab
            studentId={profile.id}
            studentName={profile.name ?? "Elev"}
          />
        )}

        {/* Tab: Drills */}
        {activeTab === "drills" && (
          <DrillStudio
            studentId={profile.id}
            studentName={profile.name ?? "Elev"}
          />
        )}

        {/* Tab: Tester */}
        {activeTab === "tests" && (
          <TestRegister studentId={profile.id} />
        )}

        {/* Tab: Planlegg neste */}
        {activeTab === "neste" && (
          <NextSessionPlanner
            studentId={profile.id}
            studentName={profile.name ?? "Elev"}
          />
        )}

        {/* Tab: Forecast */}
        {activeTab === "forecast" && (
          <StudentForecastTab userId={profile.id} />
        )}

        {/* Tab: Notater og data (TrainingDataTabs) */}
        {activeTab === "notes" && (
          <TrainingDataTabs
            studentId={profile.id}
            studentName={profile.name ?? "Elev"}
          />
        )}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractInstructorName(instructor: unknown): string {
  if (!instructor) return "";
  const inst = instructor as { User?: { name?: string } };
  return inst.User?.name ?? "";
}
