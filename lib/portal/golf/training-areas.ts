/**
 * Training Areas for golf
 * Ported from akgolf-iup golf.config.ts
 */

export interface TrainingArea {
  code: string;
  label: string;
  labelNO: string;
  icon: string;
}

export interface TrainingAreaGroup {
  code: string;
  label: string;
  labelNO: string;
  icon: string;
  areas: TrainingArea[];
}

export const TRAINING_AREA_GROUPS: TrainingAreaGroup[] = [
  {
    code: "fullSwing",
    label: "Full Swing",
    labelNO: "Full Sving",
    icon: "Golf",
    areas: [
      { code: "TEE", label: "Tee Total", labelNO: "Tee Total", icon: "Golf" },
      { code: "INN200", label: "Approach 200+ m", labelNO: "Innspill 200+ m", icon: "Target" },
      { code: "INN150", label: "Approach 150-200 m", labelNO: "Innspill 150-200 m", icon: "Target" },
      { code: "INN100", label: "Approach 100-150 m", labelNO: "Innspill 100-150 m", icon: "Target" },
      { code: "INN50", label: "Approach 50-100 m", labelNO: "Innspill 50-100 m", icon: "Target" },
    ],
  },
  {
    code: "shortGame",
    label: "Short Game",
    labelNO: "Kortspill",
    icon: "Ruler",
    areas: [
      { code: "CHIP", label: "Chip", labelNO: "Chip", icon: "Ruler" },
      { code: "PITCH", label: "Pitch", labelNO: "Pitch", icon: "Ruler" },
      { code: "LOB", label: "Lob", labelNO: "Lob", icon: "Ruler" },
      { code: "BUNKER", label: "Bunker", labelNO: "Bunker", icon: "Umbrella" },
    ],
  },
  {
    code: "putting",
    label: "Putting",
    labelNO: "Putting",
    icon: "Flag",
    areas: [
      { code: "PUTT0-3", label: "0-3 ft", labelNO: "0-3 fot", icon: "Flag" },
      { code: "PUTT3-5", label: "3-5 ft", labelNO: "3-5 fot", icon: "Flag" },
      { code: "PUTT5-10", label: "5-10 ft", labelNO: "5-10 fot", icon: "Flag" },
      { code: "PUTT10-15", label: "10-15 ft", labelNO: "10-15 fot", icon: "Flag" },
      { code: "PUTT15+", label: "15+ ft", labelNO: "15+ fot", icon: "Flag" },
    ],
  },
];

/** Flat list of all training area codes */
export const ALL_TRAINING_AREAS = TRAINING_AREA_GROUPS.flatMap((g) => g.areas);

export function getTrainingArea(code: string): TrainingArea | undefined {
  return ALL_TRAINING_AREAS.find((a) => a.code === code);
}

export function getTrainingAreaGroup(code: string): TrainingAreaGroup | undefined {
  return TRAINING_AREA_GROUPS.find((g) => g.code === code);
}
