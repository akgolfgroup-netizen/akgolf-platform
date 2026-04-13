"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { createBrowserClient } from "@supabase/ssr";
import {
  User,
  Briefcase,
  CreditCard,
  Mail,
  Users,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import type { PortalUser } from "@/lib/portal/auth";

const PROFILE_MENU = [
  { href: "/portal/profil", label: "Min profil", icon: User },
  { href: "/portal/bag", label: "Bag", icon: Briefcase },
  { href: "/portal/abonnement", label: "Abonnement", icon: CreditCard },
  { href: "/portal/meldinger", label: "Meldinger", icon: Mail },
  { href: "/portal/sosialt", label: "Sosialt", icon: Users },
  { href: "/portal/profil", label: "Innstillinger", icon: Settings },
] as const;

interface TopbarProps {
  title: string;
  subtitle?: string;
  user?: PortalUser;
}

export function Topbar({ title, subtitle, user }: TopbarProps) {
  const today = format(new Date(), "EEEE d. MMMM", { locale: nb });
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSignOut() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    await supabase.auth.signOut();
    router.push("/portal/login");
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-grey-200 bg-white/90 px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-lg font-semibold leading-tight text-black">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-0.5 text-xs leading-tight text-black">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden text-xs capitalize text-grey-400 sm:block">
          {today}
        </span>

        {/* Profile dropdown */}
        {user && (
          <div ref={ref} className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex cursor-pointer items-center gap-2 rounded-full p-1 transition-colors hover:bg-grey-50"
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                  <span className="text-xs font-semibold text-white">
                    {(user.name ?? "S")[0].toUpperCase()}
                  </span>
                </div>
              )}
              <ChevronDown className="h-3.5 w-3.5 text-grey-400" />
            </button>

            {open && (
              <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-grey-100 bg-white py-1 shadow-card-hover">
                {/* User info */}
                <div className="border-b border-grey-100 px-4 py-3">
                  <p className="text-sm font-medium text-black">
                    {user.name ?? "Spiller"}
                  </p>
                  <p className="text-[11px] text-muted">
                    {user.email}
                  </p>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  {PROFILE_MENU.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-[13px] text-grey-600 transition-colors hover:bg-grey-50 hover:text-text"
                    >
                      <item.icon className="h-4 w-4 text-grey-400" />
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* Sign out */}
                <div className="border-t border-grey-100 py-1">
                  <button
                    onClick={() => {
                      setOpen(false);
                      handleSignOut();
                    }}
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-[13px] text-grey-600 transition-colors hover:bg-grey-50 hover:text-error"
                  >
                    <LogOut className="h-4 w-4 text-grey-400" />
                    Logg ut
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
