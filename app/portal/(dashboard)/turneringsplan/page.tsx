"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  format,
  addMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import { nb } from "date-fns/locale";
import {
  Trophy,
  Calendar,
  CheckCircle2,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Target,
  Flag,
} from "lucide-react";
import { QuickAction } from "@/components/portal/heritage/quick-action";
import {
  PortalHeader,
  PortalCard,
  PremiumBentoCard,
  PremiumBentoGrid,
  staggerContainer,
  fadeInUp,
} from "@/components/portal/premium";

interface Tournament {
  id: string;
  name: string;
  date: Date;
  location: string;
  status: "registered" | "planning";
  type: string;
  preparationProgress: number;
}

const mockTournaments: Tournament[] = [
  {
    id: "1",
    name: "NM Match",
    date: new Date(2024, 7, 15),
    location: "Oslo Golfklubb",
    status: "registered",
    type: "Match",
    preparationProgress: 80,
  },
  {
    id: "2",
    name: "Klubbmesterskap",
    date: new Date(2024, 7, 28),
    location: "Bærums GK",
    status: "planning",
    type: "Stroke",
    preparationProgress: 45,
  },
  {
    id: "3",
    name: "Hovland Open",
    date: new Date(2024, 8, 12),
    location: "Vik Golf",
    status: "registered",
    type: "Stroke",
    preparationProgress: 30,
  },
];

interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
}

const preparationChecklist: ChecklistItem[] = [
  { id: "1", task: "Registrer deg på turneringen", completed: true },
  { id: "2", task: "Book overnatting", completed: true },
  { id: "3", task: "Planlegg treningsøkter uken før", completed: false },
  { id: "4", task: "Forbered utstyr", completed: false },
  { id: "5", task: "Studer banen", completed: false },
  { id: "6", task: "Planlegg måltider", completed: false },
];

function getPeriodLabel(date: Date): string {
  const month = date.getMonth();
  if (month >= 3 && month <= 5) return "Forberedelse";
  if (month >= 6 && month <= 8) return "Konkurransesesong";
  if (month >= 9 && month <= 10) return "Restitusjon";
  return "Vintertrening";
}

