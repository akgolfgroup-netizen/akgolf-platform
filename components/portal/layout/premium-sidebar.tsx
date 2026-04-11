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
  TrendingUp,
  MapPin,
  Bell,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { isStaff } from "@/lib/portal/rbac";
import type { PortalUser } from "@/lib/portal/auth";
import { useSidebar } from "./sidebar-context";
import { AKLogo } from "@/components/website/AKLogo";
import { NotificationBell } from "./notification-bell";

const navItems = [
  { href: "/portal", label: "Oversikt", icon: LayoutDashboard },
  { href: "/booking", label: "Book ny time", icon: CalendarPlus },
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
  { href: "/portal/abonnement", label: "Abonnement", icon: CreditCard },
  { href: "/portal/coaching-historikk", label: "Historikk", icon: NotebookPen },
];

const staffItems = [
  { href: "/admin/kalender", label: "Kalender", icon: CalendarDays },
  { href: "/admin/bookinger", label: "Bookinger", icon: CalendarPlus },
  { href: "/admin/fasiliteter", label: "Fasiliteter", icon: MapPin },
  { href: "/admin/elever", label: "Elever", icon: UsersIcon },
  { href: "/admin/tilgjengelighet", label: "Tilgjengelighet", icon: Clock },
  { href: "/admin/kapasitet", label: "Kapasitet", icon: BarChart3 },
  { href: "/admin/analytics", label: "Analyse", icon: TrendingUp },
  { href: "/admin/denne-uken", label: "Denne uken", icon: CalendarCheck },
  { href: "/admin/turneringer", label: "Turneringer", icon: ShieldCheck },
  { href: "/admin/notifications", label: "Notifikasjoner", icon: Bell },
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
          whileHover={{ x: 2 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "flex items-center gap-3 px-4 py-2 mx-3 rounded-lg text-[13px] font-medium transition-[background-color,color] duration-200 relative",
            active
              ? "bg-[var(--color-primary)] text-white font-semibold shadow-[0_0_0_1px_var(--color-accent-cta)]"
              : "text-[var(--color-grey-500)] hover:text-[var(--color-grey-900)] hover:bg-[var(--color-grey-100)]"
          )}
        >
          {active && (
            <span
              aria-hidden
              className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-[var(--color-accent-cta)]"
            />
          )}
          <div className={cn(
            "w-[18px] h-[18px] rounded-[5px] flex items-center justify-center transition-colors shrink-0"
          )}>
            <item.icon className={cn(
              "w-3.5 h-3.5 transition-colors",
              active
                ? "text-[var(--color-accent-cta)]"
                : "text-[var(--color-grey-400)] group-hover:text-[var(--color-primary)]"
            )} />
          </div>

          <span className="flex-1">{item.label}</span>
        </motion.div>
      </Link>
    </li>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-6 pt-6 pb-2">
      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-grey-300)]">
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
                className="flex items-center gap-3 px-4 py-2.5 mx-3 rounded-lg text-sm font-medium text-[var(--color-grey-500)] hover:text-[var(--color-error)] hover:bg-[color-mix(in_srgb,var(--color-error)_10%,transparent)] transition-[background-color,color] duration-200"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--color-grey-100)] group-hover:bg-[color-mix(in_srgb,var(--color-error)_18%,transparent)] transition-colors">
                  <LogOut className="w-4 h-4 text-[var(--color-grey-400)] group-hover:text-[var(--color-error)] transition-colors" />
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
      <div className="p-4 mx-3 mb-3 rounded-xl bg-[var(--color-primary-soft)] border border-[var(--color-grey-200)]">
        <div className="flex items-center gap-3">
          <div className="relative">
            {user.image ? (
              <img
                src={user.image}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center ring-1 ring-[var(--color-accent-cta)]/40">
                <span className="text-sm font-semibold text-white">
                  {(user.name ?? "S")[0].toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[var(--color-grey-900)] truncate">
              {user.name ?? "Spiller"}
            </p>
            <p className="text-xs font-medium text-[var(--color-primary)] truncate">
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
      <aside className="fixed left-0 top-0 h-full w-[220px] hidden lg:flex flex-col z-20 bg-white border-r border-[var(--color-grey-200)]">
        {/* Logo */}
        <div className="px-5 py-4 border-b border-[var(--color-grey-200)]">
          <div className="flex items-center justify-between">
            <Link href="/portal" className="flex items-center gap-3 group">
              <AKLogo variant="black" size={32} />
              <div>
                <span className="text-[14px] font-bold text-[var(--color-grey-900)] group-hover:text-[var(--color-primary)] transition-colors">
                  AK Golf
                </span>
                <p className="text-[9px] text-[var(--color-grey-400)] uppercase tracking-wider font-bold">
                  Academy
                </p>
              </div>
            </Link>
            <NotificationBell />
          </div>
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
              className="fixed inset-0 bg-[var(--color-grey-900)]/40 backdrop-blur-sm z-40 lg:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-72 flex flex-col z-50 lg:hidden bg-white border-r border-[var(--color-grey-200)]"
            >
              {/* Close button */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-grey-200)]">
                <div className="flex items-center gap-3">
                  <AKLogo variant="black" size={32} />
                  <div>
                    <span className="text-[14px] font-bold text-[var(--color-grey-900)]">AK Golf</span>
                    <p className="text-[9px] text-[var(--color-grey-400)] uppercase tracking-wider font-bold">Academy</p>
                  </div>
                </div>
                <button
                  onClick={close}
                  className="p-2 rounded-lg text-[var(--color-grey-400)] hover:text-[var(--color-grey-900)] hover:bg-[var(--color-grey-100)] transition-colors cursor-pointer"
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
