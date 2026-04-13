"use client";

import { useState } from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  XCircle,
  User,
  Users,
  Gamepad2,
  Flag,
  Calendar,
  ArrowUpDown
} from "lucide-react";
import {
  searchBookings,
  adminCancelBooking,
  bulkCancelBookings,
} from "@/app/admin/(authed)/bookinger/actions";
import { bulkSendReminder } from "@/app/admin/(authed)/bookinger/create-actions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Booking {
  id: string;
  startTime: Date;
  endTime: Date;
  status: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  student: { id: string; name: string | null; email: string | null };
  serviceType: { name: string; color: string | null };
  instructor: { user: { name: string | null } };
}

const STATUS_LABELS: Record<string, string> = {
  CONFIRMED: "Bekreftet",
  PENDING: "Venter",
  COMPLETED: "Fullfort",
  NO_SHOW: "Ikke mott",
  CANCELLED: "Avbestilt",
};

const STATUS_VARIANTS: Record<string, "success" | "warning" | "error" | "info" | "default"> = {
  CONFIRMED: "success",
  PENDING: "warning",
  COMPLETED: "info",
  NO_SHOW: "error",
  CANCELLED: "default",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PAID: "Betalt",
  UNPAID: "Ubetalt",
  REFUNDED: "Refundert",
};

const SERVICE_ICONS: Record<string, typeof User> = {
  INDIVIDUAL: User,
  GROUP: Users,
  SIMULATOR: Gamepad2,
  PLAYING_LESSON: Flag,
};

