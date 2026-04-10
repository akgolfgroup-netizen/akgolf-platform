"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function BookingNav() {
  return (
    <nav className="bg-white border-b border-[#D5DFDB] px-6 py-3.5 sticky top-0 z-10">
      <div className="max-w-[720px] mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[#A5B2AD] text-sm hover:text-[#005840] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Tilbake
        </Link>
        <div className="font-extrabold text-lg text-[#005840] tracking-tight">
          AK Golf <span className="text-[#A5B2AD] font-medium text-xs ml-1.5">Book</span>
        </div>
      </div>
    </nav>
  );
}
