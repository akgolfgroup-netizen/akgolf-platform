"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
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
        "relative flex items-center gap-2.5 px-3 py-2.5 mx-2 rounded-lg text-sm font-medium transition-colors",
        isActive
          ? "bg-[#0A1F18] text-white"
          : "text-[#0A1F18] hover:bg-[#F5F8F7]",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {isActive && (
        <span
          className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r-full bg-[#D1F843]"
          aria-hidden="true"
        />
      )}
      {Icon && (
        <Icon
          className={cn(
            "w-[18px] h-[18px] shrink-0",
            isActive ? "text-white" : "text-[#7A8C85]",
          )}
        />
      )}
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
    <div className="mb-5">
      <div className="px-5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7A8C85]">
        {group.label}
      </div>
      <div className="space-y-0.5">
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
    <div className="px-5 py-4 border-b border-[#D5DFDB] flex items-center gap-3">
      <AKLogo variant="neutral" size={32} />
      <div className="min-w-0">
        <span className="block text-sm font-bold text-[#0A1F18] truncate">
          AK Golf
        </span>
        <p className="text-[10px] text-[#005840] uppercase tracking-wider font-semibold">
          Mission Control
        </p>
      </div>
    </div>
  );
}

function SidebarUserFooter({
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
    <div className="p-3 border-t border-[#D5DFDB]">
      <div className="flex items-center gap-2.5 p-2 rounded-lg">
        <div className="w-9 h-9 rounded-full bg-[#F5F8F7] text-[#0A1F18] flex items-center justify-center text-sm font-semibold shrink-0">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-[#0A1F18] truncate">
            {user.name ?? "Bruker"}
          </div>
          <div className="text-xs text-[#7A8C85] truncate">
            {user.email ?? roleLabel}
          </div>
        </div>
      </div>
      <button
        onClick={onSignOut}
        className="mt-1 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#7A8C85] hover:text-[#B84233] hover:bg-[#FCEAE8] transition-colors cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>Logg ut</span>
      </button>
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
      <nav className="flex-1 py-4 overflow-y-auto">
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
      <SidebarUserFooter user={user} onSignOut={onSignOut} />
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
      <aside className="fixed left-0 top-0 h-full w-[240px] hidden lg:flex flex-col z-20 bg-white border-r border-[#D5DFDB]">
        <SidebarHeader />
        <SidebarContent
          user={user}
          pathname={pathname}
          onSignOut={handleSignOut}
        />
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-[#0A1F18]/40 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-72 flex flex-col z-50 lg:hidden bg-white border-r border-[#D5DFDB]"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#D5DFDB]">
                <div className="flex items-center gap-3">
                  <AKLogo variant="neutral" size={32} />
                  <div className="min-w-0">
                    <span className="block text-sm font-bold text-[#0A1F18] truncate">
                      AK Golf
                    </span>
                    <p className="text-[10px] text-[#005840] uppercase tracking-wider font-semibold">
                      Mission Control
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-[#7A8C85] hover:text-[#0A1F18] hover:bg-[#F5F8F7] transition-colors cursor-pointer"
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