export default function TurneringsplanPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTournament, setSelectedTournament] = useState<string | null>(
    null,
  );

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTournamentForDay = (day: Date) => {
    return mockTournaments.find((t) => isSameDay(t.date, day));
  };

  const registeredCount = mockTournaments.filter(
    (t) => t.status === "registered",
  ).length;

  return (
    <div className="space-y-8">
      <PortalHeader
        label="Portal"
        title="Turneringsplan"
        description="Planlegg og forbered dine turneringer — periodisering, sjekklister og forberedelse."
        actions={
          <button className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-alt)]">
            <Plus className="h-4 w-4" />
            Legg til turnering
          </button>
        }
      />

      {/* Stats */}
      <PremiumBentoGrid columns={3}>
        <PremiumBentoCard
          title="Planlagt"
          description={`${mockTournaments.length} turneringer på planen denne sesongen.`}
          icon={Target}
          badge={`${mockTournaments.length}`}
          badgeVariant="primary"
        />
        <PremiumBentoCard
          title="Påmeldt"
          description={`${registeredCount} bekreftede påmeldinger klare for spill.`}
          icon={CheckCircle2}
          badge={`${registeredCount}`}
          badgeVariant="success"
        />
        <PremiumBentoCard
          title="Fullført"
          description="Turneringer du har spilt ferdig denne sesongen."
          icon={Flag}
          badge="2"
          badgeVariant="neutral"
        />
      </PremiumBentoGrid>

      {/* Calendar & List */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <PortalCard padding="md" className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-[var(--color-text)]">
              {format(currentMonth, "MMMM yyyy", { locale: nb })}
            </h3>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
                className="rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface)]"
                aria-label="Forrige måned"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface)]"
                aria-label="Neste måned"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"].map((day) => (
              <div
                key={day}
                className="py-2 text-center text-xs font-semibold text-[var(--color-muted)]"
              >
                {day}
              </div>
            ))}
            {days.map((day) => {
              const tournament = getTournamentForDay(day);
              return (
                <button
                  key={day.toISOString()}
                  onClick={() =>
                    tournament && setSelectedTournament(tournament.id)
                  }
                  className={`aspect-square rounded-lg p-1 text-sm transition-colors ${
                    tournament
                      ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-alt)]"
                      : "text-[var(--color-text)] hover:bg-[var(--color-surface)]"
                  }`}
                >
                  {format(day, "d")}
                  {tournament && (
                    <div className="mt-0.5 truncate text-[8px] opacity-80">
                      {tournament.name}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </PortalCard>

        {/* Upcoming */}
        <div>
          <h3 className="mb-4 font-semibold text-[var(--color-text)]">
            Kommende
          </h3>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {mockTournaments.map((tournament) => {
              const isSelected = selectedTournament === tournament.id;
              return (
                <motion.div key={tournament.id} variants={fadeInUp}>
                  <PremiumBentoCard
                    title={tournament.name}
                    description={`${format(tournament.date, "d. MMMM", {
                      locale: nb,
                    })} · ${getPeriodLabel(tournament.date)} · ${
                      tournament.type
                    }`}
                    icon={Trophy}
                    badge={
                      tournament.status === "registered"
                        ? "Påmeldt"
                        : "Planlegger"
                    }
                    badgeVariant={
                      tournament.status === "registered" ? "success" : "warning"
                    }
                    onClick={() => setSelectedTournament(tournament.id)}
                    className={
                      isSelected
                        ? "border-[var(--color-primary)]/40 shadow-[0_12px_40px_-12px_rgba(0,88,64,0.2)]"
                        : undefined
                    }
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Selected Tournament Details */}
      {selectedTournament && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <PortalCard padding="lg">
            {(() => {
              const tournament = mockTournaments.find(
                (t) => t.id === selectedTournament,
              );
              if (!tournament) return null;
              return (
                <>
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-[var(--color-primary)]" />
                        <span className="text-sm text-[var(--color-muted)]">
                          {tournament.type} · {getPeriodLabel(tournament.date)}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-[var(--color-text)]">
                        {tournament.name}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[var(--color-muted)]">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {format(tournament.date, "EEEE d. MMMM yyyy", {
                            locale: nb,
                          })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          {tournament.location}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                        tournament.status === "registered"
                          ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                          : "bg-[var(--color-warning)]/10 text-[var(--color-warning)]"
                      }`}
                    >
                      {tournament.status === "registered" ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <Clock className="h-3.5 w-3.5" />
                      )}
                      {tournament.status === "registered"
                        ? "Påmeldt"
                        : "Planlegger"}
                    </span>
                  </div>

                  {/* Preparation Progress */}
                  <div className="mb-6">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-[var(--color-text)]">
                        Forberedelse
                      </span>
                      <span className="text-sm text-[var(--color-muted)]">
                        {tournament.preparationProgress}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface)]">
                      <div
                        className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-500"
                        style={{
                          width: `${tournament.preparationProgress}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Checklist */}
                  <h4 className="mb-3 font-semibold text-[var(--color-text)]">
                    Sjekkliste
                  </h4>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {preparationChecklist.map((item) => (
                      <label
                        key={item.id}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-black/5 bg-[var(--color-surface)]/50 p-3 transition-colors hover:bg-[var(--color-surface)]"
                      >
                        <input
                          type="checkbox"
                          checked={item.completed}
                          readOnly
                          className="h-5 w-5 rounded border-[var(--color-muted)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                        />
                        <span
                          className={`text-sm ${
                            item.completed
                              ? "text-[var(--color-muted)] line-through"
                              : "text-[var(--color-text)]"
                          }`}
                        >
                          {item.task}
                        </span>
                      </label>
                    ))}
                  </div>
                </>
              );
            })()}
          </PortalCard>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <QuickAction
          href="#"
          icon={Plus}
          label="Finn turneringer"
          description="Søk i terminlisten"
        />
        <QuickAction
          href="#"
          icon={MapPin}
          label="Baneguide"
          description="Utforsk baner"
        />
        <QuickAction
          href="#"
          icon={Calendar}
          label="Reiseplanlegger"
          description="Bestill reise"
        />
      </div>
    </div>
  );
}
