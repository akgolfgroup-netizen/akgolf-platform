"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { nanoid } from "nanoid";

export async function startLiveRound(
  courseId: string,
  teeColor: string,
  weather?: { temperature?: number; windSpeed?: number; windDir?: string }
): Promise<{ roundId: string }> {
  const user = await requirePortalUser();
  const supabase = await createServerSupabase();

  const roundId = nanoid();

  const { error: roundErr } = await supabase.from("Round").insert({
    id: roundId,
    userId: user.id,
    courseId,
    date: new Date().toISOString(),
    startTime: new Date().toISOString(),
    teeColor,
    weather: weather?.temperature ? `${weather.temperature}°C` : undefined,
    windSpeed: weather?.windSpeed ?? null,
    windDir: weather?.windDir ?? null,
    temperature: weather?.temperature ?? null,
    source: "LIVE",
    updatedAt: new Date().toISOString(),
  });

  if (roundErr) throw new Error("Kunne ikke opprette runde: " + roundErr.message);

  const { error: stateErr } = await supabase.from("RoundLiveState").insert({
    roundId,
    currentHoleNumber: 1,
    currentShotNumber: 0,
    isPaused: false,
    lastActivityAt: new Date().toISOString(),
  });

  if (stateErr)
    throw new Error("Kunne ikke opprette live-state: " + stateErr.message);

  return { roundId };
}

export async function togglePauseRound(
  roundId: string,
  pause: boolean
): Promise<void> {
  const user = await requirePortalUser();
  const supabase = await createServerSupabase();

  const { data: round } = await supabase
    .from("Round")
    .select("userId")
    .eq("id", roundId)
    .single();
  if (!round || round.userId !== user.id)
    throw new Error("Runde ikke funnet");

  await supabase
    .from("RoundLiveState")
    .update({
      isPaused: pause,
      pausedAt: pause ? new Date().toISOString() : null,
      lastActivityAt: new Date().toISOString(),
    })
    .eq("roundId", roundId);
}
