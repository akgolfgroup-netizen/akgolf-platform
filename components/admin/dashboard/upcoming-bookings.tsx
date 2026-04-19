"use client";


import { Icon } from "@/components/ui/icon";
import React from "react";
import Link from "next/link";
import { X, Check, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Booking {
  id: string;
  time: string;
  studentName: string;
  type: "coaching" | "trackman" | "gruppetrening";
  status: "confirmed" | "pending" | "cancelled";
  duration?: string;
  notes?: string;
}

interface UpcomingBookingsProps {
  bookings?: Booking[];
  maxItems?: number;
}

const typeLabels: Record<string, string> = {
  coaching: "Coaching",
  trackman: "TrackMan",
  gruppetrening: "Gruppetrening",
};

const typeColors: Record<string, string> = {
  coaching: "bg-primary/10 text-primary",
  trackman: "bg-ai/10 text-ai",
  gruppetrening: "bg-warning/10 text-warning",
};

const statusConfig = {
  confirmed: {
    label: "Bekreftet",
    icon: Check,
    className: "text-success bg-success-light",
  },
  pending: {
    label: "Avventer",
    icon: AlertCircle,
    className: "text-warning bg-warning-light",
  },
  cancelled: {
    label: "Avlyst",
    icon: X,
    className: "text-error bg-error-light",
  },
};

// Mock data
const defaultBookings: Booking[] = [
  {
    id: "1",
    time: "09:00",
    studentName: "Ola Nordmann",
    type: "coaching",
    status: "confirmed",
    duration: "50 min",
    notes: "Fokus på putting",
  },
  {
    id: "2",
    time: "11:00",
    studentName: "Kari Hansen",
    type: "trackman",
    status: "confirmed",
    duration: "60 min",
    notes: "Svinganalyse",
  },
  {
    id: "3",
    time: "14:00",
    studentName: "Per Olsen",
    type: "coaching",
    status: "pending",
    duration: "50 min",
  },
  {
    id: "4",
    time: "16:00",
    studentName: "Lisa Pedersen",
    type: "trackman",
    status: "confirmed",
    duration: "60 min",
    notes: "Driver-optimalisering",
  },
];

function BookingItem({ booking }: { booking: Booking }) {
  const status = statusConfig[booking.status];
  const StatusIcon = status.icon;

  return (
    <div className="flex items-start gap-4 p-4 hover:bg-grey-50 transition-colors group">
      <div className="flex flex-col items-center min-w-[60px]">
        <span className="text-lg font-bold text-black tabular-nums">{booking.time}</span>
        {booking.duration && (
          <span className="text-[10px] text-grey-400 uppercase">{booking.duration}</span>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-black truncate">{booking.studentName}</span>
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide",
              typeColors[booking.type]
            )}
          >
            {typeLabels[booking.type]}
          </span>
        </div>
        {booking.notes && (
          <p className="text-xs text-grey-400 mt-0.5 truncate">{booking.notes}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
            status.className
          )}
        >
          <StatusIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{status.label}</span>
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center justify-center rounded-lg text-grey-400 hover:text-black hover:bg-grey-50"
            >
              <Icon name="more_horiz" className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Se detaljer</DropdownMenuItem>
            <DropdownMenuItem>Endre tid</DropdownMenuItem>
            <DropdownMenuItem className="text-error">Avlyst</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function UpcomingBookings({ bookings = defaultBookings, maxItems = 5 }: UpcomingBookingsProps) {
  const displayBookings = bookings.slice(0, maxItems);

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-grey-200">
        <div className="flex items-center gap-3">
          <Icon name="schedule" className="w-5 h-5 text-grey-400" />
          <h2 className="text-sm font-semibold text-black">Neste bookinger</h2>
        </div>
        <Link
          href="/admin/kalender"
          className="text-sm text-grey-400 hover:text-black font-medium transition-colors"
        >
          Se alle
        </Link>
      </div>

      <div className="divide-y divide-grey-50">
        {displayBookings.length > 0 ? (
          displayBookings.map((booking) => (
            <BookingItem key={booking.id} booking={booking} />
          ))
        ) : (
          <div className="px-6 py-12 text-center">
            <Icon name="calendar_today" className="w-10 h-10 text-grey-300 mx-auto mb-3 opacity-50" />
            <p className="text-sm text-grey-400">Ingen kommende bookinger</p>
          </div>
        )}
      </div>
    </Card>
  );
}

export function CompactBookingList({ bookings = defaultBookings.slice(0, 3) }: { bookings?: Booking[] }) {
  return (
    <div className="space-y-2">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="flex items-center justify-between p-3 rounded-lg bg-grey-50 hover:bg-grey-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-black tabular-nums">{booking.time}</span>
            <span className="text-sm text-grey-400 truncate">{booking.studentName}</span>
          </div>
          <span
            className={cn(
              "px-2 py-0.5 rounded text-[10px] font-medium uppercase",
              typeColors[booking.type]
            )}
          >
            {typeLabels[booking.type]}
          </span>
        </div>
      ))}
    </div>
  );
}
