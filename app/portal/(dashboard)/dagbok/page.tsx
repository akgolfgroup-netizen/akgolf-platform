import { requirePortalUser } from "@/lib/portal/auth";
import { getTrainingLogs } from "./actions";
import {
  NotebookPen,
  List,
  Calendar,
  Clock,
  Activity,
  Target,
  Smile,
  Meh,
  Info,
} from "lucide-react";
import { PORTAL_CONTENT } from "@/lib/website-constants";
import { format, isToday, isYesterday } from "date-fns";
import { nb } from "date-fns/locale";
import { DagbokActions } from "@/components/portal/dagbok/dagbok-actions";

function formatLogDate(date: Date): string {
  if (isToday(date)) {
    return `I dag, ${format(date, "HH:mm")}`;
  }
  if (isYesterday(date)) {
    return `I går, ${format(date, "HH:mm")}`;
  }
  return format(date, "d. MMMM, HH:mm", { locale: nb });
}

function getIntensityLabel(rating: number | null): string {
  if (!rating) return "Middels";
  if (rating >= 4) return "Høy";
  if (rating >= 2) return "Middels";
  return "Lav";
}

export default async function DagbokPage() {
  await requirePortalUser();

  const logs = await getTrainingLogs();

  // Transform logs to display format
  const displayLogs = logs.map((log) => ({
    id: log.id,
    date: formatLogDate(log.date),
    title: log.TrainingPlanSession?.title ?? log.focusArea ?? "Treningsøkt",
    status: log.TrainingPlanSession ? "Coaching" : "Fullført",
    statusColor: log.TrainingPlanSession ? "blue" : "green",
    duration: log.durationMinutes ? `${log.durationMinutes} min` : "-",
    intensity: getIntensityLabel(log.rating),
    focus: log.focusArea ?? "Generell",
    mood: (log.rating ?? 3) >= 3 ? "good" : "challenging",
    notes: log.notes ?? "",
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Treningsdagbok</h1>
        <DagbokActions />
      </div>

      <div className="max-w-3xl space-y-4">
        {/* Why Log info */}
        <div className="rounded-lg p-4 bg-[#1a1a1a] border border-[#333]">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#B07D4F] mt-0.5" />
            <div>
              <p className="text-sm text-[#A3A3A3] mb-3">{PORTAL_CONTENT.dagbok.whyLog}</p>
              <div className="grid grid-cols-4 gap-2">
                {PORTAL_CONTENT.dagbok.slagCategories.map((cat) => (
                  <div key={cat.key} className="p-2 rounded bg-[#262626]">
                    <span className="text-sm font-bold text-[#B07D4F]">{cat.key}</span>
                    <span className="text-xs text-white ml-1">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 p-1 rounded-lg bg-[#F5F5F5]">
            {["Alle", "Putting", "Naerspill", "Approach", "Tee Total"].map((filter, idx) => (
              <button
                key={filter}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  idx === 0
                    ? "bg-white shadow-sm text-[#171717]"
                    : "text-[#737373] hover:text-[#171717]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#E5E5E5] bg-white text-[#171717]">
              <List className="w-3.5 h-3.5" />
              Liste
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-[#737373] hover:bg-[#F5F5F5] transition-colors">
              <Calendar className="w-3.5 h-3.5" />
              Kalender
            </button>
          </div>
        </div>

        {/* Log Entries */}
        <div className="space-y-3">
          {displayLogs.map((log) => (
            <div key={log.id} className="rounded-lg p-4 bg-white border border-[#E5E5E5]">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs text-[#737373]">{log.date}</p>
                  <p className="font-semibold text-[#171717]">{log.title}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-[11px] font-semibold uppercase ${
                    log.statusColor === "green"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {log.status}
                </span>
              </div>
              <div className="flex gap-4 mb-2 text-xs text-[#737373]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {log.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  {log.intensity}
                </span>
                <span className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  {log.focus}
                </span>
                <span className={`flex items-center gap-1 ${log.mood === "good" ? "text-green-500" : "text-orange-500"}`}>
                  {log.mood === "good" ? <Smile className="w-3 h-3" /> : <Meh className="w-3 h-3" />}
                  {log.mood === "good" ? "God folelse" : "Utfordrende"}
                </span>
              </div>
              <p className="text-sm text-[#525252]">{log.notes}</p>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {displayLogs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-lg bg-white border border-[#E5E5E5]">
            <NotebookPen className="w-10 h-10 text-[#D4D4D4] mb-3" />
            <p className="text-sm font-medium text-[#171717] mb-1">
              Ingen treningslogger ennå
            </p>
            <p className="text-sm text-[#737373]">
              {PORTAL_CONTENT.dagbok.emptyState}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
