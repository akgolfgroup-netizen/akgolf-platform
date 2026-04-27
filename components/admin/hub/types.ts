import type { LucideIcon } from "lucide-react";

export type HubStat = {
  label: string;
  value: string;
  unit?: string;
};

export type HubModule = {
  id: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  href: string;
  badge?: { label: string; tone: "accent" | "warn" };
};

export type HubActivity = {
  id: string;
  icon: LucideIcon;
  tone: "default" | "green" | "amber" | "purple";
  body: string;
  emphasis: string;
  when: string;
};

export type HubShortcut = {
  id: string;
  icon: LucideIcon;
  name: string;
  meta: string;
  href: string;
};
