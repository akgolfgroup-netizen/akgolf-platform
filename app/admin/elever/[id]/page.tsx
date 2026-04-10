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
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
  AdminCard,
  AdminButton,
  AdminBadge,
  AdminStatCard,
  AdminPageHeader,
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
    notes:
      "God progresjon på putting. Fokus på avstandskontroll neste gang.",
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

const tabs = [
  { id: "overview", label: "Oversikt" },
  { id: "history", label: "Historikk" },
  { id: "notes", label: "Notater" },
  { id: "communication", label: "Kommunikasjon" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: studentId } = use(params);
  const { toggle } = useMCSidebar();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
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

            <div className="flex-1 grid grid-cols-3 gap-4 lg:border-l lg:border-[var(--color-grey-200)] lg:pl-6">
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
            </div>
          </div>
        </AdminCard>

        {/* Stats Row */}
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
          />
          <AdminStatCard
            label="Snittfrekvens"
            value={`${studentData.stats.avgFrequency}/uke`}
            icon={<Award className="w-5 h-5" />}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-[var(--color-grey-200)]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
                activeTab === tab.id
                  ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
          </div>
        )}

        {activeTab === "history" && (
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
        )}

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
