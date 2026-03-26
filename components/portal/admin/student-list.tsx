"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { searchStudents } from "@/app/portal/(dashboard)/admin/elever/actions";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

interface Student {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  createdAt: Date;
  _count: { bookings: number; coachingSessions: number };
}

export function StudentList() {
  const [query, setQuery] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-snow)]/50" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Søk etter navn eller e-post..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm text-[var(--color-snow)] placeholder:text-[var(--color-snow)]/40 bg-[rgba(10,25,41,0.7)] border border-[rgba(15,41,80,0.4)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-4 py-2 text-sm font-medium bg-[var(--color-gold)] text-white rounded-xl hover:bg-[var(--color-gold)]/90 transition-colors"
        >
          Søk
        </button>
      </div>

      <p className="text-xs text-[var(--color-snow)]/50">{total} elever totalt</p>

      {/* Student list */}
      <div className="rounded-2xl border border-[rgba(15,41,80,0.4)] bg-[rgba(10,25,41,0.7)] backdrop-blur-md divide-y divide-[rgba(15,41,80,0.4)]">
        {loading ? (
          <div className="py-12 text-center text-[var(--color-snow)]/50">Laster...</div>
        ) : students.length === 0 ? (
          <div className="py-12 text-center text-[var(--color-snow)]/50 text-sm">
            Ingen elever funnet
          </div>
        ) : (
          students.map((student) => (
            <Link
              key={student.id}
              href={`/portal/admin/elever/${student.id}`}
              className="flex items-center gap-4 px-4 py-3 hover:bg-[rgba(15,41,80,0.3)] transition-colors"
            >
              {student.image ? (
                <img
                  src={student.image}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[rgba(15,41,80,0.5)] flex items-center justify-center text-sm font-semibold text-[var(--color-snow)]/70">
                  {student.name?.charAt(0) ?? "?"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-snow)] truncate">
                  {student.name ?? "Ukjent"}
                </p>
                <p className="text-xs text-[var(--color-snow)]/50 truncate">
                  {student.email}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-[var(--color-snow)]/70">
                  {student._count.bookings} bookinger
                </p>
                <p className="text-xs text-[var(--color-snow)]/50">
                  {student._count.coachingSessions} økter
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--color-snow)]/30 flex-shrink-0" />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
