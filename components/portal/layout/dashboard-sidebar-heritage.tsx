/**
 * AK Sports OS — Heritage Tech Dashboard Sidebar
 * Dark mode default with Heritage Green + Electric Lime accents
 * 
 * Features:
 * - Bento-grid navigation structure
 * - Role-based access (Student / Instructor / Admin / Multi-sport Coach)
 * - Heritage Tech color scheme
 * - Glow effects on active items
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Target,
  Zap,
  Calendar,
  Users,
  Trophy,
  BarChart3,
  Settings,
  ChevronLeft,
  LogOut,
  Crown,
  Activity,
  MapPin,
  ClipboardList,
  Sparkles,
  Menu,
  TrendingUp,
  School,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════════════════════
// HERITAGE TECH TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

const heritage = {
  colors: {
    deep: '#2D5A27',
    darker: '#1A3520',
    base: '#2D5A27',
    light: '#3D7A37',
    lime: '#DFFF00',
    limeDark: '#B8D400',
    limeMuted: 'rgba(223, 255, 0, 0.12)',
    graphite: '#2A2D2A',
    charcoal: '#3A3D3A',
    ink: '#1A1D1A',
    pure: '#0A0D0A',
    cream: '#F5F1E8',
    warmGrey: '#8A8680',
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION CONFIGURATION (AK Sports OS Structure)
// ═══════════════════════════════════════════════════════════════════════════════

type UserRole = "STUDENT" | "COACH" | "ADMIN" | "FACILITY_MANAGER";
type ModuleType = "academy" | "wang" | "facility";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  module: ModuleType;
}

interface NavSection {
  title: string;
  module: ModuleType;
  items: NavItem[];
}

const navigationConfig: NavSection[] = [
  {
    title: "Academy",
    module: "academy",
    items: [
      { label: "Dashboard", href: "/portal", icon: LayoutDashboard, module: "academy" },
      { label: "TrackMan", href: "/portal/trackman", icon: Target, module: "academy" },
      { label: "Coaching", href: "/portal/coaching", icon: Zap, module: "academy" },
      { label: "Statistikk", href: "/portal/stats", icon: BarChart3, module: "academy" },
      { label: "AI Coach", href: "/portal/ai", icon: Sparkles, badge: 2, module: "academy" },
    ],
  },
  {
    title: "Wang Hub",
    module: "wang",
    items: [
      { label: "Oversikt", href: "/portal/wang", icon: School, module: "wang" },
      { label: "Idretter", href: "/portal/wang/sports", icon: Activity, module: "wang" },
      { label: "Elever", href: "/portal/wang/students", icon: Users, module: "wang" },
      { label: "Turneringer", href: "/portal/wang/tournaments", icon: Trophy, module: "wang" },
      { label: "Belastning", href: "/portal/wang/load", icon: TrendingUp, module: "wang" },
    ],
  },
  {
    title: "Facility OS",
    module: "facility",
    items: [
      { label: "Anlegg", href: "/portal/facility", icon: Building2, module: "facility" },
      { label: "Kart", href: "/portal/facility/map", icon: MapPin, module: "facility" },
      { label: "Sponsor", href: "/portal/facility/sponsors", icon: Crown, module: "facility" },
      { label: "HMS", href: "/portal/facility/hms", icon: ClipboardList, module: "facility" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const ModuleIndicator = ({ module }: { module: ModuleType }) => {
  const colors = {
    academy: heritage.colors.lime,
    wang: '#00D4FF',
    facility: heritage.colors.deep,
  };

  return (
    <div 
      className="w-2 h-2 rounded-full"
      style={{ backgroundColor: colors[module] }}
    />
  );
};

const Logo = ({ collapsed }: { collapsed: boolean }) => (
  <div className="flex items-center gap-3 px-2">
    <div 
      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ 
        backgroundColor: heritage.colors.deep,
        boxShadow: `0 0 20px ${heritage.colors.deep}80`
      }}
    >
      <Crown className="w-5 h-5" style={{ color: heritage.colors.lime }} />
    </div>
    <AnimatePresence>
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          <span className="font-semibold text-white tracking-tight">AK Sports</span>
          <span className="block text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: heritage.colors.lime }}>
            OS
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const NavItemComponent = ({
  item,
  collapsed,
  isActive,
}: {
  item: NavItem;
  collapsed: boolean;
  isActive: boolean;
}) => {
  const Icon = item.icon;

  return (
    <Link href={item.href} className="block relative group">
      <motion.div
        whileHover={{ x: 2 }}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
          isActive ? "font-medium" : "hover:bg-white/5"
        )}
        style={{
          backgroundColor: isActive ? heritage.colors.limeMuted : "transparent",
        }}
      >
        <div className="relative flex-shrink-0">
          <Icon 
            className="w-5 h-5 transition-colors" 
            style={{ color: isActive ? heritage.colors.lime : heritage.colors.warmGrey }} 
          />
          {item.badge && (
            <span
              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
              style={{ backgroundColor: heritage.colors.lime, color: heritage.colors.pure }}
            >
              {item.badge}
            </span>
          )}
        </div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 overflow-hidden"
            >
              <span 
                className="text-sm whitespace-nowrap"
                style={{ color: isActive ? heritage.colors.cream : heritage.colors.warmGrey }}
              >
                {item.label}
              </span>
              <ModuleIndicator module={item.module} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 w-1 h-6 rounded-full"
            style={{ backgroundColor: heritage.colors.lime }}
            initial={false}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </motion.div>
    </Link>
  );
};

const SectionTitle = ({ title, collapsed }: { title: string; collapsed: boolean }) => (
  <AnimatePresence>
    {!collapsed && (
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="px-3 mb-2 text-[10px] font-bold tracking-wider uppercase"
        style={{ color: heritage.colors.warmGrey }}
      >
        {title}
      </motion.h3>
    )}
  </AnimatePresence>
);

const UserProfile = ({
  userName,
  userImage,
  collapsed,
  onLogout,
}: {
  userName: string;
  userImage?: string;
  collapsed: boolean;
  onLogout?: () => void;
}) => (
  <div className="px-2">
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl transition-colors",
        collapsed ? "justify-center" : "justify-between"
      )}
      style={{ backgroundColor: heritage.colors.charcoal }}
    >
      <div className="flex items-center gap-3">
        {userImage ? (
          <img
            src={userImage}
            alt={userName}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: heritage.colors.limeMuted }}
          >
            <span 
              className="font-semibold text-sm"
              style={{ color: heritage.colors.lime }}
            >
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden"
            >
              <p className="text-sm font-semibold text-white truncate">
                {userName}
              </p>
              <p className="text-xs" style={{ color: heritage.colors.warmGrey }}>
                Premium
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {!collapsed && onLogout && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onLogout}
            className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
            style={{ color: heritage.colors.warmGrey }}
          >
            <LogOut className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SIDEBAR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function HeritageDashboardSidebar({
  userRole = "STUDENT",
  userName,
  userImage,
  onLogout,
}: {
  userRole: UserRole;
  userName: string;
  userImage?: string;
  onLogout?: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const sidebarWidth = collapsed ? 80 : 280;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl"
        style={{ 
          backgroundColor: heritage.colors.charcoal,
          border: `1px solid rgba(223, 255, 0, 0.2)`
        }}
      >
        <Menu className="w-6 h-6" style={{ color: heritage.colors.lime }} />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarWidth,
          x: mobileOpen ? 0 : -sidebarWidth,
        }}
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 flex flex-col",
          "border-r transition-shadow"
        )}
        style={{
          backgroundColor: heritage.colors.ink,
          borderColor: 'rgba(255, 255, 255, 0.06)',
          boxShadow: mobileOpen ? `0 0 40px rgba(0,0,0,0.5)` : 'none',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 h-20">
          <Logo collapsed={collapsed} />
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg transition-colors hover:bg-white/10"
            style={{ color: heritage.colors.warmGrey }}
          >
            <ChevronLeft 
              className={cn(
                "w-4 h-4 transition-transform",
                collapsed && "rotate-180"
              )} 
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
          {navigationConfig.map((section) => (
            <div key={section.title}>
              <SectionTitle title={section.title} collapsed={collapsed} />
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavItemComponent
                    key={item.href}
                    item={item}
                    collapsed={collapsed}
                    isActive={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Settings Link */}
        <div className="px-3 py-4 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}>
          <Link href="/portal/settings" className="block">
            <motion.div
              whileHover={{ x: 2 }}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-white/5",
                pathname === "/portal/settings" && "font-medium"
              )}
              style={{
                backgroundColor: pathname === "/portal/settings" ? heritage.colors.limeMuted : "transparent",
              }}
            >
              <Settings 
                className="w-5 h-5 flex-shrink-0" 
                style={{ color: pathname === "/portal/settings" ? heritage.colors.lime : heritage.colors.warmGrey }}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-sm whitespace-nowrap"
                    style={{ color: pathname === "/portal/settings" ? heritage.colors.cream : heritage.colors.warmGrey }}
                  >
                    Innstillinger
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}>
          <UserProfile
            userName={userName}
            userImage={userImage}
            collapsed={collapsed}
            onLogout={onLogout}
          />
        </div>
      </motion.aside>

      {/* Desktop Spacer */}
      <div
        className="hidden lg:block flex-shrink-0 transition-all duration-300"
        style={{ width: sidebarWidth }}
      />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD LAYOUT WRAPPER
