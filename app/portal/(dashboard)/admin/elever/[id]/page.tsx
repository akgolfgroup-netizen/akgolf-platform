"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
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
  ChevronRight,
  Plus,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar, HGStatCard, HGAlert } from "@/components/portal/mission-control";
import { format, subDays } from "date-fns";
import { nb } from "date-fns/locale";
import { getOrCreateConversation } from "@/app/portal/(dashboard)/admin/meldinger/chat-actions";

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
    { id: "1", title: "Nå handicap 15", target: 15, current: 15.8, deadline: "Sommeren 2024", progress: 89 },
    { id: "2", title: "Fullføre 50 økter", target: 50, current: 42, deadline: "Desember 2024", progress: 84 },
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
  { id: "1", date: new Date(Date.now() + 86400000), time: "10:00", service: "Privat Coaching", coach: "Anders Kristiansen", status: "confirmed" },
  { id: "2", date: new Date(Date.now() + 86400000 * 7), time: "14:00", service: "Videoanalyse", coach: "Anders Kristiansen", status: "confirmed" },
];

const trainingHistory = [
  { id: "1", date: subDays(new Date(), 2), service: "Privat Coaching", coach: "Anders Kristiansen", notes: "God progresjon på putting. Fokus på avstandskontroll neste gang.", focus: "Putting" },
  { id: "2", date: subDays(new Date(), 9), service: "Videoanalyse", coach: "Anders Kristiansen", notes: "Wedge-spill analyse. Sving ser bra ut.", focus: "Wedge" },
  { id: "3", date: subDays(new Date(), 16), service: "Privat Coaching", coach: "Anders Kristiansen", notes: "Jobbet med bunker-slag. Fortsatt utfordringer.", focus: "Bunker" },
];

const coachingNotes = [
  { id: "1", date: subDays(new Date(), 2), author: "Anders Kristiansen", content: "Olav viser veldig god fremgang. Putting-statistikken har forbedret seg med 15% siste måned. Anbefaler å fortsette med samme fokusområde." },
  { id: "2", date: subDays(new Date(), 9), author: "Anders Kristiansen", content: "Videoanalyse viste at sving-planen er mer konsistent. Wedge-spill krever fortsatt oppmerksomhet." },
];

const communicationLog = [
  { id: "1", type: "email", content: "Booking bekreftelse", date: subDays(new Date(), 1), direction: "out" },
  { id: "2", type: "sms", content: "Påminnelse om time i morgen", date: subDays(new Date(), 0), direction: "out" },
  { id: "3", type: "email", content: "Takk for i dag", date: subDays(new Date(), 2), direction: "out" },
];

const tabs = [
  { id: "overview", label: "Oversikt" },
  { id: "history", label: "Historikk" },
  { id: "notes", label: "Notater" },
  { id: "communication", label: "Kommunikasjon" },
];

