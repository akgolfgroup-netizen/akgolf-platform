"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
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
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { isStaff } from "@/lib/portal/rbac";
import type { PortalUser } from "@/lib/portal/auth";

const navItems = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/bookinger", label: "Mine Bookinger", icon: CalendarCheck },
  { href: "/portal/treningsplan", label: "Treningsplan", icon: Target },
  { href: "/portal/dagbok", label: "Treningsdagbok", icon: BookOpen },
  { href: "/portal/statistikk", label: "Statistikk", icon: BarChart3 },
  { href: "/portal/kalender", label: "Kalender", icon: Calendar },
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
  { href: "/portal/admin/denne-uken", label: "Denne uken", icon: CalendarCheck },
  { href: "/portal/admin/turneringer", label: "Turneringer", icon: ShieldCheck },
];

// Dark theme matching wireframe
const THEME = {
  bg: "#171717",
  bgHover: "#262626",
  bgActive: "#262626",
  gold: "#B8975C",
  white: "#FFFFFF",
  textMuted: "#A3A3A3",
  textDim: "#737373",
  border: "#333333",
};

interface SidebarProps {
  user: PortalUser;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push("/portal/login");
  }

  return (
    <aside
      className="fixed left-0 top-0 h-full w-60 flex flex-col z-20"
      style={{ background: THEME.bg }}
    >
      {/* Logo */}
      <div
        className="px-5 py-5"
        style={{ borderBottom: `1px solid ${THEME.border}` }}
      >
        <span className="text-lg font-bold text-white">AK Golf</span>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const active = pathname === item.href ||
              (item.href !== "/portal" && pathname.startsWith(`${item.href}/`));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all duration-150",
                    active
                      ? "text-white border-l-[3px] border-white"
                      : "text-[#A3A3A3] hover:text-white hover:bg-[#262626]"
                  )}
                  style={active ? { background: THEME.bgActive } : undefined}
                >
                  <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Konto section */}
        <div className="mt-4 pt-2">
          <p
            className="px-5 py-2 text-[11px] font-medium uppercase tracking-widest"
            style={{ color: THEME.textDim }}
          >
            Konto
          </p>
          <ul className="space-y-0.5">
            {accountItems.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all duration-150",
                      active
                        ? "text-white border-l-[3px] border-white"
                        : "text-[#A3A3A3] hover:text-white hover:bg-[#262626]"
                    )}
                    style={active ? { background: THEME.bgActive } : undefined}
                  >
                    <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
            <li>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all duration-150 text-[#A3A3A3] hover:text-white hover:bg-[#262626]"
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
              {staffItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all duration-150",
                        active
                          ? "text-white border-l-[3px] border-white"
                          : "text-[#A3A3A3] hover:text-white hover:bg-[#262626]"
                      )}
                      style={active ? { background: THEME.bgActive } : undefined}
                    >
                      <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
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
          style={{ background: "#404040" }}
        >
          {user.image ? (
            <img
              src={user.image}
              alt=""
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <User className="w-[18px] h-[18px] text-[#A3A3A3]" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white truncate">
            {user.name ?? "Spiller"}
          </p>
          <p className="text-xs text-[#737373] truncate">
            {user.email}
          </p>
        </div>
      </div>
    </aside>
  );
}