// ═══════════════════════════════════════════════════════════════════════════════

export function HeritageDashboardLayout({
  children,
  userRole = "STUDENT",
  userName = "Anders Kristiansen",
  userImage,
  onLogout,
}: {
  children: React.ReactNode;
  userRole?: UserRole;
  userName?: string;
  userImage?: string;
  onLogout?: () => void;
}) {
  return (
    <div 
      className="min-h-screen flex"
      style={{ backgroundColor: heritage.colors.pure }}
    >
      <HeritageDashboardSidebar
        userRole={userRole}
        userName={userName}
        userImage={userImage}
        onLogout={onLogout}
      />
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header
          className="sticky top-0 z-30 px-6 lg:px-8 py-4 backdrop-blur-xl border-b"
          style={{
            backgroundColor: 'rgba(10, 13, 10, 0.8)',
            borderColor: 'rgba(255, 255, 255, 0.06)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-white hidden lg:block">
                Dashboard
              </h1>
              <div 
                className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2"
                style={{ 
                  backgroundColor: heritage.colors.limeMuted,
                  color: heritage.colors.lime
                }}
              >
                <Zap className="w-3 h-3" />
                20-min modus
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm" style={{ color: heritage.colors.warmGrey }}>
                {new Date().toLocaleDateString("no-NO", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

export default HeritageDashboardSidebar;
