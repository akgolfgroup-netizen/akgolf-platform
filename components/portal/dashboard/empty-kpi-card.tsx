"use client";

import { colors } from "@/lib/design-tokens";
import { MonoLabel } from "@/components/portal/patterns";

interface EmptyKpiCardProps {
  label: string;
  message: string;
  href: string;
}

export function EmptyKpiCard({ label, message, href }: EmptyKpiCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-grey-100 bg-white p-5 shadow-sm transition-all duration-200 hover:border-grey-200 hover:shadow-md">
      <div>
        <MonoLabel as="p" size="xs" uppercase className="text-grey-400 block">{label}</MonoLabel>
        <p className="mt-2 text-sm text-grey-400">{message}</p>
        <a
          href={href}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold hover:underline"
          style={{ color: colors.primary.main }}
        >
          Kom i gang
          <span>→</span>
        </a>
      </div>
    </div>
  );
}
