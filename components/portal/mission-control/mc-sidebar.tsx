"use client";

/**
 * MC Sidebar — Heritage Grid 1:1 (admin-variant).
 *
 * Kilde: design-ref/stitch/heritage/admin_player_management/code.html (linjer 1-40 av <aside>)
 *
 * Spec:
 * - Container: h-screen w-64 fixed bg-emerald-950 flex-col py-8 px-4
 * - Header: mb-10 px-4, h1 text-xl font-bold tracking-widest text-white,
 *   p text-xs font-medium uppercase text-emerald-100/50
 * - Nav: flex-1 space-y-2
 * - Active: bg-lime-400 text-emerald-950 font-bold rounded-lg px-4 py-3 text-sm uppercase tracking-tight
 * - Inactive: text-emerald-100/70 hover:text-white hover:bg-emerald-900/50
 * - Bottom: mt-auto pt-6 border-t border-emerald-900/50 px-4
 * - Bruker beholder grupper (8 i MC_NAV_CONFIG) — Heritage har flat nav men vi må tilpasse
 * - Gruppe-label: text-[10px] text-emerald-100/40 uppercase tracking-[0.12em]
 */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { MC_NAV_CONFIG, type NavGroup, type NavItem } from "./mc-nav-config";
import { canAccessMCPage, isAdmin, isStaff } from "@/lib/portal/rbac";

// Map iconName (lowercase hyphen) → Material Symbol navn (snake_case)
const ICON_MAP: Record<string, string> = {
  target: "my_location",
  zap: "bolt",
  calendar: "calendar_today",
  "calendar-days": "calendar_month",
  "clipboard-list": "assignment",
  "clipboard-check": "task_alt",
  "check-circle": "check_circle",
  clock: "schedule",
  users: "group",
  "file-text": "description",
  "notebook-pen": "edit_note",
  "message-square": "chat",
  mail: "mail",
  bell: "notifications",
  sparkles: "auto_awesome",
  bot: "smart_toy",
  "bar-chart": "bar_chart",
  "gauge-circle": "speed",
  wallet: "account_balance_wallet",
  "layout-dashboard": "dashboard",
  "building-2": "business",
  trophy: "emoji_events",
};

interface MCSidebarProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    image?: string | null;
  };
  isOpen?: boolean;
  onClose?: () => void;
}

function NavLink({
  item,
  isActive,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  onClick?: () => void;
}) {
  const materialIcon = ICON_MAP[item.iconName] ?? "circle";

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg tracking-tight text-sm uppercase transition-colors",
        isActive
          ? "bg-lime-400 text-emerald-950 font-bold"
          : "text-emerald-100/70 hover:text-white hover:bg-emerald-900/50 font-medium",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon name={materialIcon} size={20} filled={isActive} />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function NavGroupComponent({
  group,
  pathname,
  userRole,
  onClick,
}: {
  group: NavGroup;
  pathname: string;
  userRole?: string;
  onClick?: () => void;
}) {
  const accessibleItems = group.items.filter((item) => {
    const pageName = item.href.split("/").pop() || "hub";
    return canAccessMCPage(userRole, pageName as never);
  });

  if (accessibleItems.length === 0) return null;

  return (
    <div className="space-y-1 mb-4">
      <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-100/40">
        {group.label}
      </div>
      <div className="space-y-1">
        {accessibleItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));
          return (
            <NavLink
              key={item.href}
              item={item}
              isActive={isActive}
              onClick={onClick}
            />
          );
        })}
      </div>
    </div>
  );
}

function SidebarHeader() {
  return (
    <div className="mb-8 px-4">
      <h1 className="text-xl font-bold tracking-widest text-white">AK Golf</h1>
      <p className="text-xs font-medium uppercase tracking-tight text-emerald-100/50 mt-1">
        Mission Control
      </p>
    </div>
  );
}

function SidebarBottom({
  user,
  onSignOut,
}: {
  user: MCSidebarProps["user"];
  onSignOut: () => void;
}) {
  const initial = (user.name ?? user.email ?? "U")[0].toUpperCase();
  const roleLabel = isAdmin(user.role)
    ? "Admin"
    : isStaff(user.role)
      ? "Instruktør"
      : "Invitert";

  return (
    <div className="mt-auto pt-6 border-t border-emerald-900/50 px-4">
      {/* User-info + logout */}
      <div className="flex items-center gap-3 mb-4 px-4">
        <div className="w-9 h-9 rounded-full bg-emerald-900 text-lime-400 flex items-center justify-center text-sm font-bold shrink-0">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white truncate">
            {user.name ?? "Bruker"}
          </div>
          <div className="text-[10px] text-emerald-100/50 uppercase tracking-widest truncate">
            {roleLabel}
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <Link
          href="/portal"
          className="flex items-center gap-3 px-4 py-2 text-[11px] font-medium tracking-widest uppercase text-emerald-100/70 hover:text-white transition-colors"
        >
          <Icon name="home" size={18} />
          <span>Til portal</span>
        </Link>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-4 py-2 text-[11px] font-medium tracking-widest uppercase text-emerald-100/70 hover:text-white transition-colors"
        >
          <Icon name="logout" size={18} />
          <span>Logg ut</span>
        </button>
      </div>
    </div>
  );
}

function SidebarBody({
  user,
  pathname,
  onSignOut,
  onNavClick,
}: {
  user: MCSidebarProps["user"];
  pathname: string;
  onSignOut: () => void;
  onNavClick?: () => void;
}) {
  return (
    <>
      <SidebarHeader />
      <nav className="flex-1 overflow-y-auto">
        {MC_NAV_CONFIG.map((group) => (
          <NavGroupComponent
            key={group.label}
            group={group}
            pathname={pathname}
            userRole={user.role}
            onClick={onNavClick}
          />
        ))}
      </nav>
      <SidebarBottom user={user} onSignOut={onSignOut} />
    </>
  );
}

export function MCSidebar({ user, isOpen, onClose }: MCSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

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
      {/* Desktop */}
      <aside
        className="h-screen w-64 fixed left-0 top-0 flex-col py-8 px-0 z-20 hidden lg:flex"
        style={{ background: "#022c22" }}
      >
        <SidebarBody user={user} pathname={pathname} onSignOut={handleSignOut} />
      </aside>

      {/* Mobile */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-64 flex flex-col py-8 z-50 lg:hidden"
              style={{ background: "#022c22" }}
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-2 rounded-lg text-emerald-100/70 hover:text-white hover:bg-emerald-900/50 transition-colors"
                aria-label="Lukk meny"
              >
                <Icon name="close" size={20} />
              </button>
              <SidebarBody
                user={user}
                pathname={pathname}
                onSignOut={handleSignOut}
                onNavClick={onClose}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
