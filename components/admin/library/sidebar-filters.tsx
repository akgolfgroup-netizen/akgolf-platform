import {
  BarChart2,
  Brain,
  CircleDot,
  Dumbbell,
  Flag,
  Globe,
  Layers,
  PlayCircle,
  Target,
  User,
  type LucideIcon,
  FileText,
  BookOpen,
} from "lucide-react";
import {
  AUTHOR_FILTERS,
  CATEGORY_FILTERS,
  LEVEL_FILTERS,
  TYPE_FILTERS,
  type SidebarItem,
} from "./mock-data";

const TYPE_ICONS: Record<string, LucideIcon> = {
  Alle: Layers,
  Video: PlayCircle,
  Drills: Target,
  PDF: FileText,
  Artikler: BookOpen,
};

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Long-game": Target,
  "Short-game": Flag,
  Putting: CircleDot,
  Mental: Brain,
  Fysisk: Dumbbell,
};

const AUTHOR_ICONS: Record<string, LucideIcon> = {
  "Erik Solheim": User,
  "Anne Rud · TPI": User,
  "PGA / ekstern": Globe,
};

export function SidebarFilters() {
  return (
    <aside className="sticky top-[80px] rounded-[14px] border border-[#1a4a3a] bg-[#0D2E23] p-3.5">
      <FilterGroup title="Type" items={TYPE_FILTERS} icons={TYPE_ICONS} />
      <FilterGroup
        title="Kategori"
        items={CATEGORY_FILTERS}
        icons={CATEGORY_ICONS}
      />
      <FilterGroup
        title="Nivå"
        items={LEVEL_FILTERS}
        icons={Object.fromEntries(LEVEL_FILTERS.map((l) => [l.label, BarChart2]))}
      />
      <FilterGroup title="Forfatter" items={AUTHOR_FILTERS} icons={AUTHOR_ICONS} />
    </aside>
  );
}

function FilterGroup({
  title,
  items,
  icons,
}: {
  title: string;
  items: SidebarItem[];
  icons: Record<string, LucideIcon>;
}) {
  return (
    <>
      <h4 className="mx-1.5 mb-1.5 mt-3.5 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/50 first:mt-0">
        {title}
      </h4>
      {items.map((it) => {
        const Icon = icons[it.label];
        return (
          <div
            key={it.label}
            className={
              "flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] " +
              (it.active
                ? "bg-accent/15 text-accent"
                : "text-white/75 hover:bg-white/[0.04] hover:text-white")
            }
          >
            {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />}
            <span className="flex-1">{it.label}</span>
            {it.count !== undefined && (
              <span className="ml-auto font-mono text-[9.5px] text-white/50">
                {it.count}
              </span>
            )}
          </div>
        );
      })}
    </>
  );
}
