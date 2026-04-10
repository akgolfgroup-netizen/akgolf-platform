"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { AnimatePresence, motion } from "framer-motion";
import {
  User,
  CalendarDays,
  CalendarPlus,
  BookOpen,
  Target,
  Calendar,
  CalendarCheck,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  NotebookPen,
  BarChart3,
  Users as UsersIcon,
  Clock,
  ClipboardCheck,
  Dumbbell,
  X,
  CheckCircle,
  MessageSquare,
  Bot,
  Crosshair,
  Trophy,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { isStaff } from "@/lib/portal/rbac";
import type { PortalUser } from "@/lib/portal/auth";
import { useSidebar } from "./sidebar-context";

const navItems = [
  { href: "/portal", label: "Oversikt", icon: LayoutDashboard },
  { href: "/portal/bookinger", label: "Mine Bookinger", icon: CalendarCheck },
  { href: "/portal/treningsplan", label: "Treningsplan", icon: Target },
  { href: "/portal/dagbok", label: "Treningsdagbok", icon: BookOpen },
  { href: "/portal/statistikk", label: "Statistikk", icon: BarChart3 },
  { href: "/portal/turneringer", label: "Turneringer", icon: Trophy },
  { href: "/portal/benchmark", label: "Benchmarking", icon: Crosshair },
  { href: "/portal/kalender", label: "Kalender", icon: Calendar },
  { href: "/portal/meldinger", label: "Meldinger", icon: MessageSquare },
  { href: "/portal/ai-coach", label: "AI Coach", icon: Sparkles },
];

const trainingItems = [
  { href: "/portal/trening/tester", label: "Trackman Tester", icon: ClipboardCheck },
  { href: "/portal/trening/ovelser", label: "Øvelser", icon: Dumbbell },
];

const accountItems = [
  { href: "/portal/profil", label: "Profil", icon: User },
  { href: "/portal/coaching-historikk", label: "Historikk", icon: NotebookPen },
];

const staffItems = [
  { href: "/portal/admin/kalender", label: "Kalender", icon: CalendarDays },
  { href: "/portal/admin/bookinger", label: "Bookinger", icon: CalendarPlus },
  { href: "/portal/admin/godkjenninger", label: "Godkjenninger", icon: CheckCircle },
  { href: "/portal/admin/elever", label: "Elever", icon: UsersIcon },
  { href: "/portal/admin/tilgjengelighet", label: "Tilgjengelighet", icon: Clock },
  { href: "/portal/admin/kapasitet", label: "Kapasitet", icon: BarChart3 },
  { href: "/portal/admin/denne-uken", label: "Denne uken", icon: CalendarCheck },
  { href: "/portal/admin/okter", label: "Økter", icon: BookOpen },
  { href: "/portal/admin/turneringer", label: "Turneringer", icon: ShieldCheck },
  { href: "/portal/admin/meldinger", label: "Meldinger", icon: MessageSquare },
  { href: "/portal/admin/ai-assistent", label: "AI-assistent", icon: Bot },
];

// Light sidebar theme (Brand System 2026)
const THEME = {
  bg: "white",
  bgHover: "var(--color-grey-100)",
  bgActive: "var(--color-grey-100)",
  gold: "var(--color-grey-900)",
  white: "var(--color-grey-900)",
  textMuted: "var(--color-grey-400)",
  textDim: "var(--color-grey-500)",
  border: "var(--color-grey-200)",
};

interface SidebarProps {
  user: PortalUser;
}

function NavLink({
  item,
  pathname,
  onClick,
}: {
  item: { href: string; label: string; icon: React.ComponentType<{ className?: string }> };
  pathname: string;
  onClick?: () => void;
}) {
  const active =
    pathname === item.href ||
    (item.href !== "/portal" && pathname.startsWith(`${item.href}/`));

  return (
    <li>
      <Link
        href={item.href}
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors duration-150",
          active
            ? "text-[var(--color-grey-900)] border-l-[3px] border-[var(--color-grey-900)]"
            : "text-[var(--portal-text-secondary)] hover:text-[var(--color-grey-900)] hover:bg-[var(--color-grey-100)]"
        )}
        style={active ? { background: THEME.bgActive } : undefined}
      >
        <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
        <span>{item.label}</span>
      </Link>
    </li>
  );
}

