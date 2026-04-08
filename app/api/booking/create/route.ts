import { NextRequest, NextResponse } from "next/server";

/**
 * Booking Creation API - TEMPORARILY DISABLED
 * 
 * Intern booking er midlertidig deaktivert mens vi bruker Acuity Scheduling.
 * Bruk /booking-temp for booking via Acuity.
 */
export async function POST(_req: NextRequest) {
  return NextResponse.json(
    { 
      error: "Intern booking er midlertidig utilgjengelig. Vennligst bruk /booking-temp for å booke coaching.",
      redirectTo: "/booking-temp"
    },
    { status: 503 }
  );
}
