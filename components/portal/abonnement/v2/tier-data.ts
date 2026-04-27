import type { TierOption } from "./tier-switch";

export const TIER_DISPLAY: Record<string, { name: string; em?: string }> = {
  PRO: { name: "Performance", em: "Pro" },
  STARTER: { name: "Performance" },
  ACADEMY: { name: "Academy" },
  ELITE: { name: "Elite" },
  VISITOR: { name: "Ingen abonnement" },
};

export const TIER_PRICE_NUM: Record<string, number> = {
  PRO: 2200,
  STARTER: 1200,
  ACADEMY: 0,
  ELITE: 0,
  VISITOR: 0,
};

export const TIER_FEATURES: Record<string, string[]> = {
  PRO: [
    "4 individuelle coaching-økter pr. måned",
    "Prioritert booking 4 uker fram",
    "AI Coach 24/7 med video-analyse",
    "Strategisk plan per turnering",
    "Direkte chat med coachen din",
  ],
  STARTER: [
    "2 individuelle coaching-økter pr. måned",
    "Booking 4 uker fram",
    "AI Coach 24/7",
    "Personlig treningsplan",
    "Direkte chat med coachen din",
  ],
  ACADEMY: [
    "Tilgang til Academy-innhold",
    "Treningsbibliotek",
    "Strokes Gained-statistikk",
  ],
  ELITE: [
    "Skreddersydd Elite-program",
    "Ubegrenset coaching",
    "Turneringsstøtte",
  ],
  VISITOR: [],
};

export const ALL_TIERS: TierOption[] = [
  {
    key: "VISITOR",
    name: "Gratis",
    price: "0 kr",
    per: "mnd",
    meta: "Begrenset visning · ingen coaching",
  },
  {
    key: "STARTER",
    name: "Performance",
    price: "1 200 kr",
    per: "mnd",
    meta: "2 økter · personlig plan · AI Coach",
  },
  {
    key: "PRO",
    name: "Performance Pro",
    price: "2 200 kr",
    per: "mnd",
    meta: "4 økter · prioritert booking · video-feedback",
  },
];

export function formatKr(amount: number): string {
  return amount.toLocaleString("no-NO") + " kr";
}
