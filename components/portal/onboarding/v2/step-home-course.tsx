"use client";

import { useState } from "react";
import { Upload, MapPin } from "lucide-react";

interface StepHomeCourseProps {
  courseName: string | null;
  onChange: (name: string) => void;
}

export function StepHomeCourse({ courseName, onChange }: StepHomeCourseProps) {
  const [input, setInput] = useState(courseName ?? "");
  const courses = ["Bærums Golfklubb", "Oslo Golfklubb", "Miklagard", "Losby", "Vestfold GK"];

  return (
    <div className="w-full max-w-xl flex flex-col gap-8">
      <div>
        <h2 className="text-[28px] font-bold tracking-tight text-white mb-1">
          Hvor spiller du?
        </h2>
        <p className="text-[15px]" style={{ color: "rgba(255,255,255,0.5)" }}>
          Hjemmebanen brukes til å tilpasse øvelser og planlegging
        </p>
      </div>

      {/* Quick picks */}
      <div className="flex flex-wrap gap-2">
        {courses.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              setInput(c);
              onChange(c);
            }}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium transition-all"
            style={{
              background: input === c ? "#D1F843" : "rgba(255,255,255,0.04)",
              color: input === c ? "#0A1F18" : "rgba(255,255,255,0.85)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <MapPin className="w-3.5 h-3.5" />
            {c}
          </button>
        ))}
      </div>

      {/* Manual input */}
      <div>
        <label className="block text-[13px] font-semibold text-white mb-2">
          Eller skriv inn bane
        </label>
        <input
          type="text"
          placeholder="Navn på golfklubb..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            onChange(e.target.value);
          }}
          className="w-full rounded-[10px] px-4 py-3 text-[14px] text-white outline-none"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        />
      </div>

      {/* GolfBox import placeholder */}
      <div
        className="rounded-[12px] p-5 flex flex-col items-center gap-2 text-center"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px dashed rgba(255,255,255,0.12)",
        }}
      >
        <Upload className="w-5 h-5" style={{ color: "rgba(255,255,255,0.3)" }} />
        <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>
          GolfBox CSV-import kommer snart
        </p>
      </div>
    </div>
  );
}
