"use client";

import { cn } from "@/lib/portal/utils/cn";
import { MoreHorizontal, Mail, Calendar, FileText } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface StudentListItemProps {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  initials: string;
  tags?: { label: string; variant?: "default" | "primary" | "success" | "warning" }[];
  status?: "active" | "inactive" | "at-risk";
  lastActive?: string;
  nextBooking?: string;
  showActions?: boolean;
}

const tagVariants = {
  default: "bg-[var(--hg-surface-raised)] text-[var(--hg-text-secondary)]",
  primary: "bg-[var(--hg-primary-glow)] text-[var(--hg-primary)]",
  success: "bg-[var(--hg-success-bg)] text-[var(--hg-success)]",
  warning: "bg-[var(--hg-warning-bg)] text-[var(--hg-warning)]",
};

const statusStyles = {
  active: "bg-[var(--hg-success)]",
  inactive: "bg-[var(--hg-text-muted)]",
  "at-risk": "bg-[var(--hg-warning)]",
};

export function HGStudentListItem({
  id,
  name,
  email,
  initials,
  tags = [],
  status = "active",
  lastActive,
  nextBooking,
  showActions = true,
}: StudentListItemProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="hg-list-item group">
      {/* Avatar */}
      <Link href={`/admin/elever/${id}`}>
        <div className="hg-avatar hg-avatar-sm shrink-0 cursor-pointer hover:ring-2 hover:ring-[var(--hg-primary)] transition-all">
          {initials}
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Link 
            href={`/admin/elever/${id}`}
            className="text-sm font-medium text-[var(--hg-text)] hover:text-[var(--hg-primary)] transition-colors truncate"
          >
            {name}
          </Link>
          <div className={cn("w-2 h-2 rounded-full", statusStyles[status])} />
        </div>
        
        {email && (
          <div className="text-xs text-[var(--hg-text-muted)] truncate">
            {email}
          </div>
        )}
        
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {tags.map((tag, i) => (
              <span
                key={i}
                className={cn(
                  "px-1.5 py-0.5 text-[10px] font-medium rounded",
                  tagVariants[tag.variant || "default"]
                )}
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}
        
        {/* Meta */}
        <div className="flex items-center gap-3 mt-1.5 text-xs text-[var(--hg-text-muted)]">
          {lastActive && <span>Sist aktiv: {lastActive}</span>}
          {nextBooking && (
            <span className="text-[var(--hg-primary)]">Neste: {nextBooking}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 rounded-md hover:bg-[var(--hg-surface-raised)] text-[var(--hg-text-muted)] hover:text-[var(--hg-text)] transition-colors">
            <Mail className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-md hover:bg-[var(--hg-surface-raised)] text-[var(--hg-text-muted)] hover:text-[var(--hg-text)] transition-colors">
            <Calendar className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-md hover:bg-[var(--hg-surface-raised)] text-[var(--hg-text-muted)] hover:text-[var(--hg-text)] transition-colors">
            <FileText className="w-4 h-4" />
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-md hover:bg-[var(--hg-surface-raised)] text-[var(--hg-text-muted)] hover:text-[var(--hg-text)] transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {showMenu && (
              <div className="hg-dropdown-menu">
                <Link 
                  href={`/admin/elever/${id}`}
                  className="hg-dropdown-item"
                >
                  Se profil
                </Link>
                <div className="hg-dropdown-divider" />
                <button className="hg-dropdown-item w-full text-left text-[var(--hg-error)]">
                  Deaktiver
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
