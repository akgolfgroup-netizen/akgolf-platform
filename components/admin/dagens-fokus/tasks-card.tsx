import type { TaskEntry } from "./mock-data";

const PILL_TONES: Record<TaskEntry["pillTone"], string> = {
  success: "bg-[rgba(42,125,90,0.25)] text-[#6FCBA1]",
  warn: "bg-[rgba(196,138,50,0.22)] text-[#E8B967]",
  neutral: "bg-white/10 text-white/85",
};

export function TasksCard({ tasks }: { tasks: TaskEntry[] }) {
  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <div className="rounded-2xl border border-[#1a4a3a] bg-[#0D2E23] p-[18px]">
      <div className="mb-3.5 flex items-center justify-between">
        <h3 className="font-inter-tight text-[14px] font-semibold tracking-tight text-white">
          Dagens oppgaver
        </h3>
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/40">
          {doneCount}/{tasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="grid grid-cols-[18px_1fr_auto] items-start gap-2.5 rounded-lg bg-white/[0.025] px-3 py-2.5"
          >
            <div
              className={
                "mt-0.5 grid h-4 w-4 place-items-center rounded border-[1.5px] " +
                (task.done
                  ? "border-accent bg-accent"
                  : "border-white/25 bg-white/[0.04]")
              }
            >
              {task.done ? (
                <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" aria-hidden>
                  <path
                    d="M2 6.5l2.5 2.5L10 3.5"
                    fill="none"
                    stroke="#0A1F18"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : null}
            </div>
            <div>
              <div
                className={
                  "text-[13px] " +
                  (task.done ? "text-white/50 line-through" : "text-white")
                }
              >
                {task.label}
              </div>
              <div className="mt-0.5 font-mono text-[10px] tracking-[0.06em] text-white/45">
                {task.context}
              </div>
            </div>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${PILL_TONES[task.pillTone]}`}
            >
              {task.pillLabel}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
