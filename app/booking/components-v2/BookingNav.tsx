"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function BookingNav() {
  return (
    <nav className="bg-white border-b border-grey-200 px-6 py-3.5 sticky top-0 z-10">
      <div className="max-w-[720px] mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-muted text-sm hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Tilbake
        </Link>
        <div className="font-extrabold text-lg text-primary tracking-tight">
          AK Golf <span className="text-muted font-medium text-xs ml-1.5">Book</span>
        </div>
      </div>
    </nav>
  );
}
