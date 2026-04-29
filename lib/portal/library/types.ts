import type {
  LibraryItem,
  LibraryItemType,
  LibraryItemStatus,
  LibraryItemSource,
} from "@prisma/client";

export type {
  LibraryItem,
  LibraryItemType,
  LibraryItemStatus,
  LibraryItemSource,
};

export const ITEM_TYPE_LABELS: Record<LibraryItemType, string> = {
  DRILL: "Drill",
  EXERCISE: "Øvelse",
  TEST: "Test",
  ACTIVITY: "Aktivitet",
  COMPETITION_PREP: "Konkurranse­forberedelse",
};

export const STATUS_LABELS: Record<LibraryItemStatus, string> = {
  DRAFT: "Utkast",
  APPROVED: "Godkjent",
  REJECTED: "Avvist",
  ARCHIVED: "Arkivert",
};

export const SOURCE_LABELS: Record<LibraryItemSource, string> = {
  AK_METHODOLOGY: "AK-metodikken",
  WEB_INSPIRED: "Web-inspirert",
  MANUAL: "Manuell",
};

export const PLAYER_LEVELS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
] as const;

export type PlayerLevel = (typeof PLAYER_LEVELS)[number];

export interface GeneratedItem {
  type: LibraryItemType;
  title: string;
  summary: string;
  pyramid: string;
  area: string;
  subArea?: string;
  lPhase?: string;
  playerLevels: string[];
  difficulty: number;
  minDurationMinutes: number;
  maxDurationMinutes: number;
  equipment: string[];
  setup: string;
  execution: string;
  scoring?: string;
  variations?: string;
  coachingCues?: string;
  tags: string[];
}

export interface GenerateRequest {
  type: LibraryItemType;
  area: string;
  count: number;
  playerLevels?: string[];
  difficulty?: number;
  notes?: string;
}
