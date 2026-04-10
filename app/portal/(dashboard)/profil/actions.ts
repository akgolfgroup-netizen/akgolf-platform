"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import path from "path";
import { subDays, subMonths } from "date-fns";
import { z } from "zod";
import { nanoid } from "nanoid";

const ALLOWED_AVATAR_EXTENSIONS = ["jpg", "jpeg", "png", "webp"] as const;
const ALLOWED_AVATAR_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

const profileSchema = z.object({
  name: z.string().min(2, "Navn må være minst 2 tegn").max(100, "Navn kan maks være 100 tegn").optional(),
  phone: z
    .string()
    .transform((val) => val.replace(/\s/g, ""))
    .pipe(z.string().regex(/^(\+47)?[0-9]{8,15}$/, "Ugyldig telefonnummer"))
    .optional()
    .or(z.literal("")),
});

export async function getMyProfile() {
  const user = await requirePortalUser();
  if (!user?.id) return null;

  const supabase = await createServerSupabase();

  const { data: profile } = await supabase
    .from("User")
    .select(`
      id,
      name,
      email,
      phone,
      image,
      role,
      subscriptionTier,
      Instructor (specialization, title, bio)
    `)
    .eq("id", user.id)
    .single();

  return profile;
}

export async function updateProfile(data: {
  name?: string;
  phone?: string;
}) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");

  // Validate input
  const result = profileSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.issues[0]?.message ?? "Ugyldig data");
  }

  const validated = result.data;
  const supabase = await createServerSupabase();

  await supabase
    .from("User")
    .update({
      name: validated.name,
      phone: validated.phone || null,
    })
    .eq("id", user.id);

  revalidatePath("/profil");
}

async function calculateStreak(userId: string): Promise<number> {
  const supabase = await createServerSupabase();

  const { data: logs } = await supabase
    .from("TrainingLog")
    .select("date")
    .eq("userId", userId)
    .order("date", { ascending: false });

  if (!logs || logs.length === 0) return 0;

  // Normalize to UTC date-only strings (YYYY-MM-DD) and deduplicate
  const uniqueDates = [
    ...new Set(
      logs.map((l) => new Date(l.date).toISOString().split("T")[0])
    ),
  ].sort().reverse();

  const todayStr = new Date().toISOString().split("T")[0];
  const yesterdayStr = subDays(new Date(), 1).toISOString().split("T")[0];

  if (uniqueDates[0] !== todayStr && uniqueDates[0] !== yesterdayStr) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]);
    const curr = new Date(uniqueDates[i]);
    const diffDays = Math.round((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export async function getPlayerStats() {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");
  const userId = user.id;

  const supabase = await createServerSupabase();
  const thirtyDaysAgo = subDays(new Date(), 30);

  const [
    { count: trainingSessions },
    { count: coachingSessions },
    { count: tournaments },
    streak,
    { data: latestHandicap },
  ] = await Promise.all([
    supabase
      .from("TrainingLog")
      .select("*", { count: "exact", head: true })
      .eq("userId", userId)
      .gte("date", thirtyDaysAgo.toISOString()),
    supabase
      .from("CoachingSession")
      .select("*", { count: "exact", head: true })
      .eq("studentId", userId),
    supabase
      .from("PlayerTournamentPlan")
      .select("*", { count: "exact", head: true })
      .eq("studentId", userId),
    calculateStreak(userId),
    supabase
      .from("HandicapEntry")
      .select("handicapIndex")
      .eq("userId", userId)
      .order("date", { ascending: false })
      .limit(1)
      .single(),
  ]);

  return {
    trainingSessions: trainingSessions ?? 0,
    coachingSessions: coachingSessions ?? 0,
    tournaments: tournaments ?? 0,
    streak,
    currentHandicap: latestHandicap?.handicapIndex ?? null,
  };
}

export async function getHandicapHistory(months = 6) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");

  const supabase = await createServerSupabase();

  const { data: entries } = await supabase
    .from("HandicapEntry")
    .select("*")
    .eq("userId", user.id)
    .gte("date", subMonths(new Date(), months).toISOString())
    .order("date", { ascending: true });

  return entries || [];
}

export async function getAchievements() {
  const user = await requirePortalUser();
  if (!user?.id) return { definitions: [], unlocked: [] };

  const supabase = await createServerSupabase();

  const [{ data: definitions }, { data: unlocked }] = await Promise.all([
    supabase
      .from("AchievementDefinition")
      .select("*")
      .order("sortOrder", { ascending: true }),
    supabase
      .from("PlayerAchievement")
      .select("achievementDefinitionId, unlockedAt")
      .eq("userId", user.id),
  ]);

  return { definitions: definitions || [], unlocked: unlocked || [] };
}

export async function uploadAvatar(formData: FormData) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");

  const file = formData.get("avatar") as File;
  if (!file || !file.size) throw new Error("Ingen fil valgt");
  if (file.size > 5 * 1024 * 1024) throw new Error("Filen er for stor (maks 5MB)");

  // Valider MIME-type
  if (
    !ALLOWED_AVATAR_MIME_TYPES.includes(
      file.type as (typeof ALLOWED_AVATAR_MIME_TYPES)[number]
    )
  ) {
    throw new Error("Ugyldig filtype. Kun JPG, PNG og WebP er tillatt.");
  }

  // Hent og valider extension fra originalt filnavn
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (
    !ALLOWED_AVATAR_EXTENSIONS.includes(
      ext as (typeof ALLOWED_AVATAR_EXTENSIONS)[number]
    )
  ) {
    throw new Error("Ugyldig filtype. Kun JPG, PNG og WebP er tillatt.");
  }

  // Bruk nanoid for sikkert filnavn (unngår path traversal)
  const safeFileName = `${nanoid()}.${ext}`;
  const filePath = path.join(process.cwd(), "public", "avatars", safeFileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  const imageUrl = `/avatars/${safeFileName}`;
  const supabase = await createServerSupabase();

  await supabase
    .from("User")
    .update({ image: imageUrl })
    .eq("id", user.id);

  revalidatePath("/profil");
  return imageUrl;
}

/**
 * Get average Strokes Gained data for Tour Comparison
 * Requires at least 3 rounds with SG data
 */
export async function getPlayerSGData() {
  const user = await requirePortalUser();
  if (!user?.id) return null;

  const supabase = await createServerSupabase();

  const { data: rounds } = await supabase
    .from("RoundStats")
    .select("sgTotal, sgOffTheTee, sgApproach, sgAroundTheGreen, sgPutting")
    .eq("userId", user.id)
    .not("sgTotal", "is", null)
    .order("date", { ascending: false })
    .limit(10);

  // Need at least 3 rounds
  if (!rounds || rounds.length < 3) {
    return null;
  }

  // Calculate averages
  const avg = (values: (number | null)[]) => {
    const valid = values.filter((v): v is number => v !== null);
    return valid.length > 0 ? valid.reduce((a, b) => a + b, 0) / valid.length : null;
  };

  return {
    sgTotal: avg(rounds.map((r) => r.sgTotal)),
    sgOffTheTee: avg(rounds.map((r) => r.sgOffTheTee)),
    sgApproach: avg(rounds.map((r) => r.sgApproach)),
    sgAroundTheGreen: avg(rounds.map((r) => r.sgAroundTheGreen)),
    sgPutting: avg(rounds.map((r) => r.sgPutting)),
    roundCount: rounds.length,
  };
}
