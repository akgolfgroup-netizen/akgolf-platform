"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AdminBreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface AdminBreadcrumbsProps {
  items: AdminBreadcrumbItem[];
  separator?: React.ReactNode;
  showHome?: boolean;
  homeHref?: string;
  className?: string;
}

export function AdminBreadcrumbs({
  items,
  separator,
  showHome = true,
  homeHref = "/portal/admin",
  className,
}: AdminBreadcrumbsProps) {
  const sep = separator ?? (
    <ChevronRight
      className="w-3.5 h-3.5"
      style={{ color: "var(--color-muted)" }}
      aria-hidden="true"
    />
  );

  const fullItems: AdminBreadcrumbItem[] = showHome
    ? [
        {
          label: "Admin",
          href: homeHref,
          icon: <Home className="w-3.5 h-3.5" />,
        },
        ...items,
      ]
    : items;

  return (
    <nav
      aria-label="Brødsmule-navigasjon"
      className={cn("flex items-center gap-1.5 text-sm flex-wrap", className)}
    >
      {fullItems.map((item, index) => {
        const isLast = index === fullItems.length - 1;
        return (
          <React.Fragment key={`${item.label}-${index}`}>
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-primary)]"
                style={{ color: "var(--color-muted)" }}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span
                aria-current={isLast ? "page" : undefined}
                className="inline-flex items-center gap-1 font-medium"
                style={{
                  color: isLast ? "var(--color-text)" : "var(--color-muted)",
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </span>
            )}
            {!isLast && sep}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
