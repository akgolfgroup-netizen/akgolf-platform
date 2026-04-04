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
  TrendingUp,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { isStaff } from "@/lib/portal/rbac";
import type { PortalUser } from "@/lib/portal/auth";
import { useSidebar } from "./sidebar-context";
import { AKLogo } from "@/components/website/AKLogo";

const navItems = [
  { href: "/portal", label: "Oversikt", icon: LayoutDashboard },
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
  { href: "/portal/admin/fasiliteter", label: "Fasiliteter", icon: MapPin },
  { href: "/portal/admin/elever", label: "Elever", icon: UsersIcon },
  { href: "/portal/admin/tilgjengelighet", label: "Tilgjengelighet", icon: Clock },
  { href: "/portal/admin/kapasitet", label: "Kapasitet", icon: BarChart3 },
  { href: "/portal/admin/analytics", label: "Analyse", icon: TrendingUp },
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
          whileHover={{ x: 2 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "flex items-center gap-3 px-4 py-2 mx-3 rounded-lg text-[13px] font-medium transition-[background-color,color] duration-200",
            active
              ? "bg-[#F5F5F7] text-[#1D1D1F] font-semibold"
              : "text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]"
          )}
        >
          <div className={cn(
            "w-[18px] h-[18px] rounded-[5px] flex items-center justify-center transition-colors shrink-0",
            active ? "bg-[#1D1D1F]" : ""
          )}>
            <item.icon className={cn(
              "w-3.5 h-3.5 transition-colors",
              active ? "text-white" : "text-[#86868B] group-hover:text-[#1D1D1F]"
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
      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#D2D2D7]">
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
                className="flex items-center gap-3 px-4 py-2.5 mx-3 rounded-lg text-sm font-medium text-[#6E6E73] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10 transition-[background-color,color] duration-200"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#E8E8ED] group-hover:bg-[var(--color-error)]/20 transition-colors">
                  <LogOut className="w-4 h-4 text-[#86868B] group-hover:text-[var(--color-error)] transition-colors" />
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
      <div className="p-4 mx-3 mb-3 rounded-xl bg-[#F5F5F7] border border-[#E8E8ED]">
        <div className="flex items-center gap-3">
          <div className="relative">
            {user.image ? (
              <img
                src={user.image}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#1D1D1F] flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {(user.name ?? "S")[0].toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#1D1D1F] truncate">
              {user.name ?? "Spiller"}
            </p>
            <p className="text-xs font-medium text-[var(--color-brand)] truncate">
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
      <aside className="fixed left-0 top-0 h-full w-[220px] hidden lg:flex flex-col z-20 bg-white border-r border-[#E8E8ED]">
        {/* Logo */}
        <div className="px-5 py-4 border-b border-[#E8E8ED]">
          <Link href="/portal" className="flex items-center gap-3 group">
            <AKLogo variant="black" size={32} />
            <div>
              <span className="text-[14px] font-bold text-[#1D1D1F] group-hover:text-[#86868B] transition-colors">
                AK Golf
              </span>
              <p className="text-[9px] text-[#86868B] uppercase tracking-wider font-bold">
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
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-72 flex flex-col z-50 lg:hidden bg-white border-r border-[#E8E8ED]"
            >
              {/* Close button */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E8ED]">
                <div className="flex items-center gap-3">
                  <AKLogo variant="black" size={32} />
                  <div>
                    <span className="text-[14px] font-bold text-[#1D1D1F]">AK Golf</span>
                    <p className="text-[9px] text-[#86868B] uppercase tracking-wider font-bold">Academy</p>
                  </div>
                </div>
                <button
                  onClick={close}
                  className="p-2 rounded-lg text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors cursor-pointer"
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
