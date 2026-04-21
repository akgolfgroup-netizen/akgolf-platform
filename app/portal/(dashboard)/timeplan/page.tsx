import type { Metadata } from "next";
import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { getWeekEvents, createSessionForWeek } from "../treningsplan/actions";
import { TimeplanClient, type TimeplanEvent } from "./timeplan-client";

export const metadata: Metadata = {
  title: "Min timeplan | AK Golf Portal",
  description: "Din samlede timeplan med bookinger og treningsøkter.",
};

interface TimeplanPageProps {
  searchParams: Promise<{ week?: string }>;
}

export default async function TimeplanPage({ searchParams }: TimeplanPageProps) {
  const user = await requirePortalUser();
  const { week } = await searchParams;
  const weekOffset = parseInt(week ?? "0", 10) || 0;

  const supabase = await createServerSupabase();

  // --- Treningsøkter ---
  const trainingEvents = await getWeekEvents(weekOffset);

  // --- Bookinger ---
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7) + weekOffset * 7);
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const { data: bookings } = await supabase
    .from("Booking")
    .select("id, startTime, status, ServiceType(name, duration)")
    .eq("studentId", user.id)
    .gte("startTime", startOfWeek.toISOString())
    .lt("startTime", endOfWeek.toISOString())
    .in("status", ["PENDING", "CONFIRMED"]);

  // --- Kombiner til TimeplanEvent ---
  const events: TimeplanEvent[] = [];
  let bookingCount = 0;
  let trainingCount = 0;
  let groupCount = 0;
  let totalMinutes = 0;

  // Treningsøkter
  for (const ev of trainingEvents) {
    const d = new Date(ev.date);
    const dayOfWeek = (d.getDay() + 6) % 7; // 0=Mon, 6=Sun
    events.push({
      id: ev.id,
      title: ev.title,
      dayOfWeek,
      startH: ev.startH,
      startM: ev.startM,
      duration: ev.dur,
      type: ev.isGroupSession ? "group" : "training",
      subtitle: ev.isGroupSession ? ev.groupName ?? "Gruppeøkt" : ev.focus,
      href: `/portal/treningsplan`,
    });
    totalMinutes += ev.dur;
    if (ev.isGroupSession) groupCount++;
    else trainingCount++;
  }

  // Bookinger
  for (const b of bookings ?? []) {
    const st = Array.isArray(b.ServiceType) ? b.ServiceType[0] : b.ServiceType;
    const startTime = new Date(b.startTime as string);
    const dayOfWeek = (startTime.getDay() + 6) % 7;
    const duration = (st?.duration as number) ?? 60;
    events.push({
      id: b.id as string,
      title: (st?.name as string) ?? "Booking",
      dayOfWeek,
      startH: startTime.getHours(),
      startM: startTime.getMinutes(),
      duration,
      type: "booking",
      subtitle: "Coaching",
      href: `/portal/bookinger/${b.id}`,
    });
    totalMinutes += duration;
    bookingCount++;
  }

  const stats = {
    bookingCount,
    trainingCount,
    groupCount,
    totalHours: Math.round(totalMinutes / 60 * 10) / 10,
  };

  // Server action wrapper for creating sessions from timeplan
  async function handleCreateSession(data: {
    weekOffset: number;
    dayOfWeek: number;
    title: string;
    durationMinutes: number;
    startH: number;
    startM: number;
    focusArea?: string;
  }) {
    "use server";
    return createSessionForWeek({
      weekOffset: data.weekOffset,
      dayOfWeek: data.dayOfWeek,
      title: data.title,
      durationMinutes: data.durationMinutes,
      startH: data.startH,
      startM: data.startM,
      focusArea: data.focusArea,
    });
  }

  return (
    <TimeplanClient
      weekOffset={weekOffset}
      events={events}
      stats={stats}
      onCreateSession={handleCreateSession}
    />
  );
}
