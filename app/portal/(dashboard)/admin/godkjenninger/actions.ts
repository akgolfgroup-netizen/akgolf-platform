"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff, isAdmin } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { FacilityActivityStatus } from "@prisma/client";

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
    return {
      success: false,
      error: error instanceof Error ? error.message : "Ukjent feil",
    };
  }
}

export async function approveActivity(
  activityId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requirePortalUser();
    if (!user?.id || !isAdmin(user.role)) {
      return { success: false, error: "Kun admin kan godkjenne aktiviteter" };
    }

    const activity = await prisma.facilityActivity.findFirst({
      where: {
        id: activityId,
        status: FacilityActivityStatus.PENDING,
      },
    });

    if (!activity) {
      return { success: false, error: "Aktivitet ikke funnet" };
    }

    await prisma.facilityActivity.update({
      where: { id: activityId },
      data: {
        status: FacilityActivityStatus.CONFIRMED,
        approvedById: user.id,
        conflictNote: `Godkjent av ${user.name ?? "admin"}`,
      },
    });

    revalidatePath("/portal/admin/godkjenninger");
    revalidatePath("/portal/admin/fasiliteter");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Ukjent feil",
    };
  }
}

export async function rejectActivity(
  activityId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requirePortalUser();
    if (!user?.id || !isAdmin(user.role)) {
      return { success: false, error: "Kun admin kan avvise aktiviteter" };
    }

    const activity = await prisma.facilityActivity.findFirst({
      where: {
        id: activityId,
        status: FacilityActivityStatus.PENDING,
      },
    });

    if (!activity) {
      return { success: false, error: "Aktivitet ikke funnet" };
    }

    await prisma.facilityActivity.update({
      where: { id: activityId },
      data: { status: FacilityActivityStatus.CANCELLED },
    });

    revalidatePath("/portal/admin/godkjenninger");
    revalidatePath("/portal/admin/fasiliteter");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Ukjent feil",
    };
  }
}
