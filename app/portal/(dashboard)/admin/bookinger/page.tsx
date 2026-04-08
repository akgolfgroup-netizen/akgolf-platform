"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Download,
  Plus,
  Calendar,
  List,
  ChevronDown,
  MoreHorizontal,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

// Mock data
const mockBookings = [
  {
    id: "1",
    student: "Olav Hansen",
    service: "Privat Coaching",
    coach: "Anders Kristiansen",
    date: new Date(),
    time: "10:00",
    duration: "50 min",
    status: "confirmed" as const,
    price: 1200,
  },
  {
    id: "2",
    student: "Mari Kristiansen",
    service: "Videoanalyse",
    coach: "Anders Kristiansen",
    date: new Date(),
    time: "11:00",
    duration: "50 min",
    status: "pending" as const,
    price: 950,
  },
  {
    id: "3",
    student: "Erik Johansen",
    service: "Junior Trening",
    coach: "Maria Hansen",
    date: new Date(),
    time: "14:00",
    duration: "60 min",
    status: "cancelled" as const,
    price: 600,
  },
  {
    id: "4",
    student: "Sofie Berg",
    service: "Privat Coaching",
    coach: "Anders Kristiansen",
    date: new Date(Date.now() + 86400000),
    time: "09:00",
    duration: "50 min",
    status: "confirmed" as const,
    price: 1200,
  },
];

const statusConfig = {
  confirmed: {
    label: "Bekreftet",
    icon: CheckCircle,
    className: "text-[var(--hg-success)] bg-[var(--hg-success-bg)]",
    dot: "bg-[var(--hg-success)]",
  },
  pending: {
    label: "Venter",
    icon: AlertCircle,
    className: "text-[var(--hg-warning)] bg-[var(--hg-warning-bg)]",
    dot: "bg-[var(--hg-warning)]",
  },
  cancelled: {
    label: "Avbestilt",
    icon: XCircle,
    className: "text-[var(--hg-error)] bg-[var(--hg-error-bg)]",
    dot: "bg-[var(--hg-error)]",
  },
};

const viewModes = [
  { label: "Dag", value: "day", icon: List },
  { label: "Uke", value: "week", icon: Calendar },
];

export default function BookingsPage() {
  const { toggle } = useMCSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("day");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch = 
      booking.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.coach.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const todayBookings = filteredBookings.filter(
    (b) => format(b.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
  );

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
            <span className="text-2xl font-bold text-[var(--hg-text)] tabular-nums block mt-1">
              {todayBookings.length}
            </span>
          </div>
          <div className="hg-card p-4">
            <span className="hg-label">Bekreftet</span>
            <span className="text-2xl font-bold text-[var(--hg-success)] tabular-nums block mt-1">
              {filteredBookings.filter((b) => b.status === "confirmed").length}
            </span>
          </div>
          <div className="hg-card p-4">
            <span className="hg-label">Venter betaling</span>
            <span className="text-2xl font-bold text-[var(--hg-warning)] tabular-nums block mt-1">
              {filteredBookings.filter((b) => b.status === "pending").length}
            </span>
          </div>
          <div className="hg-card p-4">
            <span className="hg-label">Omsetning i dag</span>
            <span className="text-2xl font-bold text-[var(--hg-primary)] tabular-nums block mt-1">
              {todayBookings
                .filter((b) => b.status === "confirmed")
                .reduce((sum, b) => sum + b.price, 0)
                .toLocaleString("nb-NO")} kr
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="hg-card p-4 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 flex items-center gap-2 bg-[var(--hg-surface)] border border-[var(--hg-border)] rounded-lg px-3 py-2.5 focus-within:border-[var(--hg-primary)] focus-within:shadow-[0_0_0_3px_var(--hg-primary-glow)] transition-all">
              <Search className="w-4 h-4 text-[var(--hg-text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Søk etter elev, tjeneste..."
                className="flex-1 bg-transparent text-sm text-[var(--hg-text)] placeholder:text-[var(--hg-text-muted)] outline-none"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="hg-tabs">
              {viewModes.map((mode) => {
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
              <Link href="/portal/admin/bookinger/ny" className="hg-btn hg-btn-primary">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Ny booking</span>
              </Link>
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter(null)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                !statusFilter
                  ? "bg-[var(--hg-primary)] text-[var(--hg-bg)]"
                  : "bg-[var(--hg-surface-raised)] text-[var(--hg-text-secondary)] hover:text-[var(--hg-text)]"
              )}
            >
              Alle
            </button>
            {Object.entries(statusConfig).map(([status, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(statusFilter === status ? null : status)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5",
                    statusFilter === status
                      ? config.className
                      : "bg-[var(--hg-surface-raised)] text-[var(--hg-text-secondary)] hover:text-[var(--hg-text)]"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bookings List */}
        <div className="hg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--hg-border)] flex items-center justify-between">
            <div>
              <h3 className="hg-section-title">
                {format(selectedDate, "EEEE d. MMMM", { locale: nb })}
              </h3>
              <span className="text-xs text-[var(--hg-text-muted)]">
                {todayBookings.length} booking{todayBookings.length !== 1 ? "er" : ""}
              </span>
            </div>
            <button className="p-1.5 rounded-md hover:bg-[var(--hg-surface-raised)] text-[var(--hg-text-muted)]">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-[var(--hg-border-subtle)]">
            {todayBookings.length === 0 ? (
              <div className="py-12 text-center">
                <Calendar className="w-12 h-12 text-[var(--hg-text-muted)] mx-auto mb-3 opacity-50" />
                <span className="text-sm text-[var(--hg-text-muted)]">
                  Ingen bookinger denne dagen
                </span>
              </div>
            ) : (
              todayBookings.map((booking) => {
                const status = statusConfig[booking.status];
                const StatusIcon = status.icon;
                return (
                  <div
                    key={booking.id}
                    className="p-4 hover:bg-[var(--hg-surface-raised)] transition-colors group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Time */}
                      <div className="flex flex-col items-center min-w-[4rem]">
                        <span className="text-lg font-bold text-[var(--hg-text)] tabular-nums">
                          {booking.time}
                        </span>
                        <span className="text-xs text-[var(--hg-text-muted)]">
                          {booking.duration}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-[var(--hg-text)]">
                            {booking.service}
                          </h4>
                          <div
                            className={cn(
                              "px-2 py-0.5 text-[10px] font-medium rounded-full flex items-center gap-1",
                              status.className
                            )}
                          >
                            <div className={cn("w-1.5 h-1.5 rounded-full", status.dot)} />
                            {status.label}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-[var(--hg-text-muted)]">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {booking.student}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {booking.coach}
                          </span>
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-[var(--hg-text)] tabular-nums">
                          {booking.price.toLocaleString("nb-NO")} kr
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 rounded-md hover:bg-[var(--hg-border)] text-[var(--hg-text-muted)]">
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
