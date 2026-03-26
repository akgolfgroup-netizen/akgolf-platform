import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locationId = searchParams.get("locationId");

  if (!locationId) {
    return NextResponse.json(
      { error: "Mangler parameter: locationId" },
      { status: 400 }
    );
  }

  const resources = await prisma.resource.findMany({
    where: { locationId },
    select: {
      id: true,
      name: true,
      type: true,
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(resources);
}
