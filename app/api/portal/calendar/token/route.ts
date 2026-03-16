import { getPortalUser } from "@/lib/portal/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { randomBytes } from "crypto";
import { hasTierAccess } from "@/lib/portal/rbac";
import { SubscriptionTier } from "@prisma/client";

export async function POST() {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userTier = (user.subscriptionTier ?? "FREE") as SubscriptionTier;
  if (!hasTierAccess(userTier, SubscriptionTier.PRO)) {
    return NextResponse.json({ error: "Krever Pro-abonnement" }, { status: 403 });
  }

  const token = randomBytes(32).toString("hex");

  await prisma.user.update({
    where: { id: user.id },
    data: { calendarToken: token },
  });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://akgolf.no";
  const feedUrl = `${baseUrl}/api/portal/calendar/feed/${token}`;

  return NextResponse.json({ feedUrl });
}

export async function GET() {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { calendarToken: true },
  });

  if (!dbUser?.calendarToken) {
    return NextResponse.json({ feedUrl: null });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://akgolf.no";
  return NextResponse.json({
    feedUrl: `${baseUrl}/api/portal/calendar/feed/${dbUser.calendarToken}`,
  });
}
