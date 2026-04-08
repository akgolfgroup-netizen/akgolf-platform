"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export async function saveRound(data: {
  courseId: string;
  date: string;
  scores: Array<{
    holeNumber: number;
    score: number;
    putts?: number;
    fairway?: boolean;
    greenInRegulation?: boolean;
  }>;
}) {
  const user = await requirePortalUser();
  const supabase = await createServerSupabase();

  const roundId = nanoid();
  
  await supabase.from("Round").insert({
    id: roundId,
    userId: user.id,
    courseId: data.courseId,
    date: data.date,
    status: "COMPLETED",
  });

  // Insert scores
  if (data.scores.length > 0) {
    await supabase.from("HoleScore").insert(
      data.scores.map((s) => ({
        id: nanoid(),
        roundId,
        holeNumber: s.holeNumber,
        score: s.score,
        putts: s.putts ?? 0,
        fairway: s.fairway ?? null,
        greenInRegulation: s.greenInRegulation ?? null,
      }))
    );
  }

  revalidatePath("/portal/statistikk");
  return { roundId };
}

export async function getCourses() {
  const supabase = await createServerSupabase();

  const { data: courses } = await supabase
    .from("Course")
    .select("id, name, par, holes")
    .order("name");

  return courses || [];
}
