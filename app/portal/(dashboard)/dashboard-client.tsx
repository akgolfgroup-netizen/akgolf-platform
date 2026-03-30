"use client";

import Link from "next/link";
import { format, isToday, isTomorrow } from "date-fns";
import { nb } from "date-fns/locale";
import { BookOpen, BarChart3, Calendar, Lightbulb } from "lucide-react";

interface DashboardProps {
  userName: string | null;
  stats: { sessionsCount: number; roundsCount: number };
  handicap: { current: number | null; trend: number | null };
  nextBooking: {
    id: string;
    instructorName: string;
    serviceName: string;
    duration: number;
    startTime: Date;
  } | null;
  coachInsight: {
    focusAreas: string[] | null;
    primaryFocus: string | null;
    summary: string | null;
    date: Date;
  } | null;
}

export function DashboardClient({
  userName,
  stats,
  handicap,
  nextBooking,
  coachInsight,
}: DashboardProps) {
  const hasData = stats.sessionsCount > 0 || handicap.current !== null;

  if (!hasData) {
    return <OnboardingView userName={userName} />;
  }

  return (
    <div className="space-y-6">
      {/* Stat row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox
          label="HCP"
          value={
            handicap.current !== null
              ? handicap.current.toFixed(1)
              : "\u2014"
          }
        />
        <StatBox
          label="30 dager"
          value={
            handicap.trend !== null
              ? `${handicap.trend > 0 ? "+" : ""}${handicap.trend.toFixed(1)}`
              : "\u2014"
          }
          valueColor={
            handicap.trend !== null && handicap.trend < 0
              ? "text-[var(--color-success)]"
              : undefined
          }
        />
        <StatBox label="Økter" value={String(stats.sessionsCount)} />
        <StatBox label="Runder" value={String(stats.roundsCount)} />
      </div>

      {/* Next session + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-[20px] border border-[var(--color-grey-200)] p-5">
          <p className="text-sm text-[var(--color-grey-400)] mb-2">
            Neste på programmet
          </p>
          {nextBooking ? (
            <div>
              <p className="text-lg font-semibold text-[var(--color-grey-900)]">
                {nextBooking.serviceName}
              </p>
              <p className="text-sm text-[var(--color-grey-500)]">
                m/ {nextBooking.instructorName}
              </p>
              <p className="text-sm font-medium text-[var(--color-grey-900)] mt-2">
                {formatBookingDate(new Date(nextBooking.startTime))} kl.{" "}
                {format(new Date(nextBooking.startTime), "HH:mm")}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-[var(--color-grey-500)]">
                Ingen kommende økter
              </p>
              <Link
                href="/portal/bookinger/ny"
                className="inline-block mt-3 px-5 py-2.5 bg-[var(--color-black)] text-white rounded-[980px] text-sm font-semibold hover:bg-[var(--color-grey-800)] transition-colors"
              >
                Book time
              </Link>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/portal/dagbok"
            className="flex items-center gap-3 px-5 py-4 bg-[var(--color-black)] text-white rounded-[20px] font-semibold hover:bg-[var(--color-grey-800)] transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            Logg trening
          </Link>
          <Link
            href="/portal/statistikk/ny-runde"
            className="flex items-center gap-3 px-5 py-4 bg-white text-[var(--color-grey-900)] border border-[var(--color-grey-200)] rounded-[20px] font-semibold hover:bg-[var(--color-grey-100)] transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            Ny runde
          </Link>
        </div>
      </div>

      {/* Coach insight */}
      {coachInsight && (
        <div className="bg-[var(--color-grey-100)] rounded-[20px] p-5">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-[var(--color-grey-900)]" />
            <p className="text-sm font-semibold text-[var(--color-grey-900)]">
              Coach-innsikt
            </p>
          </div>
          <p className="text-sm text-[var(--color-grey-600)]">
            {coachInsight.primaryFocus
              ? `Fokusområde: ${coachInsight.primaryFocus}`
              : coachInsight.summary || "Ingen anbefalinger ennå"}
          </p>
        </div>
      )}
    </div>
  );
}

function StatBox({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="bg-white rounded-[20px] border border-[var(--color-grey-200)] p-4 text-center">
      <p
        className={`text-2xl font-bold ${valueColor || "text-[var(--color-grey-900)]"}`}
      >
        {value}
      </p>
      <p className="text-xs text-[var(--color-grey-400)] mt-1">{label}</p>
    </div>
  );
}

function OnboardingView({ userName }: { userName: string | null }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[20px] border border-[var(--color-grey-200)] p-8 text-center">
        <h1 className="text-2xl font-bold text-[var(--color-grey-900)] mb-2">
          Velkommen{userName ? `, ${userName.split(" ")[0]}` : ""}!
        </h1>
        <p className="text-[var(--color-grey-500)] mb-6">
          Her er 3 ting du kan gjøre for å komme i gang:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <OnboardingCard
            href="/portal/bookinger/ny"
            icon={Calendar}
            title="Book en time"
            description="Start med en coaching-økt"
          />
          <OnboardingCard
            href="/portal/statistikk/ny-runde"
            icon={BarChart3}
            title="Registrer en runde"
            description="Logg din første golfrunde"
          />
          <OnboardingCard
            href="/portal/profil"
            icon={BookOpen}
            title="Sett mål"
            description="Definer dine golfmål"
          />
        </div>
      </div>
    </div>
  );
}

function OnboardingCard({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="block p-5 rounded-[12px] bg-[var(--color-grey-100)] hover:bg-[var(--color-grey-200)] transition-colors"
    >
      <Icon className="w-6 h-6 text-[var(--color-grey-900)] mb-3" />
      <p className="font-semibold text-[var(--color-grey-900)]">{title}</p>
      <p className="text-sm text-[var(--color-grey-500)] mt-1">{description}</p>
    </Link>
  );
}

function formatBookingDate(date: Date): string {
  if (isToday(date)) return "I dag";
  if (isTomorrow(date)) return "I morgen";
  return format(date, "EEEE d. MMMM", { locale: nb });
}
