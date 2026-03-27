import { requirePortalUser } from "@/lib/portal/auth";
import { SessionViewClient } from "./session-view-client";
import type { TrainingSessionData, ExerciseInstance } from "@/lib/portal/golf/exercise-types";
import type { PyramidLevel, TrainingArea, LPhase, MEnvironment, PRLevel } from "@/lib/portal/golf/ak-formula";

// Demo exercise type
interface DemoExercise {
  id: string;
  name: string;
  description: string;
  pyramid: PyramidLevel;
  area: TrainingArea;
  lPhase: LPhase;
  clubSpeed: number;
  environment: MEnvironment;
  pressLevel: PRLevel;
  sets?: number;
  reps?: number;
  distance?: number;
  tempo?: string;
  restSeconds?: number;
  successCriteria?: string;
  coachNotes?: string;
}

// Demo session type
interface DemoSessionData {
  title: string;
  description: string;
  durationMinutes: number;
  intensity: "low" | "medium" | "high";
  objective: string;
  focusPoints: string[];
  primaryPyramid: PyramidLevel;
  primaryArea: TrainingArea;
  secondaryAreas?: TrainingArea[];
  equipment: string[];
  location?: string;
  warmup?: DemoExercise[];
  mainBlock: DemoExercise[];
  cooldown?: DemoExercise[];
}

