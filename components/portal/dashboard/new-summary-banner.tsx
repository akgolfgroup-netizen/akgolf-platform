"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { dismissCoachingSummary } from "@/app/portal/(dashboard)/dashboard-actions";
import type { UnreadCoachingSummary } from "@/app/portal/(dashboard)/dashboard-types";

interface Props {
  summary: UnreadCoachingSummary | null;
}

export function NewSummaryBanner({ summary }: Props) {
  const [isPending, startTransition] = useTransition();

  if (!summary) return null;

  const href = summary.linkUrl ?? "/portal/coaching-historikk";

  const handleDismiss = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    startTransition(async () => {
      try {
        await dismissCoachingSummary(summary.notificationId);
      } catch {
        // silent
      }
    });
  };

  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-secondary-fixed/40 bg-secondary-fixed/15 px-5 py-4 transition-all hover:bg-secondary-fixed/25"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary-fixed">
        <Icon name="auto_awesome" filled size={20} className="text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] uppercase tracking-widest text-primary/60">
          Nytt fra coachen din
        </p>
        <p className="truncate text-sm font-bold text-primary">{summary.title}</p>
        <p className="mt-0.5 line-clamp-1 text-xs text-primary/70">{summary.message}</p>
      </div>
      <span className="hidden items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-widest text-primary md:inline-flex">
        Les
        <Icon name="arrow_forward" size={14} />
      </span>
      <button
        type="button"
        onClick={handleDismiss}
        disabled={isPending}
        aria-label="Avvis varsling"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-primary/50 transition-colors hover:bg-primary/10 hover:text-primary disabled:opacity-50"
      >
        <Icon name="close" size={16} />
      </button>
    </Link>
  );
}
