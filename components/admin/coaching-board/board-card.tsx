import {
  AlertTriangle,
  Archive,
  Check,
  CheckCircle,
  CircleDot,
  Clock,
  FileText,
  Mail,
  MessageSquare,
  Paperclip,
  Sparkles,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { KCard } from "./types";

const TRAILING_ICONS: Record<NonNullable<KCard["trailingIcon"]>, LucideIcon> = {
  "check-circle": CheckCircle,
  "alert-triangle": AlertTriangle,
  "circle-dot": CircleDot,
  "file-text": FileText,
  sparkles: Sparkles,
  clock: Clock,
  mail: Mail,
  user: User,
  users: Users,
  check: Check,
  archive: Archive,
};

export function BoardCard({ card }: { card: KCard }) {
  const live = card.state === "live";
  const urgent = card.state === "urgent";
  const archived = card.state === "archive";
  const muted = card.state === "done" || archived;

  const TrailingIcon = card.trailingIcon
    ? TRAILING_ICONS[card.trailingIcon]
    : null;

  const ringStyle = live
    ? "border-[rgba(209,248,67,0.4)] shadow-[0_0_0_3px_rgba(209,248,67,0.10),0_4px_12px_rgba(255,255,255,0.06)]"
    : "border-[#1a4a3a]";
  const urgentBorderLeft = urgent ? "border-l-[3px] border-l-[#B84233]" : "";

  return (
    <article
      className={`group cursor-grab rounded-[10px] border bg-[#0D2E23] p-3 shadow-[0_1px_2px_rgba(255,255,255,0.04)] transition hover:-translate-y-px hover:border-white/[0.18] hover:shadow-[0_4px_12px_rgba(255,255,255,0.06)] ${ringStyle} ${urgentBorderLeft} ${
        muted ? "opacity-70" : ""
      } ${archived ? "opacity-55" : ""}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full text-[10px] font-bold text-[#0A1F18]"
            style={{ background: card.avatarColor }}
          >
            {card.studentInitials}
          </div>
          <div className="text-[12px] font-semibold text-white">
            {card.studentName}
          </div>
        </div>
        <div className="font-mono text-[10px] tracking-[0.06em] text-white/45">
          {card.when}
        </div>
      </div>

      {card.focus && (
        <p className="text-[12px] leading-[1.4] text-white/70">{card.focus}</p>
      )}

      {typeof card.progress === "number" && (
        <div className="mt-2.5 h-[3px] overflow-hidden rounded-[2px] bg-white/[0.06]">
          <div
            className="h-full rounded-[2px] bg-accent"
            style={{ width: `${card.progress}%` }}
          />
        </div>
      )}

      <div className="mt-2.5 flex items-center justify-between font-mono text-[10px] tracking-[0.06em] text-white/45">
        <span>{card.metaLabel}</span>
        <div className="flex items-center gap-2">
          {card.attachments ? (
            <span className="inline-flex items-center gap-1">
              <Paperclip className="h-[11px] w-[11px]" strokeWidth={1.8} />
              {card.attachments}
            </span>
          ) : null}
          {card.comments ? (
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="h-[11px] w-[11px]" strokeWidth={1.8} />
              {card.comments}
            </span>
          ) : null}
          {TrailingIcon ? (
            <TrailingIcon
              className={`h-[11px] w-[11px] ${
                live ? "text-accent" : ""
              }`}
              strokeWidth={1.8}
            />
          ) : null}
        </div>
      </div>
    </article>
  );
}
