// @ts-nocheck — CoachingPackage model not yet in Prisma schema
import { NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";

export async function GET() {
  try {
    const packages = await prisma.coachingPackage.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        priceNok: true,
        billingType: true,
        bookingType: true,
        sessionsPerMonth: true,
        sessionDurationMin: true,
        bookingWindowDays: true,
        bookingWindowHours: true,
        maxBookingsPerWeek: true,
        slotsRequired: true,
        description: true,
        sortOrder: true,
      },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(packages, {
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
