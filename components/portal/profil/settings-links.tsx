"use client";

import Link from "next/link";
import { User, Crown, Shield, ArrowRight } from "lucide-react";

const LINKS = [
  {
    href: "/portal/profil/innstillinger",
    iconName: "User" as const,
    label: "Kontoinnstillinger",
    description: "Navn, e-post, passord",
  },
  {
    href: "/portal/profil/abonnement",
    iconName: "Crown" as const,
    label: "Abonnement",
    description: "Pakke og betaling",
  },
  {
    href: "/portal/profil/personvern",
    iconName: "Shield" as const,
    label: "Personvern",
    description: "Data og samtykker",
  },
] as const;

const ICON_MAP = { User, Crown, Shield } as const;

export function SettingsLinks() {
  return (
    <div>
      <p className="text-[10px] font-semibold tracking-widest text-[var(--color-grey-400)] uppercase mb-3">
        Innstillinger
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {LINKS.map((link) => {
          const Icon = ICON_MAP[link.iconName];
          return (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center gap-3 p-4 rounded-xl bg-white border border-[var(--color-grey-200)] hover:border-[var(--color-grey-300)] hover:shadow-card transition-all duration-200"
            >
              <div className="w-9 h-9 rounded-lg bg-[var(--color-grey-100)] flex items-center justify-center group-hover:bg-[var(--color-primary-soft)] transition-colors">
                <Icon className="w-4 h-4 text-[var(--color-grey-600)] group-hover:text-[var(--color-primary)] transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-grey-900)] truncate">
                  {link.label}
                </p>
                <p className="text-xs text-[var(--color-grey-500)] truncate">
                  {link.description}
                </p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--color-grey-300)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
