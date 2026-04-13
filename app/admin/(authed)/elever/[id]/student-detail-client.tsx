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
              <Link href="/admin/kalender">
                <button className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#0A1F18] text-white hover:bg-[#1A3529] transition-colors">
                  <Calendar className="w-4 h-4" />
                  Book ny time
                </button>
              </Link>
              <button
                onClick={handleSendMessage}
                disabled={isSendingMessage}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white border border-[#D5DFDB] text-[#0A1F18] hover:bg-[#F5F8F7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageSquare className="w-4 h-4" />
                {isSendingMessage ? "Starter samtale..." : "Send melding"}
              </button>
              <Link href={`/admin/treningsplan?studentId=${profile.id}`}>
                <button className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white border border-[#D5DFDB] text-[#0A1F18] hover:bg-[var(--color-grey-50)] transition-colors">
                  <FileText className="w-4 h-4" />
                  Treningsplan
                </button>
              </Link>
              <button
                disabled
                title="Kommer snart"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#7A8C85] hover:bg-[#F5F8F7] transition-colors cursor-not-allowed"
              >
                <Edit3 className="w-4 h-4" />
                Rediger
              </button>
            </>
          }
        />

        {/* Profile Header Card */}
        <div className="bg-white border border-[#D5DFDB] rounded-xl p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-[#F5F8F7] text-[#324D45] flex items-center justify-center text-xl font-semibold">
                {getInitials(profile.name)}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#0A1F18]">
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
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-[#7A8C85]">
                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="flex items-center gap-1.5 hover:text-[#324D45] transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      {profile.email}
                    </a>
                  )}
                  {profile.phone && (
                    <a
                      href={`tel:${profile.phone}`}
                      className="flex items-center gap-1.5 hover:text-[var(--color-grey-700)] transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      {profile.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-4 gap-4 lg:border-l lg:border-[#D5DFDB] lg:pl-6 items-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#0A1F18] tabular-nums">
                  {profile.handicap !== null ? profile.handicap.toFixed(1) : "—"}
                </div>
                <div className="text-xs text-[#7A8C85] mt-0.5">
                  Handicap
                </div>
                {hcpChange !== null && (
                  <div
                    className={`text-xs flex items-center justify-center gap-0.5 mt-1 ${
                      hcpChange < 0
                        ? "text-[#1A4D36]"
                        : "text-[#EF4444]"
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
                <div className="text-3xl font-bold text-[#0A1F18] tabular-nums">
                  {profile.totalSessions}
                </div>
                <div className="text-xs text-[#7A8C85] mt-0.5">
                  Okter totalt
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#1A4D36] tabular-nums">
                  {profile.attendanceRate}%
                </div>
                <div className="text-xs text-[#7A8C85] mt-0.5">
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
              <div className="bg-white border border-[#D5DFDB] rounded-xl p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#0A1F18]">
                    Handicap-utvikling
                  </h3>
                  <span className="text-xs text-[#7A8C85]">
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

            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#0A1F18]">
                  Manedlig mal
                </h3>
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
                <p className="text-xs text-center text-[#7A8C85]">
                  {Math.max(0, monthlyGoal - profile.sessionsThisMonth)} okter
                  igjen denne maneden
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#D5DFDB] rounded-xl p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#0A1F18]">
                  Treningsvolum
                </h3>
                <span className="text-xs text-[#7A8C85]">
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

            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#0A1F18]">
                  Malsettinger
                </h3>
                <button
                  className="p-1.5 rounded-md text-[#7A8C85] opacity-50 cursor-not-allowed"
                  disabled
                  title="Kommer snart"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {goals.length > 0 ? (
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <div
                      key={goal.id}
                      className="p-3 rounded-lg bg-[#F5F8F7] border border-[#ECF0EF]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-[#0A1F18]">
                          {goal.title}
                        </h4>
                        {goal.targetDate && (
                          <span className="text-xs text-[#7A8C85]">
                            {format(new Date(goal.targetDate), "MMM yyyy", {
                              locale: nb,
                            })}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-[#0A1F18] tabular-nums">
                          {goal.currentValue ?? 0}
                        </span>
                        <span className="text-xs text-[#7A8C85]">
                          / {goal.targetValue ?? "?"}
                        </span>
                        <span className="text-xs text-[#1A4D36] ml-auto">
                          {goal.progress}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#ECF0EF] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0A1F18] rounded-full"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#7A8C85] py-4 text-center">
                  Ingen aktive mal
                </p>
              )}
            </div>

            {activityTimeline.length > 0 && (
              <div className="bg-white border border-[#D5DFDB] rounded-xl p-6 lg:col-span-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#0A1F18]">
                    Aktivitetslogg
                  </h3>
                  <span className="text-xs text-[#7A8C85]">
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
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#0A1F18]">
                  Kommende bookinger
                </h3>
                <Link
                  href="/admin/bookinger/ny"
                  className="text-xs text-[#0A1F18] hover:underline"
                >
                  + Ny
                </Link>
              </div>
              {profile.UpcomingBooking.length > 0 ? (
                <div className="space-y-3">
                  {profile.UpcomingBooking.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-3 rounded-lg bg-[#F5F8F7] border border-[#ECF0EF]"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-[#0A1F18]">
                          {format(new Date(booking.startTime), "EEEE d. MMMM", {
                            locale: nb,
                          })}
                        </span>
                        <AdminBadge variant="success">{booking.status}</AdminBadge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#7A8C85]">
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
                <p className="text-sm text-[#7A8C85] py-4 text-center">
                  Ingen kommende bookinger
                </p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-card p-6">
              <h3 className="text-lg font-semibold text-[#0A1F18] mb-4">
                Treningshistorikk
              </h3>
              {profile.Booking.length > 0 ? (
                <div className="space-y-3">
                  {profile.Booking.slice(0, 10).map((session) => (
                    <div
                      key={session.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-[#F5F8F7] border border-[#ECF0EF]"
                    >
                      <div className="p-2 rounded-lg bg-white text-[#0A1F18] border border-[var(--color-grey-100)]">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium text-[#0A1F18]">
                            {(session.ServiceType as { name?: string })?.name ??
                              "Okt"}
                          </h4>
                          <AdminBadge variant="muted">{session.status}</AdminBadge>
                        </div>
                        <p className="text-xs text-[#7A8C85]">
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
                <p className="text-sm text-[#7A8C85] py-4 text-center">
                  Ingen treningshistorikk
                </p>
              )}
            </div>

            {/* Aktiv treningsplan */}
            {profile.ActivePlan && (
              <div className="bg-white border border-[#D5DFDB] rounded-xl p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-[#0A1F18]">
                    Aktiv treningsplan
                  </h3>
                  <Link
                    href={`/admin/treningsplan?studentId=${profile.id}`}
                    className="text-xs text-[#0A1F18] hover:underline"
                  >
                    Se full plan
                  </Link>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F5F8F7] border border-[#ECF0EF]">
                  <FileText className="w-5 h-5 text-[#0A1F18]" />
                  <div>
                    <div className="text-sm font-medium text-[#0A1F18]">
                      {profile.ActivePlan.title}
                    </div>
                    <div className="text-xs text-[#7A8C85]">
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
