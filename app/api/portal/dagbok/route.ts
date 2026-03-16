import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";

export async function GET(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const logs = await prisma.trainingLog.findMany({
    where: {
      userId: user.id,
      ...(from && to
        ? { date: { gte: new Date(from), lte: new Date(to) } }
        : {}),
    },
    include: { planSession: { select: { title: true, focusArea: true } } },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(logs);
}

export async function POST(req: NextRequest) {
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

  const log = await prisma.trainingLog.create({
    data: {
      userId: user.id,
      planSessionId: planSessionId ?? null,
      date: date ? new Date(date) : new Date(),
      durationMinutes: durationMinutes ?? null,
      focusArea: focusArea ?? null,
      exercises: exercises ?? [],
      notes: notes ?? null,
      rating: rating ?? null,
      deviatedFromPlan: deviatedFromPlan ?? false,
      deviationReason: deviationReason ?? null,
    },
  });

  return NextResponse.json(log, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, ...data } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  // Ensure user owns the log
  const existing = await prisma.trainingLog.findFirst({
    where: { id, userId: user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.trainingLog.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const existing = await prisma.trainingLog.findFirst({
    where: { id, userId: user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.trainingLog.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
