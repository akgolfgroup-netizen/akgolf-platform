"use client";

interface TestInstructionsProps {
  steps: string[];
}

export function TestInstructions({ steps }: TestInstructionsProps) {
  return (
    <div
      className="rounded-[12px] px-5 py-4 mb-5"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px dashed rgba(255,255,255,0.10)",
      }}
    >
      <div
        className="font-mono text-[9px] uppercase tracking-[0.16em] mb-2"
        style={{
          color: "rgba(255,255,255,0.5)",
          fontFamily: "var(--font-jetbrains-mono)",
        }}
      >
        Slik gjør du
      </div>
      <ol
        className="m-0 pl-5 text-[13px] leading-[1.65] list-decimal"
        style={{ color: "rgba(255,255,255,0.78)" }}
      >
        {steps.map((s, i) => (
          <li key={i} className="marker:text-[color:#D1F843] marker:font-bold">
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}

interface ScoreFieldProps {
  label: string;
  value: number;
  rightLabel: string;
  rightValue: string;
  onChange: (n: number) => void;
}

export function ScoreField({
  label,
  value,
  rightLabel,
  rightValue,
  onChange,
}: ScoreFieldProps) {
  return (
    <div
      className="flex items-center gap-6 rounded-[14px] px-6 py-5 mb-5"
      style={{
        background: "rgba(209,248,67,0.06)",
        border: "1px solid rgba(209,248,67,0.25)",
      }}
    >
      <div>
        <div
          className="font-mono text-[10px] uppercase tracking-[0.14em]"
          style={{ color: "#D1F843", fontFamily: "var(--font-jetbrains-mono)" }}
        >
          {label}
        </div>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className="bg-transparent border-0 text-white text-center mt-1 outline-none"
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "56px",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            width: "130px",
            borderBottom: "2px dashed rgba(209,248,67,0.40)",
            paddingBottom: "4px",
          }}
        />
      </div>
      <div className="ml-auto text-right">
        <div
          className="font-mono text-[10px] uppercase tracking-[0.12em]"
          style={{
            color: "rgba(255,255,255,0.55)",
            fontFamily: "var(--font-jetbrains-mono)",
          }}
        >
          {rightLabel}
        </div>
        <div
          className="font-extrabold text-white mt-1"
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "22px",
            letterSpacing: "-0.02em",
          }}
        >
          {rightValue}
        </div>
      </div>
    </div>
  );
}

interface InputPairProps {
  label: string;
  value: number;
  unit: string;
  onChange: (n: number) => void;
}

export function InputPair({ label, value, unit, onChange }: InputPairProps) {
  return (
    <div
      className="rounded-[12px] p-3.5"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid #1a4a3a",
      }}
    >
      <div
        className="font-mono text-[9px] uppercase tracking-[0.14em] mb-2"
        style={{
          color: "rgba(255,255,255,0.5)",
          fontFamily: "var(--font-jetbrains-mono)",
        }}
      >
        {label}
      </div>
      <div className="flex items-baseline gap-1.5">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className="bg-transparent border-0 text-white outline-none p-0"
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "32px",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            width: "80px",
            borderBottom: "2px dashed rgba(209,248,67,0.40)",
            fontVariantNumeric: "tabular-nums",
          }}
        />
        <span
          className="font-medium"
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "14px",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          {unit}
        </span>
      </div>
    </div>
  );
}

interface TallyCardProps {
  label: string;
  value: number;
  max?: number;
  optional?: boolean;
  onChange: (n: number) => void;
}

export function TallyCard({
  label,
  value,
  max = 10,
  optional,
  onChange,
}: TallyCardProps) {
  return (
    <div
      className="rounded-[10px] px-3 py-3 text-center"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid #1a4a3a",
        opacity: optional ? 0.55 : 1,
      }}
    >
      <div
        className="font-mono text-[9px] uppercase tracking-[0.10em]"
        style={{
          color: "rgba(255,255,255,0.5)",
          fontFamily: "var(--font-jetbrains-mono)",
        }}
      >
        {label}
      </div>
      <div className="flex items-center justify-center gap-1.5 mt-1.5">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-5.5 h-5.5 rounded-full text-[11px] font-extrabold leading-none"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.10)",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          −
        </button>
        <div
          className="font-extrabold text-white tabular-nums"
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "22px",
            minWidth: "28px",
          }}
        >
          {value}
        </div>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-5.5 h-5.5 rounded-full text-[11px] font-extrabold leading-none"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.10)",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          +
        </button>
      </div>
      <div
        className="font-mono text-[9px] mt-1"
        style={{
          color: "rgba(255,255,255,0.4)",
          fontFamily: "var(--font-jetbrains-mono)",
        }}
      >
        {optional ? "VALGFRI" : `/ ${max}`}
      </div>
    </div>
  );
}
