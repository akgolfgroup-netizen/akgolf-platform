"use client";

import {
  Lock,
  Paperclip,
  Send,
  Smile,
  Sparkles,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ComposerProps {
  participantFirstName: string;
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  isSending: boolean;
}

export function Composer({
  participantFirstName,
  value,
  onChange,
  onSend,
  isSending,
}: ComposerProps) {
  return (
    <div
      className="px-6 pb-4.5 pt-3.5"
      style={{
        background: "#0D2E23",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
        }}
        className="flex items-end gap-2 rounded-[14px] border border-white/10 bg-white/5 px-3 py-2.5"
      >
        <ComposerIcon Icon={Paperclip} />
        <ComposerIcon Icon={Video} />
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          disabled={isSending}
          placeholder={`Skriv en melding til ${participantFirstName}…`}
          className="flex-1 resize-none border-none bg-transparent text-[13.5px] leading-[1.5] text-white placeholder:text-white/40 focus:outline-none disabled:opacity-60"
          style={{ minHeight: 24, maxHeight: 120, padding: "4px 0" }}
          rows={1}
        />
        <ComposerIcon Icon={Smile} />
        <button
          type="submit"
          disabled={!value.trim() || isSending}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg disabled:opacity-50"
          style={{ background: "#D1F843", color: "#0A1F18" }}
        >
          <Send className="h-3.5 w-3.5" strokeWidth={2.4} />
        </button>
      </form>
      <div
        className="mt-2 flex items-center gap-1.5 font-mono text-[10px] uppercase"
        style={{
          color: "rgba(255,255,255,0.4)",
          letterSpacing: "0.06em",
        }}
      >
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-md border border-white/5 bg-white/5 px-2 py-1 text-white/65 transition hover:bg-white/10"
        >
          <Sparkles className="h-2.5 w-2.5" style={{ color: "#D1F843" }} />
          Foreslå svar
        </button>
        <button
          type="button"
          className="rounded-md border border-white/5 bg-white/5 px-2 py-1 text-white/65 transition hover:bg-white/10"
        >
          Bruk mal
        </button>
        <span
          className="ml-auto inline-flex items-center gap-1"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          <Lock className="h-2.5 w-2.5" style={{ color: "#6FCBA1" }} />
          Ende-til-ende-kryptert
        </span>
      </div>
    </div>
  );
}

function ComposerIcon({ Icon }: { Icon: LucideIcon }) {
  return (
    <button
      type="button"
      tabIndex={-1}
      className="grid place-items-center rounded-lg text-white/50 transition hover:bg-white/5 hover:text-white"
      style={{ width: 30, height: 30 }}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
