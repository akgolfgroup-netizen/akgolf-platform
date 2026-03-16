import { NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";

export async function GET() {
  try {
    const types = await prisma.serviceType.findMany({
      where: { isPublic: true, isActive: true },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        duration: true,
        price: true,
        color: true,
        minNoticeHours: true,
        maxAdvanceDays: true,
        allowStripe: true,
        allowVipps: true,
        instructors: {
          select: {
            id: true,
            title: true,
            user: { select: { name: true, image: true } },
          },
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(types, {
      headers: {
        "Access-Control-Allow-Origin": process.env.WEBSITE_URL ?? "http://localhost:3003",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("[service-types] DB error:", error);
    return NextResponse.json(
      { error: "Service unavailable" },
      { status: 503, headers: { "Access-Control-Allow-Origin": process.env.WEBSITE_URL ?? "http://localhost:3003" } }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": process.env.WEBSITE_URL ?? "http://localhost:3003",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
