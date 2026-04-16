/**
 * Bookings API with Supabase - PROTECTED ENDPOINTS
 * All endpoints require authentication
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { nanoid } from "nanoid";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const dynamic = "force-dynamic";

// Helper to verify authentication
async function verifyAuth(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { error: "Unauthorized", status: 401 };
  }

  const token = authHeader.split(" ")[1];
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return { error: "Unauthorized", status: 401 };
  }

  return { user, supabase };
}

export async function GET(req: NextRequest) {
  // Rate limiting
  const rateLimit = checkRateLimit(`bookings:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  // Authentication check
  const auth = await verifyAuth(req);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { user, supabase } = auth;
  if (!supabase || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);

    const instructorId = searchParams.get("instructorId");
    const status = searchParams.get("status");

    // Build query - users can only see their own bookings unless they're staff
    let query = supabase
      .from("Booking")
      .select(`
        *,
        User:studentId(name, email, phone),
        ServiceType(name, duration, price, category),
        Instructor(id, title)
      `)
      .order("startTime", { ascending: true });

    // Get user's role from User table
    const { data: userData } = await supabase
      .from("User")
      .select("role")
      .eq("id", user.id)
      .single();

    const isStaff = userData?.role === "ADMIN" || userData?.role === "INSTRUCTOR";

    // Non-staff users can only see their own bookings
    if (!isStaff) {
      query = query.eq("studentId", user.id);
    }

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
  // Authentication check
  const auth = await verifyAuth(req);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { user, supabase } = auth;
  if (!supabase || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { studentId, instructorId, serviceTypeId, startTime, endTime, status = "PENDING" } = body;

    // Validate required fields
    if (!instructorId || !serviceTypeId || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Mangler påkrevde felter: instructorId, serviceTypeId, startTime, endTime" },
        { status: 400 }
      );
    }

    // Get user's role
    const { data: userData } = await supabase
      .from("User")
      .select("role")
      .eq("id", user.id)
      .single();

    const isStaff = userData?.role === "ADMIN" || userData?.role === "INSTRUCTOR";

    // Non-staff can only create bookings for themselves
    const targetStudentId = studentId || user.id;
    if (!isStaff && targetStudentId !== user.id) {
      return NextResponse.json(
        { error: "Du kan bare opprette bookinger for deg selv" },
        { status: 403 }
      );
    }

    // Check for booking conflicts (race condition protection)
    const { data: existingBooking } = await supabase
      .from("Booking")
      .select("id")
      .eq("instructorId", instructorId)
      .eq("status", "CONFIRMED")
      .or(`and(startTime.lte.${endTime},endTime.gte.${startTime})`)
      .maybeSingle();

    if (existingBooking) {
      return NextResponse.json(
        { error: "Tidspunktet er allerede booket" },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("Booking")
      .insert({
        id: nanoid(),
        studentId: targetStudentId,
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
  } catch (error: unknown) {
    console.error("[bookings] Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
