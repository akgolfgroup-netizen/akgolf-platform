import Link from "next/link";
import {
  Plus,
  UserPlus,
  Layers,
  MessageCircle,
  FileDown,
  Sparkles,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

interface QuickAction {
  href: string;
  icon: LucideIcon;
  label: string;
  meta: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { href: "/admin/bookinger/ny", icon: Plus, label: "Ny booking", meta: "CMD + B" },
  { href: "/admin/elever", icon: UserPlus, label: "Ny spiller", meta: "+ INVITE" },
  {
    href: "/admin/treningsplan",
    icon: Layers,
    label: "Bygg treningsplan",
    meta: "FOR EN SPILLER",
  },
  {
    href: "/admin/meldinger",
    icon: MessageCircle,
    label: "Send kringkast",
    meta: "TIL KOHORT",
  },
  {
    href: "/admin/rapporter",
    icon: FileDown,
    label: "Eksport · måneds-PDF",
    meta: "TIL STYRET",
  },
  {
    href: "/admin/ai-assistent",
    icon: Sparkles,
    label: "Spør AI Coach",
    meta: "«HVEM TRENGER OPPFØLG?»",
  },
];

/**
 * Hurtig-handlinger — 6 shortcuts til vanlige admin-aksjoner.
 * Match d27-mockup. 1-kolonne layout (mockup'en bruker col-span-1).
 */
export function QuickActionsPanel() {
  return (
    <section
      className="rounded-xl p-6"
      style={{
        background: "#0D2E23",
        border: "1px solid #1a4a3a",
      }}
    >
      <h3
        className="text-[15px] font-bold mb-3.5 flex items-center justify-between"
        style={{ color: "#FFFFFF" }}
      >
        <span>Hurtig-handlinger</span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "9px",
            letterSpacing: "0.14em",
            color: "rgba(255,255,255,0.5)",
            fontWeight: 700,
          }}
        >
          SHORTCUTS
        </span>
      </h3>

      <div className="flex flex-col gap-2.5">
        {QUICK_ACTIONS.map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.href}
              href={a.href}
              className="flex items-center gap-3 rounded-[10px] px-4 py-3.5 transition hover:bg-white/[0.04]"
              style={{ background: "rgba(0,0,0,0.20)" }}
            >
              <span
                className="w-8 h-8 rounded-[7px] grid place-items-center shrink-0"
                style={{ background: "rgba(209,248,67,0.15)", color: "#D1F843" }}
              >
                <Icon className="w-3.5 h-3.5" />
              </span>
              <span className="flex-1">
                <span
                  className="block text-[13px] font-semibold"
                  style={{ color: "#FFFFFF" }}
                >
                  {a.label}
                </span>
                <span
                  className="block mt-0.5"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  {a.meta}
                </span>
              </span>
              <ArrowRight
                className="w-3.5 h-3.5 shrink-0"
                style={{ color: "rgba(255,255,255,0.4)" }}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
