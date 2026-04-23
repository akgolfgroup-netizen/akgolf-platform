"use client";


import { Icon } from "@/components/ui/icon";
import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { searchStudents } from "@/app/admin/(authed)/spillere/actions";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/portal/utils/cn";
import { motion, AnimatePresence } from "framer-motion";

interface Student {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  subscriptionTier?: "VISITOR" | "ACADEMY" | "STARTER" | "PRO" | "ELITE";
  handicap?: number | null;
  createdAt: Date;
  lastActiveAt?: Date | null;
  _count: { bookings: number; coachingSessions: number };
}

const tierVariantMap: Record<string, "default" | "secondary" | "success" | "info" | "warning"> = {
  VISITOR: "default",
  ACADEMY: "secondary",
  STARTER: "success",
  PRO: "info",
  ELITE: "warning",
};

const tierLabelMap: Record<string, string> = {
  VISITOR: "Visitor",
  ACADEMY: "Academy",
  STARTER: "Starter",
  PRO: "Pro",
  ELITE: "Elite",
};

export function StudentList() {
  const [query, setQuery] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const fetchStudents = async (q: string) => {
    setLoading(true);
    try {
      const result = await searchStudents(q);
      setStudents(result.students as unknown as Student[]);
      setTotal(result.total);
    } catch {
      // Error handled silently - list will remain unchanged
    } finally {
      setLoading(false);
    }
  };

  const [initialized, setInitialized] = useState(false);
  if (!initialized) {
    setInitialized(true);
    fetchStudents("");
  }

  const handleSearch = () => fetchStudents(query);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === students.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(students.map((s) => s.id)));
    }
  };

  const clearSelection = () => setSelectedIds(new Set());

  const getLastActiveLabel = (lastActive: Date | null | undefined) => {
    if (!lastActive) return "Ikke registrert";
    const now = new Date();
    const diff = now.getTime() - new Date(lastActive).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "I dag";
    if (days === 1) return "I gar";
    if (days < 7) return `${days} dager siden`;
    return formatDistanceToNow(new Date(lastActive), { locale: nb, addSuffix: true });
  };

  const isRecentlyActive = (lastActive: Date | null | undefined) => {
    if (!lastActive) return false;
    const diff = new Date().getTime() - new Date(lastActive).getTime();
    return diff < 1000 * 60 * 60 * 24 * 2; // Less than 2 days
  };

  const maxSessions = Math.max(...students.map((s) => s._count.coachingSessions), 1);

  return (
    <div className="space-y-4">
      {/* Filter Bar - Glassmorphism */}
      <div className="flex items-center gap-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 px-5 transition-shadow duration-300 hover:shadow-sm">
        {/* Search */}
        <div className="flex items-center gap-3 flex-1 px-4 py-3 bg-surface-container rounded-xl border border-transparent focus-within:bg-surface-container-lowest focus-within:border-black focus-within:shadow-[0_0_0_3px_grey-100] transition-[background-color,border-color]">
          <Icon name="search" className="w-[18px] h-[18px] text-on-surface-variant" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Sok etter navn, e-post eller telefon..."
            className="flex-1 bg-transparent border-none text-sm text-on-surface placeholder:text-on-surface-variant outline-none"
          />
        </div>

        <div className="w-px h-8 bg-surface-variant" />

        {/* Filters */}
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-on-surface-variant">Medlemskap:</span>
          <select className="px-4 py-2 pr-8 text-sm font-medium text-text bg-surface-container border border-outline-variant/30 rounded-xl cursor-pointer appearance-none focus:outline-none focus:border-black bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%238E8E93%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center]">
            <option>Alle</option>
            <option>ELITE</option>
            <option>PRO</option>
            <option>STARTER</option>
            <option>ACADEMY</option>
            <option>VISITOR</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-on-surface-variant">Status:</span>
          <select className="px-4 py-2 pr-8 text-sm font-medium text-text bg-surface-container border border-outline-variant/30 rounded-xl cursor-pointer appearance-none focus:outline-none focus:border-black bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%238E8E93%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center]">
            <option>Aktive</option>
            <option>Inaktive</option>
            <option>Alle</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-4 px-5 py-4 bg-on-surface text-surface rounded-2xl"
          >
            <span className="text-sm font-medium">
              <strong>{selectedIds.size}</strong> elever valgt
            </span>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 text-surface text-[13px] font-medium rounded-xl transition-colors">
              <Icon name="mail" className="w-4 h-4" />
              Send e-post
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 text-surface text-[13px] font-medium rounded-xl transition-colors">
              <Icon name="sell" className="w-4 h-4" />
              Endre medlemskap
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 text-surface text-[13px] font-medium rounded-xl transition-colors">
              <Icon name="download" className="w-4 h-4" />
              Eksporter
            </button>
            <button
              onClick={clearSelection}
              className="ml-auto w-8 h-8 flex items-center justify-center bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 rounded-xl transition-colors"
            >
              <Icon name="close" className="w-[18px] h-[18px]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Total count */}
      <p className="text-xs text-on-surface-variant">{total} elever totalt</p>

      {/* Data Table - Glassmorphism */}
      <Card variant="elevated" padding="none" className="overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[48px_1fr_120px_100px_140px_140px_100px] gap-4 px-5 py-4 bg-surface-container border-b border-outline-variant/30">
          <div className="flex items-center justify-center">
            <button
              onClick={toggleSelectAll}
              className={cn(
                "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors",
                selectedIds.size === students.length && students.length > 0
                  ? "bg-on-surface border-black"
                  : "border-outline-variant/30 hover:border-black"
              )}
            >
              {selectedIds.size === students.length && students.length > 0 && (
                <Icon name="check" className="w-3.5 h-3.5 text-surface" />
              )}
            </button>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.06em] cursor-pointer hover:text-on-surface">
            Elev <Icon name="unfold_more" className="w-3.5 h-3.5" />
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.06em] cursor-pointer hover:text-on-surface">
            Medlemskap <Icon name="unfold_more" className="w-3.5 h-3.5" />
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.06em] cursor-pointer hover:text-on-surface">
            Handicap <Icon name="unfold_more" className="w-3.5 h-3.5" />
          </span>
          <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.06em]">
            Timer (mnd)
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.06em] cursor-pointer hover:text-on-surface">
            Sist aktiv <Icon name="unfold_more" className="w-3.5 h-3.5" />
          </span>
          <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-[0.06em]">
            Handlinger
          </span>
        </div>

        {/* Table Body */}
        {loading ? (
          <div className="py-12 text-center text-on-surface-variant">Laster...</div>
        ) : students.length === 0 ? (
          <div className="py-12 text-center text-on-surface-variant text-sm">
            Ingen elever funnet
          </div>
        ) : (
          students.map((student) => {
            const isSelected = selectedIds.has(student.id);
            const tier = student.subscriptionTier || "VISITOR";
            const sessionPercent = (student._count.coachingSessions / maxSessions) * 100;

            return (
              <div
                key={student.id}
                className={cn(
                  "grid grid-cols-[48px_1fr_120px_100px_140px_140px_100px] gap-4 px-5 py-4 items-center border-b border-outline-variant/20 last:border-b-0 transition-[background-color,transform] duration-200 hover:bg-surface-container hover:scale-[1.005]",
                  isSelected && "bg-surface-container"
                )}
              >
                {/* Checkbox */}
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => toggleSelect(student.id)}
                    className={cn(
                      "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors",
                      isSelected
                        ? "bg-on-surface border-black"
                        : "border-outline-variant/30 hover:border-black"
                    )}
                  >
                    {isSelected && <Icon name="check" className="w-3.5 h-3.5 text-surface" />}
                  </button>
                </div>

                {/* Student Info */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={student.image || undefined} />
                    <AvatarFallback>{(student.name || "?").slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-on-surface truncate">
                      {student.name ?? "Ukjent"}
                    </span>
                    <span className="text-xs text-on-surface-variant truncate">
                      {student.email}
                    </span>
                  </div>
                </div>

                {/* Tier Badge */}
                <Badge variant={tierVariantMap[tier]} size="sm">
                  {tierLabelMap[tier]}
                </Badge>

                {/* Handicap */}
                <span className="font-mono text-sm font-medium text-text">
                  {student.handicap !== null && student.handicap !== undefined
                    ? student.handicap.toFixed(1)
                    : "—"}
                </span>

                {/* Sessions with progress bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-on-surface rounded-full transition-[width]"
                      style={{ width: `${sessionPercent}%` }}
                    />
                  </div>
                  <span className="text-[13px] font-medium text-text min-w-[24px]">
                    {student._count.coachingSessions}
                  </span>
                </div>

                {/* Last Active */}
                <span
                  className={cn(
                    "text-[13px]",
                    isRecentlyActive(student.lastActiveAt)
                      ? "text-success-text font-medium"
                      : "text-on-surface-variant"
                  )}
                >
                  {getLastActiveLabel(student.lastActiveAt)}
                </span>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/admin/spillere/${student.id}`}
                    className="w-8 h-8 rounded-lg border border-outline-variant/30 bg-surface-container-lowest flex items-center justify-center hover:border-black hover:bg-surface-container transition-colors group"
                  >
                    <Icon name="visibility" className="w-4 h-4 text-on-surface-variant group-hover:text-on-surface" />
                  </Link>
                  <button className="w-8 h-8 rounded-lg border border-outline-variant/30 bg-surface-container-lowest flex items-center justify-center hover:border-black hover:bg-surface-container transition-colors group">
                    <Icon name="edit" className="w-4 h-4 text-on-surface-variant group-hover:text-on-surface" />
                  </button>
                  <button className="w-8 h-8 rounded-lg border border-outline-variant/30 bg-surface-container-lowest flex items-center justify-center hover:border-black hover:bg-surface-container transition-colors group">
                    <Icon name="more_horiz" className="w-4 h-4 text-on-surface-variant group-hover:text-on-surface" />
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Pagination */}
        {students.length > 0 && (
          <div className="flex items-center justify-between px-5 py-4 bg-surface-container border-t border-outline-variant/30">
            <span className="text-[13px] text-on-surface-variant">
              Viser 1-{students.length} av {total} elever
            </span>
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-xl border border-outline-variant/30 bg-surface-container-lowest text-sm font-medium text-text flex items-center justify-center hover:border-black hover:bg-surface-container hover:text-on-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                &lt;
              </button>
              <button className="w-9 h-9 rounded-xl bg-on-surface text-surface text-sm font-medium flex items-center justify-center">
                1
              </button>
              <button className="w-9 h-9 rounded-xl border border-outline-variant/30 bg-surface-container-lowest text-sm font-medium text-text flex items-center justify-center hover:border-black hover:bg-surface-container hover:text-on-surface transition-colors">
                2
              </button>
              <button className="w-9 h-9 rounded-xl border border-outline-variant/30 bg-surface-container-lowest text-sm font-medium text-text flex items-center justify-center hover:border-black hover:bg-surface-container hover:text-on-surface transition-colors">
                3
              </button>
              <button className="w-9 h-9 rounded-xl border border-outline-variant/30 bg-surface-container-lowest text-sm font-medium text-text flex items-center justify-center hover:border-black hover:bg-surface-container hover:text-on-surface transition-colors">
                &gt;
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
