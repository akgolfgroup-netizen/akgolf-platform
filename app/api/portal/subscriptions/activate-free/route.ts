import { NextResponse } from "next/server";
import { z } from "zod";
import { getPortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";

const ActivateFreeSchema = z.object({
  moduleSlug: z.string().min(1),
});

export async function POST(req: Request) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = ActivateFreeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Ugyldig input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { moduleSlug } = parsed.data;

  // Verify module exists and is free
  const mod = await prisma.appModule.findUnique({
    where: { slug: moduleSlug },
  });

  if (!mod || !mod.isActive) {
    return NextResponse.json({ error: "Modul ikke funnet" }, { status: 404 });
  }

  if (mod.monthlyPriceNok !== 0) {
    return NextResponse.json(
      { error: "Denne modulen er ikke gratis" },
      { status: 400 }
    );
  }

  // Check if user already has this module
  const existingSub = await prisma.appSubscription.findFirst({
    where: {
      userId: user.id,
      moduleId: mod.id,
    },
  });

  if (existingSub) {
    return NextResponse.json(
      { error: "Du har allerede denne modulen" },
      { status: 400 }
    );
  }

  // Create subscription for free module
  await prisma.appSubscription.create({
    data: {
      userId: user.id,
      moduleId: mod.id,
      status: "ACTIVE",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date("2099-12-31"), // Essentially forever for free modules
    },
  });

  return NextResponse.json({ success: true });
}
