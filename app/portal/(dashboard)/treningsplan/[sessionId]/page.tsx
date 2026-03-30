import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
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

// Convert exercise strings from AI to ExerciseInstance objects
function exerciseStringsToInstances(exercises: unknown): ExerciseInstance[] {
  if (!Array.isArray(exercises)) return [];

  return exercises.map((exercise, index) => {
    const name = typeof exercise === "string" ? exercise : String(exercise);
    return {
      id: `exercise-${index}`,
      name,
      description: undefined,
      pyramid: "SLAG" as const,
      area: "INN150" as TrainingArea,
      lPhase: "BALL" as const,
      clubSpeed: 50,
      environment: 2 as const,
      pressLevel: 2 as const,
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

  const dbSession = await prisma.trainingPlanSession.findUnique({
    where: { id: sessionId },
    include: {
      TrainingPlanWeek: {
        include: { TrainingPlan: true },
      },
    },
  });

  if (!dbSession) notFound();

  const primaryArea = mapFocusArea(dbSession.focusArea);
  const allExercises = exerciseStringsToInstances(dbSession.exercises);

  const session: TrainingSessionData = {
    id: dbSession.id,
    title: dbSession.title,
    description: dbSession.description ?? undefined,
    durationMinutes: dbSession.durationMinutes ?? 60,
    intensity: mapIntensity(dbSession.focusArea),
    objective: dbSession.TrainingPlanWeek.focus ?? dbSession.description ?? "Treningsokt",
    focusPoints: dbSession.focusArea ? [dbSession.focusArea] : [],
    primaryPyramid: "SLAG",
    primaryArea,
    equipment: [],
    mainBlock: allExercises,
  };

  return <SessionViewClient session={session} />;
}
