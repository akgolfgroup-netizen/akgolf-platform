"use client";

import { Plus } from "lucide-react";
import type { WeekTemplate } from "./types";

interface SideTemplatesProps {
  templates: WeekTemplate[];
}

export function SideTemplates({ templates }: SideTemplatesProps) {
  return (
    <div className="flex flex-col gap-3.5">
      <div
        className="font-mono text-[9px] uppercase tracking-[0.12em]"
        style={{
          color: "rgba(255,255,255,0.45)",
          fontFamily: "var(--font-jetbrains-mono)",
        }}
      >
        MINE GJENBRUKBARE UKER · {templates.length}
      </div>

      {templates.map((m) => (
        <div
          key={m.id}
          className="rounded-[12px] p-3.5 cursor-pointer transition-colors"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            className="text-[14px] font-bold tracking-[-0.01em] text-white"
          >
            {m.title}
          </div>
          <div
            className="font-mono text-[10px] mt-1 tracking-[0.04em]"
            style={{
              color: "rgba(255,255,255,0.50)",
              fontFamily: "var(--font-jetbrains-mono)",
            }}
          >
            {m.meta}
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {m.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[8px] px-1.5 py-0.5 rounded uppercase tracking-[0.10em]"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "var(--font-jetbrains-mono)",
                }}
              >
                {tag.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        className="inline-flex items-center justify-center gap-1.5 rounded-[10px] px-3.5 py-2 mt-1 text-[12px] font-semibold"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.10)",
          color: "rgba(255,255,255,0.85)",
        }}
      >
        <Plus className="w-3.5 h-3.5" />
        Lagre denne uka som mal
      </button>
    </div>
  );
}