// Demo session data - will be replaced with database fetch
const DEMO_SESSIONS: Record<string, DemoSessionData> = {
  "putting-session": {
    title: "Putting - Korte og mellomlange putts",
    description: "Fokus pa linjevalg og fartskontroll for putts mellom 3-20 fot",
    durationMinutes: 45,
    intensity: "medium",
    objective: "Forbedre treffprosent pa putts 3-10 fot og fartskontroll pa 20+ fot",
    focusPoints: ["Linje", "Fart", "Pre-shot rutine"],
    primaryPyramid: "SLAG",
    primaryArea: "PUTT3-6",
    secondaryAreas: ["PUTT6-10", "PUTT20-40"],
    equipment: ["Putter", "6 baller", "4 tees", "Putting alignment mirror"],
    location: "Putting green",
    warmup: [
      {
        id: "warmup-1",
        name: "Korte putts - 3 fot sirkel",
        description: "Putt fra alle retninger rundt hullet pa 3 fot avstand",
        pyramid: "TEK",
        area: "PUTT0-3",
        lPhase: "BALL",
        clubSpeed: 40,
        environment: 1,
        pressLevel: 1,
        sets: 2,
        reps: 8,
        restSeconds: 0,
      },
    ],
    mainBlock: [
      {
        id: "main-1",
        name: "Gate Drill - Linje",
        description: "Sett opp tees som porter. Putt gjennom porten for a trene pa startlinje.",
        pyramid: "TEK",
        area: "PUTT3-6",
        lPhase: "KØLLE",
        clubSpeed: 40,
        environment: 1,
        pressLevel: 2,
        sets: 3,
        reps: 10,
        restSeconds: 30,
        successCriteria: "Treff 8/10 gjennom porten",
        coachNotes: "Fokus pa a holde putteren square gjennom slag.",
      },
      {
        id: "main-2",
        name: "Klokke-drill med press",
        description: "Putts fra klokkeposisjoner rundt hullet. Start pa nytt ved miss.",
        pyramid: "SLAG",
        area: "PUTT3-6",
        lPhase: "BALL",
        clubSpeed: 50,
        environment: 2,
        pressLevel: 3,
        sets: 1,
        reps: 8,
        restSeconds: 0,
        successCriteria: "Fullfør alle 8 uten miss",
      },
      {
        id: "main-3",
        name: "Fartskontroll - Stige",
        description: "Putt til 10, 20, 30, 40 fot. Ballen ma stoppe innenfor 3 fot.",
        pyramid: "SLAG",
        area: "PUTT20-40",
        lPhase: "BALL",
        clubSpeed: 60,
        environment: 2,
        pressLevel: 2,
        sets: 3,
        reps: 4,
        restSeconds: 30,
        successCriteria: "Alle baller innenfor 3-fot sirkelen",
      },
      {
        id: "main-4",
        name: "Lag-putting med break",
        description: "Lange putts med break. Fokus pa a lese greenen.",
        pyramid: "SPILL",
        area: "PUTT20-40",
        lPhase: "AUTO",
        clubSpeed: 70,
        environment: 3,
        pressLevel: 3,
        sets: 2,
        reps: 5,
        restSeconds: 45,
        successCriteria: "Ingen 3-putts",
      },
    ],
    cooldown: [
      {
        id: "cooldown-1",
        name: "Avslutning - 10 korte putts",
        description: "Avslutt med 10 korte putts pa 2 fot for a bygge selvtillit",
        pyramid: "TEK",
        area: "PUTT0-3",
        lPhase: "BALL",
        clubSpeed: 30,
        environment: 1,
        pressLevel: 1,
        sets: 1,
        reps: 10,
        restSeconds: 0,
      },
    ],
  },
  "naerspill-session": {
    title: "Naerspill - Chip, Pitch og Bunker",
    description: "Komplett naerspillokt med fokus pa variasjon og avstandskontroll",
    durationMinutes: 60,
    intensity: "medium",
    objective: "Forbedre up-and-down prosent gjennom bedre kontakt og avstandskontroll",
    focusPoints: ["Kontakt", "Avstandskontroll", "Variasjon"],
    primaryPyramid: "SLAG",
    primaryArea: "CHIP",
    secondaryAreas: ["PITCH", "BUNKER"],
    equipment: ["PW", "52-grad wedge", "56-grad wedge", "60-grad wedge", "30 baller"],
    location: "Øvingsgreen og bunker",
    warmup: [
      {
        id: "warmup-1",
        name: "Chipping oppvarming",
        description: "Lette chip med 52-grad fra 10 meter. Fokus pa kontakt og rytme.",
        pyramid: "TEK",
        area: "CHIP",
        lPhase: "BALL",
        clubSpeed: 40,
        environment: 1,
        pressLevel: 1,
        sets: 1,
        reps: 20,
        restSeconds: 0,
      },
    ],
    mainBlock: [
      {
        id: "main-1",
        name: "Avstandskontroll - 3 mal",
        description: "Chip til 3 forskjellige mal (5m, 10m, 15m).",
        pyramid: "SLAG",
        area: "CHIP",
        lPhase: "BALL",
        clubSpeed: 50,
        environment: 2,
        pressLevel: 2,
        sets: 3,
        reps: 5,
        distance: 15,
        restSeconds: 30,
        successCriteria: "4/5 baller innenfor 2 meter fra malet",
      },
      {
        id: "main-2",
        name: "Gate Drill - Pitching",
        description: "Pitch til porter pa 30m, 40m, 50m.",
        pyramid: "SLAG",
        area: "PITCH",
        lPhase: "BALL",
        clubSpeed: 70,
        environment: 2,
        pressLevel: 3,
        sets: 3,
        reps: 5,
        distance: 50,
        restSeconds: 45,
        successCriteria: "3/5 treff pa hver avstand",
        coachNotes: "Varier mellom 52 og 56 grad.",
      },
      {
        id: "main-3",
        name: "Up-and-down Challenge",
        description: "10 forskjellige posisjoner rundt green.",
        pyramid: "SPILL",
        area: "CHIP",
        lPhase: "AUTO",
        clubSpeed: 60,
        environment: 3,
        pressLevel: 4,
        sets: 1,
        reps: 10,
        restSeconds: 0,
        successCriteria: "Mal: 6/10 opp og ned",
      },
      {
        id: "main-4",
        name: "Bunker - Sand forst",
        description: "Bunkerslag med fokus pa a treffe sanden for ballen.",
        pyramid: "TEK",
        area: "BUNKER",
        lPhase: "KROPP",
        clubSpeed: 70,
        environment: 2,
        pressLevel: 2,
        sets: 2,
        reps: 10,
        restSeconds: 30,
        successCriteria: "Alle baller ut pa forste forsok",
        coachNotes: "Tegn en linje i sanden. Køllehode ma treffe FOR linjen.",
      },
    ],
  },
  "tee-session": {
    title: "Tee Total - Driver og Trejern",
    description: "Full swing-økt med fokus på svingtempo og ballbane",
    durationMinutes: 60,
    intensity: "high",
    objective: "Bygge konsistent draw med kontrollert svingtempo",
    focusPoints: ["Tempo", "Ballbane", "Dispersion"],
    primaryPyramid: "SLAG",
    primaryArea: "TEE",
    equipment: ["Driver", "3-jern", "40 baller", "2 alignment sticks", "Trackman/Mevo+"],
    location: "Driving range med launch monitor",
    warmup: [
      {
        id: "warmup-1",
        name: "Halve sving - 7-jern",
        description: "Halve sving for a finne rytme og balanse",
        pyramid: "TEK",
        area: "INN150",
        lPhase: "ARM",
        clubSpeed: 50,
        environment: 1,
        pressLevel: 1,
        sets: 1,
        reps: 10,
        restSeconds: 0,
      },
    ],
    mainBlock: [
      {
        id: "main-1",
        name: "Alignment Station",
        description: "Sett opp alignment sticks. Fokus pa square setup.",
        pyramid: "TEK",
        area: "TEE",
        lPhase: "KROPP",
        clubSpeed: 60,
        environment: 1,
        pressLevel: 1,
        sets: 1,
        reps: 10,
        restSeconds: 0,
        coachNotes: "Sjekk at skulder-linje er parallell med mallinje.",
      },
      {
        id: "main-2",
        name: "Tempo Drill 3-1",
        description: "Tell 1-2-3 pa baksving, 1 pa nedsving.",
        pyramid: "TEK",
        area: "TEE",
        lPhase: "ARM",
        clubSpeed: 70,
        environment: 2,
        pressLevel: 2,
        sets: 2,
        reps: 10,
        tempo: "3-1-2",
        restSeconds: 30,
        successCriteria: "Alle slag med samme tempo-folelse",
      },
      {
        id: "main-3",
        name: "Stock Shot Driver - Draw",
        description: "Bygg din standard driver med kontrollert draw.",
        pyramid: "SLAG",
        area: "TEE",
        lPhase: "BALL",
        clubSpeed: 90,
        environment: 2,
        pressLevel: 3,
        sets: 2,
        reps: 10,
        restSeconds: 45,
        successCriteria: "8/10 med draw og innenfor 30m dispersion",
        coachNotes: "Mal for club path: +2 til +4. Face litt lukket i forhold til path.",
      },
      {
        id: "main-4",
        name: "Simulator Challenge - Fairway Treff",
        description: "10 slag pa simulatorbane. Tell fairway-treff.",
        pyramid: "SPILL",
        area: "TEE",
        lPhase: "AUTO",
        clubSpeed: 100,
        environment: 4,
        pressLevel: 4,
        sets: 1,
        reps: 10,
        restSeconds: 0,
        successCriteria: "7/10 fairways",
      },
    ],
  },
};

