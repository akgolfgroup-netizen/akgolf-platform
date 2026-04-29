"use client";

import { useState } from "react";
import type { ReactNode } from "react";

export function PanelHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-1 mt-6 flex items-end justify-between first:mt-0">
      <h2 className="m-0 font-display text-xl font-extrabold tracking-[-0.025em] text-white">
        {title}
      </h2>
      {sub ? (
        <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/40">
          {sub}
        </div>
      ) : null}
    </div>
  );
}

export function SettingsRow({
  label,
  sub,
  children,
  trailing,
  danger = false,
}: {
  label: ReactNode;
  sub?: string;
  children?: ReactNode;
  trailing?: ReactNode;
  danger?: boolean;
}) {
  return (
    <div
      className={`grid items-center gap-5 rounded-2xl border px-5 py-4 sm:grid-cols-[220px_1fr_auto] ${
        danger
          ? "border-[#F49283]/20 bg-[#F49283]/5"
          : "border-[#1a4a3a] bg-[#0D2E23]"
      }`}
    >
      <div>
        <div className={`text-sm font-semibold ${danger ? "text-[#F49283]" : "text-white"}`}>
          {label}
        </div>
        {sub ? (
          <div
            className={`mt-1 font-mono text-[9px] uppercase tracking-[0.14em] ${
              danger ? "text-[#F49283]/70" : "text-white/45"
            }`}
          >
            {sub}
          </div>
        ) : null}
      </div>
      <div className="text-[13px] text-white/70">{children}</div>
      {trailing ? <div>{trailing}</div> : <span />}
    </div>
  );
}

export function FieldInput({
  defaultValue,
  type = "text",
  readOnly = false,
  onChange,
  value,
  placeholder,
}: {
  defaultValue?: string;
  type?: string;
  readOnly?: boolean;
  onChange?: (v: string) => void;
  value?: string;
  placeholder?: string;
}) {
  return (
    <input
      type={type}
      defaultValue={defaultValue}
      value={value}
      readOnly={readOnly}
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full rounded-lg border border-[#1a4a3a] bg-white/5 px-3 py-2 text-[13px] text-white placeholder:text-white/30 focus:border-[#D1F843] focus:outline-none"
    />
  );
}

export function FieldSelect({
  options,
  defaultValue,
  onChange,
}: {
  options: { value: string; label: string }[];
  defaultValue?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <select
      defaultValue={defaultValue}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full rounded-lg border border-[#1a4a3a] bg-white/5 px-3 py-2 text-[13px] text-white focus:border-[#D1F843] focus:outline-none"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-[#0D2E23]">
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Toggle({
  defaultOn = false,
  ariaLabel,
}: {
  defaultOn?: boolean;
  ariaLabel?: string;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      onClick={() => setOn((s) => !s)}
      className={`relative h-[22px] w-[38px] rounded-full transition ${
        on ? "bg-[#D1F843]" : "bg-white/10"
      }`}
    >
      <span
        className={`absolute top-[2px] h-[18px] w-[18px] rounded-full transition-all ${
          on ? "left-[18px] bg-[#0A1F18]" : "left-[2px] bg-white"
        }`}
      />
    </button>
  );
}

export function Pill({
  children,
  variant = "neutral",
}: {
  children: ReactNode;
  variant?: "neutral" | "lime" | "success" | "warn";
}) {
  const styles: Record<string, string> = {
    neutral: "bg-white/10 text-white/80",
    lime: "bg-[#D1F843]/15 text-[#D1F843] ring-1 ring-[#D1F843]/30",
    success: "bg-[#2A7D5A]/25 text-[#6FCBA1]",
    warn: "bg-[#C48A32]/22 text-[#E8B967]",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[variant]}`}
    >
      {children}
    </span>
  );
}

export function GhostButton({
  children,
  onClick,
  type = "button",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] font-medium text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export function PrimaryButton({
  children,
  onClick,
  type = "button",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 rounded-lg bg-[#D1F843] px-3.5 py-1.5 text-[12px] font-semibold text-[#0A1F18] transition hover:bg-[#C7EE3F] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}
