/**
 * AK Golf Academy — Dashboard Sidebar
 * "Quiet Luxury" Aesthetic — Command Center Navigation
 * 
 * Features:
 * - Collapsible sidebar (280px expanded, 72px collapsed)
 * - Role-based navigation (Student vs Instructor vs Admin)
 * - Brand-compliant color scheme
 * - Smooth Framer Motion animations
 * - Active state indicators
 * 
 * Color Palette:
 * - Deep Navy #0A1F44 for institutional elements
 * - Forest Green #1B4D3E for academy elements  
 * - Gold #D4AF37 for highlights and CTAs
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Target,
  TrendingUp,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  BarChart3,
  Award,
  MessageSquare,
  ClipboardList,
  Sparkles,
  Zap,
  Menu,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

const colors = {
  // Institutional
  deepNavy: "#0A1F44",
  deepNavyLight: "#1A3A6B",
  
  // Academy
  forestGreen: "#1B4D3E",
  forestGreenLight: "#005840",
  forestGreenMuted: "#EDF5F0",
  
  // Accent
  gold: "#D4AF37",
  goldLight: "#E8D991",
  
  // Neutrals
  white: "#FFFFFF",
  silver: "#ECF0EF",
  silverLight: "#D5DFDB",
  grey400: "#7A8C85",
  grey500: "#5A6E66",
  grey600: "#48484A",
  grey800: "#2C2C2E",
  grey900: "#0A1F18",
};

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

type UserRole = "STUDENT" | "INSTRUCTOR" | "ADMIN";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  roles: UserRole[];
}

interface NavSection {
  title: string;
  items: NavItem[];
  roles: UserRole[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAUNCH MODE: Kun aktiverte funksjoner vises
// ═══════════════════════════════════════════════════════════════════════════════
const navigationConfig: NavSection[] = [
  {
    title: "Oversikt",
    roles: ["STUDENT", "INSTRUCTOR", "ADMIN"],
    items: [
      { label: "Mine bookinger", href: "/portal/bookinger", icon: BookOpen, roles: ["STUDENT", "INSTRUCTOR", "ADMIN"] },
    ],
  },
  {
    title: "Planlegging",
    roles: ["STUDENT", "INSTRUCTOR", "ADMIN"],
    items: [
      { label: "Treningsplan", href: "/portal/treningsplan", icon: Zap, roles: ["STUDENT", "INSTRUCTOR", "ADMIN"] },
    ],
  },
  // Admin-seksjon kun for instruktører
  {
    title: "Admin",
    roles: ["INSTRUCTOR", "ADMIN"],
    items: [
      { label: "Administrer bookinger", href: "/portal/admin/bookinger", icon: Calendar, roles: ["INSTRUCTOR", "ADMIN"] },
      { label: "Elever", href: "/portal/admin/elever", icon: Users, roles: ["INSTRUCTOR", "ADMIN"] },
    ],
  },
];

// TODO: Full navigasjon (aktiver etter launch)
// const fullNavigationConfig: NavSection[] = [
//   {
//     title: "Oversikt",
//     roles: ["STUDENT", "INSTRUCTOR", "ADMIN"],
//     items: [
//       { label: "Dashboard", href: "/portal", icon: LayoutDashboard, roles: ["STUDENT", "INSTRUCTOR", "ADMIN"] },
//       { label: "Kalender", href: "/portal/kalender", icon: Calendar, badge: 2, roles: ["STUDENT", "INSTRUCTOR", "ADMIN"] },
//       { label: "Mine bookinger", href: "/portal/bookinger", icon: BookOpen, roles: ["STUDENT", "INSTRUCTOR", "ADMIN"] },
//     ],
//   },
//   {
//     title: "Utvikling",
//     roles: ["STUDENT", "INSTRUCTOR", "ADMIN"],
//     items: [
//       { label: "TrackMan Data", href: "/portal/trackman", icon: Target, roles: ["STUDENT", "INSTRUCTOR", "ADMIN"] },
//       { label: "Coaching-historikk", href: "/portal/coaching-historikk", icon: ClipboardList, roles: ["STUDENT", "INSTRUCTOR", "ADMIN"] },
//       { label: "Statistikk", href: "/portal/statistikk", icon: TrendingUp, roles: ["STUDENT", "INSTRUCTOR", "ADMIN"] },
//       { label: "Treningsdagbok", href: "/portal/dagbok", icon: Award, roles: ["STUDENT", "INSTRUCTOR", "ADMIN"] },
//     ],
//   },
//   {
//     title: "Planlegging",
//     roles: ["STUDENT", "INSTRUCTOR", "ADMIN"],
//     items: [
//       { label: "Treningsplan", href: "/portal/treningsplan", icon: Zap, roles: ["STUDENT", "INSTRUCTOR", "ADMIN"] },
//       { label: "Turneringsplan", href: "/portal/turneringer", icon: Trophy, roles: ["STUDENT", "INSTRUCTOR", "ADMIN"] },
//       { label: "AI Coach", href: "/portal/ai-coach", icon: Sparkles, badge: 1, roles: ["STUDENT", "INSTRUCTOR", "ADMIN"] },
//     ],
//   },
//   {
//     title: "Admin — Mission Control",
//     roles: ["INSTRUCTOR", "ADMIN"],
//     items: [
//       { label: "Analytics", href: "/portal/admin/analytics", icon: BarChart3, roles: ["INSTRUCTOR", "ADMIN"] },
//       { label: "Elever", href: "/portal/admin/elever", icon: Users, roles: ["INSTRUCTOR", "ADMIN"] },
//       { label: "Administrer bookinger", href: "/portal/admin/bookinger", icon: Calendar, badge: 5, roles: ["INSTRUCTOR", "ADMIN"] },
//       { label: "Meldinger", href: "/portal/admin/meldinger", icon: MessageSquare, badge: 3, roles: ["INSTRUCTOR", "ADMIN"] },
//     ],
//   },
// ];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

interface DashboardSidebarProps {
  userRole: UserRole;
  userName: string;
  userImage?: string;
  onLogout?: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const Logo = ({ collapsed }: { collapsed: boolean }) => (
  <div className="flex items-center gap-3 px-2">
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: colors.forestGreen }}
    >
      <span className="text-white font-semibold text-lg">AK</span>
    </div>
    <AnimatePresence>
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <span className="font-semibold text-base tracking-tight whitespace-nowrap" style={{ color: colors.deepNavy }}>
            AK Golf
          </span>
          <span className="block text-xs font-light whitespace-nowrap" style={{ color: colors.grey500 }}>
            Portal
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
          isActive
            ? "font-medium"
            : "hover:bg-gray-50"
        )}
        style={{
          backgroundColor: isActive ? colors.forestGreenMuted : "transparent",
          color: isActive ? colors.forestGreen : colors.grey600,
        }}
      >
        <div className="relative flex-shrink-0">
          <Icon className="w-5 h-5" />
          {item.badge && (
            <span
              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[10px] font-semibold flex items-center justify-center"
              style={{ backgroundColor: colors.gold, color: colors.deepNavy }}
            >
              {item.badge}
            </span>
          )}
        </div>

        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm whitespace-nowrap overflow-hidden font-light"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 w-1 h-6 rounded-full"
            style={{ backgroundColor: colors.forestGreen }}
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
        className="px-3 mb-2 text-[10px] font-semibold tracking-wider uppercase"
        style={{ color: colors.grey400 }}
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
      style={{ backgroundColor: colors.silver }}
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
            style={{ backgroundColor: colors.forestGreenMuted }}
          >
            <span style={{ color: colors.forestGreen }} className="font-medium text-sm">
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
              <p className="text-sm font-medium truncate" style={{ color: colors.grey900 }}>
                {userName}
              </p>
              <p className="text-xs font-light" style={{ color: colors.grey500 }}>
                Elev
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
            className="p-1.5 rounded-lg transition-colors hover:bg-gray-200"
            style={{ color: colors.grey500 }}
          >
            <LogOut className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function DashboardSidebar({
  userRole = "STUDENT",
  userName,
  userImage,
  onLogout,
}: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Filter navigation based on user role
  const filteredSections = navigationConfig.filter((section) =>
    section.roles.includes(userRole)
  );

  const sidebarWidth = collapsed ? 80 : 280;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md"
        style={{ color: colors.deepNavy }}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
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
          "border-r bg-white transition-shadow"
        )}
        style={{
          borderColor: colors.silverLight,
          boxShadow: mobileOpen ? "0 0 40px rgba(0,0,0,0.1)" : "none",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 h-20">
          <Logo collapsed={collapsed} />
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg transition-colors hover:bg-gray-100"
            style={{ color: colors.grey500 }}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
          {filteredSections.map((section) => (
            <div key={section.title}>
              <SectionTitle title={section.title} collapsed={collapsed} />
              <div className="space-y-1">
                {section.items
                  .filter((item) => item.roles.includes(userRole))
                  .map((item) => (
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

        {/* Min Profil Link */}
        <div className="px-3 py-4 border-t" style={{ borderColor: colors.silverLight }}>
          <Link href="/portal/profil" className="block">
            <motion.div
              whileHover={{ x: 2 }}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-gray-50",
                pathname === "/portal/profil" && "font-medium"
              )}
              style={{
                backgroundColor: pathname === "/portal/profil" ? colors.forestGreenMuted : "transparent",
                color: pathname === "/portal/profil" ? colors.forestGreen : colors.grey600,
              }}
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-sm whitespace-overflow font-light"
                  >
                    Min profil
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t" style={{ borderColor: colors.silverLight }}>
          <UserProfile
            userName={userName}
            userImage={userImage}
            collapsed={collapsed}
            onLogout={onLogout}
          />
        </div>
      </motion.aside>

      {/* Desktop: Spacer for fixed sidebar */}
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

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: UserRole;
  userName?: string;
  userImage?: string;
  onLogout?: () => void;
}

export function DashboardLayout({
  children,
  userRole = "STUDENT",
  userName = "Anders Kristiansen",
  userImage,
  onLogout,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: colors.silver }}>
      <DashboardSidebar
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
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderColor: colors.silverLight,
          }}
        >
          <div className="flex items-center justify-between">
            <h1
              className="text-xl font-semibold tracking-tight hidden lg:block"
              style={{ color: colors.deepNavy }}
            >
              Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm font-light" style={{ color: colors.grey500 }}>
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

export default DashboardSidebar;
