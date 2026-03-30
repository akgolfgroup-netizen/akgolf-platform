"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Eye, Edit2, MoreHorizontal, ChevronsUpDown, Check, Mail, Tag, Download, X } from "lucide-react";
import { searchStudents } from "@/app/portal/(dashboard)/admin/elever/actions";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import { AppleAvatar, AppleBadge, AppleCard } from "@/components/portal/apple";
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

const tierVariantMap: Record<string, "neutral" | "dark" | "success" | "info" | "warning"> = {
  VISITOR: "neutral",
  ACADEMY: "dark",
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
    } catch (err) {
      console.error(err);
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
      <div className="flex items-center gap-4 bg-white/70 backdrop-blur-xl p-4 px-5 rounded-2xl border border-white/50 shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-card-hover)]">
        {/* Search */}
        <div className="flex items-center gap-3 flex-1 px-4 py-3 bg-[var(--color-grey-100)] rounded-xl border border-transparent focus-within:bg-white focus-within:border-[var(--color-grey-900)] focus-within:shadow-[0_0_0_3px_var(--color-grey-100)] transition-all">
          <Search className="w-[18px] h-[18px] text-[var(--color-grey-400)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Sok etter navn, e-post eller telefon..."
            className="flex-1 bg-transparent border-none text-sm text-[var(--color-grey-900)] placeholder:text-[var(--color-grey-400)] outline-none"
          />
        </div>

        <div className="w-px h-8 bg-[var(--color-grey-200)]" />

        {/* Filters */}
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-[var(--color-grey-500)]">Medlemskap:</span>
          <select className="px-4 py-2 pr-8 text-sm font-medium text-[var(--color-grey-700)] bg-[var(--color-grey-100)] border border-[var(--color-grey-200)] rounded-xl cursor-pointer appearance-none focus:outline-none focus:border-[var(--color-grey-900)] bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%238E8E93%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center]">
            <option>Alle</option>
            <option>ELITE</option>
            <option>PRO</option>
            <option>STARTER</option>
            <option>ACADEMY</option>
            <option>VISITOR</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-[var(--color-grey-500)]">Status:</span>
          <select className="px-4 py-2 pr-8 text-sm font-medium text-[var(--color-grey-700)] bg-[var(--color-grey-100)] border border-[var(--color-grey-200)] rounded-xl cursor-pointer appearance-none focus:outline-none focus:border-[var(--color-grey-900)] bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%238E8E93%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center]">
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
            className="flex items-center gap-4 px-5 py-4 bg-[var(--color-grey-900)] text-white rounded-2xl shadow-[var(--shadow-md)]"
          >
            <span className="text-sm font-medium">
              <strong>{selectedIds.size}</strong> elever valgt
            </span>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-[13px] font-medium rounded-xl transition-colors">
              <Mail className="w-4 h-4" />
              Send e-post
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-[13px] font-medium rounded-xl transition-colors">
              <Tag className="w-4 h-4" />
              Endre medlemskap
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-[13px] font-medium rounded-xl transition-colors">
              <Download className="w-4 h-4" />
              Eksporter
            </button>
            <button
              onClick={clearSelection}
              className="ml-auto w-8 h-8 flex items-center justify-center bg-white/15 hover:bg-white/25 rounded-xl transition-colors"
            >
              <X className="w-[18px] h-[18px]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Total count */}
      <p className="text-xs text-[var(--color-grey-500)]">{total} elever totalt</p>

      {/* Data Table - Glassmorphism */}
      <AppleCard variant="glass" padding="none" hover={false} className="overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[48px_1fr_120px_100px_140px_140px_100px] gap-4 px-5 py-4 bg-[var(--color-grey-100)] border-b border-[var(--color-grey-200)]">
          <div className="flex items-center justify-center">
            <button
              onClick={toggleSelectAll}
              className={cn(
                "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                selectedIds.size === students.length && students.length > 0
                  ? "bg-[var(--color-grey-900)] border-[var(--color-grey-900)]"
                  : "border-[var(--color-grey-300)] hover:border-[var(--color-grey-900)]"
              )}
            >
              {selectedIds.size === students.length && students.length > 0 && (
                <Check className="w-3.5 h-3.5 text-white" />
              )}
            </button>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-[var(--color-grey-500)] uppercase tracking-[0.06em] cursor-pointer hover:text-[var(--color-grey-900)]">
            Elev <ChevronsUpDown className="w-3.5 h-3.5" />
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-[var(--color-grey-500)] uppercase tracking-[0.06em] cursor-pointer hover:text-[var(--color-grey-900)]">
            Medlemskap <ChevronsUpDown className="w-3.5 h-3.5" />
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-[var(--color-grey-500)] uppercase tracking-[0.06em] cursor-pointer hover:text-[var(--color-grey-900)]">
            Handicap <ChevronsUpDown className="w-3.5 h-3.5" />
          </span>
          <span className="text-[11px] font-semibold text-[var(--color-grey-500)] uppercase tracking-[0.06em]">
            Timer (mnd)
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-[var(--color-grey-500)] uppercase tracking-[0.06em] cursor-pointer hover:text-[var(--color-grey-900)]">
            Sist aktiv <ChevronsUpDown className="w-3.5 h-3.5" />
          </span>
          <span className="text-[11px] font-semibold text-[var(--color-grey-500)] uppercase tracking-[0.06em]">
            Handlinger
          </span>
        </div>

        {/* Table Body */}
        {loading ? (
          <div className="py-12 text-center text-[var(--color-grey-500)]">Laster...</div>
        ) : students.length === 0 ? (
          <div className="py-12 text-center text-[var(--color-grey-500)] text-sm">
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
                  "grid grid-cols-[48px_1fr_120px_100px_140px_140px_100px] gap-4 px-5 py-4 items-center border-b border-[var(--color-grey-100)] last:border-b-0 transition-all duration-200 hover:bg-[rgba(99,102,241,0.04)] hover:scale-[1.005]",
                  isSelected && "bg-[var(--color-grey-100)]"
                )}
              >
                {/* Checkbox */}
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => toggleSelect(student.id)}
                    className={cn(
                      "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                      isSelected
                        ? "bg-[var(--color-grey-900)] border-[var(--color-grey-900)]"
                        : "border-[var(--color-grey-300)] hover:border-[var(--color-grey-900)]"
                    )}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                </div>

                {/* Student Info */}
                <div className="flex items-center gap-3">
                  <AppleAvatar
                    src={student.image}
                    name={student.name || "?"}
                    size="md"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-[var(--color-grey-900)] truncate">
                      {student.name ?? "Ukjent"}
                    </span>
                    <span className="text-xs text-[var(--color-grey-500)] truncate">
                      {student.email}
                    </span>
                  </div>
                </div>

                {/* Tier Badge */}
                <AppleBadge variant={tierVariantMap[tier]} size="sm">
                  {tierLabelMap[tier]}
                </AppleBadge>

                {/* Handicap */}
                <span className="font-mono text-sm font-medium text-[var(--color-grey-700)]">
                  {student.handicap !== null && student.handicap !== undefined
                    ? student.handicap.toFixed(1)
                    : "—"}
                </span>

                {/* Sessions with progress bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-[var(--color-grey-100)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-grey-900)] rounded-full transition-all"
                      style={{ width: `${sessionPercent}%` }}
                    />
                  </div>
                  <span className="text-[13px] font-medium text-[var(--color-grey-700)] min-w-[24px]">
                    {student._count.coachingSessions}
                  </span>
                </div>

                {/* Last Active */}
                <span
                  className={cn(
                    "text-[13px]",
                    isRecentlyActive(student.lastActiveAt)
                      ? "text-green-600 font-medium"
                      : "text-[var(--color-grey-500)]"
                  )}
                >
                  {getLastActiveLabel(student.lastActiveAt)}
                </span>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/portal/admin/elever/${student.id}`}
                    className="w-8 h-8 rounded-lg border border-[var(--color-grey-200)] bg-white flex items-center justify-center hover:border-[var(--color-grey-900)] hover:bg-[var(--color-grey-100)] transition-all group"
                  >
                    <Eye className="w-4 h-4 text-[var(--color-grey-500)] group-hover:text-[var(--color-grey-900)]" />
                  </Link>
                  <button className="w-8 h-8 rounded-lg border border-[var(--color-grey-200)] bg-white flex items-center justify-center hover:border-[var(--color-grey-900)] hover:bg-[var(--color-grey-100)] transition-all group">
                    <Edit2 className="w-4 h-4 text-[var(--color-grey-500)] group-hover:text-[var(--color-grey-900)]" />
                  </button>
                  <button className="w-8 h-8 rounded-lg border border-[var(--color-grey-200)] bg-white flex items-center justify-center hover:border-[var(--color-grey-900)] hover:bg-[var(--color-grey-100)] transition-all group">
                    <MoreHorizontal className="w-4 h-4 text-[var(--color-grey-500)] group-hover:text-[var(--color-grey-900)]" />
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Pagination */}
        {students.length > 0 && (
          <div className="flex items-center justify-between px-5 py-4 bg-[var(--color-grey-100)] border-t border-[var(--color-grey-200)]">
            <span className="text-[13px] text-[var(--color-grey-500)]">
              Viser 1-{students.length} av {total} elever
            </span>
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-xl border border-[var(--color-grey-200)] bg-white text-sm font-medium text-[var(--color-grey-700)] flex items-center justify-center hover:border-[var(--color-grey-900)] hover:bg-[var(--color-grey-100)] hover:text-[var(--color-grey-900)] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                &lt;
              </button>
              <button className="w-9 h-9 rounded-xl bg-[var(--color-grey-900)] text-white text-sm font-medium flex items-center justify-center">
                1
              </button>
              <button className="w-9 h-9 rounded-xl border border-[var(--color-grey-200)] bg-white text-sm font-medium text-[var(--color-grey-700)] flex items-center justify-center hover:border-[var(--color-grey-900)] hover:bg-[var(--color-grey-100)] hover:text-[var(--color-grey-900)] transition-all">
                2
              </button>
              <button className="w-9 h-9 rounded-xl border border-[var(--color-grey-200)] bg-white text-sm font-medium text-[var(--color-grey-700)] flex items-center justify-center hover:border-[var(--color-grey-900)] hover:bg-[var(--color-grey-100)] hover:text-[var(--color-grey-900)] transition-all">
                3
              </button>
              <button className="w-9 h-9 rounded-xl border border-[var(--color-grey-200)] bg-white text-sm font-medium text-[var(--color-grey-700)] flex items-center justify-center hover:border-[var(--color-grey-900)] hover:bg-[var(--color-grey-100)] hover:text-[var(--color-grey-900)] transition-all">
                &gt;
              </button>
            </div>
          </div>
        )}
      </AppleCard>
    </div>
  );
}
