import Link from "next/link";
import { getUpcomingBookings, getPastBookings } from "./actions";
import { BookingList } from "@/components/portal/bookinger/booking-list";
import { Plus } from "lucide-react";
import { PORTAL_EMPTY_STATES } from "@/lib/website-constants";

export default async function BookingerPage() {
  const [upcoming, past] = await Promise.all([
    getUpcomingBookings(),
    getPastBookings(),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--color-snow)]">Bookinger</h1>
        <Link
          href="/portal/bookinger/ny"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[var(--color-gold)] text-white hover:brightness-110 transition-all cursor-pointer"
          style={{ boxShadow: "0 4px 12px rgba(184,151,92,0.25)" }}
        >
          <Plus className="w-4 h-4" />
          Book coaching
        </Link>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--color-snow)]">
          Kommende treninger
        </h2>
        <BookingList
          bookings={upcoming}
          emptyMessage={PORTAL_EMPTY_STATES.bookinger.description}
        />
      </section>

      {past.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[var(--color-snow)]">
            Tidligere treninger
          </h2>
          <BookingList bookings={past} emptyMessage="Ingen historikk ennå." />
        </section>
      )}
    </div>
  );
}
