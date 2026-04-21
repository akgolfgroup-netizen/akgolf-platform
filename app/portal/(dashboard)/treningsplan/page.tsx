import {
  getWeekEvents,
  getActivePlan,
  getCurrentPeriodization,
  updateSessionTime,
  moveSessionToDay,
  deleteSession,
  logLiveSession,
  createSessionForWeek,
  addExerciseToSession,
  updateSession,
} from "./actions";
import { TrainingPlannerV3 } from "./treningsplan-v3-client";
import { TrainingPlanViewer } from "./training-plan-viewer";
import { TreningsplanPlanner } from "./treningsplan-planner";

// ---------------------------------------------------------------------
// Server component
// ---------------------------------------------------------------------

interface TreningsplanPageProps {
  searchParams: Promise<{ week?: string; view?: string }>;
}

export default async function TreningsplanPage({ searchParams }: TreningsplanPageProps) {
  const { week, view } = await searchParams;
  const weekOffset = parseInt(week ?? "0", 10) || 0;
  const activeView = view ?? "planner";

  const plan = await getActivePlan();
  const periodization = await getCurrentPeriodization();
  const events = await getWeekEvents(weekOffset);
  const historyEvents = await getWeekEvents(weekOffset - 1);

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
    await updateSessionTime(event.id, event.startH, event.startM, event.dur);
  }

  async function handleDeleteEvent(eventId: string) {
    "use server";
    await deleteSession(eventId);
  }

  async function handleMoveEvent(eventId: string, date: string, startH: number, startM: number) {
    "use server";
    const d = new Date(date);
    const day = d.getDay();
    const dayOfWeek = day === 0 ? 7 : day;
    await moveSessionToDay(eventId, dayOfWeek, startH, startM);
  }

  async function handleResizeEvent(eventId: string, durationMinutes: number) {
    "use server";
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

  async function handleCreateSession(data: {
    weekOffset: number;
    dayOfWeek: number;
    title: string;
    description?: string;
    durationMinutes?: number;
    focusArea?: string;
    startH?: number;
    startM?: number;
  }) {
    "use server";
    return createSessionForWeek(data);
  }

  async function handleAddExerciseToSession(
    sessionId: string,
    exercise: {
      id: string;
      name: string;
      description?: string;
      pyramid: string;
      area: string;
      lPhase?: string;
    }
  ) {
    "use server";
    return addExerciseToSession(sessionId, exercise);
  }

  async function handleUpdateSession(
    sessionId: string,
    data: {
      title?: string;
      description?: string;
      durationMinutes?: number;
      focusArea?: string;
    }
  ) {
    "use server";
    return updateSession(sessionId, data);
  }

  const templates = [
    { id: "t1", title: "Putting-drill", dur: 20, focus: "TEK", exercises: [] },
    { id: "t2", title: "Short game", dur: 30, focus: "SLAG", exercises: [] },
    { id: "t3", title: "Driving range", dur: 45, focus: "SLAG", exercises: [] },
    { id: "t4", title: "Styrke-okt", dur: 50, focus: "FYS", exercises: [] },
    { id: "t5", title: "Spill 9 hull", dur: 120, focus: "SPILL", exercises: [] },
    { id: "t6", title: "Svinganalyse", dur: 40, focus: "TEK", exercises: [] },
  ];

  const sessionCount = events.length;
  const totalMinutes = events.reduce((sum, e) => sum + (e.dur ?? 0), 0);
  const doneCount = events.filter((e) => e.done).length;
  const adherencePct = sessionCount > 0 ? Math.round((doneCount / sessionCount) * 100) : 0;

  if (activeView === "planner") {
    return (
      <TreningsplanPlanner
        weekOffset={weekOffset}
        planId={plan?.id ?? null}
        sessionCount={sessionCount}
        totalMinutes={totalMinutes}
        adherencePct={adherencePct}
        periodization={periodization}
        events={events}
        historyEvents={historyEvents}
        onCreateSession={handleCreateSession}
        onAddExerciseToSession={handleAddExerciseToSession}
        onUpdateSession={handleUpdateSession}
      />
    );
  }

  return (
    <div className="space-y-6">
      {activeView === "calendar" ? (
        <TrainingPlannerV3
          events={events}
          templates={templates}
          planId={plan?.id ?? null}
          weekOffset={weekOffset}
          onSaveEvent={handleSaveEvent}
          onDeleteEvent={handleDeleteEvent}
          onMoveEvent={handleMoveEvent}
          onResizeEvent={handleResizeEvent}
          onSaveLiveSession={handleSaveLiveSession}
        />
      ) : (
        <TrainingPlanViewer
          events={events}
          weekOffset={weekOffset}
          planId={plan?.id ?? null}
        />
      )}
    </div>
  );
}
