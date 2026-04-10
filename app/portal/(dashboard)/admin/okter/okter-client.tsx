"use client";

import { useState, useTransition } from "react";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit3,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import type { SessionItem, SessionStats } from "./actions";
import { saveSessionNotes } from "./actions";
import { BookingStatus } from "@prisma/client";

const statusConfig: Record<
  string,
  { label: string; icon: typeof CheckCircle; className: string }
> = {
  COMPLETED: {
    label: "Fullfort",
    icon: CheckCircle,
    className: "text-[var(--color-success)] bg-[var(--color-success)]/10",
  },
  CANCELLED: {
    label: "Avlyst",
    icon: XCircle,
    className: "text-[var(--color-error)] bg-[var(--color-error)]/10",
  },
  NO_SHOW: {
    label: "No-show",
    icon: AlertCircle,
    className: "text-[var(--color-muted)] bg-[var(--color-grey-200)]",
  },
};

type FilterItem = {
  label: string;
  value: string;
  count: number;
};

interface OkterClientProps {
  initialSessions: SessionItem[];
  stats: SessionStats;
}

export function OkterClient({ initialSessions, stats }: OkterClientProps) {
  const { toggle } = useMCSidebar();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState("");
  const [isPending, startTransition] = useTransition();

  const filters: FilterItem[] = [
    { label: "Alle", value: "all", count: stats.total },
    { label: "Fullfort", value: "completed", count: stats.completed },
    { label: "Avlyst", value: "cancelled", count: stats.cancelled },
    { label: "No-show", value: "no-show", count: stats.noShow },
  ];

  const statusFilterMap: Record<string, BookingStatus> = {
    completed: BookingStatus.COMPLETED,
    cancelled: BookingStatus.CANCELLED,
    "no-show": BookingStatus.NO_SHOW,
  };

  const filteredSessions = initialSessions.filter((s) => {
    const matchesFilter =
      activeFilter === "all" || s.status === statusFilterMap[activeFilter];
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      s.student?.name?.toLowerCase().includes(q) ||
      s.student?.email?.toLowerCase().includes(q) ||
      s.service?.name?.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const selectedSessionData = initialSessions.find(
    (s) => s.id === selectedSession
  );

  function handleSelectSession(session: SessionItem) {
    setSelectedSession(session.id);
    setNotesValue(session.adminNotes ?? "");
  }

  function handleSaveNotes() {
    if (!selectedSession) return;
    startTransition(async () => {
      const result = await saveSessionNotes(selectedSession, notesValue);
      if (result.success) {
        setSelectedSession(null);
      }
    });
  }

  return (
    <>
      <MCTopbar
        title="Okter"
        subtitle="Registrer resultater og notater fra okter"
        onMenuClick={toggle}
      />

      <div className="p-5 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="hg-card p-4">
            <span className="hg-label">Fullfort totalt</span>
            <span className="text-2xl font-bold text-[var(--color-success)] tabular-nums block mt-1">
              {stats.completed}
            </span>
          </div>
          <div className="hg-card p-4">
            <span className="hg-label">Avlyst</span>
            <span className="text-2xl font-bold text-[var(--color-error)] tabular-nums block mt-1">
              {stats.cancelled}
            </span>
          </div>
          <div className="hg-card p-4">
            <span className="hg-label">No-show</span>
            <span className="text-2xl font-bold text-[var(--color-muted)] tabular-nums block mt-1">
              {stats.noShow}
            </span>
          </div>
          <div className="hg-card p-4">
            <span className="hg-label">Oppmoeterate</span>
            <span className="text-2xl font-bold text-[var(--color-primary)] tabular-nums block mt-1">
              {stats.attendanceRate}%
            </span>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="hg-card p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex gap-2 flex-wrap">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                    activeFilter === filter.value
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-[var(--color-grey-200)] text-[var(--color-text)] hover:bg-[var(--color-grey-300)]"
                  )}
                >
                  {filter.label}
                  <span className="ml-1.5 opacity-60">({filter.count})</span>
                </button>
              ))}
            </div>
            <div className="flex-1 flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-grey-300)] rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-[var(--color-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Sok etter elev..."
                className="flex-1 bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] outline-none"
              />
            </div>
            <button className="hg-btn hg-btn-secondary">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sessions List */}
        <div className="hg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--color-grey-300)] flex items-center justify-between">
            <h3 className="hg-section-title">Okter</h3>
            <span className="text-xs text-[var(--color-muted)]">
              {filteredSessions.length} resultater
            </span>
          </div>
          <div className="divide-y divide-[var(--color-grey-200)]">
            {filteredSessions.length === 0 && (
              <div className="p-8 text-center text-sm text-[var(--color-muted)]">
                Ingen okter funnet
              </div>
            )}
            {filteredSessions.map((session) => {
              const config = statusConfig[session.status] ?? statusConfig.COMPLETED;
              const StatusIcon = config.icon;
              return (
                <div
                  key={session.id}
                  onClick={() => handleSelectSession(session)}
                  className={cn(
                    "p-4 flex items-start gap-4 hover:bg-[var(--color-grey-100)] transition-colors cursor-pointer",
                    selectedSession === session.id && "bg-[var(--color-grey-100)]"
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg shrink-0",
                      config.className
                    )}
                  >
                    <StatusIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-[var(--color-text)]">
                        {format(new Date(session.startTime), "d. MMM HH:mm", {
                          locale: nb,
                        })}
                      </span>
                      <span
                        className={cn(
                          "px-1.5 py-0.5 text-[10px] rounded-full",
                          config.className
                        )}
                      >
                        {config.label}
                      </span>
                    </div>
                    <h4 className="text-sm text-[var(--color-text)]">
                      {session.student?.name ?? session.student?.email ?? "Ukjent"}
                    </h4>
                    <p className="text-xs text-[var(--color-muted)]">
                      {session.service?.name ?? "Ukjent tjeneste"}
                      {session.instructor?.name
                        ? ` \u2022 ${session.instructor.name}`
                        : ""}
                    </p>
                    {session.adminNotes && (
                      <p className="text-xs text-[var(--color-text)] mt-2 line-clamp-2">
                        {session.adminNotes}
                      </p>
                    )}
                  </div>
                  <button className="p-1.5 rounded-md hover:bg-[var(--color-grey-300)] text-[var(--color-muted)]">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notes Panel */}
        {selectedSessionData && (
          <div className="hg-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="hg-section-title">Notater</h3>
              <button
                onClick={() => setSelectedSession(null)}
                className="p-1.5 rounded-md hover:bg-[var(--color-grey-200)]"
              >
                <XCircle className="w-4 h-4 text-[var(--color-muted)]" />
              </button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="hg-avatar hg-avatar-sm">
                {(selectedSessionData.student?.name ?? "?")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h4 className="text-sm font-medium text-[var(--color-text)]">
                  {selectedSessionData.student?.name ?? "Ukjent"}
                </h4>
                <p className="text-xs text-[var(--color-muted)]">
                  {selectedSessionData.service?.name ?? "Ukjent tjeneste"}
                </p>
              </div>
            </div>
            <textarea
              placeholder="Legg til notater fra okten..."
              value={notesValue}
              onChange={(e) => setNotesValue(e.target.value)}
              className="w-full h-24 p-3 bg-[var(--color-surface)] border border-[var(--color-grey-300)] rounded-lg text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] outline-none focus:border-[var(--color-primary)] resize-none"
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => setSelectedSession(null)}
                className="hg-btn hg-btn-secondary text-sm"
              >
                Avbryt
              </button>
              <button
                onClick={handleSaveNotes}
                disabled={isPending}
                className="hg-btn hg-btn-primary text-sm"
              >
                {isPending ? "Lagrer..." : "Lagre notater"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