export function AdminBookingList() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set());

  const fetchBookings = async (q: string, status: string, p: number) => {
    setLoading(true);
    try {
      const result = await searchBookings(q, status, p);
      setBookings(result.bookings as unknown as Booking[]);
      setTotal(result.total);
    } catch {
      // Error handled silently - list will remain unchanged
    } finally {
      setLoading(false);
    }
  };

  const [initialized, setInitialized] = useState(false);
  if (!initialized) {
    setInitialized(true);
    fetchBookings("", "ALL", 1);
  }

  const handleSearch = () => {
    setPage(1);
    fetchBookings(query, statusFilter, 1);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setPage(1);
    fetchBookings(query, status, 1);
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Avbestille denne bookingen?")) return;
    try {
      await adminCancelBooking(bookingId);
      fetchBookings(query, statusFilter, page);
    } catch {
      // Error handled silently - booking remains unchanged
    }
  };

  const handleBulkReminder = async () => {
    if (bulkLoading) return;
    const ids = Array.from(selectedBookings);
    if (ids.length === 0) return;

    if (!confirm(`Sende påminnelse til ${ids.length} booking(er)?`)) return;

    setBulkLoading(true);
    try {
      const result = await bulkSendReminder(ids);
      alert(`Påminnelse sendt: ${result.sent} vellykket, ${result.failed} feilet`);
      setSelectedBookings(new Set());
      fetchBookings(query, statusFilter, page);
    } catch {
      alert("Feil ved sending av påminnelser");
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkCancel = async () => {
    if (bulkLoading) return;
    const ids = Array.from(selectedBookings);
    if (ids.length === 0) return;

    if (!confirm(`Avbestille ${ids.length} booking(er)? Eventuelle Stripe-betalinger blir refundert.`)) return;

    setBulkLoading(true);
    try {
      const result = await bulkCancelBookings(ids);
      alert(`Avbestilt: ${result.cancelled} vellykket, ${result.failed} feilet`);
      setSelectedBookings(new Set());
      fetchBookings(query, statusFilter, page);
    } catch {
      alert("Feil ved avbestilling");
    } finally {
      setBulkLoading(false);
    }
  };

  const toggleBookingSelection = (bookingId: string) => {
    setSelectedBookings(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bookingId)) {
        newSet.delete(bookingId);
      } else {
        newSet.add(bookingId);
      }
      return newSet;
    });
  };

  const toggleAllBookings = () => {
    if (selectedBookings.size === bookings.length) {
      setSelectedBookings(new Set());
    } else {
      setSelectedBookings(new Set(bookings.map(b => b.id)));
    }
  };

  const totalPages = Math.ceil(total / 20);

  // Calculate status counts (mock data - would come from API in real implementation)
  const statusCounts = {
    ALL: total,
    CONFIRMED: bookings.filter(b => b.status === "CONFIRMED").length,
    PENDING: bookings.filter(b => b.status === "PENDING").length,
    COMPLETED: bookings.filter(b => b.status === "COMPLETED").length,
    NO_SHOW: bookings.filter(b => b.status === "NO_SHOW").length,
    CANCELLED: bookings.filter(b => b.status === "CANCELLED").length,
  };

  return (
    <div className="space-y-6">
      {/* Status Tabs */}
      <Card variant="elevated" padding="sm" className="flex gap-2 flex-wrap">
        {[
          { key: "ALL", label: "Alle" },
          { key: "CONFIRMED", label: "Bekreftet" },
          { key: "PENDING", label: "Venter" },
          { key: "COMPLETED", label: "Fullfort" },
          { key: "NO_SHOW", label: "Ikke mott" },
          { key: "CANCELLED", label: "Avbestilt" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleStatusChange(key)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-xl transition-colors duration-200 ${statusFilter === key ? "bg-black text-white" : "text-grey-400 hover:bg-grey-100 hover:text-text" }`}
          >
            {label}
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusFilter === key ? "bg-white/20 text-white" : "bg-grey-100 text-grey-500" }`}>
              {statusCounts[key as keyof typeof statusCounts] || 0}
            </span>
          </button>
        ))}
      </Card>

      {/* Filter Bar */}
      <Card variant="elevated" padding="md" className="flex items-center gap-4 flex-wrap">
        {/* Search */}
        <div className="flex items-center gap-3 flex-1 min-w-[280px] px-4 py-3 bg-grey-100 rounded-xl border border-transparent focus-within:bg-white focus-within:border-black focus-within:shadow-[0_0_0_3px_grey-200] transition-[background-color,border-color] duration-200">
          <Search className="w-[18px] h-[18px] text-grey-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Sok etter navn, e-post eller tjeneste..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-black placeholder:text-grey-400"
          />
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-grey-200" />

        {/* Date Range */}
        <button className="flex items-center gap-2 px-4 py-2 bg-grey-100 border border-grey-200 rounded-xl text-sm text-text hover:bg-grey-200 transition-colors">
          <Calendar className="w-4 h-4 text-grey-400" />
          Denne uken
        </button>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="px-5 py-2.5 text-sm font-semibold bg-black text-white rounded-xl hover:bg-black/90 transition-[background-color,transform] duration-200 hover:-translate-y-0.5"
        >
          Sok
        </button>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedBookings.size > 0 && (
        <div className="flex items-center gap-4 px-5 py-4 bg-black text-white rounded-2xl">
          <span className="text-sm font-medium">
            <strong>{selectedBookings.size}</strong> valgt
          </span>
          <button
            onClick={handleBulkReminder}
            disabled={bulkLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 text-white text-[13px] font-medium rounded-lg hover:bg-white/25 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {bulkLoading ? "Sender..." : "Send påminnelse"}
          </button>
          <button
            onClick={handleBulkCancel}
            disabled={bulkLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-error/30 text-white text-[13px] font-medium rounded-lg hover:bg-error/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {bulkLoading ? "Avbestiller..." : "Avbestill"}
          </button>
          <button
            onClick={() => setSelectedBookings(new Set())}
            className="ml-auto w-8 h-8 flex items-center justify-center bg-white/15 rounded-lg hover:bg-white/25 transition-colors"
          >
            <XCircle className="w-[18px] h-[18px]" />
          </button>
        </div>
      )}

      {/* Data Table */}
      <Card variant="elevated" padding="none" className="overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-grey-400">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Laster bookinger...
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-16 text-center text-grey-400 text-sm">
            Ingen bookinger funnet
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-[48px_140px_1fr_140px_120px_100px_120px] gap-4 px-5 py-4 bg-grey-100 border-b border-grey-200">
              <div className="flex items-center justify-center">
                <button
                  onClick={toggleAllBookings}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors duration-200 ${selectedBookings.size === bookings.length ? "bg-black border-black" : "border-grey-200 hover:border-black" }`}
                >
                  {selectedBookings.size === bookings.length && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-grey-400 cursor-pointer hover:text-black">
                Dato/tid
                <ArrowUpDown className="w-3.5 h-3.5" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-grey-400">Student</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-grey-400">Tjeneste</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-grey-400">Status</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-grey-400">Betaling</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-grey-400">Handlinger</span>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-grey-100">
              {bookings.map((b) => {
                const ServiceIcon = SERVICE_ICONS[b.serviceType.name] || User;
                const isSelected = selectedBookings.has(b.id);

                return (
                  <div
                    key={b.id}
                    className={`grid grid-cols-[48px_140px_1fr_140px_120px_100px_120px] gap-4 px-5 py-4 items-center transition-[background-color,transform] duration-200 hover:bg-grey-100 hover:scale-[1.005] ${isSelected ? "bg-grey-100" : ""}`}
                  >
                    {/* Checkbox */}
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => toggleBookingSelection(b.id)}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors duration-200 ${isSelected ? "bg-black border-black" : "border-grey-200 hover:border-black" }`}
                      >
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    </div>

                    {/* Date/Time */}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-black">
                        {format(new Date(b.startTime), "d. MMM yyyy", { locale: nb })}
                      </span>
                      <span className="text-xs font-mono text-grey-400">
                        {format(new Date(b.startTime), "HH:mm")}–{format(new Date(b.endTime), "HH:mm")}
                      </span>
                    </div>

                    {/* Student */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" />
                        <AvatarFallback>{(b.student.name || "?").slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-black truncate">
                          {b.student.name || "—"}
                        </span>
                        <span className="text-xs text-grey-400 truncate">
                          {b.student.email}
                        </span>
                      </div>
                    </div>

                    {/* Service */}
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-grey-100 text-text flex items-center justify-center">
                        <ServiceIcon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[13px] text-text">
                        {b.serviceType.name}
                      </span>
                    </div>

                    {/* Status */}
                    <Badge
                      variant={STATUS_VARIANTS[b.status] || "neutral"}
                      size="sm"
                    >
                      {STATUS_LABELS[b.status] || b.status}
                    </Badge>

                    {/* Payment */}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-black">
                        kr {b.amount.toLocaleString("nb-NO")}
                      </span>
                      <span className={`text-[11px] ${ b.paymentStatus === "PAID" ? "text-success-text" : b.paymentStatus === "REFUNDED" ? "text-amber-500" : "text-error" }`}>
                        {PAYMENT_STATUS_LABELS[b.paymentStatus] || b.paymentStatus}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {(b.status === "CONFIRMED" || b.status === "PENDING") && (
                        <button
                          onClick={() => handleCancel(b.id)}
                          className="w-8 h-8 rounded-lg border border-grey-200 bg-white flex items-center justify-center text-grey-400 hover:border-error/40 hover:bg-error/5 hover:text-error transition-colors"
                          title="Avbestill"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 bg-grey-100 border-t border-grey-200">
                <span className="text-[13px] text-grey-400">
                  Viser {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} av {total}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setPage(page - 1); fetchBookings(query, statusFilter, page - 1); }}
                    disabled={page === 1}
                    className="w-9 h-9 rounded-xl border border-grey-200 bg-white flex items-center justify-center text-text hover:border-black hover:bg-grey-100 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-[18px] h-[18px]" />
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => { setPage(pageNum); fetchBookings(query, statusFilter, pageNum); }}
                        className={`w-9 h-9 rounded-xl border text-sm font-medium flex items-center justify-center transition-colors ${page === pageNum ? "bg-black border-black text-white" : "bg-white border-grey-200 text-text hover:border-black hover:bg-grey-100 hover:text-black" }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => { setPage(page + 1); fetchBookings(query, statusFilter, page + 1); }}
                    disabled={page >= totalPages}
                    className="w-9 h-9 rounded-xl border border-grey-200 bg-white flex items-center justify-center text-text hover:border-black hover:bg-grey-100 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-[18px] h-[18px]" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
