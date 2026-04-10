"use client";

import { useState, useTransition, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Download,
  Plus,
  Calendar,
  List,
  MoreHorizontal,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  Target,
  ChevronDown,
  ChevronUp,
  StickyNote,
  Dumbbell,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import {
  searchBookings,
  adminCancelBooking,
  type AdminBooking,
  type SearchBookingsResult,
} from "./actions";
import type { SessionPlan } from "@/lib/portal/ai/session-planner";

// ---------------------------------------------------------------------------
// Typer
// ---------------------------------------------------------------------------

type StatusKey = "CONFIRMED" | "PENDING" | "CANCELLED";

const STATUS_CONFIG: Record<
  StatusKey,
  {
    label: string;
    icon: typeof CheckCircle;
    className: string;
    dot: string;
  }
> = {
  CONFIRMED: {
    label: "Bekreftet",
    icon: CheckCircle,
    className: "text-[var(--color-success)] bg-[var(--color-success)]/10",
    dot: "bg-[var(--color-success)]",
  },
  PENDING: {
    label: "Venter",
    icon: AlertCircle,
    className: "text-[var(--color-warning)] bg-[var(--color-warning)]/10",
    dot: "bg-[var(--color-warning)]",
  },
  CANCELLED: {
    label: "Avbestilt",
    icon: XCircle,
    className: "text-[var(--color-error)] bg-[var(--color-error)]/10",
    dot: "bg-[var(--color-error)]",
  },
};

// ---------------------------------------------------------------------------
// Fokusområde
// ---------------------------------------------------------------------------

type FocusAreaKey = "TEE_TOTAL" | "APPROACH" | "SHORT_GAME" | "PUTTING";

const FOCUS_AREA_CONFIG: Record<
  FocusAreaKey,
  { label: string; className: string }
> = {
  TEE_TOTAL: {
    label: "Langt spill",
    className: "text-[var(--color-primary)] bg-[var(--color-primary)]/10",
  },
  APPROACH: {
    label: "Innspill",
    className: "text-[var(--color-success)] bg-[var(--color-success)]/10",
  },
  SHORT_GAME: {
    label: "Nærspill",
    className: "text-[var(--color-warning)] bg-[var(--color-warning)]/10",
  },
  PUTTING: {
    label: "Putting",
    className: "text-[var(--color-ai)] bg-[var(--color-ai)]/10",
  },
};

function isFocusAreaKey(s: string): s is FocusAreaKey {
  return s === "TEE_TOTAL" || s === "APPROACH" || s === "SHORT_GAME" || s === "PUTTING";
}

// ---------------------------------------------------------------------------
// Session Plan Panel
// ---------------------------------------------------------------------------

function SessionPlanPanel({ bookingId }: { bookingId: string }) {
  const [plan, setPlan] = useState<SessionPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/portal/ai/session-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? "Noe gikk galt");
      }
      const data = await res.json() as { plan: SessionPlan };
      setPlan(data.plan);
      setExpanded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ukjent feil");
    } finally {
      setLoading(false);
    }
  }

  if (!plan) {
    return (
      <div className="mt-3 pt-3 border-t border-[var(--color-grey-200)]">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-2 text-xs font-medium text-[var(--color-ai)] hover:text-[var(--color-ai)]/80 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          {loading ? "Genererer AI-forslag..." : "Generer AI-forslag"}
        </button>
        {error && (
          <p className="mt-1.5 text-xs text-[var(--color-error)]">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-3 pt-3 border-t border-[var(--color-grey-200)]">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-2 text-xs font-medium text-[var(--color-ai)] hover:text-[var(--color-ai)]/80 transition-colors w-full text-left"
      >
        <Sparkles className="w-3.5 h-3.5 shrink-0" />
        <span className="flex-1">AI-øktplan — {plan.summary}</span>
        {expanded ? (
          <ChevronUp className="w-3.5 h-3.5 shrink-0" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3">
          {/* Oppvarming */}
          <div className="flex items-start gap-2.5">
            <div className="w-1 shrink-0 self-stretch rounded-full bg-[var(--color-success)]/40" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-muted)] mb-0.5">
                Oppvarming · {plan.warmup.duration} min
              </p>
              <p className="text-xs text-[var(--color-text)]">
                {plan.warmup.description}
              </p>
            </div>
          </div>

          {/* Hoveddrill */}
          <div className="flex items-start gap-2.5">
            <div className="w-1 shrink-0 self-stretch rounded-full bg-[var(--color-primary)]/40" />
            <div className="flex-1 space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                Hoveddrill
              </p>
              {plan.mainDrills.map((drill, i) => (
                <div key={i} className="bg-[var(--color-surface)] rounded-lg p-2.5">
                  <div className="flex items-center gap-2 mb-1">
                    <Dumbbell className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                    <span className="text-xs font-semibold text-[var(--color-text)]">
                      {drill.name}
                    </span>
                    <span className="ml-auto text-[10px] text-[var(--color-muted)]">
                      {drill.duration} min
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-muted)] ml-5.5">
                    {drill.description}
                  </p>
                  {drill.equipment && (
                    <p className="text-[10px] text-[var(--color-muted)] ml-5.5 mt-0.5 italic">
                      Utstyr: {drill.equipment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Avslutning */}
          <div className="flex items-start gap-2.5">
            <div className="w-1 shrink-0 self-stretch rounded-full bg-[var(--color-warning)]/40" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-muted)] mb-0.5">
                Avslutning · {plan.cooldown.duration} min
              </p>
              <p className="text-xs text-[var(--color-text)]">
                {plan.cooldown.description}
              </p>
            </div>
          </div>

          {/* Nøkkelpunkter */}
          {plan.keyPoints.length > 0 && (
            <div className="bg-[var(--color-surface)] rounded-lg p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-muted)] mb-1.5">
                Nøkkelpunkter
              </p>
              <ul className="space-y-1">
                {plan.keyPoints.map((kp, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-[var(--color-text)]">
                    <Target className="w-3 h-3 text-[var(--color-primary)] shrink-0 mt-0.5" />
                    {kp}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Trenernotater */}
          {plan.trainerNotes && (
            <div className="flex items-start gap-2 text-xs text-[var(--color-muted)] italic">
              <StickyNote className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{plan.trainerNotes}</span>
            </div>
          )}

          {/* Generer på nytt */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-1.5 text-[10px] text-[var(--color-muted)] hover:text-[var(--color-ai)] transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3" />
            )}
            Generer på nytt
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

const VIEW_MODES = [
  { label: "Dag", value: "day", icon: List },
  { label: "Uke", value: "week", icon: Calendar },
] as const;

function isStatusKey(s: string): s is StatusKey {
  return s === "CONFIRMED" || s === "PENDING" || s === "CANCELLED";
}

function formatTime(iso: string): string {
  return format(new Date(iso), "HH:mm");
}

function formatDuration(minutes: number): string {
  return `${minutes} min`;
}

function isSameDay(iso: string, date: Date): boolean {
  return format(new Date(iso), "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface BookingerClientProps {
  initialData: SearchBookingsResult;
}

// ---------------------------------------------------------------------------
// Komponent
// ---------------------------------------------------------------------------

export function BookingerClient({ initialData }: BookingerClientProps) {
  const { toggle } = useMCSidebar();
  const [isPending, startTransition] = useTransition();

  const [bookings, setBookings] = useState<AdminBooking[]>(initialData.bookings);
  const [total, setTotal] = useState(initialData.total);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"day" | "week">("day");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState<StatusKey | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Sok og filter via server action
  // ---------------------------------------------------------------------------

  const doSearch = useCallback(
    (query: string, status: StatusKey | null) => {
      startTransition(async () => {
        const result = await searchBookings(
          query,
          status ?? undefined,
          1
        );
        setBookings(result.bookings);
        setTotal(result.total);
      });
    },
    []
  );

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    doSearch(value, statusFilter);
  }

  function handleStatusFilter(status: StatusKey | null) {
    setStatusFilter(status);
    doSearch(searchQuery, status);
  }

  // ---------------------------------------------------------------------------
  // Avbestilling
  // ---------------------------------------------------------------------------

  async function handleCancel(bookingId: string) {
    if (!confirm("Er du sikker pa at du vil avbestille denne bookingen?")) return;

    setCancellingId(bookingId);
    try {
      await adminCancelBooking(bookingId, "Avbestilt av admin", true);
      // Oppdater lokal state
      doSearch(searchQuery, statusFilter);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Noe gikk galt";
      alert(message);
    } finally {
      setCancellingId(null);
    }
  }

  // ---------------------------------------------------------------------------
  // Filtrer bookinger for valgt dag
  // ---------------------------------------------------------------------------

  const dayBookings = bookings.filter((b) => isSameDay(b.startTime, selectedDate));

  const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;
  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const todayRevenue = dayBookings
    .filter((b) => b.status === "CONFIRMED")
    .reduce((sum, b) => sum + (b.amount ?? 0), 0);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
      <MCTopbar
        title="Bookinger"
        subtitle="Administrer alle bookinger og timeplan"
        onMenuClick={toggle}
      />

      <div className="p-5 space-y-5">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="hg-card p-4">
            <span className="hg-label">I dag</span>
            <span className="text-2xl font-bold text-[var(--color-text)] tabular-nums block mt-1">
              {dayBookings.length}
            </span>
          </div>
          <div className="hg-card p-4">
            <span className="hg-label">Bekreftet</span>
            <span className="text-2xl font-bold text-[var(--color-success)] tabular-nums block mt-1">
              {confirmedCount}
            </span>
          </div>
          <div className="hg-card p-4">
            <span className="hg-label">Venter</span>
            <span className="text-2xl font-bold text-[var(--color-warning)] tabular-nums block mt-1">
              {pendingCount}
            </span>
          </div>
          <div className="hg-card p-4">
            <span className="hg-label">Omsetning i dag</span>
            <span className="text-2xl font-bold text-[var(--color-primary)] tabular-nums block mt-1">
              {todayRevenue.toLocaleString("nb-NO")} kr
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="hg-card p-4 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-grey-300)] rounded-lg px-3 py-2.5 focus-within:border-[var(--color-primary)] focus-within:shadow-[0_0_0_3px_rgba(0,88,64,0.15)] transition-all">
              <Search className="w-4 h-4 text-[var(--color-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Sok etter elev, tjeneste..."
                className="flex-1 bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] outline-none"
              />
              {isPending && <Loader2 className="w-4 h-4 text-[var(--color-muted)] animate-spin" />}
            </div>

            {/* View Mode Toggle */}
            <div className="hg-tabs">
              {VIEW_MODES.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.value}
                    onClick={() => setViewMode(mode.value)}
                    className={cn(
                      "hg-tab flex items-center gap-1.5",
                      viewMode === mode.value && "active"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {mode.label}
                  </button>
                );
              })}
            </div>

            {/* Date Picker */}
            <input
              type="date"
              value={format(selectedDate, "yyyy-MM-dd")}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="hg-input w-auto"
            />

            {/* Actions */}
            <div className="flex gap-2">
              <button className="hg-btn hg-btn-secondary">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Eksporter</span>
              </button>
              <Link
                href="/admin/bookinger/ny"
                className="hg-btn hg-btn-primary"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Ny booking</span>
              </Link>
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusFilter(null)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                !statusFilter
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-text)]"
              )}
            >
              Alle ({total})
            </button>
            {(Object.entries(STATUS_CONFIG) as [StatusKey, (typeof STATUS_CONFIG)[StatusKey]][]).map(
              ([status, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={status}
                    onClick={() =>
                      handleStatusFilter(statusFilter === status ? null : status)
                    }
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5",
                      statusFilter === status
                        ? config.className
                        : "bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-text)]"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {config.label}
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Bookings List */}
        <div className="hg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--color-grey-300)] flex items-center justify-between">
            <div>
              <h3 className="hg-section-title">
                {format(selectedDate, "EEEE d. MMMM", { locale: nb })}
              </h3>
              <span className="text-xs text-[var(--color-muted)]">
                {dayBookings.length} booking{dayBookings.length !== 1 ? "er" : ""}
              </span>
            </div>
          </div>

          <div className="divide-y divide-[var(--color-grey-200)]">
            {dayBookings.length === 0 ? (
              <div className="py-12 text-center">
                <Calendar className="w-12 h-12 text-[var(--color-muted)] mx-auto mb-3 opacity-50" />
                <span className="text-sm text-[var(--color-muted)]">
                  Ingen bookinger denne dagen
                </span>
              </div>
            ) : (
              dayBookings.map((booking) => {
                const statusKey = isStatusKey(booking.status)
                  ? booking.status
                  : "PENDING";
                const statusCfg = STATUS_CONFIG[statusKey];
                const duration = booking.ServiceType?.duration ?? 0;
                const isCancelling = cancellingId === booking.id;
                const focusCfg =
                  booking.focusArea && isFocusAreaKey(booking.focusArea)
                    ? FOCUS_AREA_CONFIG[booking.focusArea]
                    : null;

                return (
                  <div
                    key={booking.id}
                    className="p-4 hover:bg-[var(--color-surface)] transition-colors group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Time */}
                      <div className="flex flex-col items-center min-w-[4rem]">
                        <span className="text-lg font-bold text-[var(--color-text)] tabular-nums">
                          {formatTime(booking.startTime)}
                        </span>
                        <span className="text-xs text-[var(--color-muted)]">
                          {formatDuration(duration)}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-[var(--color-text)]">
                            {booking.ServiceType?.name ?? "Ukjent tjeneste"}
                          </h4>
                          <div
                            className={cn(
                              "px-2 py-0.5 text-[10px] font-medium rounded-full flex items-center gap-1",
                              statusCfg.className
                            )}
                          >
                            <div
                              className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                statusCfg.dot
                              )}
                            />
                            {statusCfg.label}
                          </div>
                          {focusCfg && (
                            <div
                              className={cn(
                                "px-2 py-0.5 text-[10px] font-medium rounded-full flex items-center gap-1",
                                focusCfg.className
                              )}
                            >
                              <Target className="w-2.5 h-2.5" />
                              {focusCfg.label}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-muted)]">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {booking.User?.name ?? booking.User?.email ?? "Ukjent"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {booking.Instructor?.User?.name ?? "Ukjent instruktør"}
                          </span>
                        </div>
                        {/* Spillernotater */}
                        {booking.playerNotes && (
                          <p className="mt-1.5 text-xs text-[var(--color-muted)] italic flex items-start gap-1">
                            <StickyNote className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[var(--color-warning)]" />
                            {booking.playerNotes}
                          </p>
                        )}
                        {/* AI-øktplan-knapp (kun om fokusområde er satt) */}
                        {booking.focusArea && booking.status !== "CANCELLED" && (
                          <SessionPlanPanel bookingId={booking.id} />
                        )}
                      </div>

                      {/* Price & Actions */}
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-[var(--color-text)] tabular-nums">
                          {(booking.amount ?? 0).toLocaleString("nb-NO")} kr
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {booking.status !== "CANCELLED" && (
                            <button
                              onClick={() => handleCancel(booking.id)}
                              disabled={isCancelling}
                              className="p-1.5 rounded-md hover:bg-[var(--color-error)]/10 text-[var(--color-muted)] hover:text-[var(--color-error)] transition-colors"
                              title="Avbestill booking"
                            >
                              {isCancelling ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <XCircle className="w-4 h-4" />
                              )}
                            </button>
                          )}
                          <button className="p-1.5 rounded-md hover:bg-[var(--color-grey-200)] text-[var(--color-muted)]">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}
