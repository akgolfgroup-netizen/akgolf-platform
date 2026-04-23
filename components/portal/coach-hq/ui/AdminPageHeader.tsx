import { Icon } from "@/components/ui/icon";
import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
  className?: string;
}

export function AdminPageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  className,
}: AdminPageHeaderProps) {
  return (
    <header className={cn("mb-8", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          aria-label="Brodsmulesti"
          className="mb-3 flex items-center gap-1.5 text-xs text-[var(--color-muted)]"
        >
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={`${crumb.label}-${idx}`}>
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-[var(--color-text)] transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={cn(isLast && "text-[var(--color-text)] font-medium")}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {crumb.label}
                  </span>
                )}
                {!isLast && (
                  <Icon name="chevron_right"
                    className="w-3.5 h-3.5 text-[var(--color-muted)]"
                    aria-hidden="true" />
                )}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h1 className="admin-page-title">{title}</h1>
          {subtitle && (
            <p className="mt-1.5 text-sm text-[var(--color-muted)]">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        )}
      </div>
    </header>
  );
}
