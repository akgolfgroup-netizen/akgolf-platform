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
import {
  AdminCard,
  AdminButton,
  AdminBadge,
  AdminStatCard,
  AdminEmptyState,
  AdminInput,
} from "@/components/portal/mission-control/ui";
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
    variant: "success" | "warning" | "error";
  }
> = {
  CONFIRMED: {
    label: "Bekreftet",
    icon: CheckCircle,
    variant: "success",
  },
  PENDING: {
    label: "Venter",
    icon: AlertCircle,
    variant: "warning",
  },
  CANCELLED: {
    label: "Avbestilt",
    icon: XCircle,
    variant: "error",
  },
};

// ---------------------------------------------------------------------------
// Fokusomrade
// ---------------------------------------------------------------------------

type FocusAreaKey = "TEE_TOTAL" | "APPROACH" | "SHORT_GAME" | "PUTTING";

const FOCUS_AREA_CONFIG: Record<
  FocusAreaKey,
  { label: string; variant: "info" | "success" | "warning" | "muted" }
> = {
  TEE_TOTAL: {
    label: "Langt spill",
    variant: "info",
  },
  APPROACH: {
    label: "Innspill",
    variant: "success",
  },
  SHORT_GAME: {
    label: "Nærspill",
    variant: "warning",
  },
  PUTTING: {
    label: "Putting",
    variant: "muted",
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
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Noe gikk galt");
      }
      const data = (await res.json()) as { plan: SessionPlan };
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
      <div className="mt-3 pt-3 border-t border-[var(--color-grey-100)]">
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
    <div className="mt-3 pt-3 border-t border-[var(--color-grey-100)]">
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
                <div
                  key={i}
                  className="bg-[var(--color-grey-50)] border border-[var(--color-grey-100)] rounded-lg p-2.5"
                >
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
            <div className="bg-[var(--color-grey-50)] border border-[var(--color-grey-100)] rounded-lg p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-muted)] mb-1.5">
                Nøkkelpunkter
              </p>
              <ul className="space-y-1">
                {plan.keyPoints.map((kp, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-1.5 text-xs text-[var(--color-text)]"
                  >
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

          {/* Generer pa nytt */}
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

  const doSearch = useCallback((query: string, status: StatusKey | null) => {
    startTransition(async () => {
      const result = await searchBookings(query, status ?? undefined, 1);
      setBookings(result.bookings);
      setTotal(result.total);
    });
  }, []);

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
          <AdminStatCard label="I dag" value={dayBookings.length} />
          <AdminStatCard label="Bekreftet" value={confirmedCount} />
          <AdminStatCard label="Venter" value={pendingCount} />
          <AdminStatCard
            label="Omsetning i dag"
            value={`${todayRevenue.toLocaleString("nb-NO")} kr`}
          />
        </div>

        {/* Controls */}
        <AdminCard compact>
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-[var(--color-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <AdminInput
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Sok etter elev, tjeneste..."
                className="pl-9"
              />
              {isPending && (
                <Loader2 className="w-4 h-4 text-[var(--color-muted)] animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="inline-flex rounded-lg border border-[var(--color-grey-200)] bg-white p-1">
              {VIEW_MODES.map((mode) => {
                const Icon = mode.icon;
                const isActive = viewMode === mode.value;
                return (
                  <button
                    key={mode.value}
                    onClick={() => setViewMode(mode.value)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                      isActive
                        ? "bg-[var(--color-primary)] text-white"
                        : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
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
              className="admin-input w-auto"
            />

            {/* Actions */}
            <div className="flex gap-2">
              <AdminButton
                variant="secondary"
                icon={<Download className="w-4 h-4" />}
              >
                <span className="hidden sm:inline">Eksporter</span>
              </AdminButton>
              <Link href="/admin/bookinger/ny">
                <AdminButton variant="primary" icon={<Plus className="w-4 h-4" />}>
                  <span className="hidden sm:inline">Ny booking</span>
                </AdminButton>
              </Link>
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => handleStatusFilter(null)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-full transition-colors",
                !statusFilter
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-grey-100)] text-[var(--color-muted)] hover:text-[var(--color-text)]"
              )}
            >
              Alle ({total})
            </button>
            {(
              Object.entries(STATUS_CONFIG) as [
                StatusKey,
                (typeof STATUS_CONFIG)[StatusKey],
              ][]
            ).map(([status, config]) => {
              const Icon = config.icon;
              const isActive = statusFilter === status;
              return (
                <button
                  key={status}
                  onClick={() =>
                    handleStatusFilter(statusFilter === status ? null : status)
                  }
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-colors",
                    isActive
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-[var(--color-grey-100)] text-[var(--color-muted)] hover:text-[var(--color-text)]"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {config.label}
                </button>
              );
            })}
          </div>
        </AdminCard>

        {/* Bookings List */}
        <div className="bg-white border border-[var(--color-grey-200)] rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--color-grey-200)]">
            <h3 className="admin-section-title capitalize">
              {format(selectedDate, "EEEE d. MMMM", { locale: nb })}
            </h3>
            <span className="text-xs text-[var(--color-muted)]">
              {dayBookings.length} booking{dayBookings.length !== 1 ? "er" : ""}
            </span>
          </div>

          <div className="divide-y divide-[var(--color-grey-100)]">
            {dayBookings.length === 0 ? (
              <AdminEmptyState
                icon={<Calendar className="w-6 h-6" />}
                title="Ingen bookinger denne dagen"
                description="Velg en annen dato eller opprett en ny booking."
                className="border-0"
              />
            ) : (
              dayBookings.map((booking) => {
                const statusKey = isStatusKey(booking.status)
                  ? booking.status
                  : "PENDING";
                const statusCfg = STATUS_CONFIG[statusKey];
                const StatusIcon = statusCfg.icon;
                const duration = booking.ServiceType?.duration ?? 0;
                const isCancelling = cancellingId === booking.id;
                const focusCfg =
                  booking.focusArea && isFocusAreaKey(booking.focusArea)
                    ? FOCUS_AREA_CONFIG[booking.focusArea]
                    : null;

                return (
                  <div
                    key={booking.id}
                    className="p-4 hover:bg-[var(--color-grey-50)] transition-colors group"
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
                          <AdminBadge
                            variant={statusCfg.variant}
                            icon={<StatusIcon className="w-3 h-3" />}
                          >
                            {statusCfg.label}
                          </AdminBadge>
                          {focusCfg && (
                            <AdminBadge
                              variant={focusCfg.variant}
                              icon={<Target className="w-3 h-3" />}
                            >
                              {focusCfg.label}
                            </AdminBadge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-muted)]">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {booking.User?.name ?? booking.User?.email ?? "Ukjent"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {booking.Instructor?.User?.name ??
                              "Ukjent instruktør"}
                          </span>
                        </div>
                        {/* Spillernotater */}
                        {booking.playerNotes && (
                          <p className="mt-1.5 text-xs text-[var(--color-muted)] italic flex items-start gap-1">
                            <StickyNote className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[var(--color-warning)]" />
                            {booking.playerNotes}
                          </p>
                        )}
                        {/* AI-oktplan-knapp (kun om fokusomrade er satt) */}
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
                          <button
                            className="p-1.5 rounded-md hover:bg-[var(--color-grey-100)] text-[var(--color-muted)]"
                            title="Flere handlinger"
                          >
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
