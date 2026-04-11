"use client";

import { useState, useTransition, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  Calendar,
  Edit3,
  MoreHorizontal,
  TrendingDown,
  Target,
  Award,
  Clock,
  FileText,
  MessageSquare,
  Plus,
  CheckCircle2,
  BookOpen,
  Mail as MailIcon,
  Activity,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
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
import { format, subDays } from "date-fns";
import { nb } from "date-fns/locale";
import { getOrCreateConversation } from "@/app/admin/meldinger/chat-actions";

// Mock data
const studentData = {
  id: "1",
  name: "Olav Hansen",
  email: "olav.hansen@example.com",
  phone: "+47 123 45 678",
  initials: "OH",
  handicap: 15.8,
  handicapHistory: [18.2, 17.5, 16.9, 16.2, 15.8],
  joinedDate: new Date("2023-08-15"),
  subscription: "Elite",
  status: "active" as const,
  goals: [
    {
      id: "1",
      title: "Nå handicap 15",
      target: 15,
      current: 15.8,
      deadline: "Sommeren 2024",
      progress: 89,
    },
    {
      id: "2",
      title: "Fullføre 50 økter",
      target: 50,
      current: 42,
      deadline: "Desember 2024",
      progress: 84,
    },
  ],
  stats: {
    totalSessions: 42,
    sessionsThisMonth: 8,
    lastSession: new Date(Date.now() - 86400000 * 2),
    nextSession: new Date(Date.now() + 86400000),
    avgFrequency: 2.1,
    attendanceRate: 94,
    monthlyGoal: 10,
  },
  sessionsPerMonth: [4, 6, 7, 5, 8, 9, 7, 8],
  sparkline: {
    sessions: [4, 6, 7, 5, 8, 9, 7, 8],
    attendance: [88, 90, 92, 91, 93, 94, 94, 94],
  },
};

const upcomingBookings = [
  {
    id: "1",
    date: new Date(Date.now() + 86400000),
    time: "10:00",
    service: "Privat Coaching",
    coach: "Anders Kristiansen",
    status: "confirmed",
  },
  {
    id: "2",
    date: new Date(Date.now() + 86400000 * 7),
    time: "14:00",
    service: "Videoanalyse",
    coach: "Anders Kristiansen",
    status: "confirmed",
  },
];

const trainingHistory = [
  {
    id: "1",
    date: subDays(new Date(), 2),
    service: "Privat Coaching",
    coach: "Anders Kristiansen",
    notes: "God progresjon på putting. Fokus på avstandskontroll neste gang.",
    focus: "Putting",
  },
  {
    id: "2",
    date: subDays(new Date(), 9),
    service: "Videoanalyse",
    coach: "Anders Kristiansen",
    notes: "Wedge-spill analyse. Sving ser bra ut.",
    focus: "Wedge",
  },
  {
    id: "3",
    date: subDays(new Date(), 16),
    service: "Privat Coaching",
    coach: "Anders Kristiansen",
    notes: "Jobbet med bunker-slag. Fortsatt utfordringer.",
    focus: "Bunker",
  },
];

const coachingNotes = [
  {
    id: "1",
    date: subDays(new Date(), 2),
    author: "Anders Kristiansen",
    content:
      "Olav viser veldig god fremgang. Putting-statistikken har forbedret seg med 15% siste måned. Anbefaler å fortsette med samme fokusområde.",
  },
  {
    id: "2",
    date: subDays(new Date(), 9),
    author: "Anders Kristiansen",
    content:
      "Videoanalyse viste at sving-planen er mer konsistent. Wedge-spill krever fortsatt oppmerksomhet.",
  },
];

const communicationLog = [
  {
    id: "1",
    type: "email",
    content: "Booking bekreftelse",
    date: subDays(new Date(), 1),
    direction: "out",
  },
  {
    id: "2",
    type: "sms",
    content: "Påminnelse om time i morgen",
    date: subDays(new Date(), 0),
    direction: "out",
  },
  {
    id: "3",
    type: "email",
    content: "Takk for i dag",
    date: subDays(new Date(), 2),
    direction: "out",
  },
];

// Handicap-trend som chart-data
const handicapTrend: AdminLineChartDatum[] = [
  { label: "Aug", value: 18.2 },
  { label: "Sep", value: 17.5 },
  { label: "Okt", value: 16.9 },
  { label: "Nov", value: 16.2 },
  { label: "Des", value: 15.8 },
];

// Treningsvolum per måned
const trainingVolume: AdminBarChartDatum[] = [
  { label: "Aug", value: 4 },
  { label: "Sep", value: 6 },
  { label: "Okt", value: 7 },
  { label: "Nov", value: 5 },
  { label: "Des", value: 8 },
  { label: "Jan", value: 9 },
  { label: "Feb", value: 7 },
  { label: "Mar", value: 8 },
];

// Samlet aktivitetstimeline
const activityTimeline: AdminTimelineItem[] = [
  {
    id: "a1",
    title: "Privat Coaching gjennomført",
    description: "Fokus: Putting — avstandskontroll neste gang",
    date: format(subDays(new Date(), 2), "d. MMM", { locale: nb }),
    icon: <CheckCircle2 className="w-3 h-3" />,
    color: "var(--color-success)",
  },
  {
    id: "a2",
    title: "E-post sendt",
    description: "Booking-bekreftelse",
    date: format(subDays(new Date(), 1), "d. MMM", { locale: nb }),
    icon: <MailIcon className="w-3 h-3" />,
    color: "var(--color-primary)",
  },
  {
    id: "a3",
    title: "Videoanalyse gjennomført",
    description: "Sving-plan mer konsistent",
    date: format(subDays(new Date(), 9), "d. MMM", { locale: nb }),
    icon: <BookOpen className="w-3 h-3" />,
    color: "var(--color-success)",
  },
  {
    id: "a4",
    title: "Handicap oppdatert",
    description: "Fra 16.2 → 15.8",
    date: format(subDays(new Date(), 14), "d. MMM", { locale: nb }),
    icon: <Activity className="w-3 h-3" />,
    color: "var(--color-ai)",
  },
  {
    id: "a5",
    title: "Nytt mål satt",
    description: "Nå handicap 15 før sommeren",
    date: format(subDays(new Date(), 21), "d. MMM", { locale: nb }),
    icon: <Flag className="w-3 h-3" />,
    color: "var(--color-warning)",
  },
];

export default function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: studentId } = use(params);
  const { toggle } = useMCSidebar();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const router = useRouter();
  const [isSendingMessage, startSendingMessage] = useTransition();

  function handleSendMessage() {
    startSendingMessage(async () => {
      const result = await getOrCreateConversation(studentId);
      if (result.conversationId) {
        router.push("/admin/meldinger");
      }
    });
  }

  const tabs = [
    { id: "overview", label: "Oversikt" },
    { id: "training", label: "Trening" },
    { id: "rounds", label: "Runder" },
    { id: "notes", label: "Notater" },
    { id: "communication", label: "Kommunikasjon" },
  ];

  return (
    <>
      <MCTopbar
        title="Elev-profil"
        subtitle={studentData.name}
        onMenuClick={toggle}
      />

      <div className="p-6 space-y-6">
        <AdminPageHeader
          title={studentData.name}
          subtitle="Coaching-historikk, målsettinger og kommunikasjon"
          breadcrumbs={[
            { label: "Elever", href: "/admin/elever" },
            { label: studentData.name },
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
              <Link href={`/admin/treningsplan?studentId=${studentId}`}>
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
                {studentData.initials}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  {studentData.name}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <AdminBadge variant="info">
                    {studentData.subscription}
                  </AdminBadge>
                  <AdminBadge variant="success">Aktiv</AdminBadge>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-[var(--color-muted)]">
                  <a
                    href={`mailto:${studentData.email}`}
                    className="flex items-center gap-1.5 hover:text-[var(--color-primary)] transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    {studentData.email}
                  </a>
                  <a
                    href={`tel:${studentData.phone}`}
                    className="flex items-center gap-1.5 hover:text-[var(--color-primary)] transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {studentData.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-4 gap-4 lg:border-l lg:border-[var(--color-grey-200)] lg:pl-6 items-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--color-primary)] tabular-nums">
                  {studentData.handicap}
                </div>
                <div className="text-xs text-[var(--color-muted)] mt-0.5">
                  Handicap
                </div>
                <div className="text-xs text-[var(--color-success)] flex items-center justify-center gap-0.5 mt-1">
                  <TrendingDown className="w-3 h-3" />
                  -2.4
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--color-text)] tabular-nums">
                  {studentData.stats.totalSessions}
                </div>
                <div className="text-xs text-[var(--color-muted)] mt-0.5">
                  Økter totalt
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--color-success)] tabular-nums">
                  {studentData.stats.attendanceRate}%
                </div>
                <div className="text-xs text-[var(--color-muted)] mt-0.5">
                  Oppmøte
                </div>
              </div>
              <div className="flex items-center justify-center">
                <AdminProgressRing
                  value={studentData.stats.sessionsThisMonth}
                  max={studentData.stats.monthlyGoal}
                  size={84}
                  strokeWidth={7}
                  valueSuffix=""
                  label={`av ${studentData.stats.monthlyGoal}`}
                />
              </div>
            </div>
          </div>
        </AdminCard>

        {/* Stats Row med sparklines */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard
            label="Siste økt"
            value={format(studentData.stats.lastSession, "d. MMM", {
              locale: nb,
            })}
            icon={<Clock className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Neste økt"
            value={format(studentData.stats.nextSession, "d. MMM", {
              locale: nb,
            })}
            icon={<Calendar className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Økter denne måneden"
            value={studentData.stats.sessionsThisMonth}
            icon={<Target className="w-5 h-5" />}
            sparkline={studentData.sparkline.sessions}
          />
          <AdminStatCard
            label="Oppmøte"
            value={`${studentData.stats.attendanceRate}%`}
            icon={<Award className="w-5 h-5" />}
            sparkline={studentData.sparkline.attendance}
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <AdminCard className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="admin-section-title">Handicap-utvikling</h3>
                <span className="text-xs text-[var(--color-muted)]">
                  Siste 5 måneder
                </span>
              </div>
              <AdminLineChart
                data={handicapTrend}
                height={220}
                color="var(--color-primary)"
                valueLabel="Handicap"
              />
            </AdminCard>

            <AdminCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="admin-section-title">Månedlig mål</h3>
              </div>
              <div className="flex flex-col items-center gap-3">
                <AdminProgressRing
                  value={studentData.stats.sessionsThisMonth}
                  max={studentData.stats.monthlyGoal}
                  size={140}
                  strokeWidth={10}
                  valueSuffix=""
                  label={`av ${studentData.stats.monthlyGoal} økter`}
                />
                <p className="text-xs text-center text-[var(--color-muted)]">
                  {studentData.stats.monthlyGoal - studentData.stats.sessionsThisMonth}{" "}
                  økter igjen denne måneden
                </p>
              </div>
            </AdminCard>

            <AdminCard className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="admin-section-title">Treningsvolum</h3>
                <span className="text-xs text-[var(--color-muted)]">
                  Økter per måned
                </span>
              </div>
              <AdminBarChart
                data={trainingVolume}
                height={220}
                color="var(--color-primary)"
                valueLabel="Økter"
              />
            </AdminCard>

            <AdminCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="admin-section-title">Målsettinger</h3>
                <button className="p-1.5 rounded-md hover:bg-[var(--color-grey-100)] text-[var(--color-primary)]">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {studentData.goals.map((goal) => (
                  <div
                    key={goal.id}
                    className="p-3 rounded-lg bg-[var(--color-grey-100)]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-[var(--color-text)]">
                        {goal.title}
                      </h4>
                      <span className="text-xs text-[var(--color-muted)]">
                        {goal.deadline}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-[var(--color-text)] tabular-nums">
                        {goal.current}
                      </span>
                      <span className="text-xs text-[var(--color-muted)]">
                        / {goal.target}
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
            </AdminCard>

            <AdminCard className="lg:col-span-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="admin-section-title">Aktivitetslogg</h3>
                <span className="text-xs text-[var(--color-muted)]">
                  Siste aktiviteter
                </span>
              </div>
              <AdminTimeline items={activityTimeline} />
            </AdminCard>
          </div>
        )}

        {/* Tab: Trening (historikk + kommende) */}
        {activeTab === "training" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
              <div className="space-y-3">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-3 rounded-lg bg-[var(--color-grey-100)]"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-[var(--color-text)]">
                        {format(booking.date, "EEEE d. MMMM", { locale: nb })}
                      </span>
                      <AdminBadge variant="success">
                        {booking.status}
                      </AdminBadge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[var(--color-muted)]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {booking.time}
                      </span>
                      <span>•</span>
                      <span>{booking.service}</span>
                      <span>•</span>
                      <span>{booking.coach}</span>
                    </div>
                  </div>
                ))}
              </div>
            </AdminCard>

            <AdminCard>
              <h3 className="admin-section-title mb-4">Treningshistorikk</h3>
              <div className="space-y-3">
                {trainingHistory.map((session) => (
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
                          {session.service}
                        </h4>
                        <AdminBadge variant="muted">{session.focus}</AdminBadge>
                      </div>
                      <p className="text-xs text-[var(--color-muted)] mb-2">
                        {format(session.date, "d. MMMM yyyy", { locale: nb })} •{" "}
                        {session.coach}
                      </p>
                      {session.notes && (
                        <p className="text-sm text-[var(--color-text)]">
                          {session.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </AdminCard>
          </div>
        )}

        {/* Tab: Runder (placeholder som bruker linjegraf for score-trend) */}
        {activeTab === "rounds" && (
          <AdminCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="admin-section-title">Score-trend</h3>
              <span className="text-xs text-[var(--color-muted)]">
                Siste 5 runder
              </span>
            </div>
            <AdminLineChart
              data={[
                { label: "1", value: 88 },
                { label: "2", value: 85 },
                { label: "3", value: 87 },
                { label: "4", value: 83 },
                { label: "5", value: 82 },
              ]}
              height={240}
              color="var(--color-success)"
              valueLabel="Score"
            />
          </AdminCard>
        )}

        {/* Tab: Notater */}
        {activeTab === "notes" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <AdminButton
                variant="primary"
                icon={<Plus className="w-4 h-4" />}
              >
                Nytt notat
              </AdminButton>
            </div>
            <div className="space-y-3">
              {coachingNotes.map((note) => (
                <AdminCard key={note.id}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-xs font-semibold">
                        AK
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[var(--color-text)]">
                          {note.author}
                        </div>
                        <div className="text-xs text-[var(--color-muted)]">
                          {format(note.date, "d. MMMM yyyy", { locale: nb })}
                        </div>
                      </div>
                    </div>
                    <button className="p-1.5 rounded-md hover:bg-[var(--color-grey-100)]">
                      <MoreHorizontal className="w-4 h-4 text-[var(--color-muted)]" />
                    </button>
                  </div>
                  <p className="text-sm text-[var(--color-text)] leading-relaxed">
                    {note.content}
                  </p>
                </AdminCard>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Kommunikasjon */}
        {activeTab === "communication" && (
          <AdminCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="admin-section-title">Kommunikasjonslogg</h3>
              <AdminButton
                variant="primary"
                icon={<Plus className="w-4 h-4" />}
              >
                Ny
              </AdminButton>
            </div>
            <div className="space-y-2">
              {communicationLog.map((comm) => (
                <div
                  key={comm.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-grey-100)]"
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      comm.direction === "out"
                        ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                        : "bg-white text-[var(--color-muted)]",
                    )}
                  >
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-[var(--color-text)]">
                      {comm.content}
                    </div>
                    <div className="text-xs text-[var(--color-muted)]">
                      {format(comm.date, "d. MMM", { locale: nb })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>
        )}
      </div>
    </>
  );
}
