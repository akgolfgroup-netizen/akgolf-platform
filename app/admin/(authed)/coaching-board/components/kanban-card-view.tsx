"use client";

import {
  Paperclip,
  MessageSquare,
  AlertTriangle,
  Mail,
  Clock,
  CircleDot,
  CheckCircle,
  Users,
  User,
  FileText,
  Sparkles,
  Check,
  Archive,
  type LucideIcon,
} from "lucide-react";
import type { FooterIconName, KanbanCard } from "./kanban-types";

const FOOTER_ICONS: Record<FooterIconName, LucideIcon> = {
  paperclip: Paperclip,
  message: MessageSquare,
  alert: AlertTriangle,
  mail: Mail,
  clock: Clock,
  "circle-dot": CircleDot,
  "check-circle": CheckCircle,
  users: Users,
  user: User,
  file: FileText,
  sparkles: Sparkles,
  check: Check,
  archive: Archive,
};

interface KanbanCardViewProps {
  card: KanbanCard;
  onClick: () => void;
}

/**
 * Et kort i Coaching Board-kolonnen — speiler `.kcard` i mockupen.
 *
 * Variants:
 *   - default — standard #0D2E23 bakgrunn med subtil grønn ramme
 *   - live    — accent glow rundt kortet (currently running session)
 *   - urgent  — rød venstrebånd (forfaller / krever handling)
 *   - faded   — 0.7 opacity (lukket / arkiv)
 */
export function KanbanCardView({ card, onClick }: KanbanCardViewProps) {
  const isLive = card.variant === "live";
  const isUrgent = card.variant === "urgent";
  const isFaded = card.variant === "faded";

  return (
    <button
      type="button"
      onClick={onClick}
      className="p-3 cursor-pointer transition-all text-left w-full"
      style={{
        background: "#0D2E23",
        border: isLive
          ? "1px solid rgba(209,248,67,0.4)"
          : "1px solid #1a4a3a",
        borderLeft: isUrgent ? "3px solid #B84233" : undefined,
        borderRadius: 10,
        opacity: isFaded ? 0.7 : 1,
        boxShadow: isLive
          ? "0 0 0 3px rgba(209,248,67,0.10), 0 4px 12px rgba(255,255,255,0.06)"
          : "0 1px 2px rgba(255,255,255,0.04)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-[26px] h-[26px] rounded-full grid place-items-center text-[10px] font-bold"
            style={{ background: card.avatarColor, color: "#0A1F18" }}
          >
            {card.initials}
          </div>
          <div
            className="text-[12px] font-semibold"
            style={{ color: "#FFFFFF" }}
          >
            {card.name}
          </div>
        </div>
        <div
          className="text-[10px]"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.06em",
          }}
        >
          {card.when}
        </div>
      </div>

      <div
        className="text-[12px]"
        style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.4 }}
      >
        {card.focus}
      </div>

      {card.progress !== undefined && (
        <div
          className="mt-2.5 h-[3px] rounded-sm overflow-hidden"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="h-full rounded-sm"
            style={{
              width: `${Math.round(card.progress * 100)}%`,
              background: "#D1F843",
            }}
          />
        </div>
      )}

      <div
        className="mt-2.5 flex items-center justify-between"
        style={{
          fontSize: 10,
          color: "rgba(255,255,255,0.45)",
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.06em",
        }}
      >
        <span>{card.footerLeft}</span>
        <div className="flex gap-2 items-center">
          {card.iconRight.map((ico, idx) => {
            const Icon = FOOTER_ICONS[ico.name];
            return (
              <span key={idx} className="inline-flex items-center gap-0.5">
                <Icon className="w-[11px] h-[11px]" strokeWidth={1.8} />
                {ico.count !== undefined && <span>{ico.count}</span>}
              </span>
            );
          })}
        </div>
      </div>
    </button>
  );
}
