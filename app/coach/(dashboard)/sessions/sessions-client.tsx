"use client";

import { useState } from "react";
import Link from "next/link";
import { format, isToday, isTomorrow } from "date-fns";
import { nb } from "date-fns/locale";
import {
  Calendar,
  Clock,
  User,
  Trophy,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UpcomingSession {
  id: string;
  studentName: string;
  studentId: string;
  studentHandicap: number | null;
  serviceName: string;
  duration: number;
  startTime: Date;
  status: string;
}

interface RecentSession {
  id: string;
  studentName: string;
  studentId: string;
  serviceName: string;
  completedAt: Date;
}

interface SessionsClientProps {
  upcomingSessions: UpcomingSession[];
  recentSessions: RecentSession[];
}

export function SessionsClient({
  upcomingSessions,
  recentSessions,
}: SessionsClientProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "recent">("upcoming");

  const formatSessionDate = (date: Date) => {
    const d = new Date(date);
    if (isToday(d)) return "I dag";
    if (isTomorrow(d)) return "I morgen";
    return format(d, "EEEE d. MMMM", { locale: nb });
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-[var(--color-ink-80)] pb-4">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            activeTab === "upcoming"
              ? "bg-[var(--color-gold)] text-[var(--color-ink-100)]"
              : "bg-[var(--color-ink-90)] text-[var(--color-ink-40)] hover:text-white"
          )}
        >
          Kommende ({upcomingSessions.length})
        </button>
        <button
          onClick={() => setActiveTab("recent")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            activeTab === "recent"
              ? "bg-[var(--color-gold)] text-[var(--color-ink-100)]"
              : "bg-[var(--color-ink-90)] text-[var(--color-ink-40)] hover:text-white"
          )}
        >
          Fullforte ({recentSessions.length})
        </button>
      </div>

      {/* Upcoming sessions */}
      {activeTab === "upcoming" && (
        <div className="space-y-4">
          {upcomingSessions.length === 0 ? (
            <div className="text-center py-12 text-[var(--color-ink-50)]">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Ingen kommende okter</p>
            </div>
          ) : (
            upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="bg-[var(--color-ink-90)] rounded-xl p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-[var(--color-gold)] mb-1">
                      <Calendar className="h-4 w-4" />
                      <span className="capitalize">
                        {formatSessionDate(session.startTime)}
                      </span>
                      <span>kl. {format(new Date(session.startTime), "HH:mm")}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/portal/admin/elever/${session.studentId}`}
                        className="font-semibold text-white hover:text-[var(--color-gold)] transition-colors"
                      >
                        {session.studentName}
                      </Link>
                      {session.studentHandicap !== null && (
                        <span className="flex items-center gap-1 text-sm text-[var(--color-ink-50)]">
                          <Trophy className="h-3.5 w-3.5" />
                          HCP {session.studentHandicap}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-[var(--color-ink-50)]">
                      <span>{session.serviceName}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {session.duration} min
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/portal/admin/bookinger?id=${session.id}`}
                    className="p-2 rounded-lg bg-[var(--color-ink-80)] hover:bg-[var(--color-ink-70)] transition-colors"
                  >
                    <ChevronRight className="h-5 w-5 text-[var(--color-ink-40)]" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Recent sessions */}
      {activeTab === "recent" && (
        <div className="space-y-4">
          {recentSessions.length === 0 ? (
            <div className="text-center py-12 text-[var(--color-ink-50)]">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Ingen fullforte okter enna</p>
            </div>
          ) : (
            recentSessions.map((session) => (
              <div
                key={session.id}
                className="bg-[var(--color-ink-90)] rounded-xl p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <Link
                        href={`/portal/admin/elever/${session.studentId}`}
                        className="font-medium text-white hover:text-[var(--color-gold)] transition-colors"
                      >
                        {session.studentName}
                      </Link>
                      <p className="text-sm text-[var(--color-ink-50)]">
                        {session.serviceName}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--color-ink-50)]">
                    {format(new Date(session.completedAt), "d. MMM yyyy", {
                      locale: nb,
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
