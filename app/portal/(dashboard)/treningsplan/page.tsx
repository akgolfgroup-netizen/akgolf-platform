import { requirePortalUser } from "@/lib/portal/auth";
import { getActivePlan } from "./actions";
import { isStaff } from "@/lib/portal/rbac";
import {
  Target,
  ChevronLeft,
  ChevronRight,
  Sparkles,
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
} from "lucide-react";
import { PORTAL_CONTENT } from "@/lib/website-constants";
import { format, startOfISOWeek, addDays, isToday } from "date-fns";
import { nb } from "date-fns/locale";
import Link from "next/link";
import {
  PyramidIndicator,
  SessionIdDisplay,
  AreaCategoryBadge,
} from "@/components/portal/treningsplan";
import type { PyramidLevel, TrainingArea } from "@/lib/portal/golf/ak-formula";
import { BentoGrid } from "@/components/portal/apple/bento-grid";
import { BentoCard } from "@/components/portal/apple/bento-card";
import { AppleButton } from "@/components/portal/apple/apple-button";
import { AppleBadge } from "@/components/portal/apple/apple-badge";
import { AppleCard } from "@/components/portal/apple/apple-card";

// Demo session type
interface DemoSession {
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

// Demo session data with AK-formelen
const DEMO_SESSIONS: DemoSession[] = [
  {
    id: "putting-session",
    dayOfWeek: 1,
    title: "Putting",
    durationMinutes: 45,
    pyramid: "SLAG",
    area: "PUTT3-6",
    intensity: "medium",
    completed: true,
    exercises: [
      { name: "Oppvarming - Korte putts", details: "10 min - 3 fot sirkel" },
      { name: "Gate Drill", details: "15 min - Linje-trening" },
      { name: "Klokke-drill", details: "15 min - Break fra alle retninger" },
      { name: "Fartskontroll", details: "5 min - 40 fot putts" },
    ],
  },
  {
    id: "naerspill-session",
    dayOfWeek: 2,
    title: "Naerspill",
    durationMinutes: 60,
    pyramid: "SLAG",
    area: "CHIP",
    intensity: "medium",
    isToday: true,
    exercises: [
      { name: "Oppvarming - Chipping", details: "10 min - 20 baller fra 10m" },
      { name: "Gate Drill - Pitching", details: "15 min - 30m, 40m, 50m" },
      { name: "Up-and-down Challenge", details: "15 min - 10 posisjoner" },
      { name: "Bunkerslag", details: "5 min - Sand forst" },
    ],
  },
  {
    id: "hvile-1",
    dayOfWeek: 3,
    title: "Hvile",
    isRest: true,
  },
  {
    id: "coaching-session",
    dayOfWeek: 4,
    title: "Coaching",
    durationMinutes: 60,
    pyramid: "TEK",
    area: "INN150",
    intensity: "medium",
    isCoaching: true,
    coachName: "Anders",
  },
  {
    id: "tee-session",
    dayOfWeek: 5,
    title: "Tee Total",
    durationMinutes: 60,
    pyramid: "SLAG",
    area: "TEE",
    intensity: "high",
    exercises: [
      { name: "Alignment Station", details: "10 min - Setup og sikting" },
      { name: "Tempo Drill 3-1", details: "15 min - Svingrytme" },
      { name: "Stock Shot Driver", details: "20 min - Konsistent draw" },
      { name: "Simulator Challenge", details: "15 min - Fairway-treff" },
    ],
  },
  {
    id: "runde-session",
    dayOfWeek: 6,
    title: "Runde",
    durationMinutes: 240,
    pyramid: "SPILL",
    area: "TEE",
    intensity: "high",
    isRound: true,
  },
  {
    id: "hvile-2",
    dayOfWeek: 7,
    title: "Hvile",
    isRest: true,
  },
];

function getSessionIcon(session: DemoSession) {
  if (session.isRest) return Bed;
  if (session.isCoaching) return User;
  if (session.isRound) return Flag;
  if (session.area === "TEE") return Wind;
  return Target;
}

function getSessionBadgeVariant(session: DemoSession): "success" | "neutral" | "info" | "gold" | "warning" {
  if (session.completed) return "success";
  if (session.isRest) return "neutral";
  if (session.isCoaching) return "info";
  if (session.isRound) return "success";
  return "gold";
}

export default async function TreningsplanPage() {
  const user = await requirePortalUser();
  const plan = await getActivePlan();
  const canGenerate = isStaff(user?.role);

  // Get current week dates
  const now = new Date();
  const weekStart = startOfISOWeek(now);
  const weekNumber = format(now, "w");
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Map demo sessions to week dates
  const weekDays = DEMO_SESSIONS.map((session, idx) => ({
    ...session,
    date: weekDates[idx],
    dateNum: format(weekDates[idx], "d"),
    dayName: format(weekDates[idx], "EEEE", { locale: nb }),
    isToday: isToday(weekDates[idx]),
  }));

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
              <AppleButton variant="primary" size="sm" icon={Sparkles}>
                Generer ny plan
              </AppleButton>
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
            const badgeVariant = getSessionBadgeVariant(day);

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
                        Dagens okt: {todaySession.title}
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
                        {todaySession.intensity === "high" ? "Hoy" : "Middels"} intensitet
                      </AppleBadge>
                    </div>
                  </div>
                </div>
                <Link href={`/portal/treningsplan/${todaySession.id}`}>
                  <AppleButton variant="gold" icon={Play}>
                    Start okt
                  </AppleButton>
                </Link>
              </div>

              {/* Pyramid indicator */}
              {todaySession.pyramid && (
                <div className="flex items-center gap-4 px-4 py-3 bg-[var(--apple-gray-50)] rounded-xl border border-[var(--apple-gray-100)] mb-4">
                  <PyramidIndicator level={todaySession.pyramid} />
                  <div className="text-sm text-[var(--apple-gray-600)]">
                    Fokus pa slagkvalitet og presisjon
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
                    Individuell coaching. Fokus baseres pa treningslogg og mal.
                  </p>
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
            icon={TrendingUp}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-[var(--apple-gray-50)] rounded-xl">
                <p className="text-3xl font-bold text-[var(--apple-gray-950)]">{completedSessions}/{totalSessions}</p>
                <p className="text-xs text-[var(--apple-gray-500)] mt-1">Okter fullfort</p>
              </div>
              <div className="text-center p-4 bg-[var(--apple-gray-50)] rounded-xl">
                <p className="text-3xl font-bold text-[var(--apple-gray-950)]">{Math.round(totalMinutes / 60)}t</p>
                <p className="text-xs text-[var(--apple-gray-500)] mt-1">Total treningstid</p>
              </div>
              <div className="text-center p-4 bg-[var(--apple-gold-50)] rounded-xl col-span-2">
                <p className="text-3xl font-bold text-[var(--apple-gold-600)]">
                  {Math.round((completedSessions / totalSessions) * 100) || 0}%
                </p>
                <p className="text-xs text-[var(--apple-gray-500)] mt-1">Malprogresjon</p>
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
                Godt jobbet med putting i gar! Fokuser pa a holde hodet stille gjennom hele slaget.
                Naerspill i dag - bruk samme fokus pa setup og alignment.
              </p>
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
                  : "Kontakt din coach for a fa en personlig treningsplan."}
              </p>
              {canGenerate && (
                <AppleButton variant="gold" size="lg" icon={Sparkles}>
                  Generer treningsplan
                </AppleButton>
              )}
            </div>
          </AppleCard>
        )}
      </div>
    </div>
  );
}
