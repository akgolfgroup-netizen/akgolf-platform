import { CalendarSyncSettings } from "@/components/portal/kalender/calendar-sync-settings";
import { addMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { PORTAL_CONTENT } from "@/lib/website-constants";

export default async function KalenderPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; offset?: string }>;
}) {
  const params = await searchParams;
  const view = params.view === "uke" ? "uke" : params.view === "dag" ? "dag" : "maned";
  const monthOffset = parseInt(params.offset ?? "0", 10);

  const baseDate = addMonths(new Date(), monthOffset);

  // Demo calendar data matching wireframe
  const calendarDays = [
    // Week 1 (prev month)
    { day: 23, isOtherMonth: true },
    { day: 24, isOtherMonth: true },
    { day: 25, isOtherMonth: true },
    { day: 26, isOtherMonth: true },
    { day: 27, isOtherMonth: true },
    { day: 28, isOtherMonth: true },
    { day: 1 },
    // Week 2
    { day: 2 },
    { day: 3 },
    { day: 4 },
    { day: 5, event: { type: "coaching", label: "Coaching" } },
    { day: 6 },
    { day: 7 },
    { day: 8 },
    // Week 3
    { day: 9, event: { type: "training", label: "Putting" } },
    { day: 10 },
    { day: 11 },
    { day: 12, event: { type: "coaching", label: "Coaching" } },
    { day: 13 },
    { day: 14, event: { type: "tournament", label: "Turnering" } },
    { day: 15, event: { type: "tournament", label: "Turnering" } },
    // Week 4
    { day: 16, event: { type: "training", label: "Naerspill" } },
    { day: 17 },
    { day: 18 },
    { day: 19, event: { type: "coaching", label: "Coaching" } },
    { day: 20 },
    { day: 21 },
    { day: 22 },
    // Week 5 (current)
    { day: 23, event: { type: "training", label: "Putting" } },
    { day: 24, isToday: true, event: { type: "training", label: "Naerspill" } },
    { day: 25 },
    { day: 26, event: { type: "coaching", label: "Coaching" } },
    { day: 27, event: { type: "training", label: "Tee Total" } },
    { day: 28 },
    { day: 29 },
    // Week 6
    { day: 30 },
    { day: 31 },
    { day: 1, isOtherMonth: true },
    { day: 2, isOtherMonth: true },
    { day: 3, isOtherMonth: true },
    { day: 4, isOtherMonth: true },
    { day: 5, isOtherMonth: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white capitalize">
            {baseDate.toLocaleDateString("nb-NO", { month: "long", year: "numeric" })}
          </h1>
          <div className="flex gap-1">
            <a
              href={`?view=${view}&offset=${monthOffset - 1}`}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#333] bg-white text-[#171717] hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </a>
            <a
              href={`?view=${view}&offset=0`}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#333] bg-white text-[#171717] hover:bg-gray-100 transition-colors"
            >
              I dag
            </a>
            <a
              href={`?view=${view}&offset=${monthOffset + 1}`}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#333] bg-white text-[#171717] hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 p-1 rounded-lg bg-[#F5F5F5]">
            {[
              { label: "Maned", val: "maned" },
              { label: "Uke", val: "uke" },
              { label: "Dag", val: "dag" },
            ].map((v) => (
              <a
                key={v.val}
                href={`?view=${v.val}&offset=${monthOffset}`}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  view === v.val
                    ? "bg-white shadow-sm text-[#171717]"
                    : "text-[#737373] hover:text-[#171717]"
                }`}
              >
                {v.label}
              </a>
            ))}
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#171717] text-white hover:bg-[#262626] transition-colors">
            <Plus className="w-4 h-4" />
            Legg til
          </button>
        </div>
      </div>

      <div className="max-w-5xl space-y-4">
        {/* Event Type Legend */}
        <div className="flex gap-4">
          {[
            { color: "#DBEAFE", label: "Coaching" },
            { color: "#DCFCE7", label: "Trening" },
            { color: "#FEF3C7", label: "Turnering" },
            { color: "#F3E8FF", label: "Runde" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-xs text-white">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ background: item.color }}
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="rounded-lg overflow-hidden bg-white border border-[#E5E5E5]">
          {/* Header */}
          <div className="grid grid-cols-7 bg-[#FAFAFA]">
            {["Man", "Tir", "Ons", "Tor", "Fre", "Lor", "Son"].map((day) => (
              <div
                key={day}
                className="p-2 text-center text-xs font-semibold text-[#737373]"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-[1px] bg-[#E5E5E5]">
            {calendarDays.map((item, idx) => (
              <div
                key={idx}
                className={`min-h-[60px] p-2 bg-white ${
                  item.isToday ? "border-2 border-[#171717]" : ""
                } ${item.event ? "bg-blue-50" : ""}`}
              >
                <span
                  className={`text-sm ${
                    item.isOtherMonth ? "text-[#A3A3A3]" : "text-[#171717]"
                  } ${item.isToday ? "font-semibold" : ""}`}
                >
                  {item.day}
                </span>
                {item.event && (
                  <div
                    className={`mt-1 px-1 py-0.5 rounded text-[10px] truncate ${
                      item.event.type === "coaching"
                        ? "bg-blue-100 text-blue-700"
                        : item.event.type === "training"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.event.label}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* iCal sync */}
        <CalendarSyncSettings />

        {/* Info section */}
        <details className="rounded-lg bg-white border border-[#E5E5E5] group">
          <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer list-none hover:bg-[#F5F5F5]">
            <span className="text-sm font-medium text-[#171717]">Kalender-info</span>
            <span className="ml-auto text-xs text-[#737373] group-open:hidden">Vis mer</span>
            <span className="ml-auto text-xs text-[#737373] hidden group-open:inline">Skjul</span>
          </summary>
          <div className="px-4 pb-4 space-y-4 border-t border-[#E5E5E5]">
            {/* Color codes */}
            <div className="pt-4">
              <p className="text-xs font-semibold text-[#737373] uppercase tracking-widest mb-2">
                Fargekoder
              </p>
              <div className="flex flex-wrap gap-3">
                {PORTAL_CONTENT.kalender.colorCodes.map((item) => (
                  <div key={item.color} className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        item.color === "gold"
                          ? "bg-[#B07D4F]"
                          : item.color === "blue"
                          ? "bg-blue-500"
                          : item.color === "green"
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }`}
                    />
                    <span className="text-sm text-[#525252]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sync info */}
            <div>
              <p className="text-xs font-semibold text-[#737373] uppercase tracking-widest mb-2">
                Synkronisering
              </p>
              <p className="text-sm text-[#525252]">
                {PORTAL_CONTENT.kalender.syncInfo}
              </p>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
