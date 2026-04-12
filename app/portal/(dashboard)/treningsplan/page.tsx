import { requirePortalUser } from "@/lib/portal/auth";
import {
  getWeekEvents,
  getActivePlan,
  updateSessionTime,
  moveSessionToDay,
  deleteSession,
  logLiveSession,
} from "./actions";
import { TrainingPlannerV2 } from "./treningsplan-v2-client";

// ---------------------------------------------------------------------
// Server component
// ---------------------------------------------------------------------

interface TreningsplanPageProps {
  searchParams: Promise<{ week?: string }>;
}

export default async function TreningsplanPage({ searchParams }: TreningsplanPageProps) {
  const user = await requirePortalUser();
  const { week } = await searchParams;
  const weekOffset = parseInt(week ?? "0", 10) || 0;

  const plan = await getActivePlan();
  const events = await getWeekEvents(weekOffset);

  // Server action wrappers bound to the user context
  async function handleSaveEvent(event: {
    id: string;
    date: string;
    startH: number;
    startM: number;
    dur: number;
    title: string;
    focus: string;
    exercises: unknown[];
    done: boolean;
  }) {
    "use server";
    // For new events or edits, we update the session time
    await updateSessionTime(event.id, event.startH, event.startM, event.dur);
  }

  async function handleDeleteEvent(eventId: string) {
    "use server";
    await deleteSession(eventId);
  }

  async function handleMoveEvent(eventId: string, date: string, startH: number, startM: number) {
    "use server";
    // Parse date to get dayOfWeek (1=Mon, 7=Sun)
    const d = new Date(date);
    const day = d.getDay();
    const dayOfWeek = day === 0 ? 7 : day;
    await moveSessionToDay(eventId, dayOfWeek, startH, startM);
  }

  async function handleResizeEvent(eventId: string, durationMinutes: number) {
    "use server";
    // Get current time from event
    const ev = events.find((e) => e.id === eventId);
    await updateSessionTime(eventId, ev?.startH ?? 9, ev?.startM ?? 0, durationMinutes);
  }

  async function handleSaveLiveSession(data: {
    durationMinutes: number;
    focusArea: string | null;
    exercises: {
      id: string;
      name: string;
      pyramid: string;
      area: string;
      lPhase: string | null;
      cs: string | null;
      m: string | null;
      pr: string | null;
      pFrom: string | null;
      pTo: string | null;
      slagFocus: string[];
      baller: number;
      bevegelser: number;
    }[];
  }) {
    "use server";
    await logLiveSession(data);
  }

  // Default templates (can be extended with user favorites later)
  const templates = [
    { id: "t1", title: "Putting-drill", dur: 20, focus: "TEK", exercises: [] },
    { id: "t2", title: "Short game", dur: 30, focus: "SLAG", exercises: [] },
    { id: "t3", title: "Driving range", dur: 45, focus: "SLAG", exercises: [] },
    { id: "t4", title: "Styrke-okt", dur: 50, focus: "FYS", exercises: [] },
    { id: "t5", title: "Spill 9 hull", dur: 120, focus: "SPILL", exercises: [] },
    { id: "t6", title: "Svinganalyse", dur: 40, focus: "TEK", exercises: [] },
  ];

  return (
    <TrainingPlannerV2
      events={events}
      templates={templates}
      planId={plan?.id ?? null}
      onSaveEvent={handleSaveEvent}
      onDeleteEvent={handleDeleteEvent}
      onMoveEvent={handleMoveEvent}
      onResizeEvent={handleResizeEvent}
      onSaveLiveSession={handleSaveLiveSession}
    />
  );
}