function SidebarContent({
  user,
  pathname,
  onSignOut,
  onNavClick,
}: {
  user: PortalUser;
  pathname: string;
  onSignOut: () => void;
  onNavClick?: () => void;
}) {
  return (
    <>
      {/* Main Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} onClick={onNavClick} />
          ))}
        </ul>

        {/* Trening section */}
        <div className="mt-4 pt-2">
          <p
            className="px-5 py-2 text-[11px] font-medium uppercase tracking-widest"
            style={{ color: THEME.textDim }}
          >
            Trening
          </p>
          <ul className="space-y-0.5">
            {trainingItems.map((item) => (
              <NavLink key={item.href} item={item} pathname={pathname} onClick={onNavClick} />
            ))}
          </ul>
        </div>

        {/* Konto section */}
        <div className="mt-4 pt-2">
          <p
            className="px-5 py-2 text-[11px] font-medium uppercase tracking-widest"
            style={{ color: THEME.textDim }}
          >
            Konto
          </p>
          <ul className="space-y-0.5">
            {accountItems.map((item) => (
              <NavLink key={item.href} item={item} pathname={pathname} onClick={onNavClick} />
            ))}
            <li>
              <button
                onClick={() => {
                  onSignOut();
                  onNavClick?.();
                }}
                className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors duration-150 text-[var(--portal-text-secondary)] hover:text-[var(--color-grey-900)] hover:bg-[var(--color-grey-100)] cursor-pointer"
              >
                <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
                <span>Logg ut</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Admin section */}
        {isStaff(user.role) && (
          <div className="mt-4 pt-2">
            <p
              className="px-5 py-2 text-[11px] font-medium uppercase tracking-widest"
              style={{ color: THEME.textDim }}
            >
              Admin
            </p>
            <ul className="space-y-0.5">
              {staffItems.map((item) => (
                <NavLink key={item.href} item={item} pathname={pathname} onClick={onNavClick} />
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* User footer */}
      <div
        className="px-5 py-4 flex items-center gap-3"
        style={{ borderTop: `1px solid ${THEME.border}` }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "var(--portal-text-muted)" }}
        >
          {user.image ? (
            <img
              src={user.image}
              alt=""
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <User className="w-[18px] h-[18px] text-[var(--portal-text-secondary)]" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[var(--color-grey-900)] truncate">
            {user.name ?? "Spiller"}
          </p>
          <p className="text-xs text-[var(--portal-text-muted)] truncate">
            {user.email}
          </p>
        </div>
      </div>
    </>
  );
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, close } = useSidebar();

  async function handleSignOut() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push("/portal/login");
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="fixed left-0 top-0 h-full w-60 hidden lg:flex flex-col z-20"
        style={{ background: THEME.bg }}
      >
        {/* Logo */}
        <div
          className="px-5 py-5"
          style={{ borderBottom: `1px solid ${THEME.border}` }}
        >
          <span className="text-lg font-bold text-[var(--color-grey-900)]">AK Golf</span>
        </div>

        <SidebarContent
          user={user}
          pathname={pathname}
          onSignOut={handleSignOut}
        />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-72 flex flex-col z-50 lg:hidden"
              style={{ background: THEME.bg }}
            >
              {/* Close button */}
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: `1px solid ${THEME.border}` }}
              >
                <span className="text-lg font-bold text-[var(--color-grey-900)]">AK Golf</span>
                <button
                  onClick={close}
                  className="p-1 rounded-lg text-[var(--portal-text-muted)] hover:text-[var(--color-grey-900)] transition-colors cursor-pointer"
                  aria-label="Lukk meny"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <SidebarContent
                user={user}
                pathname={pathname}
                onSignOut={handleSignOut}
                onNavClick={close}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
