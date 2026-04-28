"use client";

import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { NameList } from "./NameList";
import { useSidebar } from "@/components/portal/layout/sidebar-context";

interface PlayerHQSidebarProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

/**
 * PlayerHQ Sidebar — én navnliste (220px) med ikon + tekst per item.
 *
 * Brand Guide V2.0.
 * Erstatter: components/portal/layout/sidebar.tsx (Heritage-rest).
 *
 * Desktop (>=1024px): inline sticky sidebar.
 * Mobil (<1024px): overlay-drawer som åpnes via MobileHeader meny-knapp
 * (useSidebar-context.toggle).
 */
export function PlayerHQSidebar({ user }: PlayerHQSidebarProps) {
  const router = useRouter();
  const { isOpen, close } = useSidebar();

  async function handleSignOut() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    await supabase.auth.signOut();
    router.push("/portal/login");
    router.refresh();
  }

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex h-screen sticky top-0 z-30 shrink-0">
        <NameList user={user} onSignOut={handleSignOut} />
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
              className="fixed inset-0 z-40 bg-ink/55 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed left-0 top-0 z-50 h-screen lg:hidden"
              role="dialog"
              aria-label="Hovedmeny"
              aria-modal="true"
            >
              <div className="relative h-full">
                <NameList user={user} onSignOut={handleSignOut} onItemClick={close} />
                <button
                  type="button"
                  onClick={close}
                  className="absolute top-4 right-2 w-9 h-9 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Lukk meny"
                >
                  <X className="w-5 h-5" strokeWidth={2.2} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
