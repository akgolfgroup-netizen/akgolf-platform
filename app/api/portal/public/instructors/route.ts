import { NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";

export async function GET() {
  try {
    const instructors = await prisma.instructor.findMany({
      select: {
        id: true,
        title: true,
        bio: true,
        specialization: true,
        user: { select: { name: true, image: true } },
      },
    });

    return NextResponse.json(instructors, {
      headers: {
        "Access-Control-Allow-Origin": process.env.WEBSITE_URL ?? "http://localhost:3003",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("[instructors] DB error:", error);
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
