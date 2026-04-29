import {
  Send,
  FileText,
  Mic,
  Clock,
  Edit3,
  MessageCircle,
  Phone,
  type LucideIcon,
} from "lucide-react";
import type { FocusItem } from "./mock-data";

const PRIMARY_ICON: Record<string, LucideIcon> = {
  send: Send,
  "edit-3": Edit3,
  "message-circle": MessageCircle,
};

const SECONDARY_ICON: Record<string, LucideIcon> = {
  "file-text": FileText,
  mic: Mic,
  phone: Phone,
  clock: Clock,
};

export function FocusCard({ item }: { item: FocusItem }) {
  const PrimaryIcon = PRIMARY_ICON[item.primaryAction.iconName] ?? Send;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#1a4a3a] bg-[#0D2E23] p-5">
      <div className="absolute right-[18px] top-4 font-mono text-[48px] font-bold leading-none tracking-[-0.04em] text-white/[0.06]">
        {item.num}
      </div>

      <div className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-accent">
        {item.tag}
      </div>
      <h3 className="mb-1 mt-1.5 font-inter-tight text-[18px] font-bold leading-tight tracking-[-0.01em] text-white">
        {item.title}
      </h3>
      <p className="mb-3.5 text-[12px] leading-[1.5] text-white/60">
        {item.why}
      </p>

      <div className="mb-1.5 flex items-center gap-2 rounded-lg bg-white/[0.03] px-2.5 py-2 text-[12px] text-white">
        <div
          className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full text-[9px] font-bold text-ink"
          style={{ background: item.studentColor }}
        >
          {item.studentInitials}
        </div>
        <span>{item.studentName}</span>
        <span className="ml-auto font-mono text-[10px] text-white/50">
          {item.studentMeta}
        </span>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-accent bg-accent px-3 py-2 text-[12px] font-semibold text-ink transition hover:bg-accent/90"
        >
          <PrimaryIcon className="h-3.5 w-3.5" strokeWidth={2} />
          {item.primaryAction.label}
        </button>
        {item.secondaryIcons.map((iconName) => {
          const Icon = SECONDARY_ICON[iconName];
          if (!Icon) return null;
          return (
            <button
              key={iconName}
              type="button"
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-transparent text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
