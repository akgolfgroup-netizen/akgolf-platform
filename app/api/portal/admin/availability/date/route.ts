/**
 * Dato-spesifikk tilgjengelighet (override) for en instruktør.
 *
 *   GET  ?instructorId=X&from=ISO&to=ISO  – list overrides i periode
 *   POST { instructorId, date, startTime, endTime }  – opprett/oppdater
 *   DELETE { id }  – fjern override (faller tilbake på ukentlig default)
 *
 * "Fri"-dag modelleres ved å la kunde-flyten ikke finne noe:
 *   Foreløpig anbefalt løsning er å bruke BlockedTime for hele dagen.
 *   API-et her gjelder positive overrides (åpningstid for akkurat denne datoen).
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { logger } from "@/lib/logger";
import { nanoid } from "nanoid";

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

async function requireAdmin(req: NextRequest) {
  const rateLimit = checkRateLimit(`admin:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return { error: NextResponse.json({ error: "For mange forespørsler" }, { status: 429 }) };
  }
  const user = await requirePortalUser();
  if (!user?.id) {
    return { error: NextResponse.json({ error: "Ikke innlogget" }, { status: 401 }) };
  }
  const supabase = await createServerSupabase();
  const { data: dbUser } = await supabase.from("User").select("role").eq("id", user.id).single();
  if (!dbUser || dbUser.role !== "ADMIN") {
    return { error: NextResponse.json({ error: "Mangler tilgang" }, { status: 403 }) };
  }
  return { user, supabase };
}

export async function GET(req: NextRequest) {
  const ctx = await requireAdmin(req);
  if ("error" in ctx) return ctx.error;
  const { supabase } = ctx;

  const { searchParams } = new URL(req.url);
  const instructorId = searchParams.get("instructorId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  if (!instructorId || !from || !to) {
    return NextResponse.json({ error: "Mangler instructorId, from eller to" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("InstructorDateAvailability")
    .select("id, date, startTime, endTime, locationId")
    .eq("instructorId", instructorId)
    .gte("date", from)
    .lte("date", to)
    .order("date", { ascending: true });
  if (error) {
    logger.error("[availability/date GET]", error);
    return NextResponse.json({ error: "Kunne ikke hente" }, { status: 500 });
  }
  return NextResponse.json({ overrides: data ?? [] });
}

export async function POST(req: NextRequest) {
  const ctx = await requireAdmin(req);
  if ("error" in ctx) return ctx.error;
  const { supabase } = ctx;

  const body = (await req.json()) as {
    instructorId?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
  };

  if (!body.instructorId || !body.date || !body.startTime || !body.endTime) {
    return NextResponse.json({ error: "Mangler felter" }, { status: 400 });
  }
  if (!timeRegex.test(body.startTime) || !timeRegex.test(body.endTime)) {
    return NextResponse.json({ error: "Tid må være HH:MM" }, { status: 400 });
  }

  const [sh, sm] = body.startTime.split(":").map(Number);
  const [eh, em] = body.endTime.split(":").map(Number);
  if (sh * 60 + sm >= eh * 60 + em) {
    return NextResponse.json({ error: "Starttid må være før sluttid" }, { status: 400 });
  }

  const date = new Date(body.date);
  if (Number.isNaN(date.getTime())) {
    return NextResponse.json({ error: "Ugyldig dato" }, { status: 400 });
  }
  date.setUTCHours(0, 0, 0, 0);

  // Upsert: finn eksisterende for (instructorId, date)
  const { data: existing } = await supabase
    .from("InstructorDateAvailability")
    .select("id")
    .eq("instructorId", body.instructorId)
    .eq("date", date.toISOString())
    .maybeSingle();

  if (existing) {
    await supabase
      .from("InstructorDateAvailability")
      .update({ startTime: body.startTime, endTime: body.endTime })
      .eq("id", existing.id);
    return NextResponse.json({ success: true, id: existing.id, updated: true });
  }

  const id = nanoid();
  const { error } = await supabase.from("InstructorDateAvailability").insert({
    id,
    instructorId: body.instructorId,
    date: date.toISOString(),
    startTime: body.startTime,
    endTime: body.endTime,
  });
  if (error) {
    logger.error("[availability/date POST]", error);
    return NextResponse.json({ error: "Kunne ikke opprette" }, { status: 500 });
  }
  return NextResponse.json({ success: true, id, created: true });
}

export async function DELETE(req: NextRequest) {
  const ctx = await requireAdmin(req);
  if ("error" in ctx) return ctx.error;
  const { supabase } = ctx;

  const { id } = (await req.json()) as { id?: string };
  if (!id) return NextResponse.json({ error: "id påkrevd" }, { status: 400 });

  const { error } = await supabase.from("InstructorDateAvailability").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Kunne ikke slette" }, { status: 500 });
  return NextResponse.json({ success: true });
}
