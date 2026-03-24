"use client";

import { useState } from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Search, ChevronLeft, ChevronRight, XCircle } from "lucide-react";
import { searchBookings, adminCancelBooking } from "@/app/portal/(dashboard)/admin/bookinger/actions";

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

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: "bg-[rgba(34,197,94,0.15)] text-[#86EFAC]",
  PENDING: "bg-[rgba(245,158,11,0.15)] text-[#FCD34D]",
  COMPLETED: "bg-[rgba(15,41,80,0.3)] text-[var(--color-snow)]/70",
  NO_SHOW: "bg-[rgba(239,68,68,0.15)] text-[#FCA5A5]",
  CANCELLED: "bg-[rgba(15,41,80,0.3)] text-[var(--color-snow)]/50",
};

export function AdminBookingList() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async (q: string, status: string, p: number) => {
    setLoading(true);
    try {
      const result = await searchBookings(q, status, p);
      setBookings(result.bookings as unknown as Booking[]);
      setTotal(result.total);
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
    }
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-4">
      {/* Search & filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-snow)]/50" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Søk etter navn, e-post eller tjeneste..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm text-[var(--color-snow)] placeholder:text-[var(--color-snow)]/40 bg-[rgba(10,25,41,0.7)] border border-[rgba(15,41,80,0.4)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="text-sm rounded-xl px-3 py-2 text-[var(--color-snow)] bg-[rgba(10,25,41,0.7)] border border-[rgba(15,41,80,0.4)]"
        >
          <option value="ALL">Alle statuser</option>
          <option value="CONFIRMED">Bekreftet</option>
          <option value="PENDING">Venter</option>
          <option value="COMPLETED">Fullført</option>
          <option value="NO_SHOW">Ikke møtt</option>
          <option value="CANCELLED">Avbestilt</option>
        </select>
        <button
          onClick={handleSearch}
          className="px-4 py-2 text-sm font-medium bg-[var(--color-gold)] text-white rounded-xl hover:bg-[var(--color-gold)]/90 transition-colors"
        >
          Søk
        </button>
      </div>

      {/* Results table */}
      <div className="rounded-2xl border border-[rgba(15,41,80,0.4)] bg-[rgba(10,25,41,0.7)] backdrop-blur-md overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-[var(--color-snow)]/50">Laster...</div>
        ) : bookings.length === 0 ? (
          <div className="py-12 text-center text-[var(--color-snow)]/50 text-sm">
            Ingen bookinger funnet
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[rgba(15,41,80,0.3)] border-b border-[rgba(15,41,80,0.4)]">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-snow)]/50 uppercase">Student</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-snow)]/50 uppercase">Tjeneste</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-snow)]/50 uppercase">Dato/tid</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-snow)]/50 uppercase">Instruktør</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-snow)]/50 uppercase">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[var(--color-snow)]/50 uppercase">Beløp</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(15,41,80,0.4)]">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-[rgba(15,41,80,0.3)]">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-[var(--color-snow)]">{b.student.name ?? "—"}</p>
                    <p className="text-xs text-[var(--color-snow)]/50">{b.student.email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-snow)]/70">{b.serviceType.name}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-[var(--color-snow)]/70">
                      {format(new Date(b.startTime), "d. MMM yyyy", { locale: nb })}
                    </p>
                    <p className="text-xs text-[var(--color-snow)]/50">
                      {format(new Date(b.startTime), "HH:mm")}–{format(new Date(b.endTime), "HH:mm")}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-snow)]/70">
                    {b.instructor.user.name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[b.status] ?? "bg-[rgba(15,41,80,0.3)]"}`}>
                      {STATUS_LABELS[b.status] ?? b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-snow)]/70 text-right">
                    kr {(b.amount / 100).toLocaleString("nb-NO")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {(b.status === "CONFIRMED" || b.status === "PENDING") && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="p-1 rounded hover:bg-[rgba(239,68,68,0.15)] text-[var(--color-snow)]/40 hover:text-[#FCA5A5] transition-colors"
                        title="Avbestill"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-[var(--color-snow)]/50">
          <span>
            Viser {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} av {total}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => { setPage(page - 1); fetchBookings(query, statusFilter, page - 1); }}
              disabled={page === 1}
              className="p-1.5 rounded hover:bg-[rgba(15,41,80,0.3)] disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setPage(page + 1); fetchBookings(query, statusFilter, page + 1); }}
              disabled={page >= totalPages}
              className="p-1.5 rounded hover:bg-[rgba(15,41,80,0.3)] disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
