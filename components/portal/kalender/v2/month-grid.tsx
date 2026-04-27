"use client";

import { LEVEL_COLORS, type SessionBlock, type SessionLevel } from "./types";

const DOW = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

interface MonthGridProps {
  monthDate: Date; // any date inside the month
  sessions: SessionBlock[];
}

interface CellDate {
  date: Date;
  inMonth: boolean;
  isToday: boolean;
}

function buildMonthCells(monthDate: Date): CellDate[] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = (firstOfMonth.getDay() + 6) % 7; // Mon = 0
  const start = new Date(year, month, 1 - startWeekday);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cells: CellDate[] = [];
  for (let i = 0; i < 35; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    cells.push({
      date: d,
      inMonth: d.getMonth() === month,
      isToday: d.getTime() === today.getTime(),
    });
  }
  return cells;
}

export function MonthGrid({ monthDate, sessions }: MonthGridProps) {
  const cells = buildMonthCells(monthDate);

  const sessionsByDay = new Map<string, SessionBlock[]>();
  for (const s of sessions) {
    const key = s.date.toDateString();
    const arr = sessionsByDay.get(key) ?? [];
    arr.push(s);
    sessionsByDay.set(key, arr);
  }

  return (
    <>
      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {DOW.map((d) => (
          <div
            key={d}
            className="font-mono text-[9px] uppercase tracking-[0.14em] py-1.5 px-2"
            style={{
              color: "rgba(255,255,255,0.45)",
              fontFamily: "var(--font-jetbrains-mono)",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      <div
        className="grid grid-cols-7 gap-1.5"
        style={{ gridAutoRows: "minmax(140px, 1fr)" }}
      >
        {cells.map((cell, i) => {
          const ofDay = sessionsByDay.get(cell.date.toDateString()) ?? [];
          const visible = ofDay.slice(0, 2);
          const overflow = ofDay.length - visible.length;

          return (
            <div
              key={i}
              className="rounded-[12px] flex flex-col gap-1 min-h-[140px] transition-colors"
              style={{
                background: cell.isToday ? "rgba(209,248,67,0.04)" : "#0D2E23",
                border: cell.isToday
                  ? "1px solid rgba(209,248,67,0.55)"
                  : "1px solid #1a4a3a",
                opacity: cell.inMonth ? 1 : 0.4,
                padding: "8px 8px 6px",
              }}
            >
              <div className="flex items-center justify-between px-0.5 pb-1">
                <div
                  className="flex items-center gap-1.5 text-[13px] font-bold"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  {cell.isToday && (
                    <span
                      className="w-[7px] h-[7px] rounded-full"
                      style={{
                        background: "#D1F843",
                        boxShadow: "0 0 0 3px rgba(209,248,67,0.20)",
                      }}
                    />
                  )}
                  {cell.date.getDate()}
                </div>
                <div
                  className="font-mono text-[9px] tracking-[0.06em]"
                  style={{
                    color: "rgba(255,255,255,0.40)",
                    fontFamily: "var(--font-jetbrains-mono)",
                  }}
                >
                  {ofDay.length === 0
                    ? "REST"
                    : `${ofDay.length} ${ofDay.length === 1 ? "økt" : "økter"}`}
                </div>
              </div>

              {visible.map((s) => (
                <SessionTile key={s.id} session={s} />
              ))}

              {overflow > 0 && (
                <div
                  className="rounded-md px-2 py-0.5 text-center font-mono text-[10px] cursor-pointer"
                  style={{
                    color: "rgba(255,255,255,0.55)",
                    border: "1px dashed rgba(255,255,255,0.12)",
                    fontFamily: "var(--font-jetbrains-mono)",
                  }}
                >
                  + {overflow} til
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function SessionTile({ session }: { session: SessionBlock }) {
  const isAi = session.level === "ai-suggest";
  const colors = isAi
    ? { fg: "#D1F843", bg: "rgba(209,248,67,0.10)" }
    : LEVEL_COLORS[session.level as SessionLevel];

  return (
    <div
      className="rounded-md px-2 py-1.5 cursor-grab select-none transition-colors"
      style={{
        background: colors.bg,
        borderLeft: `3px solid ${colors.fg}`,
        borderTop: isAi ? "1px dashed " + colors.fg : "none",
        borderRight: isAi ? "1px dashed " + colors.fg : "none",
        borderBottom: isAi ? "1px dashed " + colors.fg : "none",
      }}
    >
      <div
        className="text-[12px] font-bold leading-[1.25] tracking-[-0.01em]"
        style={{ color: isAi ? "#D1F843" : "#fff", fontFamily: "var(--font-inter)" }}
      >
        {session.title}
      </div>
      <div
        className="font-mono text-[9px] tracking-[0.06em] mt-0.5"
        style={{
          color: "rgba(255,255,255,0.55)",
          fontFamily: "var(--font-jetbrains-mono)",
        }}
      >
        {session.meta}
      </div>
    </div>
  );
}
