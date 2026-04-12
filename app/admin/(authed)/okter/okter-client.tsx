"use client";

import { useState, useTransition } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit3,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
  AdminCard,
  AdminButton,
  AdminInput,
  AdminTextarea,
  AdminBadge,
  AdminStatCard,
  AdminPageHeader,
  AdminEmptyState,
} from "@/components/portal/mission-control/ui";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import type { SessionItem, SessionStats } from "./actions";
import { saveSessionNotes } from "./actions";
import { BookingStatus } from "@prisma/client";

type StatusVariant = "success" | "error" | "muted";

const statusConfig: Record<
  string,
  {
    label: string;
    icon: typeof CheckCircle;
    variant: StatusVariant;
    iconClass: string;
  }
> = {
  COMPLETED: {
    label: "Fullført",
    icon: CheckCircle,
    variant: "success",
    iconClass: "bg-[var(--color-success)]/10 text-[var(--color-success)]",
  },
  CANCELLED: {
    label: "Avlyst",
    icon: XCircle,
    variant: "error",
    iconClass: "bg-[var(--color-error)]/10 text-[var(--color-error)]",
  },
  NO_SHOW: {
    label: "No-show",
    icon: AlertCircle,
    variant: "muted",
    iconClass: "bg-[var(--color-grey-100)] text-[var(--color-muted)]",
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
    { label: "Fullført", value: "completed", count: stats.completed },
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
    (s) => s.id === selectedSession,
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
        title="Økter"
        subtitle="Registrer resultater og notater fra økter"
        onMenuClick={toggle}
      />

      <div className="p-6 space-y-6">
        <AdminPageHeader
          title="Økter"
          subtitle="Gjennomgå fullførte økter, avlysninger og no-shows"
        />

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard
            label="Fullført totalt"
            value={stats.completed}
            icon={<CheckCircle className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Avlyst"
            value={stats.cancelled}
            icon={<XCircle className="w-5 h-5" />}
          />
          <AdminStatCard
            label="No-show"
            value={stats.noShow}
            icon={<AlertCircle className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Oppmøterate"
            value={`${stats.attendanceRate}%`}
          />
        </div>

        {/* Filters & Search */}
        <AdminCard>
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)] pointer-events-none" />
              <AdminInput
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Søk etter elev..."
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border",
                    activeFilter === filter.value
                      ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                      : "bg-white border-[var(--color-grey-200)] text-[var(--color-text)] hover:bg-[var(--color-grey-100)]",
                  )}
                >
                  {filter.label}
                  <span className="ml-1.5 opacity-70">({filter.count})</span>
                </button>
              ))}
            </div>
          </div>
        </AdminCard>

        {/* Sessions List */}
        {filteredSessions.length === 0 ? (
          <AdminEmptyState
            icon={<ClipboardList className="w-6 h-6" />}
            title="Ingen økter funnet"
            description="Prøv å justere filter eller søk for å finne det du leter etter."
          />
        ) : (
          <AdminCard className="p-0 overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--color-grey-200)] flex items-center justify-between">
              <h3 className="admin-section-title">
                Økter
              </h3>
              <span className="text-xs text-[var(--color-muted)]">
                {filteredSessions.length} resultater
              </span>
            </div>
            <div className="divide-y divide-[var(--color-grey-200)]">
              {filteredSessions.map((session) => {
                const config =
                  statusConfig[session.status] ?? statusConfig.COMPLETED;
                const StatusIcon = config.icon;
                return (
                  <div
                    key={session.id}
                    onClick={() => handleSelectSession(session)}
                    className={cn(
                      "p-4 flex items-start gap-4 hover:bg-[var(--color-grey-100)] transition-colors cursor-pointer",
                      selectedSession === session.id &&
                        "bg-[var(--color-grey-100)]",
                    )}
                  >
                    <div
                      className={cn(
                        "p-2 rounded-lg shrink-0",
                        config.iconClass,
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
                        <AdminBadge variant={config.variant}>
                          {config.label}
                        </AdminBadge>
                      </div>
                      <h4 className="text-sm text-[var(--color-text)]">
                        {session.student?.name ??
                          session.student?.email ??
                          "Ukjent"}
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
                    <button
                      type="button"
                      className="p-1.5 rounded-md hover:bg-[var(--color-grey-200)] text-[var(--color-muted)]"
                      aria-label="Rediger notater"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </AdminCard>
        )}

        {/* Notes Panel */}
        {selectedSessionData && (
          <AdminCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="admin-section-title">
                Notater
              </h3>
              <button
                type="button"
                onClick={() => setSelectedSession(null)}
                className="p-1.5 rounded-md hover:bg-[var(--color-grey-100)]"
                aria-label="Lukk"
              >
                <XCircle className="w-4 h-4 text-[var(--color-muted)]" />
              </button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-xs font-semibold">
                {(selectedSessionData.student?.name ?? "?")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
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
            <AdminTextarea
              placeholder="Legg til notater fra økten..."
              value={notesValue}
              onChange={(e) => setNotesValue(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end gap-2 mt-3">
              <AdminButton
                variant="secondary"
                onClick={() => setSelectedSession(null)}
              >
                Avbryt
              </AdminButton>
              <AdminButton
                variant="primary"
                onClick={handleSaveNotes}
                loading={isPending}
              >
                {isPending ? "Lagrer..." : "Lagre notater"}
              </AdminButton>
            </div>
          </AdminCard>
        )}
      </div>
    </>
  );
}
