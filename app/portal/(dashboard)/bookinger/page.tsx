import Link from "next/link";
import { getUpcomingBookings, getPastBookings } from "./actions";
import { BookingList } from "@/components/portal/bookinger/booking-list";
import { Topbar } from "@/components/portal/layout/topbar";
import { Plus } from "lucide-react";

const THEME = {
  navy: "#0F2950",
  gold: "#B8975C",
  goldLight: "#E8D4B0",
  text: "#02060D",
  textSecondary: "#64748B",
};

export default async function BookingerPage() {
  const [upcoming, past] = await Promise.all([
    getUpcomingBookings(),
    getPastBookings(),
  ]);

  return (
    <div>
      <Topbar title="Bookinger" />
      <div className="p-8 max-w-3xl space-y-10">
        {/* Book coaching button */}
        <Link
          href="/bookinger/ny"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${THEME.gold}, ${THEME.goldLight})`,
            color: "#FFFFFF",
            boxShadow: "0 4px 20px rgba(184,151,92,0.25)",
          }}
        >
          <Plus className="w-5 h-5" />
          Book coaching
        </Link>

        <section>
          <h2 
            className="text-xl font-semibold mb-5"
            style={{ color: THEME.navy }}
          >
            Kommende treninger
          </h2>
          <BookingList
            bookings={upcoming}
            emptyMessage="Ingen kommende bookinger."
          />
        </section>

        {past.length > 0 && (
          <section>
            <h2 
              className="text-xl font-semibold mb-5"
              style={{ color: THEME.navy }}
            >
              Tidligere treninger
            </h2>
            <BookingList bookings={past} emptyMessage="Ingen historikk ennå." />
          </section>
        )}
      </div>
    </div>
  );
}
