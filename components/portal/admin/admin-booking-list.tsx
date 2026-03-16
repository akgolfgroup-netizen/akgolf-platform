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
  CONFIRMED: "bg-green-100 text-green-700",
  PENDING: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-gray-100 text-gray-600",
  NO_SHOW: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-500",
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Sok etter navn, e-post eller tjeneste..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8975C]/40"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white"
        >
          <option value="ALL">Alle statuser</option>
          <option value="CONFIRMED">Bekreftet</option>
          <option value="PENDING">Venter</option>
          <option value="COMPLETED">Fullfort</option>
          <option value="NO_SHOW">Ikke mott</option>
          <option value="CANCELLED">Avbestilt</option>
        </select>
        <button
          onClick={handleSearch}
          className="px-4 py-2 text-sm font-medium bg-[#0F2950] text-white rounded-lg hover:bg-[#0F2950]/90 transition-colors"
        >
          Sok
        </button>
      </div>

      {/* Results table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-gray-400">Laster...</div>
        ) : bookings.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">
            Ingen bookinger funnet
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Tjeneste</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Dato/tid</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Instruktor</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Belop</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-800">{b.student.name ?? "—"}</p>
                    <p className="text-xs text-gray-400">{b.student.email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{b.serviceType.name}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-700">
                      {format(new Date(b.startTime), "d. MMM yyyy", { locale: nb })}
                    </p>
                    <p className="text-xs text-gray-400">
                      {format(new Date(b.startTime), "HH:mm")}–{format(new Date(b.endTime), "HH:mm")}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {b.instructor.user.name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[b.status] ?? "bg-gray-100"}`}>
                      {STATUS_LABELS[b.status] ?? b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">
                    kr {(b.amount / 100).toLocaleString("nb-NO")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {(b.status === "CONFIRMED" || b.status === "PENDING") && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
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
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Viser {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} av {total}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => { setPage(page - 1); fetchBookings(query, statusFilter, page - 1); }}
              disabled={page === 1}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setPage(page + 1); fetchBookings(query, statusFilter, page + 1); }}
              disabled={page >= totalPages}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
