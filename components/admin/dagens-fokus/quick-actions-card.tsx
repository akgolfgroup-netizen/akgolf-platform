import type { QuickAction } from "./mock-data";
import { DAGENS_FOKUS_ICON_MAP } from "./icon-map";

export function QuickActionsCard({ actions }: { actions: QuickAction[] }) {
  return (
    <div className="rounded-2xl border border-[#1a4a3a] bg-[#0D2E23] p-[18px]">
      <div className="mb-3.5 flex items-center justify-between">
        <h3 className="font-inter-tight text-[14px] font-semibold tracking-tight text-white">
          Hurtigvalg
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {actions.map((action) => {
          const Icon = DAGENS_FOKUS_ICON_MAP[action.iconName];
          return (
            <button
              key={action.label}
              type="button"
              className="flex items-center gap-2.5 rounded-[10px] border border-[#1a4a3a] bg-white/[0.025] p-3.5 text-left transition hover:border-white/15 hover:bg-white/[0.05]"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[rgba(209,248,67,0.10)] text-accent">
                {Icon ? <Icon className="h-4 w-4" strokeWidth={1.8} /> : null}
              </span>
              <span className="text-[12px] font-semibold text-white">
                {action.label}
                <small className="mt-0.5 block text-[10px] font-normal text-white/45">
                  {action.hint}
                </small>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
