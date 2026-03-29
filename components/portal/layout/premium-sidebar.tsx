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
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { isStaff } from "@/lib/portal/rbac";
import type { PortalUser } from "@/lib/portal/auth";
import { useSidebar } from "./sidebar-context";

const navItems = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/bookinger", label: "Mine Bookinger", icon: CalendarCheck },
  { href: "/portal/treningsplan", label: "Treningsplan", icon: Target },
  { href: "/portal/dagbok", label: "Treningsdagbok", icon: BookOpen },
  { href: "/portal/statistikk", label: "Statistikk", icon: BarChart3 },
  { href: "/portal/kalender", label: "Kalender", icon: Calendar },
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
  { href: "/portal/admin/elever", label: "Elever", icon: UsersIcon },
  { href: "/portal/admin/tilgjengelighet", label: "Tilgjengelighet", icon: Clock },
  { href: "/portal/admin/kapasitet", label: "Kapasitet", icon: BarChart3 },
  { href: "/portal/admin/denne-uken", label: "Denne uken", icon: CalendarCheck },
  { href: "/portal/admin/turneringer", label: "Turneringer", icon: ShieldCheck },
];

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
      <Link href={item.href} onClick={onClick} className="block relative group">
        <motion.div
          whileHover={{ x: 4 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "flex items-center gap-3 px-4 py-2.5 mx-3 rounded-lg text-sm font-medium transition-all duration-200",
            active
              ? "bg-gradient-to-r from-gold/20 to-gold/5 text-white"
              : "text-[var(--portal-text-secondary)] hover:text-white hover:bg-white/5"
          )}
        >
          {/* Active indicator */}
          {active && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gold rounded-r-full"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}

          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
            active ? "bg-gold/20" : "bg-white/5 group-hover:bg-white/10"
          )}>
            <item.icon className={cn(
              "w-4 h-4 transition-colors",
              active ? "text-gold" : "text-[var(--portal-text-muted)] group-hover:text-white"
            )} />
          </div>

          <span className="flex-1">{item.label}</span>

          {active && (
            <ChevronRight className="w-4 h-4 text-gold/50" />
          )}
        </motion.div>
      </Link>
    </li>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-6 pt-6 pb-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--portal-text-muted)]">
        {children}
      </p>
    </div>
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
      <nav className="flex-1 py-2 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} onClick={onNavClick} />
          ))}
        </ul>

        {/* Trening section */}
        <SectionHeader>Trening</SectionHeader>
        <ul className="space-y-1">
          {trainingItems.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} onClick={onNavClick} />
          ))}
        </ul>

        {/* Konto section */}
        <SectionHeader>Konto</SectionHeader>
        <ul className="space-y-1">
          {accountItems.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} onClick={onNavClick} />
          ))}
          <li>
            <button
              onClick={() => {
                onSignOut();
                onNavClick?.();
              }}
              className="w-full block relative group cursor-pointer"
            >
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-3 px-4 py-2.5 mx-3 rounded-lg text-sm font-medium text-[var(--portal-text-secondary)] hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 group-hover:bg-red-500/20 transition-colors">
                  <LogOut className="w-4 h-4 text-[var(--portal-text-muted)] group-hover:text-red-400 transition-colors" />
                </div>
                <span>Logg ut</span>
              </motion.div>
            </button>
          </li>
        </ul>

        {/* Admin section */}
        {isStaff(user.role) && (
          <>
            <SectionHeader>Admin</SectionHeader>
            <ul className="space-y-1">
              {staffItems.map((item) => (
                <NavLink key={item.href} item={item} pathname={pathname} onClick={onNavClick} />
              ))}
            </ul>
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="p-4 mx-3 mb-3 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative">
            {user.image ? (
              <img
                src={user.image}
                alt=""
                className="w-10 h-10 rounded-full object-cover ring-2 ring-gold/20"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center ring-2 ring-gold/20">
                <span className="text-sm font-semibold text-gold">
                  {(user.name ?? "S")[0].toUpperCase()}
                </span>
              </div>
            )}
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0c1220]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">
              {user.name ?? "Spiller"}
            </p>
            <p className="text-xs text-[var(--portal-text-muted)] truncate flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-gold" />
              {user.subscriptionTier ?? "Academy"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export function PremiumSidebar({ user }: SidebarProps) {
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
      <aside className="fixed left-0 top-0 h-full w-64 hidden lg:flex flex-col z-20 bg-[#0c1220] border-r border-white/5">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/5">
          <Link href="/portal" className="flex items-center gap-3 group">
            {/* Logo mark */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center shadow-lg shadow-gold/20">
              <span className="text-lg font-bold text-white">K</span>
            </div>
            <div>
              <span className="text-lg font-bold text-white group-hover:text-gold transition-colors">
                AK Golf
              </span>
              <p className="text-[10px] text-[var(--portal-text-muted)] uppercase tracking-wider">
                Academy
              </p>
            </div>
          </Link>
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-72 flex flex-col z-50 lg:hidden bg-[#0c1220] border-r border-white/5"
            >
              {/* Close button */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">K</span>
                  </div>
                  <span className="text-lg font-bold text-white">AK Golf</span>
                </div>
                <button
                  onClick={close}
                  className="p-2 rounded-lg text-[var(--portal-text-muted)] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
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
