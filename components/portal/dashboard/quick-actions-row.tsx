import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  CalendarPlus,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

interface QuickAction {
  href: string;
  icon: LucideIcon;
  label: string;
  description: string;
  accent?: string;
}

const ACTIONS: QuickAction[] = [
  {
    href: "/portal/dagbok",
    icon: BookOpen,
    label: "Logg trening",
    description: "Dagens økt",
    accent: "var(--color-primary)",
  },
  {
    href: "/portal/statistikk/ny-runde",
    icon: BarChart3,
    label: "Ny runde",
    description: "Registrer score",
    accent: "var(--color-success)",
  },
  {
    href: "/portal/ai-coach",
    icon: Sparkles,
    label: "AI Coach",
    description: "Få innsikt",
    accent: "var(--color-ai)",
  },
  {
    href: "/portal/bookinger/ny",
    icon: CalendarPlus,
    label: "Ny booking",
    description: "Book time",
    accent: "var(--color-warning)",
  },
];

export function QuickActionsRow() {
  return (
    <>
      {/* Desktop / tablet-rad */}
      <div className="hidden grid-cols-2 gap-3 md:grid md:grid-cols-4">
        {ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group flex items-center gap-3 rounded-2xl border border-[var(--color-grey-200)] bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--color-primary)]/30 hover:shadow-md"
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
              style={{
                backgroundColor: `color-mix(in srgb, ${action.accent} 12%, transparent)`,
              }}
            >
              <action.icon
                className="h-5 w-5"
                style={{ color: action.accent }}
                strokeWidth={1.75}
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--color-grey-900)]">
                {action.label}
              </p>
              <p className="truncate text-[11px] text-[var(--color-muted)]">
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobil sticky-bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-grey-200)] bg-white/95 backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {ACTIONS.map((action) => (
            <Link
              key={`mobile-${action.href}`}
              href={action.href}
              className="flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-center"
            >
              <action.icon
                className="h-5 w-5"
                style={{ color: action.accent }}
                strokeWidth={1.75}
              />
              <span className="text-[10px] font-semibold text-[var(--color-grey-900)]">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
