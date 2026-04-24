/**
 * Facility Overview API
 *
 * GET /api/portal/admin/facility-overview?from=ISO&to=ISO
 *
 * Returnerer alle aktive fasiliteter + normaliserte events fra:
 *   - Booking (bookings)
 *   - FacilityActivity (klubbevents, turneringer, closure)
 *   - TrainingPlanSession (gruppeplan-økter med facilityId satt, dersom vi kan mappe weekStart + dayOfWeek til dato i perioden)
 *
 * Brukes av /admin/fasiliteter — sanntid + dag/uke/måned.
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { addDays } from "date-fns";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

type EventSource = "BOOKING" | "ACTIVITY" | "TRAINING_PLAN";

export interface FacilityEvent {
  id: string;
  source: EventSource;
  facilityId: string;
  title: string;
  subtitle: string | null;
  startTime: string;
  endTime: string;
  color: string | null;
  status: string | null;
}

export interface FacilityWithEvents {
  id: string;
  name: string;
  description: string | null;
  capacity: number | null;
  sortOrder: number;
  events: FacilityEvent[];
}

export async function GET(req: NextRequest) {
  try {
    const user = await requirePortalUser();
    if (!user?.id || !isStaff(user.role)) {
      return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const fromStr = searchParams.get("from");
    const toStr = searchParams.get("to");
    if (!fromStr || !toStr) {
      return NextResponse.json({ error: "Mangler from/to" }, { status: 400 });
    }
    const from = new Date(fromStr);
    const to = new Date(toStr);
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      return NextResponse.json({ error: "Ugyldig dato" }, { status: 400 });
    }

    const supabase = await createServerSupabase();

    // 1. Alle aktive fasiliteter
    const { data: facilities, error: fErr } = await supabase
      .from("Facility")
      .select("id, name, description, capacity, sortOrder")
      .eq("isActive", true)
      .order("sortOrder", { ascending: true });
    if (fErr) throw fErr;

    const facilityMap = new Map<string, FacilityWithEvents>();
    for (const f of facilities ?? []) {
      facilityMap.set(f.id as string, {
        id: f.id as string,
        name: f.name as string,
        description: (f.description as string | null) ?? null,
        capacity: (f.capacity as number | null) ?? null,
        sortOrder: (f.sortOrder as number) ?? 0,
        events: [],
      });
    }

    // 2. Bookings
    const { data: bookings } = await supabase
      .from("Booking")
      .select(`
        id, startTime, endTime, status, facilityId,
        User (name),
        ServiceType (name, color),
        Instructor (User (name))
      `)
      .gte("startTime", from.toISOString())
      .lte("endTime", to.toISOString())
      .in("status", ["PENDING", "CONFIRMED", "COMPLETED"])
      .not("facilityId", "is", null);

    for (const b of bookings ?? []) {
      const fid = b.facilityId as string | null;
      if (!fid) continue;
      const f = facilityMap.get(fid);
      if (!f) continue;
      const bUser = Array.isArray(b.User) ? b.User[0] : b.User;
      const bService = Array.isArray(b.ServiceType) ? b.ServiceType[0] : b.ServiceType;
      const bInst = Array.isArray(b.Instructor) ? b.Instructor[0] : b.Instructor;
      const bInstUser = bInst
        ? Array.isArray((bInst as Record<string, unknown>).User)
          ? ((bInst as Record<string, unknown>).User as Record<string, unknown>[])[0]
          : (bInst as Record<string, unknown>).User
        : undefined;
      const studentName = (bUser as { name?: string | null } | null)?.name ?? "Ukjent";
      const instName = (bInstUser as { name?: string | null } | undefined)?.name ?? "";
      const serviceName = (bService as { name?: string } | null)?.name ?? "Booking";
      f.events.push({
        id: b.id as string,
        source: "BOOKING",
        facilityId: fid,
        title: `${serviceName} – ${studentName}`,
        subtitle: instName || null,
        startTime: b.startTime as string,
        endTime: b.endTime as string,
        color: (bService as { color?: string | null } | null)?.color ?? null,
        status: b.status as string,
      });
    }

    // 3. FacilityActivity
    const { data: activities } = await supabase
      .from("FacilityActivity")
      .select("id, facilityId, title, description, activityType, startTime, endTime, status, color")
      .gte("startTime", from.toISOString())
      .lte("endTime", to.toISOString())
      .neq("status", "CANCELLED");

    for (const a of activities ?? []) {
      const f = facilityMap.get(a.facilityId as string);
      if (!f) continue;
      f.events.push({
        id: a.id as string,
        source: "ACTIVITY",
        facilityId: a.facilityId as string,
        title: a.title as string,
        subtitle: (a.activityType as string) ?? null,
        startTime: a.startTime as string,
        endTime: a.endTime as string,
        color: (a.color as string | null) ?? null,
        status: a.status as string,
      });
    }

    // 4. TrainingPlanSession med facilityId — mapp dayOfWeek + weekStart til faktisk dato
    const { data: sessions } = await supabase
      .from("TrainingPlanSession")
      .select(`
        id, title, focusArea, durationMinutes, dayOfWeek, facilityId,
        TrainingPlanWeek (weekStart, TrainingPlan (title))
      `)
      .not("facilityId", "is", null);

    for (const s of sessions ?? []) {
      const fid = s.facilityId as string | null;
      if (!fid) continue;
      const f = facilityMap.get(fid);
      if (!f) continue;
      const week = Array.isArray(s.TrainingPlanWeek) ? s.TrainingPlanWeek[0] : s.TrainingPlanWeek;
      const weekStart = (week as { weekStart?: string } | null)?.weekStart;
      if (!weekStart) continue;
      const plan = (week as { TrainingPlan?: unknown } | null)?.TrainingPlan;
      const planRow = Array.isArray(plan) ? plan[0] : plan;
      const planTitle = (planRow as { title?: string } | null)?.title ?? "Treningsplan";
      const dow = (s.dayOfWeek as number) ?? 0;
      // weekStart er mandag (0) — dayOfWeek: 0=mandag, 1=tirsdag, ...
      const date = addDays(new Date(weekStart), dow);
      // default 08:00 varighet
      const sessionStart = new Date(date);
      sessionStart.setUTCHours(8, 0, 0, 0);
      const dur = (s.durationMinutes as number | null) ?? 60;
      const sessionEnd = new Date(sessionStart.getTime() + dur * 60_000);
      if (sessionEnd < from || sessionStart > to) continue;
      f.events.push({
        id: s.id as string,
        source: "TRAINING_PLAN",
        facilityId: fid,
        title: (s.title as string) ?? "Gruppeplan-økt",
        subtitle: planTitle,
        startTime: sessionStart.toISOString(),
        endTime: sessionEnd.toISOString(),
        color: null,
        status: "CONFIRMED",
      });
    }

    // Sorter events per fasilitet
    for (const f of facilityMap.values()) {
      f.events.sort((a, b) => (a.startTime < b.startTime ? -1 : 1));
    }

    return NextResponse.json({
      from: from.toISOString(),
      to: to.toISOString(),
      facilities: Array.from(facilityMap.values()),
    });
  } catch (err) {
    logger.error("[facility-overview] Error:", err);
    return NextResponse.json({ error: "Kunne ikke hente oversikt" }, { status: 500 });
  }
}
