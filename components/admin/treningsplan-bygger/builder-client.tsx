"use client";

import { Eye, LayoutTemplate, Send } from "lucide-react";
import { useState } from "react";
import { DayBoard } from "./day-board";
import { DrillLibrary } from "./drill-library";
import {
  ALLOCATION_ROWS,
  LIBRARY_SECTIONS,
  PLAN_GOALS,
  WEEK_1_DAYS,
  WEEK_TABS,
} from "./mock-data";
import { PlanInfo } from "./plan-info";
import { SummaryPanel } from "./summary-panel";
import { WeekTabs } from "./week-tabs";

const AI_TEXT =
  "Anders sin svake 6m-putt og driver-spredning matches godt mot fordelingen denne uka. Vurder å øke putting i uke 2 (nå 9 % — bør være 12–15 %).";

export function TreningsplanByggerClient() {
  const [activeWeek, setActiveWeek] = useState(WEEK_TABS[0].id);
  const [toast, setToast] = useState<string | null>(null);

  const fireToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2400);
  };

  const activeWeekTab = WEEK_TABS.find((w) => w.id === activeWeek) ?? WEEK_TABS[0];

  return (
    <div className="px-6 py-5 text-white" style={{ background: "#102B1E" }}>
      {/* Page head */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <div
            className="font-mono text-[10px] font-bold uppercase tracking-[0.14em]"
            style={{ color: "#D1F843" }}
          >
            / TRENING · BYGGER
          </div>
          <h1 className="mt-1 font-inter-tight text-[34px] font-semibold leading-tight tracking-tight text-white">
            Bygg en 4-ukers plan til Anders.
          </h1>
          <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-white/65">
            Dra &amp; slipp drills og økter inn i ukene. AI foreslår fordeling
            basert på siste 90-dagers data — du tilpasser. Send til spiller når
            du er ferdig.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fireToast("Lagre som mal — kobles på i neste sprint")}
            className="flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-[12.5px] font-medium text-white transition hover:border-[rgba(209,248,67,0.35)]"
            style={{
              background: "rgba(255,255,255,0.04)",
              borderColor: "rgba(255,255,255,0.10)",
            }}
          >
            <LayoutTemplate className="h-3.5 w-3.5" strokeWidth={2} />
            Lagre som mal
          </button>
          <button
            type="button"
            onClick={() => fireToast("Forhåndsvisning kommer i neste sprint")}
            className="flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-[12.5px] font-medium text-white transition hover:border-[rgba(209,248,67,0.35)]"
            style={{
              background: "rgba(255,255,255,0.04)",
              borderColor: "rgba(255,255,255,0.10)",
            }}
          >
            <Eye className="h-3.5 w-3.5" strokeWidth={2} />
            Forhåndsvis
          </button>
          <button
            type="button"
            onClick={() => fireToast("Send til Anders — kobles på i neste sprint")}
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-bold text-[#0A1F18] transition hover:opacity-90"
            style={{ background: "#D1F843" }}
          >
            <Send className="h-3.5 w-3.5" strokeWidth={2.4} />
            Send til Anders
          </button>
        </div>
      </div>

      {/* 3-col grid */}
      <div className="grid items-start gap-3.5 lg:grid-cols-[280px_minmax(0,1fr)_300px]">
        <DrillLibrary sections={LIBRARY_SECTIONS} />

        <div className="min-w-0">
          <PlanInfo />
          <WeekTabs
            weeks={WEEK_TABS}
            activeId={activeWeek}
            onSelect={setActiveWeek}
          />
          <DayBoard
            days={WEEK_1_DAYS}
            onAddBlock={() =>
              fireToast(
                "Drag & drop / hurtig-add kobles på når plan-actions er ferdig"
              )
            }
          />
        </div>

        <SummaryPanel
          weekLabel={activeWeekTab.label.toLowerCase()}
          rows={ALLOCATION_ROWS}
          aiText={AI_TEXT}
          goals={PLAN_GOALS}
        />
      </div>

      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 rounded-xl border px-4 py-3 text-[13px] font-medium text-white shadow-lg"
          style={{
            background: "#0D2E23",
            borderColor: "rgba(209,248,67,0.30)",
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
