"use client";

/**
 * Portal Sidebar — Sprint 0 HQ Foundation (lys variant).
 *
 * Bakgrunn: hvit (#FFFFFF), border-right: 1px #F0EDE5
 * Active: pill rgba(0,88,64,0.08), 12px radius, tekst #005840
 * Muted tekst: #5E5C57
 */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  ClipboardList,
  Calendar,
  BarChart3,
  User,
  LogOut,
  X,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import type { PortalUser } from "@/lib/portal/auth";
import { useSidebar } from "./sidebar-context";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  matchPaths?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "/portal/treningsplan",
    label: "Treningsplan",
    icon: ClipboardList,
    matchPaths: ["/portal/treningsplan/uke", "/portal/treningsplan/analyse", "/portal/treningsplan/live-session"],
  },
  {
    href: "/portal/teknisk-plan",
    label: "Teknisk Plan",
    icon: Wrench,
  },
  {
    href: "/portal/bookinger",
    label: "Bookinger",
    icon: Calendar,
    matchPaths: ["/portal/bookinger/ny", "/portal/bookinger/venteliste"],
  },
  {
    href: "/portal/statistikk",
    label: "Statistikk",
    icon: BarChart3,
  },
];

function NavLink({
  item,
  pathname,
  onClick,
}: {
  item: NavItem;
  pathname: string;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  const isExactHome = item.href === "/portal" && pathname === "/portal";
  const isSubMatch = item.href !== "/portal" && pathname.startsWith(item.href);
  const isExtraMatch = item.matchPaths?.some((p) => pathname.startsWith(p));
  const active = isExactHome || isSubMatch || (isExtraMatch ?? false);

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 mx-3 px-3 py-2.5 text-[13px] font-medium transition-colors",
        active
          ? "text-[#005840]"
          : "text-[#5E5C57] hover:text-[#0A1F18]",
      )}
      style={{
        borderRadius: 12,
        background: active ? "rgba(0,88,64,0.08)" : "transparent",
      }}
    >
      <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.75} />
      <span>{item.label}</span>
    </Link>
  );
}

function SidebarBody({
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
  const displayName = user.name ?? user.email ?? "Spiller";
  const initials = displayName
    .split(/[\s@]/)[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {/* Header */}
      <div className="px-5 mb-6">
        <Link
          href="/portal"
          onClick={onNavClick}
          className="flex items-center gap-2.5"
          aria-label="AK Golf — Hjem"
        >
          <span
            className="w-8 h-8 rounded-lg grid place-items-center font-bold text-[12px]"
            style={{
              background: "#005840",
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
            }}
          >
            AK
          </span>
          <span
            className="text-[14px] font-medium"
            style={{ color: "#0A1F18", letterSpacing: "-0.01em" }}
          >
            AK Golf
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            pathname={pathname}
            onClick={onNavClick}
          />
        ))}
      </nav>

      {/* Bottom: profil + logg ut */}
      <div className="px-3 mt-auto pt-4" style={{ borderTop: "1px solid #F0EDE5" }}>
        <div className="flex items-center gap-2.5 px-3 py-2.5 mb-1">
          <span
            className="w-8 h-8 rounded-full grid place-items-center text-[11px] font-bold shrink-0"
            style={{ background: "#005840", color: "#FFFFFF" }}
          >
            {initials}
          </span>
          <span className="text-[13px] font-medium text-[#0A1F18] truncate">
            {displayName}
          </span>
        </div>

        <div className="space-y-0.5">
          <Link
            href="/portal/profil"
            onClick={onNavClick}
            className="flex items-center gap-3 px-3 py-2 text-[12px] font-medium text-[#5E5C57] hover:text-[#0A1F18] transition-colors"
            style={{ borderRadius: 12 }}
          >
            <User className="w-4 h-4" strokeWidth={1.75} />
            <span>Profil</span>
          </Link>
          <button
            onClick={() => {
              onSignOut();
              onNavClick?.();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-[12px] font-medium text-[#5E5C57] hover:text-[#0A1F18] transition-colors"
            style={{ borderRadius: 12 }}
          >
            <LogOut className="w-4 h-4" strokeWidth={1.75} />
            <span>Logg ut</span>
          </button>
        </div>
      </div>
    </>
  );
}

interface SidebarProps {
  user: PortalUser;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, close } = useSidebar();

  async function handleSignOut() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    await supabase.auth.signOut();
    router.push("/portal/login");
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="h-screen w-60 fixed left-0 top-0 flex-col py-6 gap-y-4 z-40 hidden lg:flex"
        style={{
          background: "#FFFFFF",
          borderRight: "1px solid #F0EDE5",
        }}
      >
        <SidebarBody user={user} pathname={pathname} onSignOut={handleSignOut} />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 z-40 bg-[#0A1F18]/30 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.32 }}
              className="fixed left-0 top-0 z-50 flex h-screen w-60 flex-col py-6 gap-y-4 lg:hidden"
              style={{
                background: "#FFFFFF",
                borderRight: "1px solid #F0EDE5",
              }}
            >
              <button
                onClick={close}
                className="absolute right-3 top-3 rounded-lg p-2 text-[#5E5C57] hover:text-[#0A1F18] transition-colors"
                aria-label="Lukk meny"
              >
                <X className="w-5 h-5" strokeWidth={1.75} />
              </button>
              <SidebarBody
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
