import type { LucideIcon } from "lucide-react";

/**
 * Kanban-typer for Coaching Board (D3-mockup).
 *
 * Mockupen har 4 kolonner / faser:
 *   - preparation (Forberedelse)  — kommende økter, prep-status
 *   - active      (Pågår)          — én økt akkurat nå
 *   - followup    (Etterarbeid)    — sluttet, venter på narrativ/oppfølging
 *   - done        (Ferdig)         — lukket, arkiv
 *
 * Hver kolonne viser et antall (count) i en pille — totalt over alle faser
 * for valgt periode (denne uken som default).
 */
export type ColumnTone = "preparation" | "active" | "followup" | "done";

export type CardVariant = "default" | "live" | "urgent" | "faded";

/**
 * Footer-ikoner — reflekterer at kortet har vedlegg, kommentarer,
 * advarsel, e-post, klokke, etc. Holdes som strenger for å unngå
 * å sende Lucide-komponenter som props (gotchas.md).
 */
export type FooterIconName =
  | "paperclip"
  | "message"
  | "alert"
  | "mail"
  | "clock"
  | "circle-dot"
  | "check-circle"
  | "users"
  | "user"
  | "file"
  | "sparkles"
  | "check"
  | "archive";

export interface FooterIcon {
  name: FooterIconName;
  count?: number;
}

export interface KanbanCard {
  id: string;
  initials: string;
  avatarColor: string;
  name: string;
  when: string;
  focus: string;
  /** 0–1 progress, vises som lime barlinje. Skjules hvis undefined. */
  progress?: number;
  footerLeft: string;
  iconRight: FooterIcon[];
  variant?: CardVariant;
  /** href for klikk — peker til /admin/elever/[id], /admin/okter, eller booking. */
  href?: string;
}

export interface KanbanColumn {
  tone: ColumnTone;
  title: string;
  icon: LucideIcon;
  count: number;
  cards: KanbanCard[];
}
