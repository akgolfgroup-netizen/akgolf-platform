"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff, isAdmin } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { sendBookingConfirmation, sendBookingCancellation } from "@/lib/portal/email/send-booking-email";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";

// Hjelpefunksjon: Supabase returnerer relasjoner som arrays — hent første element
function firstOrSelf<T>(value: T | T[]): T | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export async function getPendingItems() {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    redirect("/");
  }

  const [pendingBookings, pendingActivities] = await Promise.all([
    prisma.booking.findMany({
      where: { status: "PENDING" },
      include: {
        User: { select: { name: true, email: true } },
        ServiceType: { select: { name: true, price: true } },
        Instructor: { include: { User: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.facilityActivity.findMany({
      where: { status: "PENDING" },
      include: { Facility: true, CreatedBy: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { pendingBookings, pendingActivities };
}

export async function approveBooking(
  bookingId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requirePortalUser();
    if (!user?.id || !isStaff(user.role)) {
      redirect("/");
    }

    const supabase = await createServerSupabase();

    // Verifiser at bookingen tilhorer en av denne instructorens elever
    const { data: booking } = await supabase
      .from("Booking")
      .select(`
        id,
        startTime,
        endTime,
        amount,
        vatAmount,
        stripePaymentId,
        status,
        User (name, email),
        Instructor (User (name, email)),
        ServiceType (name, duration)
      `)
      .eq("id", bookingId)
      .eq("status", "PENDING")
      .single();

    if (!booking) {
      return { success: false, error: "Booking ikke funnet" };
    }

    await supabase
      .from("Booking")
      .update({ status: "CONFIRMED" })
      .eq("id", bookingId);

    // Supabase returnerer relasjoner som arrays — hent første element
    const bookingUser = firstOrSelf(booking.User);
    const bookingInstructor = firstOrSelf(booking.Instructor);
    const instructorUser = bookingInstructor
      ? firstOrSelf(bookingInstructor.User)
      : null;
    const bookingService = firstOrSelf(booking.ServiceType);

    // Send bekreftelse til student og instruktør
    const userEmail = bookingUser?.email ?? null;
    const instructorEmail = instructorUser?.email ?? null;
    if (userEmail && instructorEmail) {
      sendBookingConfirmation({
        bookingId,
        studentName: bookingUser?.name ?? "Kunde",
        studentEmail: userEmail,
        instructorName: instructorUser?.name ?? "Instruktør",
        instructorEmail,
        serviceName: bookingService?.name ?? "Ukjent tjeneste",
        startTime: new Date(booking.startTime),
        duration: bookingService?.duration ?? 0,
        amount: booking.amount,
        vatAmount: booking.vatAmount,
        location: "Gamle Fredrikstad Golfklubb",
      }).catch((err: unknown) => logger.error("[Godkjenning] E-post feilet:", err));
    }

    revalidatePath("/admin/godkjenninger");
    revalidatePath("/admin");

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

    const supabase = await createServerSupabase();

    const { data: booking } = await supabase
      .from("Booking")
      .select(`
        id,
        startTime,
        User (name, email),
        Instructor (User (name)),
        ServiceType (name)
      `)
      .eq("id", bookingId)
      .eq("status", "PENDING")
      .single();

    if (!booking) {
      return { success: false, error: "Booking ikke funnet" };
    }

    await supabase
      .from("Booking")
      .update({ status: "CANCELLED" })
      .eq("id", bookingId);

    // Supabase returnerer relasjoner som arrays — hent første element
    const rejectUser = firstOrSelf(booking.User);
    const rejectInstructor = firstOrSelf(booking.Instructor);
    const rejectInstructorUser = rejectInstructor
      ? firstOrSelf(rejectInstructor.User)
      : null;
    const rejectService = firstOrSelf(booking.ServiceType);

    // Send avvisnings-e-post til student
    const userEmail = rejectUser?.email ?? null;
    if (userEmail) {
      sendBookingCancellation(
        userEmail,
        rejectUser?.name ?? "Kunde",
        rejectService?.name ?? "Ukjent tjeneste",
        rejectInstructorUser?.name ?? "Instruktør",
        new Date(booking.startTime),
        "Bookingen ble avvist av instruktør",
        100, // Full refund ved avvisning
      ).catch((err: unknown) => logger.error("[Godkjenning] Avvisnings-e-post feilet:", err));
    }

    revalidatePath("/admin/godkjenninger");
    revalidatePath("/admin");

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

    const supabase = await createServerSupabase();

    const { data: activity } = await supabase
      .from("FacilityActivity")
      .select("*")
      .eq("id", activityId)
      .eq("status", "PENDING")
      .single();

    if (!activity) {
      return { success: false, error: "Aktivitet ikke funnet" };
    }

    await supabase
      .from("FacilityActivity")
      .update({
        status: "CONFIRMED",
        approvedById: user.id,
        conflictNote: `Godkjent av ${user.name ?? "admin"}`,
      })
      .eq("id", activityId);

    revalidatePath("/admin/godkjenninger");
    revalidatePath("/admin/fasiliteter");

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

    const supabase = await createServerSupabase();

    const { data: activity } = await supabase
      .from("FacilityActivity")
      .select("*")
      .eq("id", activityId)
      .eq("status", "PENDING")
      .single();

    if (!activity) {
      return { success: false, error: "Aktivitet ikke funnet" };
    }

    await supabase
      .from("FacilityActivity")
      .update({ status: "CANCELLED" })
      .eq("id", activityId);

    revalidatePath("/admin/godkjenninger");
    revalidatePath("/admin/fasiliteter");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Ukjent feil",
    };
  }
}
