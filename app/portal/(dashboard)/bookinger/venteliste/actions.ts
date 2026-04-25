"use server";

import { revalidatePath } from "next/cache";
import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { logger } from "@/lib/logger";
import { WaitlistStatus } from "@prisma/client";

interface ActionResult {
  success: boolean;
  message?: string;
}

/**
 * Lar en student melde seg av venteliste på egen entry.
 * Setter status = CANCELLED i stedet for å slette, så historikk bevares.
 */
export async function cancelWaitlistEntry(
  entryId: string,
): Promise<ActionResult> {
  const user = await requirePortalUser();

  const entry = await prisma.waitlistEntry.findUnique({
    where: { id: entryId },
    select: { studentId: true, status: true },
  });

  if (!entry) {
    return { success: false, message: "Fant ikke ventelisten." };
  }

  if (entry.studentId !== user.id) {
    logger.warn(
      `[Waitlist] User ${user.id} forsøkte å kansellere entry ${entryId} for annen student ${entry.studentId}`,
    );
    return { success: false, message: "Du kan kun kansellere egne entries." };
  }

  if (
    entry.status === WaitlistStatus.CANCELLED ||
    entry.status === WaitlistStatus.EXPIRED
  ) {
    return { success: true };
  }

  await prisma.waitlistEntry.update({
    where: { id: entryId },
    data: {
      status: WaitlistStatus.CANCELLED,
      updatedAt: new Date(),
    },
  });

  revalidatePath("/portal/bookinger/venteliste");
  return { success: true };
}
