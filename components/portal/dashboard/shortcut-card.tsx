"use client";

import Link from "next/link";
import { LucideIcon, ArrowUpRight } from "lucide-react";

interface ShortcutCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

export function ShortcutCard({
  href,
  icon: Icon,
  title,
  subtitle,
}: ShortcutCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-2xl border border-grey-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <ArrowUpRight className="h-4 w-4 text-grey-300 transition-colors group-hover:text-primary" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-black">{title}</h4>
        <p className="text-xs text-grey-400">{subtitle}</p>
      </div>
    </Link>
  );
}
