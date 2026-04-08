import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { nanoid } from "nanoid";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

export async function GET(req: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const supabase = await createServerSupabase();
  
  let query = supabase
    .from("TrainingLog")
    .select(`
      *,
      TrainingPlanSession (title, focusArea)
    `)
    .eq("userId", user.id)
    .order("date", { ascending: false });

  if (from && to) {
    query = query.gte("date", from).lte("date", to);
  }

  const { data: logs, error } = await query;

  if (error) {
    return NextResponse.json({ error: "Kunne ikke hente logger" }, { status: 500 });
  }

  return NextResponse.json(logs || []);
}

export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    planSessionId,
    date,
    durationMinutes,
    focusArea,
    exercises,
    notes,
    rating,
    deviatedFromPlan,
    deviationReason,
  } = body;

  const supabase = await createServerSupabase();
  const { data: log, error } = await supabase
    .from("TrainingLog")
    .insert({
      id: nanoid(),
      userId: user.id,
      planSessionId: planSessionId ?? null,
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
      durationMinutes: durationMinutes ?? null,
      focusArea: focusArea ?? null,
      exercises: exercises ?? [],
      notes: notes ?? null,
      rating: rating ?? null,
      deviatedFromPlan: deviatedFromPlan ?? false,
      deviationReason: deviationReason ?? null,
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Kunne ikke opprette logg" }, { status: 500 });
  }

  return NextResponse.json(log, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, ...data } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const supabase = await createServerSupabase();

  // Ensure user owns the log
  const { data: existing, error: existingError } = await supabase
    .from("TrainingLog")
    .select("id")
    .eq("id", id)
    .eq("userId", user.id)
    .single();

  if (existingError || !existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Whitelist allowed fields to prevent mass assignment
  const allowedFields = ["durationMinutes", "focusArea", "notes", "rating", "deviatedFromPlan", "deviationReason"];
  const sanitizedData = Object.fromEntries(
    Object.entries(data).filter(([key]) => allowedFields.includes(key))
  );

  if (Object.keys(sanitizedData).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const { data: updated, error } = await supabase
    .from("TrainingLog")
    .update({
      ...sanitizedData,
      updatedAt: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Kunne ikke oppdatere logg" }, { status: 500 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const supabase = await createServerSupabase();

  const { data: existing, error: existingError } = await supabase
    .from("TrainingLog")
    .select("id")
    .eq("id", id)
    .eq("userId", user.id)
    .single();

  if (existingError || !existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { error } = await supabase
    .from("TrainingLog")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Kunne ikke slette logg" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
