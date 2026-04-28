"use client";

import { Sparkles, ListChecks, LineChart } from "lucide-react";

export function StepReady() {
  const points = [
    {
      Icon: ListChecks,
      title: "Logg hver økt",
      desc: "Skriv inn fokus, varighet og notater. Vi gjør resten.",
    },
    {
      Icon: LineChart,
      title: "Se trender",
      desc: "Strokes Gained og handicap-utvikling oppdateres automatisk.",
    },
    {
      Icon: Sparkles,
      title: "AI Coach",
      desc: "Anbefalinger basert på ditt mål og din historikk.",
    },
  ];

  return (
    <div className="w-full max-w-[720px]">
      <div
        className="font-mono text-[10px] uppercase tracking-[0.16em]"
        style={{ color: "#D1F843", fontFamily: "var(--font-jetbrains-mono)" }}
      >
        Steg 4 av 4 · Klar
      </div>
      <h1
        className="mt-2.5 mb-3.5 text-[36px] font-extrabold tracking-[-0.03em] leading-[1.1] text-white"
        style={{ fontFamily: "var(--font-inter-tight)" }}
      >
        Du er klar
      </h1>
      <p
        className="text-[15px] mb-8 max-w-[56ch]"
        style={{ color: "rgba(255,255,255,0.7)" }}
      >
        Vi har satt opp profilen din. Logg din første økt for å aktivere
        statistikk og AI Coach.
      </p>

      <div className="space-y-3">
        {points.map((p) => {
          const Icon = p.Icon;
          return (
            <div
              key={p.title}
              className="flex items-start gap-4 rounded-[14px] p-5 border"
              style={{ background: "#0D2E23", borderColor: "#1a4a3a" }}
            >
              <div
                className="w-10 h-10 rounded-[10px] grid place-items-center shrink-0"
                style={{
                  background: "rgba(209,248,67,0.15)",
                  color: "#D1F843",
                }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-white font-bold text-[15px] tracking-tight">
                  {p.title}
                </div>
                <div
                  className="text-[13px] mt-1 leading-[1.5]"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  {p.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
