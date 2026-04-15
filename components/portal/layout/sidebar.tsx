"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { AnimatePresence, motion } from "framer-motion";
import {
  ClipboardList,
  Flag,
  LayoutDashboard,
  LogOut,
  Plus,
  ShieldCheck,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { isStaff } from "@/lib/portal/rbac";
import type { PortalUser } from "@/lib/portal/auth";
import { useSidebar } from "./sidebar-context";
import { AKLogo } from "@/components/website/AKLogo";
import { NotificationBell } from "./notification-bell";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  matchPaths?: string[];
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/portal",
    label: "Oversikt",
    icon: LayoutDashboard,
  },
  {
    href: "/portal/treningsplan",
    label: "Planlegg",
    icon: ClipboardList,
    matchPaths: ["/portal/bookinger", "/portal/kalender", "/portal/periodisering"],
  },
  {
    href: "/portal/dagbok",
    label: "Tren",
    icon: Target,
    matchPaths: ["/portal/trening", "/portal/tester"],
  },
  {
    href: "/portal/runde",
    label: "Spill",
    icon: Flag,
    matchPaths: ["/portal/turneringer", "/portal/spill", "/portal/turneringsplan", "/portal/bag"],
  },
  {
    href: "/portal/statistikk",
    label: "Analyser",
    icon: TrendingUp,
    matchPaths: ["/portal/analyse", "/portal/benchmark", "/portal/trackman", "/portal/sammenligning", "/portal/ai-coach", "/portal/coaching-historikk"],
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
  const isExactHome = item.href === "/portal" && pathname === "/portal";
  const isSubMatch = item.href !== "/portal" && pathname.startsWith(item.href);
  const isExtraMatch = item.matchPaths?.some((p) => pathname.startsWith(p));
  const active = isExactHome || isSubMatch || (isExtraMatch ?? false);

  return (
    <li>
      <Link href={item.href} onClick={onClick} className="group relative block">
        <div
          className={cn(
            "relative mx-2 flex items-center gap-3 rounded-xl px-4 py-[7px] text-[13px] transition-all duration-200",
            active
              ? "bg-black font-semibold text-white"
              : "font-medium text-grey-400 hover:bg-grey-50 hover:text-black",
          )}
        >
          <item.icon
            className={cn(
              "h-[18px] w-[18px] shrink-0 transition-colors",
              active
                ? "text-white"
                : "text-grey-300 group-hover:text-black",
            )}
          />
          <span>{item.label}</span>
        </div>
      </Link>
    </li>
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
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} onClick={onNavClick} />
          ))}
        </ul>

        <div className="mx-2 mt-6 border-t border-grey-200 pt-4">
          <button
            onClick={() => {
              onSignOut();
              onNavClick?.();
            }}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-2 text-[13px] font-medium text-grey-400 transition-colors hover:text-error"
          >
            <LogOut className="h-4 w-4" />
            <span>Logg ut</span>
          </button>
        </div>

        {isStaff(user.role) && (
          <div className="mx-2 mt-2">
            <Link
              href="/admin"
              onClick={onNavClick}
              className="flex items-center gap-2.5 rounded-xl bg-black px-4 py-2.5 text-[13px] font-bold text-white transition-opacity hover:opacity-90"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Mission Control</span>
            </Link>
          </div>
        )}
      </nav>

      <div className="px-4 pb-4">
        <Link
          href="/portal/bookinger/ny"
          onClick={onNavClick}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-accent-cta px-4 py-2.5 text-[13px] font-bold text-accent-cta-text transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Ny økt
        </Link>
      </div>

      <div className="mx-3 mb-3 rounded-xl border border-grey-200 bg-grey-50 p-3">
        <div className="flex items-center gap-3">
          {user.image ? (
            <Image
              src={user.image}
              alt=""
              width={36}
              height={36}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black">
              <span className="text-xs font-semibold text-white">
                {(user.name ?? "S")[0].toUpperCase()}
              </span>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-black">
              {user.name ?? "Spiller"}
            </p>
            <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-grey-500">
              {user.subscriptionTier ?? "Academy"}
            </p>
          </div>
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
      <aside className="fixed left-0 top-0 z-20 hidden h-full w-[220px] flex-col border-r border-grey-200 bg-white lg:flex">
        <div className="border-b border-grey-200 px-5 py-4">
          <div className="flex items-center justify-between">
            <Link href="/portal" className="group flex items-center gap-3">
              <AKLogo variant="black" size={32} />
              <div>
                <span className="text-[17px] font-bold tracking-[-0.03em] text-black transition-colors group-hover:text-primary">
                  AK Golf
                </span>
                <p className="text-[9px] font-bold uppercase tracking-wider text-grey-400">
                  Academy
                </p>
              </div>
            </Link>
            <NotificationBell />
          </div>
        </div>

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
              onClick={close}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-grey-200 bg-white lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-grey-200 px-5 py-4">
                <div className="flex items-center gap-3">
                  <AKLogo variant="black" size={32} />
                  <span className="text-[14px] font-bold text-black">AK Golf</span>
                </div>
                <button
                  onClick={close}
                  className="cursor-pointer rounded-lg p-2 text-grey-400 transition-colors hover:bg-grey-50 hover:text-black"
                  aria-label="Lukk meny"
                >
                  <X className="h-5 w-5" />
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
