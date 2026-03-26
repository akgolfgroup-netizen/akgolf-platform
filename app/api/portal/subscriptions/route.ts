import { NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";

export async function GET() {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const subscriptions = await prisma.appSubscription.findMany({
    where: { userId: user.id },
    include: {
      module: { select: { slug: true, name: true, icon: true } },
      bundle: {
        select: {
          slug: true,
          name: true,
          items: { include: { module: { select: { slug: true, name: true } } } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(subscriptions);
}
