import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("CoachingPackage")
      .select("id, name, slug, priceNok, billingType, bookingType, sessionsPerMonth, sessionDurationMin, bookingWindowDays, bookingWindowHours, maxBookingsPerWeek, slotsRequired, description, sortOrder")
      .eq("isActive", true)
      .order("sortOrder", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[coaching/packages] Error:", msg);
    return NextResponse.json(
      { error: "Kunne ikke hente pakker", detail: msg },
      { status: 503 }
    );
  }
}
