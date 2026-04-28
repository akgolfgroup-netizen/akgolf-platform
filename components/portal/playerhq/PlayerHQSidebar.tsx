"use client";

import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { NameList } from "./NameList";

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
 */
export function PlayerHQSidebar({ user }: PlayerHQSidebarProps) {
  const router = useRouter();

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
    <div className="hidden lg:flex h-screen sticky top-0 z-30 shrink-0">
      <NameList user={user} onSignOut={handleSignOut} />
    </div>
  );
}
