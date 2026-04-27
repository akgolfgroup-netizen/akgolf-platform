"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";

interface InfoLink {
  label: string;
  Icon: LucideIcon;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
}

interface InfoCardProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  links?: InfoLink[];
}

export function InfoCard({ Icon, title, description, links }: InfoCardProps) {
  return (
    <section
      className="rounded-[16px] px-5.5 py-4.5"
      style={{
        background: "#0D2E23",
        border: "1px solid #1A4A3A",
      }}
    >
      <h4 className="m-0 mb-1.5 flex items-center gap-2 text-[13px] font-semibold tracking-[-0.01em] text-white">
        <Icon className="h-3.5 w-3.5" style={{ color: "#D1F843" }} />
        {title}
      </h4>
      <p
        className="m-0 text-xs leading-[1.55]"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        {description}
      </p>
      {links && links.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {links.map((link, idx) => (
            <button
              key={idx}
              type="button"
              onClick={link.onClick}
              disabled={link.disabled}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-[7px] border bg-white/5 px-2.5 py-1.5 text-xs font-medium transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50",
                link.danger
                  ? ""
                  : "",
              )}
              style={{
                borderColor: link.danger
                  ? "rgba(184,66,51,0.25)"
                  : "rgba(255,255,255,0.08)",
                color: link.danger ? "#F49283" : "rgba(255,255,255,0.85)",
              }}
            >
              <link.Icon className="h-3 w-3" />
              {link.label}
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
