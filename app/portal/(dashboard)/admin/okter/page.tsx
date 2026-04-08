"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  FileText,
  MoreHorizontal,
  Calendar,
  User,
  Edit3,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

// Mock data
const sessions = [
  {
    id: "1",
    date: new Date(),
    time: "10:00",
    student: "Olav Hansen",
    service: "Privat Coaching",
    coach: "Anders Kristiansen",
    status: "completed" as const,
    notes: "God progresjon på putting. Fokus på avstandskontroll neste gang.",
    result: "Fullført",
  },
  {
    id: "2",
    date: new Date(),
    time: "11:00",
    student: "Mari Kristiansen",
    service: "Videoanalyse",
    coach: "Anders Kristiansen",
    status: "completed" as const,
    notes: "",
    result: "Fullført",
  },
  {
    id: "3",
    date: new Date(),
    time: "14:00",
    student: "Erik Johansen",
    service: "Junior Trening",
    coach: "Maria Hansen",
    status: "cancelled" as const,
    notes: "Kansellert av elev",
    result: "Kansellert",
  },
  {
    id: "4",
    date: new Date(Date.now() - 86400000),
    time: "09:00",
    student: "Sofie Berg",
    service: "Privat Coaching",
    coach: "Anders Kristiansen",
    status: "no-show" as const,
    notes: "Elev møtte ikke uten varsel",
    result: "No-show",
  },
];

const statusConfig = {
  completed: { label: "Fullført", icon: CheckCircle, className: "text-[var(--hg-success)] bg-[var(--hg-success-bg)]" },
  cancelled: { label: "Avlyst", icon: XCircle, className: "text-[var(--hg-error)] bg-[var(--hg-error-bg)]" },
  "no-show": { label: "No-show", icon: AlertCircle, className: "text-[var(--hg-text-muted)] bg-[var(--hg-surface-raised)]" },
  upcoming: { label: "Kommende", icon: Clock, className: "text-[var(--hg-warning)] bg-[var(--hg-warning-bg)]" },
};

const filters = [
  { label: "Alle", value: "all", count: 48 },
  { label: "Fullført", value: "completed", count: 42 },
  { label: "Avlyst", value: "cancelled", count: 4 },
  { label: "No-show", value: "no-show", count: 2 },
];

export default function OkterPage() {
  const { toggle } = useMCSidebar();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const filteredSessions = sessions.filter((s) => {
    const matchesFilter = activeFilter === "all" || s.status === activeFilter;
    const matchesSearch = s.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.service.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const selectedSessionData = sessions.find((s) => s.id === selectedSession);

  return (
    <>
      <MCTopbar
        title="Økter"
        subtitle="Registrer resultater og notater fra økter"
        onMenuClick={toggle}
      />

      <div className="p-5 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="hg-card p-4">
            <span className="hg-label">Fullført denne uke</span>
            <span className="text-2xl font-bold text-[var(--hg-success)] tabular-nums block mt-1">42</span>
          </div>
          <div className="hg-card p-4">
            <span className="hg-label">Avlyst</span>
            <span className="text-2xl font-bold text-[var(--hg-error)] tabular-nums block mt-1">4</span>
          </div>
          <div className="hg-card p-4">
            <span className="hg-label">No-show</span>
            <span className="text-2xl font-bold text-[var(--hg-text-muted)] tabular-nums block mt-1">2</span>
          </div>
          <div className="hg-card p-4">
            <span className="hg-label">Oppmøterate</span>
            <span className="text-2xl font-bold text-[var(--hg-primary)] tabular-nums block mt-1">94%</span>
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
                      ? "bg-[var(--hg-primary)] text-[var(--hg-bg)]"
                      : "bg-[var(--hg-surface-raised)] text-[var(--hg-text-secondary)] hover:text-[var(--hg-text)]"
                  )}
                >
                  {filter.label}
                  <span className="ml-1.5 opacity-60">({filter.count})</span>
                </button>
              ))}
            </div>
            <div className="flex-1 flex items-center gap-2 bg-[var(--hg-surface)] border border-[var(--hg-border)] rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-[var(--hg-text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Søk etter elev..."
                className="flex-1 bg-transparent text-sm text-[var(--hg-text)] placeholder:text-[var(--hg-text-muted)] outline-none"
              />
            </div>
            <button className="hg-btn hg-btn-secondary">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sessions List */}
        <div className="hg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--hg-border)] flex items-center justify-between">
            <h3 className="hg-section-title">Økter</h3>
            <span className="text-xs text-[var(--hg-text-muted)]">{filteredSessions.length} resultater</span>
          </div>
          <div className="divide-y divide-[var(--hg-border-subtle)]">
            {filteredSessions.map((session) => {
              const status = statusConfig[session.status];
              const StatusIcon = status.icon;
              return (
                <div
                  key={session.id}
                  onClick={() => setSelectedSession(session.id)}
                  className={cn(
                    "p-4 flex items-start gap-4 hover:bg-[var(--hg-surface-raised)] transition-colors cursor-pointer",
                    selectedSession === session.id && "bg-[var(--hg-surface-raised)]"
                  )}
                >
                  <div className={cn("p-2 rounded-lg shrink-0", status.className)}>
                    <StatusIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-[var(--hg-text)]">
                        {format(session.date, "d. MMM", { locale: nb })} {session.time}
                      </span>
                      <span className={cn("px-1.5 py-0.5 text-[10px] rounded-full", status.className)}>
                        {status.label}
                      </span>
                    </div>
                    <h4 className="text-sm text-[var(--hg-text)]">{session.student}</h4>
                    <p className="text-xs text-[var(--hg-text-muted)]">{session.service} • {session.coach}</p>
                    {session.notes && (
                      <p className="text-xs text-[var(--hg-text-secondary)] mt-2 line-clamp-2">
                        {session.notes}
                      </p>
                    )}
                  </div>
                  <button className="p-1.5 rounded-md hover:bg-[var(--hg-border)] text-[var(--hg-text-muted)]">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Notes Modal Preview */}
        {selectedSessionData && (
          <div className="hg-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="hg-section-title">Notater</h3>
              <button
                onClick={() => setSelectedSession(null)}
                className="p-1.5 rounded-md hover:bg-[var(--hg-surface-raised)]"
              >
                <XCircle className="w-4 h-4 text-[var(--hg-text-muted)]" />
              </button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="hg-avatar hg-avatar-sm">
                {selectedSessionData.student.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <h4 className="text-sm font-medium text-[var(--hg-text)]">{selectedSessionData.student}</h4>
                <p className="text-xs text-[var(--hg-text-muted)]">{selectedSessionData.service}</p>
              </div>
            </div>
            <textarea
              placeholder="Legg til notater fra økten..."
              defaultValue={selectedSessionData.notes}
              className="w-full h-24 p-3 bg-[var(--hg-surface)] border border-[var(--hg-border)] rounded-lg text-sm text-[var(--hg-text)] placeholder:text-[var(--hg-text-muted)] outline-none focus:border-[var(--hg-primary)] resize-none"
            />
            <div className="flex justify-end gap-2 mt-3">
              <button className="hg-btn hg-btn-secondary text-sm">Avbryt</button>
              <button className="hg-btn hg-btn-primary text-sm">Lagre notater</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}


