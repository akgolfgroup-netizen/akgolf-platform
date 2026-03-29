"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";

export async function approveBooking(
  bookingId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requirePortalUser();

    // Verifiser at bookingen tilhorer denne instruktoren
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        instructorId: user.id,
        status: "PENDING",
      },
    });

    if (!booking) {
      return { success: false, error: "Booking ikke funnet" };
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CONFIRMED" },
    });

    // TODO: Send bekreftelse til student via e-post

    revalidatePath("/coach/approvals");
    revalidatePath("/coach");

    return { success: true };
  } catch (error) {
    console.error("Failed to approve booking:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Ukjent feil",
    };
  }
}

export async function rejectBooking(
  bookingId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requirePortalUser();

    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        instructorId: user.id,
        status: "PENDING",
      },
    });

    if (!booking) {
      return { success: false, error: "Booking ikke funnet" };
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });

    // TODO: Send avvisning til student via e-post med begrunnelse

    revalidatePath("/coach/approvals");
    revalidatePath("/coach");

    return { success: true };
  } catch (error) {
    console.error("Failed to reject booking:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Ukjent feil",
    };
  }
}
