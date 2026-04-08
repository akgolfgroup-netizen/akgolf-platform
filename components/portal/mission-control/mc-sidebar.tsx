"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/portal/utils/cn";
import { MC_NAV_CONFIG, MC_ICON_MAP, type NavGroup, type NavItem } from "./mc-nav-config";
import { canAccessMCPage, isAdmin, isStaff } from "@/lib/portal/rbac";
import { AKLogo } from "@/components/website/AKLogo";

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
  const Icon = MC_ICON_MAP[item.iconName];

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "hg-sidebar-link",
        isActive && "active"
      )}
    >
      {Icon && <Icon className="w-[18px] h-[18px]" />}
      <span>{item.label}</span>
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
  // Filter items based on user role
  const accessibleItems = group.items.filter((item) => {
    const pageName = item.href.split("/").pop() || "hub";
    return canAccessMCPage(userRole, pageName as never);
  });

  if (accessibleItems.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="px-5 py-2 text-[10px] font-semibold text-[var(--hg-text-muted)] uppercase tracking-[0.05em]">
        {group.label}
      </div>
      {accessibleItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/portal/admin" && pathname.startsWith(`${item.href}/`));
        return (
          <NavLink key={item.href} item={item} isActive={isActive} onClick={onClick} />
        );
      })}
    </div>
  );
}

function SidebarContent({
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
      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
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

      {/* User Footer */}
      <div className="p-4 border-t border-[var(--hg-border)]">
        <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--hg-surface-raised)] transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--hg-surface-raised)] to-[var(--hg-border)] flex items-center justify-center text-[var(--hg-text)] text-[10px] font-semibold border border-[var(--hg-border)]">
            {(user.name ?? user.email ?? "U")[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold text-[var(--hg-text)] truncate">
              {user.name ?? "Bruker"}
            </div>
            <div className={`text-[9px] ${isAdmin(user.role) ? "text-[var(--hg-primary)] font-semibold" : "text-[var(--hg-text-muted)]"}`}>
              {isAdmin(user.role) ? "Admin" : isStaff(user.role) ? "Instruktor" : "Invitert"}
            </div>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-2 px-2 py-2 mt-2 text-[11px] text-[var(--hg-text-muted)] hover:text-[var(--hg-error)] hover:bg-[var(--hg-error-bg)] rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logg ut</span>
        </button>
      </div>
    </>
  );
}

export function MCSidebar({ user, isOpen, onClose }: MCSidebarProps) {
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
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-[220px] hidden lg:flex flex-col z-20 hg-sidebar">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--hg-border)] flex items-center gap-3">
          <AKLogo variant="neutral" size={32} />
          <div>
            <span className="text-[14px] font-bold text-[var(--hg-text)]">AK Golf</span>
            <p className="text-[9px] text-[var(--hg-primary)] uppercase tracking-wider font-bold">Mission Control</p>
          </div>
        </div>

        <SidebarContent user={user} pathname={pathname} onSignOut={handleSignOut} />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-72 flex flex-col z-50 lg:hidden hg-sidebar"
            >
              {/* Header with close button */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--hg-border)]">
                <div className="flex items-center gap-3">
                  <AKLogo variant="neutral" size={32} />
                  <div>
                    <span className="text-[14px] font-bold text-[var(--hg-text)]">AK Golf</span>
                    <p className="text-[9px] text-[var(--hg-primary)] uppercase tracking-wider font-bold">Mission Control</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-[var(--hg-text-muted)] hover:text-[var(--hg-text)] hover:bg-[var(--hg-surface-raised)] transition-colors cursor-pointer"
                  aria-label="Lukk meny"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <SidebarContent
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
