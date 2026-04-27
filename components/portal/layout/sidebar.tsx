"use client";

/**
 * Portal Sidebar — Heritage Grid 1:1.
 *
 * Kilde: design-ref/stitch/heritage/dashboard_mission_control/code.html
 *        (aside-seksjonen, linje 1-60 av <aside>)
 *
 * Eksakte klasser fra Heritage:
 * - Container: h-screen w-64 bg-primary-container py-8 gap-y-6
 * - Header: px-8 mb-4, h1 text-surface text-lg, p text-[#d2f000] text-[11px] widest
 * - Active: bg-[#d2f000] text-[#154212] rounded-lg mx-4 px-4 py-3 text-[11px] widest
 *   + icon FILLED
 * - Inactive: text-[#fdf9f0]/70 hover:bg-[#154212]/80 hover:text-surface
 * - Subscription: bg-[#154212] border border-[#d2f000]/20 rounded-xl p-4
 * - Bottom links: px-4 py-2 text-[#fdf9f0]/70 hover:text-surface text-[11px]
 */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/portal/utils/cn";
import type { PortalUser } from "@/lib/portal/auth";
import { useSidebar } from "./sidebar-context";

interface NavItem {
  href: string;
  label: string;
  iconName: string;
  matchPaths?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { href: "/portal", label: "Dashboard", iconName: "dashboard" },
  {
    href: "/portal/treningsplan",
    label: "Planlegg",
    iconName: "assignment",
    matchPaths: ["/portal/bookinger", "/portal/kalender", "/portal/periodisering", "/portal/timeplan"],
  },
  {
    href: "/portal/timeplan",
    label: "Timeplan",
    iconName: "calendar_month",
    matchPaths: [],
  },
  {
    href: "/portal/dagbok",
    label: "Tren",
    iconName: "fitness_center",
    matchPaths: ["/portal/trening", "/portal/tester"],
  },
  {
    href: "/portal/runde",
    label: "Spill",
    iconName: "flag",
    matchPaths: ["/portal/turneringer", "/portal/spill", "/portal/turneringsplan", "/portal/bag"],
  },
  {
    href: "/portal/statistikk",
    label: "Analyser",
    iconName: "query_stats",
    matchPaths: [
      "/portal/analyse",
      "/portal/benchmark",
      "/portal/trackman",
      "/portal/sammenligning",
      "/portal/ai-coach",
      "/portal/coaching-historikk",
      "/portal/kartlegging",
    ],
  },
  {
    href: "/portal/talent",
    label: "Talenter",
    iconName: "auto_awesome",
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
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg mx-4 px-4 py-3 uppercase text-[11px] font-medium tracking-widest transition-all",
        active
          ? "bg-[#d2f000] text-[#154212]"
          : "text-[#fdf9f0]/70 hover:bg-[#154212]/80 hover:text-surface",
      )}
    >
      <Icon name={item.iconName} size={20} filled={active} />
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
  void user;
  return (
    <>
      {/* Header */}
      <div className="px-8 mb-4">
        <Link
          href="/portal"
          onClick={onNavClick}
          className="flex flex-col"
        >
          <h1 className="text-surface font-bold text-lg tracking-tight">AK Golf</h1>
          <p className="uppercase text-[11px] font-medium tracking-widest text-[#d2f000]">
            Precision Performance
          </p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            pathname={pathname}
            onClick={onNavClick}
          />
        ))}
      </nav>

      {/* Bottom block: Subscription + Support/Sign out */}
      <div className="px-4 mt-auto space-y-4">
        <div className="bg-[#154212] border border-[#d2f000]/20 rounded-xl p-4">
          <p className="text-[10px] text-[#d2f000] font-bold tracking-widest mb-2 uppercase">
            Subscription
          </p>
          <Link
            href="/portal/abonnement"
            onClick={onNavClick}
            className="block w-full bg-[#d2f000] text-[#154212] py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider text-center hover:opacity-90 transition-opacity"
          >
            Upgrade Pro
          </Link>
        </div>

        <div className="space-y-1">
          <Link
            href="/portal/profil"
            onClick={onNavClick}
            className="flex items-center gap-3 text-[#fdf9f0]/70 hover:text-surface px-4 py-2 text-[11px] font-medium tracking-widest uppercase transition-all"
          >
            <Icon name="help_outline" size={20} />
            <span>Support</span>
          </Link>
          <button
            onClick={() => {
              onSignOut();
              onNavClick?.();
            }}
            className="w-full flex items-center gap-3 text-[#fdf9f0]/70 hover:text-surface px-4 py-2 text-[11px] font-medium tracking-widest uppercase transition-all"
          >
            <Icon name="logout" size={20} />
            <span>Sign out</span>
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
        className="h-screen w-64 fixed left-0 top-0 flex flex-col py-8 gap-y-6 shadow-2xl z-40 hidden lg:flex"
        style={{
          background: "#2d5a27",
          boxShadow: "0 0 40px rgba(21, 66, 18, 0.2)",
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
              className="fixed inset-0 z-40 bg-on-surface/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col py-8 gap-y-6 lg:hidden"
              style={{ background: "#2d5a27" }}
            >
              <button
                onClick={close}
                className="absolute right-4 top-4 rounded-lg p-2 text-[#fdf9f0]/70 hover:bg-[#154212]/80 hover:text-surface transition-colors"
                aria-label="Lukk meny"
              >
                <Icon name="close" size={20} />
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
