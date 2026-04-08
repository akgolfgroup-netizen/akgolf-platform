/**
 * Bookings API with Supabase
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { nanoid } from "nanoid";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const rateLimit = checkRateLimit(`bookings:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { searchParams } = new URL(req.url);
    
    const instructorId = searchParams.get("instructorId");
    const status = searchParams.get("status");

    let query = supabase
      .from("Booking")
      .select(`
        *,
        User:studentId(name, email, phone),
        ServiceType(name, duration, price, category),
        Instructor(id, title)
      `)
      .order("startTime", { ascending: true });

    if (instructorId) query = query.eq("instructorId", instructorId);
    if (status) query = query.eq("status", status);

    const { data, error } = await query.limit(100);

    if (error) {
      console.error("[bookings] Error:", error);
      return NextResponse.json({ error: "Kunne ikke hente bookinger" }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("[bookings] Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, instructorId, serviceTypeId, startTime, endTime, status = "PENDING" } = body;

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from("Booking")
      .insert({
        id: nanoid(),
        studentId,
        instructorId,
        serviceTypeId,
        startTime,
        endTime,
        status,
        createdAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("[bookings] Create error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
