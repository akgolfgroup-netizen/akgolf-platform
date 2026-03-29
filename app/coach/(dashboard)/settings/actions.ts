"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";

interface ProfileData {
  name: string;
  phone: string;
  bio: string;
}

interface NotificationSettings {
  emailNewBooking: boolean;
  emailCancellation: boolean;
  emailReminder: boolean;
  pushEnabled: boolean;
}

export async function updateProfile(
  data: ProfileData
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requirePortalUser();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: data.name,
        phone: data.phone,
      },
    });

    // Oppdater instruktor-bio hvis bruker er instruktor
    const instructor = await prisma.instructor.findFirst({
      where: { userId: user.id },
    });

    if (instructor) {
      await prisma.instructor.update({
        where: { id: instructor.id },
        data: { bio: data.bio },
      });
    }

    revalidatePath("/coach/settings");

    return { success: true };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Ukjent feil",
    };
  }
}

export async function updateNotifications(
  settings: NotificationSettings
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requirePortalUser();

    // TODO: Lagre notification settings i databasen
    // For na logger vi bare innstillingene
    console.log(`[Settings] User ${user.id} updated notifications:`, settings);

    revalidatePath("/coach/settings");

    return { success: true };
  } catch (error) {
    console.error("Failed to update notifications:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Ukjent feil",
    };
  }
}
