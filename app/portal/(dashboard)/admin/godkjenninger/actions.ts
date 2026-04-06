"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff, isAdmin } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { FacilityActivityStatus } from "@prisma/client";
import { sendBookingConfirmation, sendBookingCancellation } from "@/lib/portal/email/send-booking-email";
import { logger } from "@/lib/logger";

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
      include: {
        User: { select: { name: true, email: true } },
        Instructor: { select: { User: { select: { name: true, email: true } } } },
        ServiceType: { select: { name: true, duration: true } },
      },
    });

    if (!booking) {
      return { success: false, error: "Booking ikke funnet" };
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CONFIRMED" },
    });

    // Send bekreftelse til student og instruktør
    if (booking.User.email && booking.Instructor.User.email) {
      sendBookingConfirmation({
        bookingId,
        studentName: booking.User.name ?? "Kunde",
        studentEmail: booking.User.email,
        instructorName: booking.Instructor.User.name ?? "Instruktør",
        instructorEmail: booking.Instructor.User.email,
        serviceName: booking.ServiceType.name,
        startTime: booking.startTime,
        duration: booking.ServiceType.duration,
        amount: booking.amount,
        vatAmount: booking.vatAmount,
        location: "Gamle Fredrikstad Golfklubb",
      }).catch((err: unknown) => logger.error("[Godkjenning] E-post feilet:", err));
    }

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
      include: {
        User: { select: { name: true, email: true } },
        Instructor: { select: { User: { select: { name: true } } } },
        ServiceType: { select: { name: true } },
      },
    });

    if (!booking) {
      return { success: false, error: "Booking ikke funnet" };
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });

    // Send avvisnings-e-post til student
    if (booking.User.email) {
      sendBookingCancellation(
        booking.User.email,
        booking.User.name ?? "Kunde",
        booking.ServiceType.name,
        booking.Instructor.User.name ?? "Instruktør",
        booking.startTime,
        "Bookingen ble avvist av instruktør",
        100, // Full refund ved avvisning
      ).catch((err: unknown) => logger.error("[Godkjenning] Avvisnings-e-post feilet:", err));
    }

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
