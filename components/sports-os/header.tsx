"use client";

import { Bell, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="h-16 bg-[#F5F1E8] border-b border-[#e5e1d8] flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
          <input
            type="text"
            placeholder="Search players, sessions, or analytics..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#d4d0c7] rounded-xl text-[#333333] placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#DFFF00] focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 text-[#666666] hover:text-[#333333] transition-colors rounded-xl hover:bg-[#ebe7de]">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#DFFF00] rounded-full ring-2 ring-[#F5F1E8]" />
        </button>

        {/* New Session Button */}
        <Button 
          className="bg-[#DFFF00] hover:bg-[#c8e600] text-[#2D5A27] font-bold rounded-xl px-4 py-2 flex items-center gap-2 transition-all duration-150 hover:shadow-lg hover:shadow-[#DFFF00]/20"
        >
          <Plus className="w-4 h-4" />
          <span>Book 20-Min Session</span>
        </Button>
      </div>
    </header>
  );
}
