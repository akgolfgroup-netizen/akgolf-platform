import { UkePageHeader } from "@/components/admin/uke/page-header";
import { WeekSummary } from "@/components/admin/uke/week-summary";
import { WeekGrid } from "@/components/admin/uke/week-grid";
import {
  WEEK_DAYS,
  WEEK_KPIS,
  WEEK_EVENTS,
  WEEKLY_FOCUS,
  OPEN_SLOTS,
} from "@/components/admin/uke/mock-data";

// TODO: koble til ekte data
// - bookings: prisma.booking.findMany for instructorId i uken
// - kpis: aggregat fra Booking + Capacity, Stripe forventet inntekt
// - apne slots: lib/portal/booking/available-slots
// - ukens fokus: ny modell WeeklyFocus eller manuelt fra Coach

export default function DenneUkenPage() {
  return (
    <div className="min-h-full bg-[#102B1E] px-7 pb-12 pt-6 text-white">
      <UkePageHeader
        eyebrow="Uke 18 · 28 april–4 mai"
        title="Denne uken"
        subtitle="32 økter planlagt · 6 åpne slots · 4 spillere på venteliste"
      />

      <WeekSummary kpis={WEEK_KPIS} />

      <div className="mt-[18px] grid grid-cols-[1fr_320px] gap-4">
        <WeekGrid days={WEEK_DAYS} events={WEEK_EVENTS} />

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-[#1a4a3a] bg-[#0D2E23] p-5">
            <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-accent">
              Ukens fokus
            </div>
            <h2 className="mt-2 font-inter-tight text-[16px] font-semibold text-white">
              Tre ting denne uken
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {WEEKLY_FOCUS.map((item) => (
                <li
                  key={item.title}
                  className={
                    item.highlight
                      ? "rounded-lg border border-accent/30 bg-accent/10 px-3.5 py-3"
                      : "rounded-lg border border-white/5 bg-white/[0.025] px-3.5 py-3"
                  }
                >
                  <div className="text-[13px] font-semibold text-white">
                    {item.title}
                  </div>
                  <div className="mt-1 text-[12px] leading-snug text-white/65">
                    {item.description}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-[#1a4a3a] bg-[#0D2E23] p-5">
            <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-accent">
              Åpne slots
            </div>
            <h2 className="mt-2 font-inter-tight text-[16px] font-semibold text-white">
              {OPEN_SLOTS.length} ledige denne uken
            </h2>
            <ul className="mt-4 flex flex-col gap-2">
              {OPEN_SLOTS.map((slot) => (
                <li
                  key={`${slot.when}-${slot.location}`}
                  className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.025] px-3.5 py-2.5"
                >
                  <div>
                    <div className="text-[13px] font-medium text-white">
                      {slot.when}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/45">
                      {slot.location}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="rounded-md border border-white/10 bg-transparent px-2.5 py-1 text-[11px] font-medium text-white/80 transition hover:bg-white/5"
                  >
                    Tilby
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
