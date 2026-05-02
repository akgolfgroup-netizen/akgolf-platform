// Server Component — quick actions for raske handlinger fra Hjem
import Link from "next/link";
import {
  CalendarPlus,
  FlagTriangleRight,
  CalendarDays,
  MessageCircle,
  BarChart3,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

interface Shortcut {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Hvis true: vises med accent-farge (lime), brukes for primaer-CTA */
  primary?: boolean;
}

/**
 * Quick actions — 6 hyppigste handlinger fra Hjem.
 *
 * Forste action ("Book okt") er fremhevet med lime accent-farge,
 * de andre bruker subtle hvit kort-stil.
 */
const SHORTCUTS: Shortcut[] = [
  {
    href: "/portal/bookinger/ny",
    label: "Book økt",
    icon: CalendarPlus,
    primary: true,
  },
  { href: "/portal/runde/ny", label: "Logg runde", icon: FlagTriangleRight },
  { href: "/portal/treningsplan", label: "Ukesplan", icon: CalendarDays },
  { href: "/portal/meldinger", label: "Meldinger", icon: MessageCircle },
  { href: "/portal/statistikk", label: "Statistikk", icon: BarChart3 },
  { href: "/portal/ai-coach", label: "AI Coach", icon: Sparkles },
];

export function ShortcutsRow() {
  return (
    <div className="col-span-12 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
      {SHORTCUTS.map((s) => {
        const Icon = s.icon;
        if (s.primary) {
          return (
            <Link
              key={s.href}
              href={s.href}
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-xs font-bold transition-all hover:-translate-y-0.5 hover:shadow-accent-glow"
              style={{
                background: "var(--color-accent, #D1F843)",
                color: "var(--color-ink, #0A1F18)",
                border: "1px solid var(--color-accent, #D1F843)",
              }}
            >
              <span
                className="grid h-8 w-8 place-items-center rounded-lg"
                style={{ background: "rgba(10,31,24,0.12)" }}
              >
                <Icon className="h-4 w-4" />
              </span>
              {s.label}
            </Link>
          );
        }
        return (
          <Link
            key={s.href}
            href={s.href}
            className="flex items-center gap-2.5 rounded-xl border border-line bg-card px-3.5 py-3 text-xs font-semibold text-ink-muted transition-all hover:-translate-y-0.5 hover:border-primary hover:text-ink hover:shadow-card-hover"
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
