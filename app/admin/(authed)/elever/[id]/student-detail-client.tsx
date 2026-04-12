"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  Calendar,
  Edit3,
  TrendingDown,
  TrendingUp,
  Target,
  Award,
  Clock,
  FileText,
  MessageSquare,
  Plus,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
  AdminCard,
  AdminButton,
  AdminBadge,
  AdminStatCard,
  AdminPageHeader,
  AdminTabs,
  AdminTimeline,
  AdminLineChart,
  AdminBarChart,
  AdminProgressRing,
  type AdminTimelineItem,
  type AdminLineChartDatum,
  type AdminBarChartDatum,
} from "@/components/portal/mission-control/ui";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { getOrCreateConversation } from "@/app/admin/(authed)/meldinger/chat-actions";
import { TrainingDataTabs } from "./training-data-tabs";
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
  const { toggle } = useMCSidebar();
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
      icon: <CheckCircle2 className="w-3 h-3" />,
      color: "var(--color-success)",
    })),
    ...profile.CoachingSession.slice(0, 3).map((cs) => ({
      id: `cs-${cs.id}`,
      title: cs.primaryFocus
        ? `Coaching: ${cs.primaryFocus}`
        : "Coaching-okt gjennomfort",
      description: cs.instructorNotes?.slice(0, 80) ?? undefined,
      date: format(new Date(cs.sessionDate), "d. MMM", { locale: nb }),
      icon: <BookOpen className="w-3 h-3" />,
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
    { id: "notes", label: "Notater og data" },
  ];

  return (
    <>
      <MCTopbar
        title="Elev-profil"
        subtitle={profile.name ?? "Elev"}
        onMenuClick={toggle}
      />

      <div className="p-6 space-y-6">
        <AdminPageHeader
          title={profile.name ?? "Elev"}
          subtitle="Coaching-historikk, malsettinger og kommunikasjon"
          breadcrumbs={[
            { label: "Elever", href: "/admin/elever" },
            { label: profile.name ?? "Elev" },
          ]}
          actions={
            <>
              <AdminButton
                variant="primary"
                icon={<Calendar className="w-4 h-4" />}
              >
                Book ny time
              </AdminButton>
              <AdminButton
                variant="secondary"
                icon={<MessageSquare className="w-4 h-4" />}
                onClick={handleSendMessage}
                loading={isSendingMessage}
              >
                {isSendingMessage ? "Starter samtale..." : "Send melding"}
              </AdminButton>
              <Link href={`/admin/treningsplan?studentId=${profile.id}`}>
                <AdminButton
                  variant="secondary"
                  icon={<FileText className="w-4 h-4" />}
                >
                  Treningsplan
                </AdminButton>
              </Link>
              <AdminButton
                variant="ghost"
                icon={<Edit3 className="w-4 h-4" />}
              >
                Rediger
              </AdminButton>
            </>
          }
        />

        {/* Profile Header */}
        <AdminCard>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-xl font-semibold">
                {getInitials(profile.name)}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  {profile.name ?? "Uten navn"}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <AdminBadge variant="info">
                    {TIER_LABEL[profile.subscriptionTier] ?? profile.subscriptionTier}
                  </AdminBadge>
                  <AdminBadge variant={profile.isActive ? "success" : "muted"}>
                    {profile.isActive ? "Aktiv" : "Inaktiv"}
                  </AdminBadge>
                  {profile.category && (
                    <AdminBadge variant="muted">Kat {profile.category}</AdminBadge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-[var(--color-muted)]">
                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="flex items-center gap-1.5 hover:text-[var(--color-primary)] transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      {profile.email}
                    </a>
                  )}
                  {profile.phone && (
                    <a
                      href={`tel:${profile.phone}`}
                      className="flex items-center gap-1.5 hover:text-[var(--color-primary)] transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      {profile.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-4 gap-4 lg:border-l lg:border-[var(--color-grey-200)] lg:pl-6 items-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--color-primary)] tabular-nums">
                  {profile.handicap !== null ? profile.handicap.toFixed(1) : "—"}
                </div>
                <div className="text-xs text-[var(--color-muted)] mt-0.5">
                  Handicap
                </div>
                {hcpChange !== null && (
                  <div
                    className={`text-xs flex items-center justify-center gap-0.5 mt-1 ${
                      hcpChange < 0
                        ? "text-[var(--color-success)]"
                        : "text-[var(--color-error)]"
                    }`}
                  >
                    {hcpChange < 0 ? (
                      <TrendingDown className="w-3 h-3" />
                    ) : (
                      <TrendingUp className="w-3 h-3" />
                    )}
                    {hcpChange > 0 ? "+" : ""}
                    {hcpChange.toFixed(1)}
                  </div>
                )}
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--color-text)] tabular-nums">
                  {profile.totalSessions}
                </div>
                <div className="text-xs text-[var(--color-muted)] mt-0.5">
                  Okter totalt
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--color-success)] tabular-nums">
                  {profile.attendanceRate}%
                </div>
                <div className="text-xs text-[var(--color-muted)] mt-0.5">
                  Oppmote
                </div>
              </div>
              <div className="flex items-center justify-center">
                <AdminProgressRing
                  value={profile.sessionsThisMonth}
                  max={monthlyGoal}
                  size={84}
                  strokeWidth={7}
                  valueSuffix=""
                  label={`av ${monthlyGoal}`}
                />
              </div>
            </div>
          </div>
        </AdminCard>

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
            icon={<Clock className="w-5 h-5" />}
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
            icon={<Calendar className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Okter denne maneden"
            value={profile.sessionsThisMonth}
            icon={<Target className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Kategori"
            value={profile.category ?? "—"}
            icon={<Award className="w-5 h-5" />}
          />
        </div>

        {/* Tabs */}
        <AdminTabs
          items={tabs}
          value={activeTab}
          onValueChange={setActiveTab}
        />

        {/* Tab: Oversikt */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {handicapTrend.length > 1 && (
              <AdminCard className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="admin-section-title">Handicap-utvikling</h3>
                  <span className="text-xs text-[var(--color-muted)]">
                    {handicapTrend.length} maling{handicapTrend.length !== 1 ? "er" : ""}
                  </span>
                </div>
                <AdminLineChart
                  data={handicapTrend}
                  height={220}
                  color="var(--color-primary)"
                  valueLabel="Handicap"
                />
              </AdminCard>
            )}

            <AdminCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="admin-section-title">Manedlig mal</h3>
              </div>
              <div className="flex flex-col items-center gap-3">
                <AdminProgressRing
                  value={profile.sessionsThisMonth}
                  max={monthlyGoal}
                  size={140}
                  strokeWidth={10}
                  valueSuffix=""
                  label={`av ${monthlyGoal} okter`}
                />
                <p className="text-xs text-center text-[var(--color-muted)]">
                  {Math.max(0, monthlyGoal - profile.sessionsThisMonth)} okter
                  igjen denne maneden
                </p>
              </div>
            </AdminCard>

            <AdminCard className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="admin-section-title">Treningsvolum</h3>
                <span className="text-xs text-[var(--color-muted)]">
                  Okter per maned
                </span>
              </div>
              <AdminBarChart
                data={trainingVolume}
                height={220}
                color="var(--color-primary)"
                valueLabel="Okter"
              />
            </AdminCard>

            <AdminCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="admin-section-title">Malsettinger</h3>
                <button className="p-1.5 rounded-md hover:bg-[var(--color-grey-100)] text-[var(--color-primary)]">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {goals.length > 0 ? (
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <div
                      key={goal.id}
                      className="p-3 rounded-lg bg-[var(--color-grey-100)]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-[var(--color-text)]">
                          {goal.title}
                        </h4>
                        {goal.targetDate && (
                          <span className="text-xs text-[var(--color-muted)]">
                            {format(new Date(goal.targetDate), "MMM yyyy", {
                              locale: nb,
                            })}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-[var(--color-text)] tabular-nums">
                          {goal.currentValue ?? 0}
                        </span>
                        <span className="text-xs text-[var(--color-muted)]">
                          / {goal.targetValue ?? "?"}
                        </span>
                        <span className="text-xs text-[var(--color-success)] ml-auto">
                          {goal.progress}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-[var(--color-grey-200)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--color-primary)] rounded-full"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--color-muted)] py-4 text-center">
                  Ingen aktive mal
                </p>
              )}
            </AdminCard>

            {activityTimeline.length > 0 && (
              <AdminCard className="lg:col-span-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="admin-section-title">Aktivitetslogg</h3>
                  <span className="text-xs text-[var(--color-muted)]">
                    Siste aktiviteter
                  </span>
                </div>
                <AdminTimeline items={activityTimeline} />
              </AdminCard>
            )}
          </div>
        )}

        {/* Tab: Trening (kommende + historikk) */}
        {activeTab === "training" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdminCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="admin-section-title">Kommende bookinger</h3>
                <Link
                  href="/admin/bookinger/ny"
                  className="text-xs text-[var(--color-primary)] hover:underline"
                >
                  + Ny
                </Link>
              </div>
              {profile.UpcomingBooking.length > 0 ? (
                <div className="space-y-3">
                  {profile.UpcomingBooking.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-3 rounded-lg bg-[var(--color-grey-100)]"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-[var(--color-text)]">
                          {format(new Date(booking.startTime), "EEEE d. MMMM", {
                            locale: nb,
                          })}
                        </span>
                        <AdminBadge variant="success">{booking.status}</AdminBadge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[var(--color-muted)]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
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
                <p className="text-sm text-[var(--color-muted)] py-4 text-center">
                  Ingen kommende bookinger
                </p>
              )}
            </AdminCard>

            <AdminCard>
              <h3 className="admin-section-title mb-4">Treningshistorikk</h3>
              {profile.Booking.length > 0 ? (
                <div className="space-y-3">
                  {profile.Booking.slice(0, 10).map((session) => (
                    <div
                      key={session.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-grey-100)]"
                    >
                      <div className="p-2 rounded-lg bg-white text-[var(--color-primary)]">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium text-[var(--color-text)]">
                            {(session.ServiceType as { name?: string })?.name ??
                              "Okt"}
                          </h4>
                          <AdminBadge variant="muted">{session.status}</AdminBadge>
                        </div>
                        <p className="text-xs text-[var(--color-muted)]">
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
                <p className="text-sm text-[var(--color-muted)] py-4 text-center">
                  Ingen treningshistorikk
                </p>
              )}
            </AdminCard>

            {/* Aktiv treningsplan */}
            {profile.ActivePlan && (
              <AdminCard className="lg:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="admin-section-title">Aktiv treningsplan</h3>
                  <Link
                    href={`/admin/treningsplan?studentId=${profile.id}`}
                    className="text-xs text-[var(--color-primary)] hover:underline"
                  >
                    Se full plan
                  </Link>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-grey-100)]">
                  <FileText className="w-5 h-5 text-[var(--color-primary)]" />
                  <div>
                    <div className="text-sm font-medium text-[var(--color-text)]">
                      {profile.ActivePlan.title}
                    </div>
                    <div className="text-xs text-[var(--color-muted)]">
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
              </AdminCard>
            )}
          </div>
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
