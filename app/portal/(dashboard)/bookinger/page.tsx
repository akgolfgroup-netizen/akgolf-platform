import { requirePortalUser } from "@/lib/portal/auth";
import { getUpcomingBookings, getPastBookings } from "./actions";
import Link from "next/link";
import { SessionCard } from "@/components/portal/heritage/session-card";
import { QuickAction } from "@/components/portal/heritage/quick-action";
import { Plus, Calendar, History, Clock } from "lucide-react";
import { PORTAL_CONTENT } from "@/lib/website-constants";

interface Booking {
  id: string;
  serviceName: string;
  instructorName: string;
  startTime: Date;
  duration: number;
  location?: string;
  status: "upcoming" | "completed" | "cancelled";
  type: "coaching" | "training" | "tournament" | "booking";
}

export default async function BookingerPage() {
  const [upcoming, past] = await Promise.all([getUpcomingBookings(), getPastBookings()]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1c1c16]">Mine bookinger</h1>
          <p className="text-[#6b7366] mt-1">Administrer dine coaching-timer og treninger</p>
        </div>
        <Link
          href="/portal/bookinger/ny"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#154212] text-white text-sm font-medium hover:bg-[#0d2e0c] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Book ny
        </Link>
      </div>

      {/* Cancellation Rules */}
      <div className="bg-[#f7f3ea] rounded-2xl p-5 border border-[#c2c9bb]/50">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-[#8a9385]" />
          <h3 className="font-semibold text-[#1c1c16]">Avbestillingsregler</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PORTAL_CONTENT.bookings.cancellationRules.map((rule) => (
            <div key={rule.hours} className="bg-white rounded-xl p-3 border border-[#c2c9bb]/30">
              <p className="text-sm font-semibold text-[#1c1c16]">{rule.hours} timer</p>
              <p className="text-xs text-[#6b7366]">{rule.rule}</p>
              <p className="text-xs font-medium text-[#154212] mt-1">{rule.fee}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <QuickAction
          href="/portal/bookinger/ny"
          icon={Calendar}
          label="Book coaching"
          description="Planlegg ny økt med coach"
          variant="primary"
        />
        <QuickAction
          href="/portal/kalender"
          icon={Clock}
          label="Se kalender"
          description="Oversikt over alle aktiviteter"
        />
      </div>

      {/* Upcoming Bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#154212]" />
            <h2 className="text-lg font-semibold text-[#1c1c16]">Kommende økter</h2>
          </div>
          <span className="text-sm text-[#6b7366]">{upcoming.length} planlagt</span>
        </div>

        {upcoming.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#c2c9bb]/50">
            <p className="text-[#8a9385]">{PORTAL_CONTENT.bookings.emptyState}</p>
            <Link
              href="/portal/bookinger/ny"
              className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-[#154212] hover:underline"
            >
              <Plus className="w-4 h-4" />
              Book din første time
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((booking, index) => (
              <SessionCard
                key={booking.id}
                id={booking.id}
                title={booking.serviceName}
                date={new Date(booking.startTime)}
                duration={booking.duration}
                instructor={booking.instructorName}
                location={booking.location}
                status="upcoming"
                type={booking.type || "coaching"}
                delay={index * 0.05}
              />
            ))}
          </div>
        )}
      </div>

      {/* Past Bookings */}
      {past.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-[#8a9385]" />
              <h2 className="text-lg font-semibold text-[#1c1c16]">Tidligere økter</h2>
            </div>
            <span className="text-sm text-[#6b7366]">{past.length} fullført</span>
          </div>

          <div className="space-y-3 opacity-75">
            {past.slice(0, 5).map((booking, index) => (
              <SessionCard
                key={booking.id}
                id={booking.id}
                title={booking.serviceName}
                date={new Date(booking.startTime)}
                duration={booking.duration}
                instructor={booking.instructorName}
                location={booking.location}
                status="completed"
                type={booking.type || "coaching"}
                delay={index * 0.05}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
