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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Sok etter navn eller e-post..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8975C]/40"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-4 py-2 text-sm font-medium bg-[#0F2950] text-white rounded-lg hover:bg-[#0F2950]/90 transition-colors"
        >
          Sok
        </button>
      </div>

      <p className="text-xs text-gray-400">{total} elever totalt</p>

      {/* Student list */}
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {loading ? (
          <div className="py-12 text-center text-gray-400">Laster...</div>
        ) : students.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">
            Ingen elever funnet
          </div>
        ) : (
          students.map((student) => (
            <Link
              key={student.id}
              href={`/admin/elever/${student.id}`}
              className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              {student.image ? (
                <img
                  src={student.image}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-500">
                  {student.name?.charAt(0) ?? "?"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {student.name ?? "Ukjent"}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {student.email}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-gray-500">
                  {student._count.bookings} bookinger
                </p>
                <p className="text-xs text-gray-400">
                  {student._count.coachingSessions} okter
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
