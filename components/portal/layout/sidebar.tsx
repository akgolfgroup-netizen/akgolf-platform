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
  Trophy,
  Calendar,
  CalendarCheck,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  NotebookPen,
  BarChart2,
  BarChart3,
  Users as UsersIcon,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { isStaff } from "@/lib/portal/rbac";
import type { PortalUser } from "@/lib/portal/auth";

const navItems = [
  { href: "/portal", label: "Oversikt", icon: LayoutDashboard },
  { href: "/portal/profil", label: "Min profil", icon: User },
  { href: "/portal/bookinger", label: "Bookinger", icon: CalendarDays },
  { href: "/portal/coaching-historikk", label: "Coachinghistorikk", icon: BookOpen },
  { href: "/portal/treningsplan", label: "Treningsplan", icon: Target },
  { href: "/portal/dagbok", label: "Dagbok", icon: NotebookPen },
  { href: "/portal/analyse", label: "Analyse", icon: BarChart2 },
  { href: "/portal/statistikk", label: "Statistikk", icon: BarChart3 },
  { href: "/portal/sammenligning", label: "Sammenligning", icon: UsersIcon },
  { href: "/portal/turneringsplan", label: "Turneringsplan", icon: Trophy },
  { href: "/portal/kalender", label: "Kalender", icon: Calendar },
];

const staffItems = [
  { href: "/portal/admin/kalender", label: "Kalender", icon: CalendarDays },
  { href: "/portal/admin/bookinger", label: "Bookinger", icon: CalendarPlus },
  { href: "/portal/admin/elever", label: "Elever", icon: UsersIcon },
  { href: "/portal/admin/tilgjengelighet", label: "Tilgjengelighet", icon: Clock },
  { href: "/portal/admin/denne-uken", label: "Denne uken", icon: CalendarCheck },
  { href: "/portal/admin/turneringer", label: "Turneringer", icon: ShieldCheck },
];

// Theme constants
const THEME = {
  bg: "#FAFBFC",
  bgElevated: "#FFFFFF",
  gold: "#B8975C",
  goldLight: "#E8D4B0",
  navy: "#0F2950",
  text: "#02060D",
  textSecondary: "#64748B",
  textTertiary: "#9CA3AF",
  border: "#EBE5DA",
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
      style={{
        background: THEME.bgElevated,
        borderRight: `1px solid ${THEME.border}`,
      }}
    >
      {/* Logo */}
      <div
        className="px-5 py-5"
        style={{ borderBottom: `1px solid ${THEME.border}` }}
      >
        <div className="flex items-center gap-3">
          <img
            src="/portal/ak-logo.svg"
            alt="AK Golf"
            className="w-10 h-10 rounded-xl flex-shrink-0"
          />
          <div>
            <p
              className="text-sm font-semibold leading-tight tracking-tight"
              style={{ color: THEME.navy }}
            >
              Golf Academy
            </p>
            <p
              className="text-[10px] font-medium uppercase tracking-widest mt-0.5"
              style={{ color: THEME.gold }}
            >
              Spillerportal
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p
          className="px-3 text-[10px] font-semibold uppercase tracking-widest mb-3"
          style={{ color: THEME.textTertiary }}
        >
          Meny
        </p>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href ||
              (item.href !== "/portal" && pathname.startsWith(`${item.href}/`));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                    active
                      ? "text-white"
                      : "hover:bg-gray-50"
                  )}
                  style={active ? {
                    background: `linear-gradient(135deg, ${THEME.gold}, ${THEME.goldLight})`,
                    boxShadow: "0 4px 12px rgba(184,151,92,0.25)",
                  } : { color: THEME.textSecondary }}
                >
                  <item.icon
                    className={cn(
                      "w-4 h-4 flex-shrink-0 transition-colors",
                      active ? "text-white" : "text-current group-hover:text-[#B8975C]"
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}

          {isStaff(user.role) && (
            <>
              <li className="pt-4 pb-2">
                <p
                  className="px-3 text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: THEME.textTertiary }}
                >
                  Admin
                </p>
              </li>
              {staffItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                        active
                          ? "text-white"
                          : "hover:bg-gray-50"
                      )}
                      style={active ? {
                        background: `linear-gradient(135deg, ${THEME.gold}, ${THEME.goldLight})`,
                        boxShadow: "0 4px 12px rgba(184,151,92,0.25)",
                      } : { color: THEME.textSecondary }}
                    >
                      <item.icon
                        className={cn(
                          "w-4 h-4 flex-shrink-0",
                          active ? "text-white" : "text-current"
                        )}
                      />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </>
          )}
        </ul>
      </nav>

      {/* User footer */}
      <div
        className="mx-4 mb-4 p-4 rounded-2xl"
        style={{
          background: THEME.bg,
          border: `1px solid ${THEME.border}`,
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          {user.image ? (
            <img
              src={user.image}
              alt=""
              className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border-2"
              style={{ borderColor: THEME.border }}
            />
          ) : (
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${THEME.gold}, ${THEME.goldLight})` }}
            >
              {user.name?.charAt(0) ?? "?"}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p
              className="text-sm font-semibold truncate leading-tight"
              style={{ color: THEME.navy }}
            >
              {user.name}
            </p>
            <p
              className="text-[10px] truncate capitalize mt-0.5"
              style={{ color: THEME.textTertiary }}
            >
              {user.role?.toLowerCase()}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all duration-200 hover:bg-white"
          style={{ color: THEME.textSecondary }}
        >
          <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
          Logg ut
        </button>
      </div>
    </aside>
  );
}
