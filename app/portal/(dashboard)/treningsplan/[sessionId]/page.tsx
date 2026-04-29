import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { SessionViewClient } from "./session-view-client";
import type { TrainingSessionData, ExerciseInstance } from "@/lib/portal/golf/exercise-types";
import type { TrainingArea } from "@/lib/portal/golf/ak-formula";

// Map focusArea string to TrainingArea
function mapFocusArea(focusArea: string | null): TrainingArea {
  const areaMap: Record<string, TrainingArea> = {
    putting: "PUTT3-6",
    putt: "PUTT3-6",
    naerspill: "CHIP",
    kortspill: "CHIP",
    chip: "CHIP",
    pitch: "PITCH",
    bunker: "BUNKER",
    range: "INN150",
    langspill: "TEE",
    tee: "TEE",
    bane: "INN150",
    styrke: "INN150",
    restitusjon: "INN150",
  };

  if (!focusArea) return "INN150";
  const key = focusArea.toLowerCase().trim();
  return areaMap[key] ?? "INN150";
}

// Map focusArea to intensity heuristic
function mapIntensity(focusArea: string | null): "low" | "medium" | "high" {
  if (!focusArea) return "medium";
  const key = focusArea.toLowerCase().trim();
  if (key === "restitusjon") return "low";
  if (key === "styrke" || key === "bane") return "high";
  return "medium";
}

// Structured exercise shape from AI (if AI returns objects instead of strings)
interface AIExerciseData {
  name?: string;
  description?: string;
  pyramid?: string;
  area?: string;
  lPhase?: string;
  clubSpeed?: number;
  environment?: number;
  pressLevel?: number;
  sets?: number;
  reps?: number;
}

// Valid values for type-safe mapping
const VALID_PYRAMIDS = ["FYS", "TEK", "SLAG", "SPILL", "MENTAL"] as const;
const VALID_LPHASES = ["KROPP", "ARM", "KØLLE", "BALL", "AUTO"] as const;

function isValidPyramid(v: string): v is (typeof VALID_PYRAMIDS)[number] {
  return (VALID_PYRAMIDS as readonly string[]).includes(v);
}

function isValidLPhase(v: string): v is (typeof VALID_LPHASES)[number] {
  return (VALID_LPHASES as readonly string[]).includes(v);
}

// Convert exercise data from AI to ExerciseInstance objects.
// AI may return strings (exercise names) or structured objects with metadata.
function exerciseStringsToInstances(
  exercises: unknown,
  sessionArea: TrainingArea
): ExerciseInstance[] {
  if (!Array.isArray(exercises)) return [];

  return exercises.map((exercise, index) => {
    // Handle string-only exercises (legacy/simple AI output)
    if (typeof exercise === "string") {
      return {
        id: `exercise-${index}`,
        name: exercise,
        description: undefined,
        // Defaults — AI did not provide structured data for string exercises
        pyramid: "SLAG" as const,
        area: sessionArea,
        lPhase: "BALL" as const,
        clubSpeed: 50,
        environment: 2 as const,
        pressLevel: 2 as const,
        completed: false,
      };
    }

    // Handle structured exercise objects from AI
    const data = exercise as AIExerciseData;
    const name = data.name ?? String(exercise);
    const pyramid = data.pyramid && isValidPyramid(data.pyramid) ? data.pyramid : "SLAG";
    const lPhase = data.lPhase && isValidLPhase(data.lPhase) ? data.lPhase : "BALL";

    return {
      id: `exercise-${index}`,
      name,
      description: data.description,
      pyramid: pyramid as ExerciseInstance["pyramid"],
      area: sessionArea,
      lPhase: lPhase as ExerciseInstance["lPhase"],
      clubSpeed: data.clubSpeed ?? 50,
      environment: (data.environment ?? 2) as ExerciseInstance["environment"],
      pressLevel: (data.pressLevel ?? 2) as ExerciseInstance["pressLevel"],
      sets: data.sets,
      reps: data.reps,
      completed: false,
    };
  });
}

interface Props {
  params: Promise<{ sessionId: string }>;
}

export default async function SessionPage({ params }: Props) {
  const { sessionId } = await params;
  await requirePortalUser();

  const supabase = await createServerSupabase();

  const { data: dbSession } = await supabase
    .from("TrainingPlanSession")
    .select(`
      *,
      TrainingPlanWeek:weekId(
        *,
        TrainingPlan:planId(*)
      )
    `)
    .eq("id", sessionId)
    .maybeSingle();

  if (!dbSession) notFound();

  const primaryArea = mapFocusArea(dbSession.focusArea);
  const allExercises = exerciseStringsToInstances(dbSession.exercises, primaryArea);

  const session: TrainingSessionData = {
    id: dbSession.id,
    title: dbSession.title,
    description: dbSession.description ?? undefined,
    durationMinutes: dbSession.durationMinutes ?? 60,
    intensity: mapIntensity(dbSession.focusArea),
    objective: dbSession.TrainingPlanWeek?.focus ?? dbSession.description ?? "Treningsokt",
    focusPoints: dbSession.focusArea ? [dbSession.focusArea] : [],
    primaryPyramid: "SLAG",
    primaryArea,
    equipment: [],
    mainBlock: allExercises,
  };

  return <SessionViewClient session={session} />;
}
