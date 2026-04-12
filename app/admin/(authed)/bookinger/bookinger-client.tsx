"use client";

import { useState, useTransition, useCallback } from "react";
import Link from "next/link";
import {
  Search, Download, Plus, Calendar, List, Clock, User,
  CheckCircle, XCircle, AlertCircle, Loader2, Target,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
  AdminCard, AdminButton, AdminBadge, AdminStatCard, AdminEmptyState,
  AdminInput, AdminDropdown, AdminDataTable,
  type AdminDataTableColumn, type AdminDataTableBulkAction,
} from "@/components/portal/mission-control/ui";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { searchBookings, bulkCancelBookings, type AdminBooking, type SearchBookingsResult } from "./actions";
import { bulkSendReminder } from "./create-actions";
import { BookingDetailDrawer } from "./booking-detail-drawer";
import { SessionPlanPanel } from "./session-plan-panel";

// ── Config ─────────────────────────────────────────────────

type StatusKey = "CONFIRMED" | "PENDING" | "CANCELLED";

const STATUS_CONFIG: Record<StatusKey, { label: string; icon: typeof CheckCircle; variant: "success" | "warning" | "error" }> = {
  CONFIRMED: { label: "Bekreftet", icon: CheckCircle, variant: "success" },
  PENDING: { label: "Venter", icon: AlertCircle, variant: "warning" },
  CANCELLED: { label: "Avbestilt", icon: XCircle, variant: "error" },
};

type FocusAreaKey = "TEE_TOTAL" | "APPROACH" | "SHORT_GAME" | "PUTTING";
const FOCUS_AREA_CONFIG: Record<FocusAreaKey, { label: string; variant: "info" | "success" | "warning" | "muted" }> = {
  TEE_TOTAL: { label: "Langt spill", variant: "info" },
  APPROACH: { label: "Innspill", variant: "success" },
  SHORT_GAME: { label: "Nærspill", variant: "warning" },
  PUTTING: { label: "Putting", variant: "muted" },
};

function isStatusKey(s: string): s is StatusKey { return s === "CONFIRMED" || s === "PENDING" || s === "CANCELLED"; }
function isFocusAreaKey(s: string): s is FocusAreaKey { return s in FOCUS_AREA_CONFIG; }
function formatTime(iso: string): string { return format(new Date(iso), "HH:mm"); }
function isSameDay(iso: string, date: Date): boolean { return format(new Date(iso), "yyyy-MM-dd") === format(date, "yyyy-MM-dd"); }

const VIEW_MODES = [
  { label: "Dag", value: "day" as const, icon: Calendar },
  { label: "Liste", value: "list" as const, icon: List },
];
type ViewMode = "day" | "list";

// ── Component ──────────────────────────────────────────────

