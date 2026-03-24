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

function getSessionIconColor(session: DemoSession) {
  if (session.completed) return "text-green-500";
  if (session.isRest) return "text-[#525252]";
  if (session.isCoaching) return "text-blue-500";
  if (session.isRound) return "text-green-500";
  return "text-[#B07D4F]";
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Treningsplan</h1>
          <p className="text-sm text-[#737373] mt-1">
            Uke {weekNumber} - {format(weekStart, "d. MMMM", { locale: nb })} - {format(addDays(weekStart, 6), "d. MMMM yyyy", { locale: nb })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-[#333] bg-[#1a1a1a] text-white hover:bg-[#262626] transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="px-4 py-2.5 rounded-lg text-sm font-medium border border-[#333] bg-[#1a1a1a] text-white hover:bg-[#262626] transition-colors">
            I dag
          </button>
          <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-[#333] bg-[#1a1a1a] text-white hover:bg-[#262626] transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
          {canGenerate && (
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#B07D4F] text-white hover:bg-[#A06D3F] transition-colors">
              <Sparkles className="w-4 h-4" />
              Generer ny plan
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl space-y-4">
        {/* AI Intro */}
        {plan && (
          <div className="rounded-lg p-4 bg-[#1a1a1a] border border-[#333]">
            <p className="text-sm text-[#A3A3A3] mb-3">{PORTAL_CONTENT.treningsplan.intro}</p>
            <div className="flex flex-wrap gap-4">
              {PORTAL_CONTENT.treningsplan.howToUse.map((tip, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[#737373]">
                  <span className="w-5 h-5 rounded-full bg-[#B07D4F]/20 text-[#B07D4F] flex items-center justify-center font-medium">
                    {idx + 1}
                  </span>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Week Overview */}
        <div className="grid grid-cols-7 gap-3">
          {weekDays.map((day) => {
            const Icon = getSessionIcon(day);
            const iconColor = getSessionIconColor(day);

            return (
              <Link
                key={day.id}
                href={day.isRest ? "#" : `/portal/treningsplan/${day.id}`}
                className={`text-center p-3 rounded-lg border transition-all ${
                  day.isToday
                    ? "border-[#B07D4F] border-2 bg-[#B07D4F]/5"
                    : day.completed
                    ? "bg-green-500/5 border-green-500/30"
                    : "bg-[#1a1a1a] border-[#333] hover:border-[#444]"
                } ${day.isRest ? "cursor-default" : "cursor-pointer"}`}
              >
                <p className="text-[10px] text-[#737373] uppercase tracking-wide">
                  {day.dayName.slice(0, 3)}
                </p>
                <p className={`text-lg font-semibold my-1 ${day.isToday ? "text-[#B07D4F]" : "text-white"}`}>
                  {day.dateNum}
                </p>
                <div className="mt-2">
                  <Icon className={`w-5 h-5 mx-auto ${iconColor}`} />
                </div>
                <p className="text-[10px] text-[#737373] mt-1 truncate">{day.title}</p>
                {day.durationMinutes && !day.isRest && (
                  <p className="text-[9px] text-[#525252]">{day.durationMinutes} min</p>
                )}
              </Link>
            );
          })}
        </div>

        {/* Today's Session Detail */}
        {todaySession && !todaySession.isRest && (
          <div className="rounded-xl border border-[#333] bg-[#1a1a1a] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[#333]">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-lg font-semibold text-white">
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
                <p className="text-sm text-[#737373]">
                  {todaySession.durationMinutes} minutter - {todaySession.intensity === "high" ? "Hoy" : "Middels"} intensitet
                </p>
              </div>
              <Link
                href={`/portal/treningsplan/${todaySession.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#B07D4F] text-white hover:bg-[#A06D3F] transition-colors"
              >
                <Play className="w-4 h-4" />
                Start okt
              </Link>
            </div>

            {/* Pyramid indicator */}
            {todaySession.pyramid && (
              <div className="flex items-center gap-4 px-4 py-3 bg-[#0f0f0f] border-b border-[#333]">
                <PyramidIndicator level={todaySession.pyramid} />
                <div className="text-sm text-[#737373]">
                  Fokus pa slagkvalitet og presisjon
                </div>
              </div>
            )}

            {/* Exercises */}
            {todaySession.exercises && (
              <div className="p-4 space-y-2">
                {todaySession.exercises.map((exercise, idx) => (
                  <div key={idx} className="flex gap-3 p-3 rounded-lg bg-[#0f0f0f] border border-[#262626]">
                    <div className="w-6 h-6 rounded-full bg-[#262626] flex items-center justify-center text-sm text-[#737373] flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{exercise.name}</p>
                      <p className="text-xs text-[#737373]">{exercise.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Coaching session info */}
            {todaySession.isCoaching && (
              <div className="p-4">
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">Coaching med {todaySession.coachName}</span>
                  </div>
                  <p className="text-sm text-[#A3A3A3]">
                    Individuell coaching. Fokus baseres pa treningslogg og mal.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Upcoming Days Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weekDays
            .filter((d) => !d.isToday && !d.completed && !d.isRest && d.dayOfWeek > (todaySession?.dayOfWeek || 0))
            .slice(0, 2)
            .map((day) => (
              <Link
                key={day.id}
                href={`/portal/treningsplan/${day.id}`}
                className="rounded-lg p-4 bg-[#1a1a1a] border border-[#333] hover:border-[#444] transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">
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
                <p className="text-xs text-[#737373]">
                  {day.title} - {day.durationMinutes} min
                  {day.isCoaching && ` med ${day.coachName}`}
                </p>
              </Link>
            ))}
        </div>

        {/* Empty state if no plan */}
        {!plan && (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl bg-[#1a1a1a] border border-[#333]">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 bg-[#B07D4F]/15">
              <Calendar className="w-10 h-10 text-[#B07D4F]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Ingen aktiv treningsplan</h3>
            <p className="text-[#737373] max-w-md">
              {canGenerate
                ? PORTAL_CONTENT.treningsplan.emptyState
                : "Kontakt din coach for a fa en personlig treningsplan."}
            </p>
            {canGenerate && (
              <button className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium bg-[#B07D4F] text-white hover:bg-[#A06D3F] transition-colors">
                <Sparkles className="w-4 h-4" />
                Generer treningsplan
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
