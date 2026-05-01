"use client";

import { useState } from "react";

interface StepProfileProps {
  handicap: number | null;
  age: number | null;
  weeklyHours: number | null;
  onChange: (field: "handicap" | "age" | "weeklyHours", value: number) => void;
}

export function StepProfile({ handicap, age, weeklyHours, onChange }: StepProfileProps) {
  const [localHcp, setLocalHcp] = useState(handicap ?? "");
  const [localAge, setLocalAge] = useState(age ?? "");
  const [localHours, setLocalHours] = useState(weeklyHours ?? "");

  return (
    <div className="w-full max-w-xl flex flex-col gap-8">
      <div>
        <h2 className="text-[28px] font-bold tracking-tight text-white mb-1">
          Din golfbakgrunn
        </h2>
        <p className="text-[15px]" style={{ color: "rgba(255,255,255,0.5)" }}>
          Hjelper oss å tilpasse treningsplanen fra dag én
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Handicap */}
        <div>
          <label className="block text-[13px] font-semibold text-white mb-2">
            Nåværende handicap
          </label>
          <input
            type="number"
            min={0}
            max={54}
            step={0.1}
            placeholder="f.eks. 12.4"
            value={localHcp}
            onChange={(e) => {
              const val = e.target.value;
              setLocalHcp(val);
              const n = parseFloat(val);
              if (!isNaN(n) && n >= 0 && n <= 54) onChange("handicap", n);
            }}
            className="w-full rounded-[10px] px-4 py-3 text-[14px] text-white outline-none transition-colors"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />
        </div>

        {/* Age */}
        <div>
          <label className="block text-[13px] font-semibold text-white mb-2">
            Alder
          </label>
          <input
            type="number"
            min={5}
            max={100}
            placeholder="f.eks. 35"
            value={localAge}
            onChange={(e) => {
              const val = e.target.value;
              setLocalAge(val);
              const n = parseInt(val);
              if (!isNaN(n) && n >= 5 && n <= 100) onChange("age", n);
            }}
            className="w-full rounded-[10px] px-4 py-3 text-[14px] text-white outline-none transition-colors"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />
        </div>

        {/* Weekly hours */}
        <div>
          <label className="block text-[13px] font-semibold text-white mb-2">
            Timer golf per uke (trening + runder)
          </label>
          <input
            type="number"
            min={1}
            max={40}
            placeholder="f.eks. 5"
            value={localHours}
            onChange={(e) => {
              const val = e.target.value;
              setLocalHours(val);
              const n = parseInt(val);
              if (!isNaN(n) && n >= 1 && n <= 40) onChange("weeklyHours", n);
            }}
            className="w-full rounded-[10px] px-4 py-3 text-[14px] text-white outline-none transition-colors"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
