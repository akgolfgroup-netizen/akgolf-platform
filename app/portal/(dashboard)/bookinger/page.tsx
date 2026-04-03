import Link from "next/link";
import { getUpcomingBookings, getPastBookings } from "./actions";
import { BookingList } from "@/components/portal/bookinger/booking-list";
import { PORTAL_CONTENT } from "@/lib/website-constants";
import { BentoGrid } from "@/components/portal/apple/bento-grid";
import { BentoCard } from "@/components/portal/apple/bento-card";
import { AppleButton } from "@/components/portal/apple/apple-button";
// MERK: Lucide icons importeres IKKE her — vi bruker iconName i stedet
// for å unngå Server→Client Component boundary-feil

export default async function BookingerPage() {
  const [upcoming, past] = await Promise.all([
    getUpcomingBookings(),
    getPastBookings(),
  ]);

  return (
    <main className="min-h-screen bg-[var(--color-grey-100)] p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-grey-900)] tracking-tight">
              Mine bookinger
            </h1>
            <p className="text-[var(--color-grey-500)] mt-1">
              Administrer dine coaching-timer og treninger
            </p>
          </div>
          <Link href="/portal/bookinger/ny">
            <AppleButton iconName="plus" variant="primary" size="md">
              Book coaching
            </AppleButton>
          </Link>
        </div>

        {/* Cancellation Rules - Glass Card */}
        <BentoCard
          variant="glass"
          span={12}
          iconName="info"
          title="Avbestillingsregler"
          subtitle="Viktig informasjon om endringer"
          hover={false}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            {PORTAL_CONTENT.bookings.cancellationRules.map((rule) => (
              <div
                key={rule.hours}
                className="flex flex-col p-3 rounded-xl bg-[var(--color-grey-100)]/50"
              >
                <span className="text-sm font-semibold text-[var(--color-grey-900)]">
                  {rule.hours} timer
                </span>
                <span className="text-xs text-[var(--color-grey-600)] mt-0.5">
                  {rule.rule}
                </span>
                <span className="text-xs text-[var(--color-grey-900)] font-medium mt-1">
                  {rule.fee}
                </span>
              </div>
            ))}
          </div>
        </BentoCard>

        {/* Upcoming Bookings */}
        <BentoGrid gap="lg">
          <BentoCard
            span={12}
            variant="solid"
            iconName="calendarCheck"
            iconColor="text-green-500"
            title="Kommende treninger"
            subtitle={upcoming.length > 0 ? `${upcoming.length} planlagte` : "Ingen planlagte"}
            hover={false}
          >
            <BookingList
              bookings={upcoming}
              emptyMessage={PORTAL_CONTENT.bookings.emptyState}
            />
          </BentoCard>
        </BentoGrid>

        {/* Past Bookings */}
        {past.length > 0 && (
          <BentoGrid gap="lg">
            <BentoCard
              span={12}
              variant="solid"
              iconName="calendar"
              iconColor="text-[var(--color-grey-400)]"
              title="Tidligere treninger"
              subtitle={`${past.length} fullførte`}
              hover={false}
            >
              <BookingList bookings={past} emptyMessage="Ingen historikk ennå." />
            </BentoCard>
          </BentoGrid>
        )}
      </div>
    </main>
  );
}
