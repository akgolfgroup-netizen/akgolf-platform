// Felles typer for spillere-sider (liste + grid).
// TODO: erstatt med ekte Prisma-data via getPlayers() server action
// (lib/portal/players/get-players.ts) i Sprint 1 Blokk D.

export type PlayerStatus = "active" | "trending-down" | "inactive" | "stable";

export type PlayerTrendTone = "up" | "down" | "flat";

export type PlayerHcpTier = "elite" | "adv" | "mid" | "beg";

export interface PlayerListRow {
  id: string;
  initials: string;
  avatarColor: string;
  fullName: string;
  username: string;
  memberSince: number;
  hcp: number;
  hcpTier: PlayerHcpTier;
  plan: string;
  coach: string;
  sgRecent: number; // siste 5 — positive = bedre
  sparkPoints: string; // SVG polyline points
  sparkColor: string;
  lastRoundLabel: string;
  lastRoundTone: "ok" | "warn" | "alert";
  status: PlayerStatus;
}

export interface PlayerStat {
  label: string;
  value: string;
  tone?: "default" | "success" | "danger" | "accent";
}

export type PlayerCardFlag = "up" | "warn" | "alert" | "none";

export type PlayerCardPillTone =
  | "default"
  | "lime"
  | "green"
  | "amber"
  | "violet"
  | "coral";

export interface PlayerCardPill {
  label: string;
  tone: PlayerCardPillTone;
}

export interface PlayerCardStat {
  label: string;
  value: string;
  tone?: "default" | "up" | "down" | "muted";
  small?: string;
}

export type PlayerCardFooterIcon =
  | "message"
  | "calendar-plus"
  | "zap"
  | "calendar-check"
  | "circle-dot"
  | "arrow-right"
  | "target"
  | "sparkles";

export interface PlayerCard {
  id: string;
  initials: string;
  avatarColor: string;
  fullName: string;
  metaLine: string;
  flag: PlayerCardFlag;
  pills: PlayerCardPill[];
  stats: PlayerCardStat[];
  sparkPoints: string;
  sparkColor: string;
  sparkDashed?: boolean;
  lastSeenLabel: string;
  ctaLabel: string;
  ctaIcon: PlayerCardFooterIcon;
}

export interface PlayerGroup {
  id: string;
  title: string;
  count: string;
  tone: "alert" | "up" | "default";
  cards: PlayerCard[];
}
