import { REPORT_SECTIONS } from "./rapporter-data";

export function ReportSidebar() {
  return (
    <aside
      className="sticky top-[80px] self-start rounded-[14px] p-3.5"
      style={{ background: "#0D2E23", border: "1px solid #1a4a3a" }}
    >
      {REPORT_SECTIONS.map((section, sIdx) => (
        <div key={section.title}>
          <h4
            className={`px-2 pb-1.5 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/50 ${
              sIdx === 0 ? "pt-1" : "pt-3.5"
            }`}
          >
            {section.title}
          </h4>
          {section.items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                className={`flex w-full items-center gap-2.5 rounded-[7px] px-2.5 py-2 text-left text-[13px] transition ${
                  item.active
                    ? "bg-[rgba(209,248,67,0.14)]"
                    : "text-white/[0.78] hover:bg-white/[0.04] hover:text-white"
                }`}
                style={item.active ? { color: "#D1F843" } : undefined}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                <span className="flex-1 truncate">{item.label}</span>
                {item.count && (
                  <span className="font-mono text-[9.5px] text-white/50">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
