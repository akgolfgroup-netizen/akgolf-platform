import { CALENDAR_HOURS, WEEK_HEADERS } from "./mock-data";
import { CalendarBlock } from "./calendar-block";

export function CalendarGrid() {
  return (
    <div
      className="overflow-hidden rounded-[14px] border bg-white/[0.04]"
      style={{
        gridTemplateColumns: "60px repeat(7, 1fr)",
        display: "grid",
        borderColor: "rgba(255,255,255,0.10)",
      }}
    >
      {/* Header row */}
      <div className="border-b border-r border-white/8 bg-white/[0.025] px-2 py-3" />
      {WEEK_HEADERS.map((h, i) => (
        <div
          key={i}
          className={
            "border-b bg-white/[0.025] px-2.5 py-3 " +
            (i < 6 ? "border-r " : "") +
            "border-white/8"
          }
        >
          <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/50">
            {h.dow}
          </div>
          <div
            className={
              "mt-0.5 text-[20px] font-bold tracking-tight " +
              (h.today ? "text-accent" : "text-white")
            }
          >
            {h.num}
          </div>
          <div className="mt-0.5 font-mono text-[10px] text-white/50">{h.meta}</div>
        </div>
      ))}

      {/* Hour rows */}
      {CALENDAR_HOURS.map((row) => (
        <RowFragment key={row.hour} row={row} />
      ))}
    </div>
  );
}

function RowFragment({
  row,
}: {
  row: (typeof CALENDAR_HOURS)[number];
}) {
  return (
    <>
      <div
        className="h-[60px] border-r border-white/8 px-2 py-2 text-right font-mono text-[10px] tracking-wider text-white/45"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        {row.hour}
      </div>
      {row.cells.map((cell, idx) => (
        <div
          key={idx}
          className={
            "relative h-[60px] " +
            (idx < 6 ? "border-r " : "") +
            "border-white/8"
          }
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          {cell && <CalendarBlock block={cell} />}
          {row.showNowLineAt !== undefined && row.nowLineColIndex === idx && (
            <NowLine top={row.showNowLineAt} />
          )}
        </div>
      ))}
    </>
  );
}

function NowLine({ top }: { top: number }) {
  return (
    <div
      className="pointer-events-none absolute left-0 right-0 z-[5]"
      style={{ top, height: 2, background: "#D1F843" }}
    >
      <div
        className="absolute -left-1 -top-[3px] h-2 w-2 rounded-full"
        style={{ background: "#D1F843", boxShadow: "0 0 8px #D1F843" }}
      />
    </div>
  );
}
