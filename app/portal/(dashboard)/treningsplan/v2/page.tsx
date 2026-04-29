import type { Metadata } from "next";
import { requirePortalUser } from "@/lib/portal/auth";
import { getWeekEvents, getActivePlan } from "../actions";
import { WeekStrip } from "@/components/portal/treningsplan-v2/week-strip";
import type { V2Event } from "@/components/portal/treningsplan-v2/types";

export const metadata: Metadata = {
  title: "Treningsplan v2 | PlayerHQ",
  description: "Pixel-rebuild av treningsplan-uken (a5-mockup).",
};

export const dynamic = "force-dynamic";

interface TreningsplanV2PageProps {
  searchParams: Promise<{ week?: string }>;
}

function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function buildWeekDates(offset: number): Date[] {
  const today = new Date();
  // Manuell start (mandag)
  const day = today.getDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;
  const monday = new Date(today);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - daysFromMonday + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export default async function TreningsplanV2Page({
  searchParams,
}: TreningsplanV2PageProps) {
  await requirePortalUser();

  const { week } = await searchParams;
  const weekOffset = parseInt(week ?? "0", 10) || 0;

  const safe = <T,>(p: Promise<T>, label: string, fallback: T): Promise<T> =>
    p.catch((err) => {
      console.error(`[treningsplan/v2] ${label} failed:`, err);
      return fallback;
    });

  const [plan, eventsRaw] = await Promise.all([
    safe(getActivePlan(), "getActivePlan", null),
    safe(getWeekEvents(weekOffset), "getWeekEvents", []),
  ]);

  const weekDates = buildWeekDates(weekOffset);
  const todayIso = isoDate(new Date());

  // Map eksisterende events til V2Event-format
  const events: V2Event[] = (eventsRaw ?? []).map((e) => ({
    id: e.id,
    date: typeof e.date === "string" ? e.date : isoDate(new Date(e.date)),
    startH: e.startH ?? 9,
    startM: e.startM ?? 0,
    dur: e.dur ?? 60,
    title: e.title ?? "Økt",
    focus: e.focus ?? "",
    area: e.area ?? null,
    exercises: [],
    done: e.done ?? false,
    isGroupSession: e.isGroupSession ?? false,
    groupName: e.groupName ?? null,
  }));

  return (
    <div
      className="min-h-screen p-6 lg:p-10"
      style={{ background: "#0F1F18", color: "#FFFFFF" }}
    >
      <div className="max-w-[1200px] mx-auto space-y-6">
        <header>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#D1F843",
            }}
          >
            / Spill · Treningsplan
          </div>
          <h1
            className="mt-2 text-[36px] font-bold tracking-tight"
            style={{ color: "#FFFFFF" }}
          >
            Uke {Math.floor((weekDates[0].getTime() - new Date(weekDates[0].getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1}
          </h1>
          {plan ? (
            <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
              {plan.title ?? "Aktiv plan"}
            </p>
          ) : null}
        </header>

        <WeekStrip
          weekDates={weekDates}
          events={events}
          todayIso={todayIso}
          hrefForDay={(iso) => `/portal/treningsplan?date=${iso}`}
        />
      </div>
    </div>
  );
}
