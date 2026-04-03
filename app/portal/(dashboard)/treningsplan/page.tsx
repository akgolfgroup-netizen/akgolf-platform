import { requirePortalUser } from "@/lib/portal/auth";
import { getActivePlan, getCurrentWeekSessions } from "./actions";
import { isStaff } from "@/lib/portal/rbac";
// Kun ikoner som brukes DIREKTE i JSX (ikke som props til client components)
import {
  Target,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Play,
  Bed,
  Calendar,
  Clock,
} from "lucide-react";
// MERK: Ikoner til AppleButton/AppleBadge/BentoCard bruker iconName i stedet
// for å unngå Server→Client Component boundary-feil
import { PORTAL_CONTENT } from "@/lib/website-constants";
import { format, startOfISOWeek, addDays, isToday } from "date-fns";
import { nb } from "date-fns/locale";
import Link from "next/link";
import {
  PyramidIndicator,
  AreaCategoryBadge,
} from "@/components/portal/treningsplan";
import { BentoGrid } from "@/components/portal/apple/bento-grid";
import { BentoCard } from "@/components/portal/apple/bento-card";
import { AppleButton } from "@/components/portal/apple/apple-button";
import { AppleBadge } from "@/components/portal/apple/apple-badge";
import { AppleCard } from "@/components/portal/apple/apple-card";

// Type for exercises stored as JSON in the database
interface SessionExercise {
  name: string;
  details: string;
}

// Mapped day type for the week grid
interface WeekDay {
  id: string;
  dayOfWeek: number;
  title: string;
  durationMinutes: number | null;
  focusArea: string | null;
  exercises: SessionExercise[];
  hasSession: boolean;
  isRest: boolean;
  completed: boolean;
  date: Date;
  dateNum: string;
  dayName: string;
  isToday: boolean;
}

function getSessionIcon(day: WeekDay) {
  if (day.isRest) return Bed;
  return Target;
}

