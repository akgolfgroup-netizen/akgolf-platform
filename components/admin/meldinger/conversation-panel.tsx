import {
  ArrowUp,
  Calendar,
  Image as ImageIcon,
  MoreHorizontal,
  Paperclip,
  Sparkles,
  User,
} from "lucide-react";
import type { ChatBubble } from "./mock-data";
import { QUICK_TEMPLATES } from "./mock-data";

interface ConversationPanelProps {
  bubbles: ChatBubble[];
}

export function ConversationPanel({ bubbles }: ConversationPanelProps) {
  return (
    <section className="flex h-full flex-col overflow-hidden rounded-[14px] border border-[#1a4a3a] bg-[#0D2E23]">
      <div className="flex items-center gap-3.5 border-b border-[#1a4a3a] px-[22px] py-[14px]">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-[#6BB1FF] text-[13px] font-bold text-ink">
          FH
        </div>
        <div className="flex-1">
          <div className="text-[14px] font-bold text-white">
            Foreldre Hansen · Erik H
          </div>
          <div className="mt-0.5 font-mono text-[10px] tracking-[0.06em] text-white/55">
            JUNIOR ELITE · BOGSTAD · MEDLEM SIDEN 2023
          </div>
        </div>
        <div className="flex gap-1.5">
          <IconButton><User className="h-[14px] w-[14px]" strokeWidth={1.8} /></IconButton>
          <IconButton><Calendar className="h-[14px] w-[14px]" strokeWidth={1.8} /></IconButton>
          <IconButton><MoreHorizontal className="h-[14px] w-[14px]" strokeWidth={1.8} /></IconButton>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto px-[22px] py-[22px]">
        <div className="py-1.5 text-center font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/35">
          — 28. APRIL —
        </div>
        {bubbles.map((b) => (
          <Bubble key={b.id} bubble={b} />
        ))}
      </div>

      <div className="border-t border-[#1a4a3a] px-[22px] py-3.5">
        <div className="flex items-center gap-2 rounded-[12px] border border-white/[0.08] bg-black/20 px-3.5 py-2.5">
          <input
            type="text"
            placeholder="Skriv en melding…"
            className="flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-white/40"
          />
          <IconButton><Paperclip className="h-[14px] w-[14px]" strokeWidth={1.8} /></IconButton>
          <IconButton><ImageIcon className="h-[14px] w-[14px]" strokeWidth={1.8} /></IconButton>
          <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded-[7px] bg-accent text-ink"
          >
            <ArrowUp className="h-[14px] w-[14px]" strokeWidth={2.2} />
          </button>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {QUICK_TEMPLATES.map((t) => (
            <button
              key={t.label}
              type="button"
              className={
                "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-[5px] font-mono text-[10px] tracking-[0.04em] " +
                (t.ai
                  ? "border-accent/20 bg-accent/10 text-accent"
                  : "border-white/[0.06] bg-white/[0.04] text-white/60")
              }
            >
              {t.ai && <Sparkles className="h-[11px] w-[11px]" strokeWidth={1.8} />}
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Bubble({ bubble }: { bubble: ChatBubble }) {
  const isOut = bubble.direction === "out";
  return (
    <div
      className={
        "max-w-[75%] rounded-[14px] px-3.5 py-2.5 text-[13px] leading-[1.55] " +
        (isOut
          ? "self-end rounded-br-[4px] border border-accent/20 bg-gradient-to-b from-accent/[0.18] to-accent/10 text-white"
          : "self-start rounded-bl-[4px] bg-white/[0.06] text-[#E6EAE8]")
      }
    >
      {bubble.emphasized && bubble.text.includes(bubble.emphasized) ? (
        <BubbleText text={bubble.text} emphasized={bubble.emphasized} />
      ) : (
        bubble.text
      )}
      {bubble.attachment && (
        <div className="mt-2 flex items-center gap-2.5 rounded-[10px] border border-white/[0.08] bg-black/30 px-3.5 py-2.5 text-[12px] text-white/85">
          <Calendar className="h-[18px] w-[18px] text-accent" strokeWidth={1.8} />
          {bubble.attachment}
        </div>
      )}
      <div
        className={
          "mt-1 font-mono text-[9px] tracking-[0.06em] " +
          (isOut ? "text-right text-white/55" : "text-white/40")
        }
      >
        {bubble.timestamp}
      </div>
    </div>
  );
}

function BubbleText({ text, emphasized }: { text: string; emphasized: string }) {
  const parts = text.split(emphasized);
  return (
    <>
      {parts[0]}
      <strong className="font-bold text-white">{emphasized}</strong>
      {parts[1]}
    </>
  );
}

function IconButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="grid h-8 w-8 place-items-center rounded-[7px] border border-white/[0.06] bg-white/[0.04] text-white/70 hover:bg-white/[0.08]"
    >
      {children}
    </button>
  );
}