export default function StudentDetailPage({ params }: { params: { id: string } }) {
  const { toggle } = useMCSidebar();
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();
  const [isSendingMessage, startSendingMessage] = useTransition();

  function handleSendMessage() {
    startSendingMessage(async () => {
      const result = await getOrCreateConversation(params.id);
      if (result.conversationId) {
        router.push("/portal/admin/meldinger");
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

      <div className="p-5 space-y-5">
        {/* Back Link */}
        <Link
          href="/portal/admin/elever"
          className="inline-flex items-center gap-1 text-sm text-[var(--hg-text-muted)] hover:text-[var(--hg-text)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Tilbake til elever
        </Link>

        {/* Profile Header */}
        <div className="hg-card p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Avatar & Basic Info */}
            <div className="flex items-start gap-4">
              <div className="hg-avatar hg-avatar-lg text-xl">{studentData.initials}</div>
              <div>
                <h1 className="text-xl font-bold text-[var(--hg-text)]">{studentData.name}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="hg-badge hg-badge-primary">{studentData.subscription}</span>
                  <span className="hg-badge hg-badge-success">Aktiv</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-[var(--hg-text-muted)]">
                  <a href={`mailto:${studentData.email}`} className="flex items-center gap-1 hover:text-[var(--hg-primary)]">
                    <Mail className="w-4 h-4" />
                    {studentData.email}
                  </a>
                  <a href={`tel:${studentData.phone}`} className="flex items-center gap-1 hover:text-[var(--hg-primary)]">
                    <Phone className="w-4 h-4" />
                    {studentData.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex-1 grid grid-cols-3 gap-4 lg:border-l lg:border-[var(--hg-border)] lg:pl-6">
              <div className="text-center">
                <span className="text-3xl font-bold text-[var(--hg-primary)] tabular-nums block">{studentData.handicap}</span>
                <span className="text-xs text-[var(--hg-text-muted)]">Handicap</span>
                <span className="text-xs text-[var(--hg-success)] flex items-center justify-center gap-0.5 mt-1">
                  <TrendingDown className="w-3 h-3" />
                  -2.4
                </span>
              </div>
              <div className="text-center">
                <span className="text-3xl font-bold text-[var(--hg-text)] tabular-nums block">{studentData.stats.totalSessions}</span>
                <span className="text-xs text-[var(--hg-text-muted)]">Økter totalt</span>
              </div>
              <div className="text-center">
                <span className="text-3xl font-bold text-[var(--hg-success)] tabular-nums block">{studentData.stats.attendanceRate}%</span>
                <span className="text-xs text-[var(--hg-text-muted)]">Oppmøte</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button className="hg-btn hg-btn-primary text-sm">
                <Calendar className="w-4 h-4" />
                Book ny time
              </button>
              <button
                onClick={handleSendMessage}
                disabled={isSendingMessage}
                className="hg-btn hg-btn-secondary text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                {isSendingMessage ? "Starter samtale..." : "Send melding"}
              </button>
              <Link
                href={`/portal/admin/treningsplan?studentId=${params.id}`}
                className="hg-btn hg-btn-secondary text-sm"
              >
                <FileText className="w-4 h-4" />
                Rediger treningsplan
              </Link>
              <button className="hg-btn hg-btn-ghost text-sm">
                <Edit3 className="w-4 h-4" />
                Rediger profil
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <HGStatCard
            label="Siste økt"
            value={format(studentData.stats.lastSession, "d. MMM", { locale: nb })}
            icon={Clock}
          />
          <HGStatCard
            label="Neste økt"
            value={format(studentData.stats.nextSession, "d. MMM", { locale: nb })}
            icon={Calendar}
            variant="success"
          />
          <HGStatCard
            label="Økter denne måned"
            value={studentData.stats.sessionsThisMonth}
            icon={Target}
          />
          <HGStatCard
            label="Gj.snitt frekvens"
            value={`${studentData.stats.avgFrequency}/uke`}
            icon={Award}
          />
        </div>

        {/* Tabs */}
        <div className="hg-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn("hg-tab", activeTab === tab.id && "active")}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Goals */}
            <div className="hg-card p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="hg-section-title">Målsettinger</h3>
                <button className="p-1.5 rounded-md hover:bg-[var(--hg-surface-raised)]">
                  <Plus className="w-4 h-4 text-[var(--hg-primary)]" />
                </button>
              </div>
              <div className="space-y-4">
                {studentData.goals.map((goal) => (
                  <div key={goal.id} className="p-3 bg-[var(--hg-surface-raised)] rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-[var(--hg-text)]">{goal.title}</h4>
                      <span className="text-xs text-[var(--hg-text-muted)]">{goal.deadline}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-[var(--hg-text)] tabular-nums">{goal.current}</span>
                      <span className="text-xs text-[var(--hg-text-muted)]">/ {goal.target}</span>
                      <span className="text-xs text-[var(--hg-success)] ml-auto">{goal.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-[var(--hg-border)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--hg-primary)] rounded-full"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Bookings */}
            <div className="hg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--hg-border)] flex items-center justify-between">
                <h3 className="hg-section-title">Kommende bookinger</h3>
                <Link href="/portal/admin/bookinger/ny" className="text-xs text-[var(--hg-primary)] hover:underline">
                  + Ny
                </Link>
              </div>
              <div className="divide-y divide-[var(--hg-border-subtle)]">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-[var(--hg-text)]">
                        {format(booking.date, "EEEE d. MMMM", { locale: nb })}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] rounded-full bg-[var(--hg-success-bg)] text-[var(--hg-success)]">
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[var(--hg-text-muted)]">
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
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="hg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--hg-border)]">
              <h3 className="hg-section-title">Treningshistorikk</h3>
            </div>
            <div className="divide-y divide-[var(--hg-border-subtle)]">
              {trainingHistory.map((session) => (
                <div key={session.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[var(--hg-surface-raised)]">
                      <Calendar className="w-4 h-4 text-[var(--hg-primary)]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium text-[var(--hg-text)]">{session.service}</h4>
                        <span className="px-1.5 py-0.5 text-[10px] rounded bg-[var(--hg-surface-raised)] text-[var(--hg-text-muted)]">
                          {session.focus}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--hg-text-muted)] mb-2">
                        {format(session.date, "d. MMMM yyyy", { locale: nb })} • {session.coach}
                      </p>
                      {session.notes && (
                        <p className="text-sm text-[var(--hg-text-secondary)] bg-[var(--hg-surface-raised)] p-2 rounded">
                          {session.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "notes" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button className="hg-btn hg-btn-primary text-sm">
                <Plus className="w-4 h-4" />
                Nytt notat
              </button>
            </div>
            <div className="space-y-3">
              {coachingNotes.map((note) => (
                <div key={note.id} className="hg-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="hg-avatar hg-avatar-sm">AK</div>
                      <div>
                        <span className="text-sm font-medium text-[var(--hg-text)]">{note.author}</span>
                        <span className="text-xs text-[var(--hg-text-muted)] ml-2">
                          {format(note.date, "d. MMMM yyyy", { locale: nb })}
                        </span>
                      </div>
                    </div>
                    <button className="p-1.5 rounded-md hover:bg-[var(--hg-surface-raised)]">
                      <MoreHorizontal className="w-4 h-4 text-[var(--hg-text-muted)]" />
                    </button>
                  </div>
                  <p className="text-sm text-[var(--hg-text)] leading-relaxed">{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "communication" && (
          <div className="hg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--hg-border)] flex items-center justify-between">
              <h3 className="hg-section-title">Kommunikasjonslogg</h3>
              <button className="hg-btn hg-btn-primary text-sm">
                <Plus className="w-4 h-4" />
                Ny
              </button>
            </div>
            <div className="divide-y divide-[var(--hg-border-subtle)]">
              {communicationLog.map((comm) => (
                <div key={comm.id} className="p-4 flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    comm.direction === "out" ? "bg-[var(--hg-primary-bg)] text-[var(--hg-primary)]" : "bg-[var(--hg-surface-raised)]"
                  )}>
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm text-[var(--hg-text)]">{comm.content}</span>
                    <span className="text-xs text-[var(--hg-text-muted)] ml-2">
                      {format(comm.date, "d. MMM", { locale: nb })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
