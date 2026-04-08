"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  Target,
  TrendingUp,
  BookOpen,
  Settings,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/sports-os/dashboard", shortcut: "1" },
  { icon: Calendar, label: "Sessions", href: "/sports-os/sessions", shortcut: "2" },
  { icon: Target, label: "IUP Plan", href: "/sports-os/iup", shortcut: "3" },
  { icon: TrendingUp, label: "Analytics", href: "/sports-os/analytics", shortcut: "4" },
  { icon: BookOpen, label: "Log", href: "/sports-os/log", shortcut: "5" },
  { icon: Settings, label: "Settings", href: "/sports-os/settings", shortcut: "6" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#2D5A27] flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-[#1a3d16]">
        <Link href="/sports-os/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#DFFF00] rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-[#2D5A27]" />
          </div>
          <div>
            <h1 className="text-[#F5F1E8] font-bold text-lg tracking-tight">AK Sports</h1>
            <p className="text-[#a8c4a4] text-xs">OS v2.0</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 group relative",
                isActive
                  ? "bg-[#1a3d16] text-[#F5F1E8]"
                  : "text-[#c8dcc4] hover:bg-[#3d7a37] hover:text-[#F5F1E8]"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-6 bg-[#DFFF00] rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className={cn("w-5 h-5", isActive && "text-[#DFFF00]")} />
              <span className="font-medium">{item.label}</span>
              <kbd className="ml-auto text-xs bg-[#1a3d16] px-2 py-0.5 rounded text-[#8fb88a] group-hover:text-[#DFFF00] transition-colors">
                ⌘{item.shortcut}
              </kbd>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-[#1a3d16]">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1a3d16]/50">
          <div className="w-10 h-10 rounded-full bg-[#DFFF00] flex items-center justify-center">
            <span className="text-[#2D5A27] font-bold">AK</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#F5F1E8] font-bold truncate">Anders K.</p>
            <p className="text-[#8fb88a] text-xs truncate">Head Coach</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