export function BookingerClient({ initialData }: { initialData: SearchBookingsResult }) {
  const { toggle } = useMCSidebar();
  const [isPending, startTransition] = useTransition();
  const [bookings, setBookings] = useState<AdminBooking[]>(initialData.bookings);
  const [total, setTotal] = useState(initialData.total);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState<StatusKey | null>(null);
  const [drawerBooking, setDrawerBooking] = useState<AdminBooking | null>(null);

  const doSearch = useCallback((query: string, status: StatusKey | null) => {
    startTransition(async () => {
      const result = await searchBookings(query, status ?? undefined, 1);
      setBookings(result.bookings);
      setTotal(result.total);
    });
  }, []);

  function handleSearchChange(value: string) { setSearchQuery(value); doSearch(value, statusFilter); }
  function handleStatusFilter(status: StatusKey | null) { setStatusFilter(status); doSearch(searchQuery, status); }
  function handleMutated() { doSearch(searchQuery, statusFilter); setDrawerBooking(null); }

  async function handleBulkReminder(rows: AdminBooking[]) {
    if (!rows.length) return;
    const result = await bulkSendReminder(rows.map((r) => r.id));
    alert(`Påminnelser sendt: ${result.sent}. Feilet: ${result.failed}.`);
  }

  async function handleBulkCancel(rows: AdminBooking[]) {
    if (!rows.length || !window.confirm(`Avbestill ${rows.length} bookinger? Dette kan ikke angres.`)) return;
    const result = await bulkCancelBookings(rows.map((r) => r.id));
    alert(`Avbestilt: ${result.cancelled}. Feilet: ${result.failed}.`);
    doSearch(searchQuery, statusFilter);
  }

  const dayBookings = bookings.filter((b) => isSameDay(b.startTime, selectedDate));
  const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;
  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const todayRevenue = dayBookings.filter((b) => b.status === "CONFIRMED").reduce((s, b) => s + (b.amount ?? 0), 0);

  const listColumns: AdminDataTableColumn<AdminBooking>[] = [
    { key: "startTime", label: "Tidspunkt", sortable: true, render: (r) => (
      <div><div className="text-sm font-medium text-[var(--color-text)]">{format(new Date(r.startTime), "d. MMM", { locale: nb })}</div><div className="text-xs text-[var(--color-muted)] tabular-nums">{formatTime(r.startTime)}</div></div>
    )},
    { key: "User", label: "Elev", render: (r) => <span className="text-sm text-[var(--color-text)]">{r.User?.name ?? r.User?.email ?? "Ukjent"}</span> },
    { key: "ServiceType", label: "Tjeneste", render: (r) => <span className="text-sm text-[var(--color-text)]">{r.ServiceType?.name ?? "—"}</span> },
    { key: "Instructor", label: "Instruktør", render: (r) => <span className="text-sm text-[var(--color-muted)]">{r.Instructor?.User?.name ?? "—"}</span> },
    { key: "status", label: "Status", sortable: true, render: (r) => {
      const k = isStatusKey(r.status) ? r.status : "PENDING"; const c = STATUS_CONFIG[k]; const I = c.icon;
      return <AdminBadge variant={c.variant} icon={<I className="w-3 h-3" />}>{c.label}</AdminBadge>;
    }},
    { key: "amount", label: "Beløp", sortable: true, align: "right", render: (r) => <span className="text-sm font-semibold text-[var(--color-text)] tabular-nums">{(r.amount ?? 0).toLocaleString("nb-NO")} kr</span> },
  ];

  const listBulkActions: AdminDataTableBulkAction<AdminBooking>[] = [
    { label: "Send påminnelse", variant: "primary", action: handleBulkReminder },
    { label: "Avbestill valgte", variant: "danger", action: handleBulkCancel },
  ];

  return (
    <>
      <MCTopbar title="Bookinger" subtitle="Administrer alle bookinger og timeplan" onMenuClick={toggle} />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard label="I dag" value={dayBookings.length} />
          <AdminStatCard label="Bekreftet" value={confirmedCount} />
          <AdminStatCard label="Venter" value={pendingCount} />
          <AdminStatCard label="Omsetning i dag" value={`${todayRevenue.toLocaleString("nb-NO")} kr`} />
        </div>

        <AdminCard compact>
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-[var(--color-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <AdminInput value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)} placeholder="Søk etter elev, tjeneste..." className="pl-9" />
              {isPending && <Loader2 className="w-4 h-4 text-[var(--color-muted)] animate-spin absolute right-3 top-1/2 -translate-y-1/2" />}
            </div>
            <div className="inline-flex rounded-lg border border-[var(--color-grey-200)] bg-white p-1">
              {VIEW_MODES.map((mode) => { const Icon = mode.icon; return (
                <button key={mode.value} onClick={() => setViewMode(mode.value)} className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors", viewMode === mode.value ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-muted)] hover:text-[var(--color-text)]")}><Icon className="w-3.5 h-3.5" />{mode.label}</button>
              );})}
            </div>
            <input type="date" value={format(selectedDate, "yyyy-MM-dd")} onChange={(e) => setSelectedDate(new Date(e.target.value))} className="admin-input w-auto" />
            <div className="flex gap-2">
              <AdminDropdown label="Handlinger" items={[
                { id: "export", label: "Eksporter CSV", icon: <Download className="w-4 h-4" />, onSelect: () => exportCsv(bookings) },
                { id: "remind", label: "Send påminnelse (dagens)", onSelect: () => handleBulkReminder(dayBookings) },
              ]} />
              <Link href="/admin/bookinger/ny"><AdminButton variant="primary" icon={<Plus className="w-4 h-4" />}><span className="hidden sm:inline">Ny booking</span></AdminButton></Link>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <FilterPill active={!statusFilter} onClick={() => handleStatusFilter(null)}>Alle ({total})</FilterPill>
            {(Object.entries(STATUS_CONFIG) as [StatusKey, (typeof STATUS_CONFIG)[StatusKey]][]).map(([s, c]) => {
              const Icon = c.icon;
              return <FilterPill key={s} active={statusFilter === s} onClick={() => handleStatusFilter(statusFilter === s ? null : s)}><Icon className="w-3.5 h-3.5" />{c.label}</FilterPill>;
            })}
          </div>
        </AdminCard>

        {viewMode === "day" && (
          <AdminCard className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--color-grey-200)]">
              <h3 className="admin-section-title capitalize">{format(selectedDate, "EEEE d. MMMM", { locale: nb })}</h3>
              <span className="text-xs text-[var(--color-muted)]">{dayBookings.length} booking{dayBookings.length !== 1 ? "er" : ""}</span>
            </div>
            <div className="divide-y divide-[var(--color-grey-100)]">
              {dayBookings.length === 0 ? (
                <AdminEmptyState icon={<Calendar className="w-6 h-6" />} title="Ingen bookinger denne dagen" description="Velg en annen dato eller opprett en ny booking." className="border-0" />
              ) : dayBookings.map((b) => <DayBookingRow key={b.id} booking={b} onDetail={setDrawerBooking} />)}
            </div>
          </AdminCard>
        )}

        {viewMode === "list" && (
          <AdminDataTable<AdminBooking> columns={listColumns} data={bookings} searchable={false} pagination={{ pageSize: 15 }} bulkActions={listBulkActions} onRowClick={setDrawerBooking} emptyMessage="Ingen bookinger funnet." />
        )}
      </div>

      <BookingDetailDrawer booking={drawerBooking} onClose={() => setDrawerBooking(null)} onMutated={handleMutated} />
    </>
  );
}