export default async function TreningsplanPage() {
  const user = await requirePortalUser();
  const plan = await getActivePlan();
  const sessions = await getCurrentWeekSessions();
  const canGenerate = isStaff(user?.role);

  // Get current week dates
  const now = new Date();
  const weekStart = startOfISOWeek(now);
  const weekNumber = format(now, "w");
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Map real sessions to week dates (dayOfWeek: 1=Monday ... 7=Sunday)
  const sessionsByDay = new Map(
    sessions.map((s) => [s.dayOfWeek, s])
  );

  const weekDays: WeekDay[] = weekDates.map((date, idx) => {
    const dayOfWeek = idx + 1; // 1=Monday ... 7=Sunday
    const session = sessionsByDay.get(dayOfWeek);
    const exercises = session?.exercises
      ? (session.exercises as unknown as SessionExercise[])
      : [];
    const completed = session?.TrainingLog
      ? session.TrainingLog.length > 0
      : false;

    return {
      id: session?.id ?? `rest-${dayOfWeek}`,
      dayOfWeek,
      title: session?.title ?? "Hvile",
      durationMinutes: session?.durationMinutes ?? null,
      focusArea: session?.focusArea ?? null,
      exercises,
      hasSession: !!session,
      isRest: !session,
      completed,
      date,
      dateNum: format(date, "d"),
      dayName: format(date, "EEEE", { locale: nb }),
      isToday: isToday(date),
    };
  });

  // Find today's session
  const todaySession = weekDays.find((d) => d.isToday && d.hasSession);

  // Calculate weekly stats
  const totalMinutes = weekDays.reduce((sum, d) => sum + (d.durationMinutes || 0), 0);
  const completedSessions = weekDays.filter((d) => d.completed).length;
  const totalSessions = weekDays.filter((d) => d.hasSession).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-grey-100)] via-[#F0F4F8] to-[var(--color-grey-100)] p-8">
      <div className="max-w-[1200px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[32px] font-bold text-[var(--color-grey-900)] tracking-tight mb-1">
              Treningsplan
            </h1>
            <p className="text-[15px] text-[var(--color-grey-500)]" suppressHydrationWarning>
              Uke {weekNumber} - {format(weekStart, "d. MMMM", { locale: nb })} - {format(addDays(weekStart, 6), "d. MMMM yyyy", { locale: nb })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <AppleButton variant="secondary" size="sm" className="!px-3">
                <ChevronLeft className="w-4 h-4" />
              </AppleButton>
              <AppleButton variant="secondary" size="sm">
                I dag
              </AppleButton>
              <AppleButton variant="secondary" size="sm" className="!px-3">
                <ChevronRight className="w-4 h-4" />
              </AppleButton>
            </div>
            {canGenerate && (
              <AppleButton variant="primary" size="sm" iconName="sparkles">
                Generer ny plan
              </AppleButton>
            )}
          </div>
        </div>

        {plan ? (
          <>
            {/* AI Intro Card */}
            <AppleCard variant="glass" padding="md" hover={false}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-grey-200)] flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-[var(--color-grey-700)]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[var(--color-grey-600)] mb-4">{PORTAL_CONTENT.treningsplan.intro}</p>
                  <div className="flex flex-wrap gap-4">
                    {PORTAL_CONTENT.treningsplan.howToUse.map((tip, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[var(--color-grey-500)]">
                        <span className="w-5 h-5 rounded-full bg-[var(--color-grey-100)] text-[var(--color-grey-900)] flex items-center justify-center font-semibold text-[10px]">
                          {idx + 1}
                        </span>
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AppleCard>

            {/* Week Overview Grid */}
            <div className="grid grid-cols-7 gap-3" suppressHydrationWarning>
              {weekDays.map((day) => {
                const Icon = getSessionIcon(day);

                return (
                  <Link
                    key={day.id}
                    href={day.isRest ? "#" : `/portal/treningsplan/${day.id}`}
                    className={`group text-center p-4 rounded-2xl border transition-[border-color,box-shadow] duration-300 ${
                      day.isToday
                        ? "border-[var(--color-grey-400)] border-2 bg-gradient-to-br from-[var(--color-grey-100)] to-white shadow-[var(--shadow-md)]"
                        : day.completed
                        ? "bg-[var(--color-grey-100)] border-[var(--color-grey-300)]"
                        : "bg-white/70 backdrop-blur-sm border-white/50 hover:border-[var(--color-grey-300)] hover:shadow-md"
                    } ${day.isRest ? "cursor-default opacity-70" : "cursor-pointer"}`}
                    suppressHydrationWarning
                  >
                    <p className="text-[11px] text-[var(--color-grey-500)] uppercase tracking-wider font-medium mb-1">
                      {day.dayName.slice(0, 3)}
                    </p>
                    <p className="text-xl font-bold mb-2 text-[var(--color-grey-900)]">
                      {day.dateNum}
                    </p>
                    <div className={`w-10 h-10 rounded-xl mx-auto flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110 ${
                      day.completed
                        ? "bg-[var(--color-grey-200)]"
                        : "bg-[var(--color-grey-100)]"
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        day.completed
                          ? "text-[var(--color-grey-700)]"
                          : day.isRest
                          ? "text-[var(--color-grey-500)]"
                          : "text-[var(--color-grey-900)]"
                      }`} />
                    </div>
                    <p className="text-xs font-medium text-[var(--color-grey-700)] truncate">{day.title}</p>
                    {day.durationMinutes && !day.isRest && (
                      <p className="text-[10px] text-[var(--color-grey-400)] mt-0.5">{day.durationMinutes} min</p>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Today's Session + Stats */}
            <BentoGrid gap="md">
              {/* Today's Session Detail */}
              {todaySession && (
                <BentoCard span={8} variant="glass" hover={false}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-grey-100)] to-[var(--color-grey-200)] flex items-center justify-center">
                        <Play className="w-6 h-6 text-[var(--color-grey-900)]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-lg font-bold text-[var(--color-grey-900)]">
                            Dagens okt: {todaySession.title}
                          </span>
                          {todaySession.focusArea && (
                            <AreaCategoryBadge
                              category={
                                todaySession.focusArea.startsWith("PUTT")
                                  ? "PUTTING"
                                  : ["CHIP", "PITCH", "LOB", "BUNKER"].includes(todaySession.focusArea)
                                  ? "SHORT_GAME"
                                  : "FULL_SWING"
                              }
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          {todaySession.durationMinutes && (
                            <span className="flex items-center gap-1 text-sm text-[var(--color-grey-500)]">
                              <Clock className="w-4 h-4" />
                              {todaySession.durationMinutes} min
                            </span>
                          )}
                          <AppleBadge
                            variant="neutral"
                            size="sm"
                            iconName="zap"
                          >
                            Planlagt okt
                          </AppleBadge>
                        </div>
                      </div>
                    </div>
                    <Link href={`/portal/treningsplan/${todaySession.id}`}>
                      <AppleButton variant="primary" iconName="play">
                        Start okt
                      </AppleButton>
                    </Link>
                  </div>

                  {/* Pyramid indicator */}
                  {todaySession.focusArea && (
                    <div className="flex items-center gap-4 px-4 py-3 bg-[var(--color-grey-100)] rounded-xl border border-[var(--color-grey-100)] mb-4">
                      <PyramidIndicator level="SLAG" />
                      <div className="text-sm text-[var(--color-grey-600)]">
                        Fokusomrade: {todaySession.focusArea}
                      </div>
                    </div>
                  )}

                  {/* Exercises */}
                  {todaySession.exercises.length > 0 && (
                    <div className="space-y-2">
                      {todaySession.exercises.map((exercise, idx) => (
                        <div
                          key={idx}
                          className="flex gap-3 p-4 rounded-xl bg-[var(--color-grey-100)] border border-[var(--color-grey-100)] hover:border-[var(--color-grey-200)] transition-colors"
                        >
                          <div className="w-7 h-7 rounded-full bg-[var(--color-grey-200)] flex items-center justify-center text-sm font-semibold text-[var(--color-grey-900)] flex-shrink-0">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-[var(--color-grey-900)]">{exercise.name}</p>
                            <p className="text-xs text-[var(--color-grey-500)]">{exercise.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </BentoCard>
              )}

              {/* Weekly Stats */}
              <BentoCard
                span={4}
                variant="glass"
                title="Ukens statistikk"
                subtitle="Progresjon denne uken"
                iconName="trendingUp"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-[var(--color-grey-100)] rounded-xl">
                    <p className="text-3xl font-bold text-[var(--color-grey-900)]">{completedSessions}/{totalSessions}</p>
                    <p className="text-xs text-[var(--color-grey-500)] mt-1">Okter fullfort</p>
                  </div>
                  <div className="text-center p-4 bg-[var(--color-grey-100)] rounded-xl">
                    <p className="text-3xl font-bold text-[var(--color-grey-900)]">{Math.round(totalMinutes / 60)}t</p>
                    <p className="text-xs text-[var(--color-grey-500)] mt-1">Total treningstid</p>
                  </div>
                  <div className="text-center p-4 bg-[var(--color-grey-100)] rounded-xl col-span-2">
                    <p className="text-3xl font-bold text-[var(--color-grey-900)]">
                      {totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0}%
                    </p>
                    <p className="text-xs text-[var(--color-grey-500)] mt-1">Malprogresjon</p>
                  </div>
                </div>
              </BentoCard>

              {/* Upcoming Days Preview */}
              <BentoCard span={8} variant="solid" title="Kommende okter" subtitle="Planlagte aktiviteter">
                <div className="grid grid-cols-2 gap-4">
                  {weekDays
                    .filter((d) => !d.isToday && !d.completed && !d.isRest && d.dayOfWeek > (todaySession?.dayOfWeek || 0))
                    .slice(0, 2)
                    .map((day) => (
                      <Link
                        key={day.id}
                        href={`/portal/treningsplan/${day.id}`}
                        className="p-4 rounded-xl bg-[var(--color-grey-100)] border border-[var(--color-grey-100)] hover:border-[var(--color-grey-300)] hover:bg-white transition-[border-color,background-color] duration-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-[var(--color-grey-900)]">
                            {day.dayName} {day.dateNum}.
                          </span>
                          {day.focusArea && (
                            <AreaCategoryBadge
                              category={
                                day.focusArea.startsWith("PUTT")
                                  ? "PUTTING"
                                  : ["CHIP", "PITCH", "LOB", "BUNKER"].includes(day.focusArea)
                                  ? "SHORT_GAME"
                                  : "FULL_SWING"
                              }
                            />
                          )}
                        </div>
                        <p className="text-xs text-[var(--color-grey-500)]">
                          {day.title}{day.durationMinutes ? ` - ${day.durationMinutes} min` : ""}
                        </p>
                      </Link>
                    ))}
                  {weekDays.filter((d) => !d.isToday && !d.completed && !d.isRest && d.dayOfWeek > (todaySession?.dayOfWeek || 0)).length === 0 && (
                    <p className="text-sm text-[var(--color-grey-500)] col-span-2 text-center py-4">
                      Ingen kommende okter denne uken
                    </p>
                  )}
                </div>
              </BentoCard>
            </BentoGrid>
          </>
        ) : (
          /* Empty state when no plan exists */
          <div className="bg-white rounded-[20px] border border-[var(--color-grey-200)] p-8 text-center">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--color-grey-100)] to-[var(--color-grey-200)] flex items-center justify-center mb-6 shadow-lg">
                <Calendar className="w-10 h-10 text-[var(--color-grey-900)]" />
              </div>
              <p className="text-lg font-semibold text-[var(--color-grey-900)] mb-2">Ingen treningsplan ennå</p>
              <p className="text-[var(--color-grey-500)] mb-4 max-w-md">
                {canGenerate
                  ? "Generer en AI-treningsplan basert på dine mål"
                  : "Kontakt din coach for å få en personlig treningsplan."}
              </p>
              {canGenerate && (
                <AppleButton variant="primary" size="lg" iconName="sparkles">
                  Generer treningsplan
                </AppleButton>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
