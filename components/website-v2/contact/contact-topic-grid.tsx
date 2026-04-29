"use client";

import type { LucideIcon } from "lucide-react";
import {
  UserPlus,
  UsersRound,
  Calendar,
  Briefcase,
  Newspaper,
  HelpCircle,
} from "lucide-react";

export interface Topic {
  id: string;
  Icon: LucideIcon;
  label: string;
}

export const TOPICS: Topic[] = [
  { id: "medlem", Icon: UserPlus, label: "Bli spiller" },
  { id: "junior", Icon: UsersRound, label: "Junior" },
  { id: "booking", Icon: Calendar, label: "Booking" },
  { id: "bedrift", Icon: Briefcase, label: "Bedrift / event" },
  { id: "presse", Icon: Newspaper, label: "Presse" },
  { id: "annet", Icon: HelpCircle, label: "Annet" },
];

interface Props {
  selected: string;
  onSelect: (id: string) => void;
}

export function ContactTopicGrid({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
      {TOPICS.map(({ id, Icon, label }) => {
        const active = id === selected;
        return (
          <button
            type="button"
            key={id}
            onClick={() => onSelect(id)}
            className="flex items-center gap-2.5 rounded-[14px] border-[1.5px] px-3.5 py-3.5 text-left transition-all"
            style={{
              background: active
                ? "var(--akgolf-ink, #0A1F18)"
                : "var(--akgolf-surface, #F4F6F4)",
              borderColor: active
                ? "var(--akgolf-ink, #0A1F18)"
                : "var(--akgolf-line-light, #E4EAE6)",
              color: active ? "#fff" : "var(--akgolf-ink, #0A1F18)",
            }}
          >
            <span
              className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-lg"
              style={{
                background: active
                  ? "rgba(255,255,255,0.10)"
                  : "rgba(0,88,64,0.10)",
                color: active
                  ? "var(--akgolf-accent, #D1F843)"
                  : "var(--akgolf-primary, #005840)",
              }}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
            <span className="text-[13px] font-semibold">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
