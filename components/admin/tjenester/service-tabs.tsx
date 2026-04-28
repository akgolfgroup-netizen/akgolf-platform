import { TABS } from "./mock-data";

export function ServiceTabs() {
  return (
    <div className="mb-4 flex items-center gap-0.5 border-b border-[#1a4a3a]">
      {TABS.map((tab) => {
        const active = tab.active;
        return (
          <button
            type="button"
            key={tab.key}
            className={
              "-mb-px flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-[12.5px] transition " +
              (active
                ? "border-accent text-accent"
                : "border-transparent text-white/55 hover:text-white/80")
            }
          >
            {tab.label}
            <span
              className={
                "rounded font-mono text-[9.5px] font-bold tracking-[0.04em] px-1.5 py-[1px] " +
                (active
                  ? "bg-[rgba(209,248,67,0.15)] text-accent"
                  : "bg-white/[0.08] text-white/50")
              }
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
