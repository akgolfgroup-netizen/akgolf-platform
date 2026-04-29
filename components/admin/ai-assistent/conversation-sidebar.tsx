import { Plus } from "lucide-react";
import { MOCK_CONVERSATIONS, type ConversationItem } from "./mock-data";

const GROUP_LABELS: Record<ConversationItem["group"], string> = {
  today: "I dag",
  yesterday: "I går",
  earlier: "Tidligere",
};

export function ConversationSidebar() {
  const grouped: Record<ConversationItem["group"], ConversationItem[]> = {
    today: [],
    yesterday: [],
    earlier: [],
  };
  for (const c of MOCK_CONVERSATIONS) grouped[c.group].push(c);

  return (
    <aside
      className="overflow-y-auto rounded-[14px] border border-[#1a4a3a] bg-[#0D2E23] p-3.5"
      style={{ maxHeight: "calc(100vh - 120px)" }}
    >
      <div className="mb-1 flex items-center gap-2 rounded-md bg-accent/15 px-3 py-2.5 text-accent">
        <Plus className="h-3.5 w-3.5" strokeWidth={2} />
        <span className="text-[12.5px] font-semibold">Ny samtale</span>
      </div>

      {(["today", "yesterday", "earlier"] as const).map((g) => (
        <div key={g}>
          <h4 className="mx-1.5 mb-1.5 mt-3.5 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/55">
            {GROUP_LABELS[g]}
          </h4>
          {grouped[g].map((c) => (
            <div
              key={c.id}
              className={
                "mb-1 cursor-pointer rounded-md px-3 py-2.5 " +
                (c.active ? "bg-accent/10" : "hover:bg-white/[0.03]")
              }
            >
              <div className="text-[12.5px] font-semibold leading-[1.3] text-white">
                {c.title}
              </div>
              <div className="mt-0.5 font-mono text-[9.5px] tracking-[0.04em] text-white/50">
                {c.meta}
              </div>
            </div>
          ))}
        </div>
      ))}
    </aside>
  );
}
