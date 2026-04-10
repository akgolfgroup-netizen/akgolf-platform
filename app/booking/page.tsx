import { createServerSupabase } from "@/lib/supabase/server";
import { getPortalUser } from "@/lib/portal/auth";
import { BookingClient } from "./booking-client";
import type { TrainerWithServices } from "./components-v2/types";

// Trener-metadata (bilder, rolle, badge) — bor ikke i databasen
const TRAINER_META: Record<string, { imageUrl: string; role: string; badge: string }> = {
  Anders: {
    imageUrl: "/images/academy/AK-Golf-Academy-20.jpg",
    role: "Head Coach",
    badge: "Performance · Flex",
  },
  Markus: {
    imageUrl: "/images/academy/AK-Golf-Academy-25.jpg",
    role: "Assistant Coach",
    badge: "Express · Flex",
  },
};

function getTrainerMeta(name: string) {
  const firstName = name.split(" ")[0];
  return (
    TRAINER_META[firstName] ?? {
      imageUrl: "/images/academy/AK-Golf-Academy-1.jpg",
      role: "Coach",
      badge: "Coaching",
    }
  );
}

type ServiceTypeRow = {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  allowStripe: boolean;
  category: string | null;
  Instructor:
    | Array<{
        Instructor:
          | {
              id: string;
              User: { name: string | null } | { name: string | null }[] | null;
            }
          | Array<{
              id: string;
              User: { name: string | null } | { name: string | null }[] | null;
            }>
          | null;
      }>
    | null;
};

export default async function BookingPage() {
  const supabase = await createServerSupabase();
  const user = await getPortalUser();

  // Hent alle aktive public service types med koblede instruktører
  const { data: serviceTypes } = await supabase
    .from("ServiceType")
    .select(
      `
      id,
      name,
      description,
      duration,
      price,
      allowStripe,
      category,
      Instructor:InstructorServiceType(
        Instructor(
          id,
          User:userId(name)
        )
      )
    `
    )
    .eq("isPublic", true)
    .eq("isActive", true)
    .neq("name", "Foundation")
    .neq("name", "Start")
    .neq("name", "Banecoaching");

  const rows = (serviceTypes ?? []) as ServiceTypeRow[];

  // Grupper etter trener
  const trainersMap = new Map<string, TrainerWithServices>();

  for (const st of rows) {
    const isSubscription = st.name.includes("Performance") || st.name.includes("Express");

    const links = st.Instructor ?? [];
    const instructors = links
      .flatMap((link) => {
        const inst = link.Instructor;
        if (!inst) return [];
        return Array.isArray(inst) ? inst : [inst];
      })
      .map((inst) => {
        const userRel = inst.User;
        const userObj = Array.isArray(userRel) ? userRel[0] ?? null : userRel;
        return { id: inst.id, name: userObj?.name ?? "Coach" };
      });

    for (const instructor of instructors) {
      const trainerId = instructor.id;
      const trainerName = instructor.name;
      const meta = getTrainerMeta(trainerName);

      if (!trainersMap.has(trainerId)) {
        trainersMap.set(trainerId, {
          id: trainerId,
          name: trainerName,
          role: meta.role,
          imageUrl: meta.imageUrl,
          badge: meta.badge,
          services: [],
        });
      }

      trainersMap.get(trainerId)!.services.push({
        id: st.id,
        name: st.name,
        description: st.description,
        duration: st.duration,
        price: st.price,
        isSubscription,
        availableSlotsThisWeek: 8,
        allowStripe: st.allowStripe,
      });
    }
  }

  const trainers = Array.from(trainersMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  for (const trainer of trainers) {
    trainer.services.sort((a, b) => {
      if (a.isSubscription && !b.isSubscription) return -1;
      if (!a.isSubscription && b.isSubscription) return 1;
      return b.price - a.price;
    });
  }

  // Prefill bruker-info hvis innlogget
  const prefilledUser = user?.id
    ? {
        name: user.name ?? "",
        email: user.email ?? "",
        phone: (user as { phone?: string }).phone ?? "",
      }
    : null;

  const subscriptionTier = user?.subscriptionTier;
  const hasSubscription =
    !!subscriptionTier && subscriptionTier !== "VISITOR" && subscriptionTier !== "FREE";

  return (
    <BookingClient
      trainers={trainers}
      prefilledUser={prefilledUser}
      isLoggedIn={!!user?.id}
      hasSubscription={hasSubscription}
    />
  );
}
