"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  BarChart3,
  Target,
  Trophy,
  Settings,
  Menu,
  X,
  Clock,
  CreditCard,
} from "lucide-react";
import { AKLogo } from "@/components/website/AKLogo";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Oversikt", href: "/portal", icon: LayoutDashboard },
  { label: "Kalender", href: "/portal/kalender", icon: Calendar },
  { label: "Bookinger", href: "/portal/bookinger", icon: BookOpen },
  { label: "Treningsdagbok", href: "/portal/dagbok", icon: Target },
  { label: "Statistikk", href: "/portal/statistikk", icon: BarChart3 },
  { label: "Treningsplan", href: "/portal/treningsplan", icon: Trophy },
];

const ADMIN_ITEMS: NavItem[] = [
  { label: "Denne uken", href: "/portal/admin/denne-uken", icon: Calendar },
  { label: "Elever", href: "/portal/admin/elever", icon: BookOpen },
  { label: "Bookinger", href: "/portal/admin/bookinger", icon: Clock },
];

interface EliteDashboardProps {
  children: React.ReactNode;
  user: {
    name: string | null;
    email: string | null;
    role: string;
    avatarUrl?: string | null;
  };
}

export function EliteDashboard({ children, user }: EliteDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isAdmin = user.role === "ADMIN" || user.role === "INSTRUCTOR";

  return (
    <div className="min-h-screen bg-[var(--color-grey-100)]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-[260px]
          bg-white border-r border-[var(--color-grey-200)]
          transform transition-transform duration-300
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-grey-200)]">
          <Link href="/portal" className="cursor-pointer">
            <AKLogo variant="black" size={40} />
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg text-[var(--color-grey-400)] hover:text-[var(--color-grey-900)] hover:bg-[var(--color-grey-100)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          <p className="px-3 py-2 text-[10px] font-semibold text-[var(--color-grey-500)] uppercase tracking-wider">
            Meny
          </p>

          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== "/portal" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                  text-sm font-medium transition-colors duration-200
                  min-h-[44px] cursor-pointer
                  ${isActive
                    ? "bg-[var(--color-grey-100)] text-[var(--color-grey-900)]"
                    : "text-[var(--color-grey-500)] hover:bg-[var(--color-grey-100)] hover:text-[var(--color-grey-900)]"
                  }
                `}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[var(--color-grey-900)] rounded-r" />
                )}
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto px-2 py-0.5 text-[10px] font-semibold rounded-full bg-[var(--color-success)]/20 text-[var(--color-success)]">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Admin section */}
          {isAdmin && (
            <>
              <div className="pt-4">
                <p className="px-3 py-2 text-[10px] font-semibold text-[var(--color-grey-500)] uppercase tracking-wider">
                  Admin
                </p>
              </div>

              {ADMIN_ITEMS.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                      text-sm font-medium transition-colors duration-200
                      min-h-[44px] cursor-pointer
                      ${isActive
                        ? "bg-[var(--color-blue)]/10 text-[var(--color-blue)]"
                        : "text-[var(--color-grey-500)] hover:bg-[var(--color-grey-100)] hover:text-[var(--color-grey-900)]"
                      }
                    `}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[var(--color-blue)] rounded-r" />
                    )}
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-[var(--color-grey-200)]">
          <Link
            href="/portal/apper"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--color-grey-500)] hover:bg-[var(--color-grey-100)] hover:text-[var(--color-grey-900)] transition-colors cursor-pointer min-h-[44px]"
          >
            <CreditCard className="w-5 h-5" />
            <span>Apper</span>
          </Link>

          <Link
            href="/portal/profil"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--color-grey-500)] hover:bg-[var(--color-grey-100)] hover:text-[var(--color-grey-900)] transition-colors cursor-pointer min-h-[44px]"
          >
            <Settings className="w-5 h-5" />
            <span>Innstillinger</span>
          </Link>

          {/* User info */}
          <div className="flex items-center gap-3 px-3 py-3 mt-2 rounded-xl bg-[var(--color-grey-100)]">
            <div className="w-9 h-9 rounded-full bg-[var(--color-grey-200)] flex items-center justify-center">
              <span className="text-sm font-semibold text-[var(--color-grey-900)]">
                {user.name?.charAt(0) || user.email?.charAt(0) || "?"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--color-grey-900)] truncate">
                {user.name || "Bruker"}
              </p>
              <p className="text-xs text-[var(--color-grey-400)] truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-[260px] min-h-screen">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-md border-b border-[var(--color-grey-200)] lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-[var(--color-grey-400)] hover:text-[var(--color-grey-900)] hover:bg-[var(--color-grey-100)] cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <AKLogo variant="black" size={28} />

          <div className="w-9 h-9 rounded-full bg-[var(--color-grey-200)] flex items-center justify-center">
            <span className="text-sm font-semibold text-[var(--color-grey-900)]">
              {user.name?.charAt(0) || "?"}
            </span>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
