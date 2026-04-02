"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";

export async function approveBooking(
  bookingId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requirePortalUser();
    if (!user?.id || !isStaff(user.role)) {
      redirect("/");
    }

    // Verifiser at bookingen tilhorer en av denne instructorens elever
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
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

    revalidatePath("/portal/admin/godkjenninger");
    revalidatePath("/portal/admin");

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
    if (!user?.id || !isStaff(user.role)) {
      redirect("/");
    }

    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
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

    revalidatePath("/portal/admin/godkjenninger");
    revalidatePath("/portal/admin");

    return { success: true };
  } catch (error) {
    console.error("Failed to reject booking:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Ukjent feil",
    };
  }
}
