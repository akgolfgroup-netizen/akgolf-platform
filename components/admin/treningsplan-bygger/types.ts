import type { LucideIcon } from "lucide-react";

export type DrillCategory = "putting" | "long" | "short" | "fysisk" | "mental";

export type LibraryDrill = {
  id: string;
  name: string;
  meta: string;
  category: DrillCategory;
};

export type LibrarySection = {
  id: string;
  title: string;
  drills: LibraryDrill[];
};

export type BlockType =
  | "range"
  | "short"
  | "putt"
  | "fysisk"
  | "runde"
  | "rest";

export type DayBlock = {
  id: string;
  type: BlockType;
  name: string;
  meta: string;
};

export type DayColumn = {
  id: string;
  label: string;
  blocks: DayBlock[];
};

export type WeekTab = {
  id: string;
  label: string;
  range: string;
  blocks: number;
  hours: number;
  taper?: boolean;
};

export type AllocationRow = {
  label: string;
  hours: number;
  swatch: string;
  pct: number;
};

export type PlanGoal = {
  text: string;
  iconName: "target" | "circle-dot" | "trophy";
  iconColor: string;
};

export type IconBlock = {
  Icon: LucideIcon;
  bg: string;
  color: string;
};
