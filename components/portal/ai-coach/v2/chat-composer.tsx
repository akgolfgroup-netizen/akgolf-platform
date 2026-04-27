"use client";

import { useState } from "react";

interface ChatComposerProps {
  suggestions: string[];
  onSend: (text: string) => void;
  onPickSuggestion?: (text: string) => void;
  busy?: boolean;
}

/**
 * Composer for AI Coach v2 — forslag + send-felt.
 */
export function ChatComposer({
  suggestions,
  onSend,
  onPickSuggestion,
  busy,
}: ChatComposerProps) {
  const [value, setValue] = useState("");

  const submit = () => {
    const text = value.trim();
    if (!text || busy) return;
    onSend(text);
    setValue("");
  };

  return (
    <div className="px-6 pt-4 pb-5 border-t border-[color:var(--color-line)] bg-card">
      <div className="flex flex-wrap gap-1.5 mb-2.5">
        {suggestions.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onPickSuggestion?.(s)}
            className="text-xs px-3 py-1.5 rounded-full bg-[#F5F8F7] border border-[color:var(--color-line)] text-ink-muted hover:bg-card hover:border-[#AF52DE] hover:text-[#AF52DE] transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
      <div className="flex gap-2.5 items-end p-2.5 bg-[#F5F8F7] border border-[color:var(--color-line)] rounded-xl">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Spor om data, drills, plan eller taktikk..."
          rows={1}
          className="flex-1 bg-transparent outline-none text-sm resize-none min-h-[36px] font-[inherit]"
        />
        <button
          type="button"
          onClick={submit}
          disabled={busy || !value.trim()}
          className="bg-[#0A1F18] text-[#D1F843] px-4 py-2 rounded-lg font-semibold text-[13px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {busy ? "Sender..." : "Send"}
        </button>
      </div>
    </div>
  );
}
