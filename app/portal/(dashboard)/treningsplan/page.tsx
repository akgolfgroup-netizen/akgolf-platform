import { requirePortalUser } from "@/lib/portal/auth";
import { getActivePlan, getCurrentWeekSessions } from "./actions";
import { getLoggedSessionIds } from "../dagbok/actions";
import { isStaff } from "@/lib/portal/rbac";
import {
  Target,
  ChevronLeft,
  ChevronRight,
  Play,
  User,
  Wind,
  Flag,
  Bed,
  Calendar,
  Clock,
  Zap,
  TrendingUp,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { PORTAL_CONTENT } from "@/lib/website-constants";
import { format, startOfISOWeek, addDays, isToday as checkIsToday } from "date-fns";
import { nb } from "date-fns/locale";
import Link from "next/link";
import {
  PyramidIndicator,
  SessionIdDisplay,
  AreaCategoryBadge,
} from "@/components/portal/treningsplan";
import { GeneratePlanButton } from "@/components/portal/treningsplan/generate-plan-button";
import type { PyramidLevel, TrainingArea } from "@/lib/portal/golf/ak-formula";
import { BentoGrid } from "@/components/portal/apple/bento-grid";
import { BentoCard } from "@/components/portal/apple/bento-card";
import { AppleButton } from "@/components/portal/apple/apple-button";
import { AppleBadge } from "@/components/portal/apple/apple-badge";
import { AppleCard } from "@/components/portal/apple/apple-card";

// Session type for display
interface DisplaySession {
  id: string;
  dayOfWeek: number;
  title: string;
  durationMinutes?: number;
  pyramid?: PyramidLevel;
  area?: TrainingArea;
  intensity?: "low" | "medium" | "high";
  completed?: boolean;
  isToday?: boolean;
  isRest?: boolean;
  isCoaching?: boolean;
  isRound?: boolean;
  coachName?: string;
  exercises?: Array<{ name: string; details: string }>;
}

function getSessionIcon(session: DisplaySession) {
  if (session.isRest) return Bed;
  if (session.isCoaching) return User;
  if (session.isRound) return Flag;
  if (session.area === "TEE") return Wind;
  return Target;
}

function getSessionBadgeVariant(session: DisplaySession): "success" | "neutral" | "info" | "gold" | "warning" {
  if (session.completed) return "success";
  if (session.isRest) return "neutral";
  if (session.isCoaching) return "info";
  if (session.isRound) return "success";
  return "gold";
}

export default async function TreningsplanPage() {
  const user = await requirePortalUser();
  const [plan, weekSessions, loggedSessionIds] = await Promise.all([
    getActivePlan(),
    getCurrentWeekSessions(),
    getLoggedSessionIds(),
  ]);
  const canGenerate = isStaff(user?.role);

  // Get current week dates
  const now = new Date();
  const weekStart = startOfISOWeek(now);
  const weekNumber = format(now, "w");
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Transform plan sessions to display format
  const sessionsFromPlan: DisplaySession[] = weekSessions.map((s) => ({
    id: s.id,
    dayOfWeek: s.dayOfWeek,
    title: s.title,
    durationMinutes: s.durationMinutes ?? undefined,
    completed: loggedSessionIds.includes(s.id),
    exercises: Array.isArray(s.exercises)
      ? (s.exercises as Array<{ name: string; details: string }>)
      : undefined,
  }));

  // Create week days array - fill in rest days for days without sessions
  const weekDays = weekDates.map((date, idx) => {
    const dayOfWeek = idx + 1; // 1 = Monday
    const session = sessionsFromPlan.find((s) => s.dayOfWeek === dayOfWeek);
    const isRestDay = !session;

    const dayData: DisplaySession & { date: Date; dateNum: string; dayName: string } = {
      id: session?.id ?? `rest-${dayOfWeek}`,
      dayOfWeek,
      title: session?.title ?? "Hvile",
      durationMinutes: session?.durationMinutes,
      completed: session?.completed,
      isRest: isRestDay,
      exercises: session?.exercises,
      date,
      dateNum: format(date, "d"),
      dayName: format(date, "EEEE", { locale: nb }),
      isToday: checkIsToday(date),
    };

    return dayData;
  });

  // Find today's session
  const todaySession = weekDays.find((d) => d.isToday);

  // Calculate weekly stats
  const totalMinutes = weekDays.reduce((sum, d) => sum + (d.durationMinutes || 0), 0);
  const completedSessions = weekDays.filter(d => d.completed).length;
  const totalSessions = weekDays.filter(d => !d.isRest).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--apple-gray-50)] via-[#F0F4F8] to-[var(--apple-gray-100)] p-8">
      <div className="max-w-[1200px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[32px] font-bold text-[var(--apple-gray-950)] tracking-tight mb-1">
              Treningsplan
            </h1>
            <p className="text-[15px] text-[var(--apple-gray-500)]" suppressHydrationWarning>
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
              <GeneratePlanButton studentId={user.id} variant="primary" />
            )}
          </div>
        </div>

        {/* AI Intro Card */}
        {plan && (
          <AppleCard variant="glass" padding="md" hover={false}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-[var(--apple-gray-600)] mb-4">{PORTAL_CONTENT.treningsplan.intro}</p>
                <div className="flex flex-wrap gap-4">
                  {PORTAL_CONTENT.treningsplan.howToUse.map((tip, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[var(--apple-gray-500)]">
                      <span className="w-5 h-5 rounded-full bg-[var(--apple-gold-100)] text-[var(--apple-gold-600)] flex items-center justify-center font-semibold text-[10px]">
                        {idx + 1}
                      </span>
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AppleCard>
        )}

        {/* Week Overview Grid */}
        <div className="grid grid-cols-7 gap-3" suppressHydrationWarning>
          {weekDays.map((day) => {
            const Icon = getSessionIcon(day);

            return (
              <Link
                key={day.id}
                href={day.isRest ? "#" : `/portal/treningsplan/${day.id}`}
                className={`group text-center p-4 rounded-2xl border transition-all duration-300 ${
                  day.isToday
                    ? "border-[var(--apple-gold-400)] border-2 bg-gradient-to-br from-[var(--apple-gold-50)] to-white shadow-[var(--shadow-glow-gold)]"
                    : day.completed
                    ? "bg-gradient-to-br from-green-50 to-white border-green-200/50"
                    : "bg-white/70 backdrop-blur-sm border-white/50 hover:border-[var(--apple-gray-300)] hover:shadow-md"
                } ${day.isRest ? "cursor-default opacity-70" : "cursor-pointer"}`}
                suppressHydrationWarning
              >
                <p className="text-[11px] text-[var(--apple-gray-500)] uppercase tracking-wider font-medium mb-1">
                  {day.dayName.slice(0, 3)}
                </p>
                <p className={`text-xl font-bold mb-2 ${day.isToday ? "text-[var(--apple-gold-600)]" : "text-[var(--apple-gray-900)]"}`}>
                  {day.dateNum}
                </p>
                <div className={`w-10 h-10 rounded-xl mx-auto flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110 ${
                  day.completed
                    ? "bg-green-100"
                    : day.isRest
                    ? "bg-[var(--apple-gray-100)]"
                    : day.isCoaching
                    ? "bg-blue-100"
                    : day.isRound
                    ? "bg-green-100"
                    : "bg-[var(--apple-gold-100)]"
                }`}>
                  <Icon className={`w-5 h-5 ${
                    day.completed
                      ? "text-green-600"
                      : day.isRest
                      ? "text-[var(--apple-gray-500)]"
                      : day.isCoaching
                      ? "text-blue-600"
                      : day.isRound
                      ? "text-green-600"
                      : "text-[var(--apple-gold-600)]"
                  }`} />
                </div>
                <p className="text-xs font-medium text-[var(--apple-gray-700)] truncate">{day.title}</p>
                {day.durationMinutes && !day.isRest && (
                  <p className="text-[10px] text-[var(--apple-gray-400)] mt-0.5">{day.durationMinutes} min</p>
                )}
              </Link>
            );
          })}
        </div>

        {/* Today's Session + Stats */}
        <BentoGrid gap="md">
          {/* Today's Session Detail */}
          {todaySession && !todaySession.isRest && (
            <BentoCard span={8} variant="glass" hover={false}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--apple-gold-100)] to-[var(--apple-gold-200)] flex items-center justify-center">
                    <Play className="w-6 h-6 text-[var(--apple-gold-600)]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-lg font-bold text-[var(--apple-gray-900)]">
                        Dagens økt: {todaySession.title}
                      </span>
                      {todaySession.pyramid && todaySession.area && (
                        <SessionIdDisplay
                          pyramid={todaySession.pyramid}
                          area={todaySession.area}
                          compact
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-sm text-[var(--apple-gray-500)]">
                        <Clock className="w-4 h-4" />
                        {todaySession.durationMinutes} min
                      </span>
                      <AppleBadge
                        variant={todaySession.intensity === "high" ? "warning" : "info"}
                        size="sm"
                        icon={Zap}
                      >
                        {todaySession.intensity === "high" ? "Høy" : "Middels"} intensitet
                      </AppleBadge>
                    </div>
                  </div>
                </div>
                <Link href={`/portal/treningsplan/${todaySession.id}`}>
                  <AppleButton variant="gold" icon={Play}>
                    Start økt
                  </AppleButton>
                </Link>
              </div>

              {/* Pyramid indicator */}
              {todaySession.pyramid && (
                <div className="flex items-center gap-4 px-4 py-3 bg-[var(--apple-gray-50)] rounded-xl border border-[var(--apple-gray-100)] mb-4">
                  <PyramidIndicator level={todaySession.pyramid} />
                  <div className="text-sm text-[var(--apple-gray-600)]">
                    Fokus på slagkvalitet og presisjon
                  </div>
                </div>
              )}

              {/* Exercises */}
              {todaySession.exercises && (
                <div className="space-y-2">
                  {todaySession.exercises.map((exercise, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 p-4 rounded-xl bg-white/50 border border-[var(--apple-gray-100)] hover:border-[var(--apple-gray-200)] transition-colors"
                    >
                      <div className="w-7 h-7 rounded-full bg-[var(--apple-gold-100)] flex items-center justify-center text-sm font-semibold text-[var(--apple-gold-600)] flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[var(--apple-gray-900)]">{exercise.name}</p>
                        <p className="text-xs text-[var(--apple-gray-500)]">{exercise.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Coaching session info */}
              {todaySession.isCoaching && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-700">Coaching med {todaySession.coachName}</span>
                  </div>
                  <p className="text-sm text-[var(--apple-gray-600)]">
                    Individuell coaching. Fokus baseres på treningslogg og mål.
                  </p>
                </div>
              )}
            </BentoCard>
          )}

          {/* Weekly Stats */}
          <BentoCard
            span={todaySession && !todaySession.isRest ? 4 : 12}
            variant="glass"
            title="Ukens statistikk"
            subtitle="Progresjon denne uken"
            icon={TrendingUp}
          >
            <div className={`grid ${todaySession && !todaySession.isRest ? "grid-cols-2" : "grid-cols-4"} gap-4`}>
              <div className="text-center p-4 bg-[var(--apple-gray-50)] rounded-xl">
                <p className="text-3xl font-bold text-[var(--apple-gray-950)]">{completedSessions}/{totalSessions}</p>
                <p className="text-xs text-[var(--apple-gray-500)] mt-1">Økter fullført</p>
              </div>
              <div className="text-center p-4 bg-[var(--apple-gray-50)] rounded-xl">
                <p className="text-3xl font-bold text-[var(--apple-gray-950)]">{Math.round(totalMinutes / 60)}t</p>
                <p className="text-xs text-[var(--apple-gray-500)] mt-1">Total treningstid</p>
              </div>
              <div className={`text-center p-4 bg-[var(--apple-gold-50)] rounded-xl ${todaySession && !todaySession.isRest ? "col-span-2" : ""}`}>
                <p className="text-3xl font-bold text-[var(--apple-gold-600)]">
                  {totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0}%
                </p>
                <p className="text-xs text-[var(--apple-gray-500)] mt-1">Målprogresjon</p>
              </div>
            </div>
          </BentoCard>

          {/* Coach Notes */}
          <BentoCard
            span={4}
            variant="gradient"
            title="Coach-notat"
            subtitle="Fra Anders"
            icon={MessageSquare}
          >
            <div className="p-4 bg-white/60 rounded-xl border border-[var(--apple-gold-200)]/30">
              <p className="text-sm text-[var(--apple-gray-700)] leading-relaxed">
                Godt jobbet med putting i går! Fokuser på å holde hodet stille gjennom hele slaget.
                Nærespill i dag - bruk samme fokus på setup og alignment.
              </p>
            </div>
          </BentoCard>

          {/* Upcoming Days Preview */}
          <BentoCard span={8} variant="solid" title="Kommende økter" subtitle="Planlagte aktiviteter">
            <div className="grid grid-cols-2 gap-4">
              {weekDays
                .filter((d) => !d.isToday && !d.completed && !d.isRest && d.dayOfWeek > (todaySession?.dayOfWeek || 0))
                .slice(0, 2)
                .map((day) => (
                  <Link
                    key={day.id}
                    href={`/portal/treningsplan/${day.id}`}
                    className="p-4 rounded-xl bg-[var(--apple-gray-50)] border border-[var(--apple-gray-100)] hover:border-[var(--apple-gray-300)] hover:bg-white transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-[var(--apple-gray-900)]">
                        {day.dayName} {day.dateNum}.
                      </span>
                      {day.pyramid && day.area && (
                        <AreaCategoryBadge
                          category={
                            day.area.startsWith("PUTT")
                              ? "PUTTING"
                              : ["CHIP", "PITCH", "LOB", "BUNKER"].includes(day.area)
                              ? "SHORT_GAME"
                              : "FULL_SWING"
                          }
                        />
                      )}
                    </div>
                    <p className="text-xs text-[var(--apple-gray-500)]">
                      {day.title} - {day.durationMinutes} min
                      {day.isCoaching && ` med ${day.coachName}`}
                    </p>
                  </Link>
                ))}
              {weekDays.filter((d) => !d.isToday && !d.completed && !d.isRest && d.dayOfWeek > (todaySession?.dayOfWeek || 0)).length === 0 && (
                <p className="text-sm text-[var(--apple-gray-500)] col-span-2 text-center py-4">
                  Ingen flere økter denne uken
                </p>
              )}
            </div>
          </BentoCard>
        </BentoGrid>

        {/* Empty state if no plan */}
        {!plan && (
          <AppleCard variant="glass" padding="lg" hover={false} className="text-center">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--apple-gold-100)] to-[var(--apple-gold-200)] flex items-center justify-center mb-6 shadow-lg">
                <Calendar className="w-10 h-10 text-[var(--apple-gold-600)]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--apple-gray-900)] mb-2">Ingen aktiv treningsplan</h3>
              <p className="text-[var(--apple-gray-500)] max-w-md mb-6">
                {canGenerate
                  ? PORTAL_CONTENT.treningsplan.emptyState
                  : "Kontakt din coach for å få en personlig treningsplan."}
              </p>
              {canGenerate && (
                <GeneratePlanButton studentId={user.id} variant="primary" />
              )}
            </div>
          </AppleCard>
        )}
      </div>
    </div>
  );
}