// Convert DemoExercise to ExerciseInstance
function toExerciseInstance(demo: DemoExercise): ExerciseInstance {
  return {
    ...demo,
    completed: false,
  };
}

// Convert DemoSessionData to TrainingSessionData
function toTrainingSessionData(id: string, demo: DemoSessionData): TrainingSessionData {
  return {
    id,
    title: demo.title,
    description: demo.description,
    durationMinutes: demo.durationMinutes,
    intensity: demo.intensity,
    objective: demo.objective,
    focusPoints: demo.focusPoints,
    primaryPyramid: demo.primaryPyramid,
    primaryArea: demo.primaryArea,
    secondaryAreas: demo.secondaryAreas,
    equipment: demo.equipment,
    location: demo.location,
    warmup: demo.warmup?.map(toExerciseInstance),
    mainBlock: demo.mainBlock.map(toExerciseInstance),
    cooldown: demo.cooldown?.map(toExerciseInstance),
  };
}

interface Props {
  params: Promise<{ sessionId: string }>;
}

export default async function SessionPage({ params }: Props) {
  const { sessionId } = await params;
  await requirePortalUser();

  const demoSession = DEMO_SESSIONS[sessionId];

  if (!demoSession) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-xl font-semibold text-white mb-2">Økt ikke funnet</h1>
        <p className="text-[#737373]">Denne okten finnes ikke.</p>
      </div>
    );
  }

  const session = toTrainingSessionData(sessionId, demoSession);

  return <SessionViewClient session={session} />;
}
