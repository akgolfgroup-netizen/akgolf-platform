"use client";

import type { ReactNode } from "react";
import { Check, CheckCircle2, Play, X } from "lucide-react";

export type TestStatus = "done" | "active" | "pending";

interface TestCardProps {
  number: number;
  unit: string;
  title: string;
  meta: string;
  status: TestStatus;
  children?: ReactNode;
  footer?: ReactNode;
}

export function TestCard({
  number,
  unit,
  title,
  meta,
  status,
  children,
  footer,
}: TestCardProps) {
  return (
    <div
      className="rounded-[18px] p-7 transition-shadow"
      style={{
        background: status === "done" ? "rgba(118,193,156,0.04)" : "#0D2E23",
        border:
          status === "done"
            ? "1px solid rgba(118,193,156,0.25)"
            : status === "active"
              ? "1px solid rgba(209,248,67,0.30)"
              : "1px solid #1a4a3a",
        boxShadow: status === "active" ? "0 0 0 4px rgba(209,248,67,0.05)" : undefined,
      }}
    >
      <div
        className="grid items-center gap-4 mb-4"
        style={{ gridTemplateColumns: "56px 1fr auto" }}
      >
        <TestNumberBadge number={number} unit={unit} status={status} />
        <div>
          <div
            className="text-[22px] font-extrabold text-white tracking-[-0.025em]"
            style={{ fontFamily: "var(--font-inter-tight)" }}
          >
            {title}
          </div>
          <div
            className="font-mono text-[10px] uppercase tracking-[0.12em] mt-1"
            style={{
              color: "rgba(255,255,255,0.55)",
              fontFamily: "var(--font-jetbrains-mono)",
            }}
          >
            {meta}
          </div>
        </div>
        <StatusPill status={status} />
      </div>

      {children}

      {footer && (
        <div
          className="flex items-center gap-2.5 pt-4 mt-4"
          style={{ borderTop: "1px dashed #1a4a3a" }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

function TestNumberBadge({
  number,
  unit,
  status,
}: {
  number: number;
  unit: string;
  status: TestStatus;
}) {
  const done = status === "done";
  return (
    <div
      className="rounded-[14px] grid place-items-center text-center"
      style={{
        width: "56px",
        height: "56px",
        background: done ? "rgba(118,193,156,0.20)" : "rgba(209,248,67,0.10)",
        border: done ? "1px solid rgba(118,193,156,0.40)" : "1px solid rgba(209,248,67,0.25)",
        color: done ? "#6FCBA1" : "#D1F843",
        fontFamily: "var(--font-jetbrains-mono)",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        lineHeight: 1.2,
      }}
    >
      <strong
        style={{
          display: "block",
          fontFamily: "var(--font-inter)",
          fontSize: "22px",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          color: done ? "#6FCBA1" : "#D1F843",
        }}
      >
        {number}
      </strong>
      <span style={{ marginTop: "-2px" }}>{unit}</span>
    </div>
  );
}

function StatusPill({ status }: { status: TestStatus }) {
  if (status === "done") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold"
        style={{
          background: "rgba(118,193,156,0.15)",
          color: "#6FCBA1",
          border: "1px solid rgba(118,193,156,0.30)",
        }}
      >
        <Check className="w-2.5 h-2.5" />
        Logget
      </span>
    );
  }
  if (status === "active") {
    return (
      <span
        className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider"
        style={{ background: "#D1F843", color: "#0A1F18" }}
      >
        Pågår
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider"
      style={{
        background: "rgba(255,255,255,0.04)",
        color: "rgba(255,255,255,0.55)",
        border: "1px solid rgba(255,255,255,0.10)",
      }}
    >
      Venter
    </span>
  );
}

export function TestDoneSummary({
  message,
  stats,
}: {
  message: string;
  stats: { label: string; value: string }[];
}) {
  return (
    <div
      className="flex items-center gap-4 rounded-[12px] px-5 py-4 text-[14px] font-semibold"
      style={{
        background: "rgba(118,193,156,0.10)",
        border: "1px solid rgba(118,193,156,0.25)",
        color: "#6FCBA1",
      }}
    >
      <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
      <span>{message}</span>
      <div className="ml-auto flex gap-6">
        {stats.map((s) => (
          <div key={s.label} className="text-right">
            <div
              className="font-mono text-[9px] uppercase tracking-[0.12em]"
              style={{
                color: "rgba(111,203,161,0.7)",
                fontFamily: "var(--font-jetbrains-mono)",
              }}
            >
              {s.label}
            </div>
            <div
              className="font-extrabold text-white mt-0.5"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "18px",
                letterSpacing: "-0.02em",
              }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TestActionRow({
  leftLabel,
  onSkip,
  onPrimary,
  primaryLabel,
  primaryIcon,
}: {
  leftLabel: string;
  onSkip?: () => void;
  onPrimary?: () => void;
  primaryLabel: string;
  primaryIcon: "check" | "play";
}) {
  const PrimaryIcon = primaryIcon === "check" ? Check : Play;
  return (
    <>
      <span
        className="font-mono text-[10px] uppercase tracking-[0.06em]"
        style={{
          color: "rgba(255,255,255,0.5)",
          fontFamily: "var(--font-jetbrains-mono)",
        }}
      >
        {leftLabel}
      </span>
      <div className="ml-auto flex gap-2">
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="inline-flex items-center gap-1.5 rounded-[10px] px-3.5 py-2 text-[12px] font-semibold transition-colors"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.10)",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            <X className="w-3.5 h-3.5" />
            Hopp over
          </button>
        )}
        <button
          type="button"
          onClick={onPrimary}
          className="inline-flex items-center gap-1.5 rounded-[10px] px-4 py-2 text-[12px] font-extrabold transition-colors"
          style={{
            background: primaryIcon === "play" ? "rgba(255,255,255,0.04)" : "#D1F843",
            color: primaryIcon === "play" ? "#fff" : "#0A1F18",
            border: primaryIcon === "play" ? "1px solid rgba(255,255,255,0.10)" : "none",
          }}
        >
          <PrimaryIcon className="w-3.5 h-3.5" />
          {primaryLabel}
        </button>
      </div>
    </>
  );
}
