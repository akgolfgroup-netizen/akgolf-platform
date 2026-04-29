// Server Component — statisk navigasjonsrad. Lucide-ikoner og next/link
import Link from "next/link";
import {
  FlagTriangleRight,
  CalendarDays,
  Activity,
  Sparkles,
  BarChart3,
  Menu,
  type LucideIcon,
} from "lucide-react";

interface Shortcut {
  href: string;
  label: string;
  icon: LucideIcon;
}

const SHORTCUTS: Shortcut[] = [
  { href: "/portal/runde/ny", label: "Logg runde", icon: FlagTriangleRight },
  { href: "/portal/min-plan", label: "Ukesplan", icon: CalendarDays },
  { href: "/portal/trackman", label: "TrackMan", icon: Activity },
  { href: "/portal/ai-coach", label: "AI Coach", icon: Sparkles },
  { href: "/portal/statistikk", label: "Statistikk", icon: BarChart3 },
  { href: "/portal/bookinger", label: "Bookinger", icon: Menu },
];

export function ShortcutsRow() {
  return (
    <div className="col-span-12 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
      {SHORTCUTS.map((s) => {
        const Icon = s.icon;
        return (
          <Link
            key={s.href}
            href={s.href}
            className="flex items-center gap-2.5 rounded-xl border border-line bg-card px-3.5 py-3 text-xs font-semibold text-ink-muted transition-all hover:-translate-y-0.5 hover:border-transparent hover:shadow-card-hover"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-surface-soft">
              <Icon className="h-4 w-4 text-ink-muted" />
            </span>
            {s.label}
          </Link>
        );
      })}
    </div>
  );
}
