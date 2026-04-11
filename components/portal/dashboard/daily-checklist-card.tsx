import Link from "next/link";
import { Check, Circle, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  href?: string;
}

interface DailyChecklistCardProps {
  items: ChecklistItem[];
}

export function DailyChecklistCard({ items }: DailyChecklistCardProps) {
  const completed = items.filter((i) => i.completed).length;
  const total = items.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-[var(--color-grey-200)] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
            <ListChecks
              className="h-5 w-5 text-[var(--color-primary)]"
              strokeWidth={1.75}
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-grey-900)]">
              Dagens sjekkliste
            </h3>
            <p className="text-[11px] text-[var(--color-muted)]">
              {completed} av {total} fullført
            </p>
          </div>
        </div>
        <span className="rounded-full bg-[var(--color-surface)] px-3 py-1 text-[11px] font-bold text-[var(--color-primary)] tabular-nums">
          {percent}%
        </span>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-grey-200)]">
        <div
          className="h-full rounded-full bg-[var(--color-primary)] transition-[width]"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ul className="mt-4 flex flex-1 flex-col gap-2">
        {items.map((item) => {
          const content = (
            <div
              className={cn(
                "flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-colors",
                item.completed
                  ? "bg-[var(--color-success)]/5"
                  : "bg-[var(--color-surface)] hover:border-[var(--color-grey-200)] hover:bg-white",
              )}
            >
              <div
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
                  item.completed
                    ? "border-[var(--color-success)] bg-[var(--color-success)] text-white"
                    : "border-[var(--color-grey-200)] text-[var(--color-muted)]",
                )}
              >
                {item.completed ? (
                  <Check className="h-3 w-3" strokeWidth={3} />
                ) : (
                  <Circle className="h-2 w-2" />
                )}
              </div>
              <span
                className={cn(
                  "text-sm font-medium",
                  item.completed
                    ? "text-[var(--color-muted)] line-through"
                    : "text-[var(--color-grey-900)]",
                )}
              >
                {item.label}
              </span>
            </div>
          );

          return (
            <li key={item.id}>
              {item.href ? (
                <Link href={item.href} className="block">
                  {content}
                </Link>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