// ── Sub-components ─────────────────────────────────────────

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-colors", active ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-grey-100)] text-[var(--color-muted)] hover:text-[var(--color-text)]")}>{children}</button>
  );
}

function DayBookingRow({ booking, onDetail }: { booking: AdminBooking; onDetail: (b: AdminBooking) => void }) {
  const statusKey = isStatusKey(booking.status) ? booking.status : "PENDING";
  const cfg = STATUS_CONFIG[statusKey];
  const StatusIcon = cfg.icon;
  const focusCfg = booking.focusArea && isFocusAreaKey(booking.focusArea) ? FOCUS_AREA_CONFIG[booking.focusArea] : null;

  return (
    <div className="p-4 hover:bg-[var(--color-grey-50)] transition-colors group cursor-pointer" onClick={() => onDetail(booking)}>
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center min-w-[4rem]">
          <span className="text-lg font-bold text-[var(--color-text)] tabular-nums">{formatTime(booking.startTime)}</span>
          <span className="text-xs text-[var(--color-muted)]">{booking.ServiceType?.duration ?? 0} min</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-[var(--color-text)]">{booking.ServiceType?.name ?? "Ukjent"}</h4>
            <AdminBadge variant={cfg.variant} icon={<StatusIcon className="w-3 h-3" />}>{cfg.label}</AdminBadge>
            {focusCfg && <AdminBadge variant={focusCfg.variant} icon={<Target className="w-3 h-3" />}>{focusCfg.label}</AdminBadge>}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-muted)]">
            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{booking.User?.name ?? booking.User?.email ?? "Ukjent"}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{booking.Instructor?.User?.name ?? "Ukjent"}</span>
          </div>
          {booking.focusArea && booking.status !== "CANCELLED" && <SessionPlanPanel bookingId={booking.id} />}
        </div>
        <span className="text-sm font-semibold text-[var(--color-text)] tabular-nums">{(booking.amount ?? 0).toLocaleString("nb-NO")} kr</span>
      </div>
    </div>
  );
}

function exportCsv(bookings: AdminBooking[]) {
  const csv = ["Tid,Elev,Tjeneste,Instruktør,Status,Beløp", ...bookings.map((b) =>
    [format(new Date(b.startTime), "yyyy-MM-dd HH:mm"), b.User?.name ?? "", b.ServiceType?.name ?? "", b.Instructor?.User?.name ?? "", b.status, String(b.amount ?? 0)].map((v) => `"${v}"`).join(","),
  )].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `bookinger-${format(new Date(), "yyyy-MM-dd")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
