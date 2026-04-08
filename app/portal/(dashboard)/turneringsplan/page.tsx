"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { nb } from "date-fns/locale";
import { Trophy, Calendar, CheckCircle2, MapPin, Clock, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { QuickAction } from "@/components/portal/heritage/quick-action";

// Mock tournaments
const mockTournaments = [
  {
    id: "1",
    name: "NM Match",
    date: new Date(2024, 7, 15),
    location: "Oslo Golfklubb",
    status: "registered" as const,
    type: "Match",
    preparationProgress: 80,
  },
  {
    id: "2",
    name: "Klubbmesterskap",
    date: new Date(2024, 7, 28),
    location: "Bærums GK",
    status: "planning" as const,
    type: "Stroke",
    preparationProgress: 45,
  },
  {
    id: "3",
    name: "Hovland Open",
    date: new Date(2024, 8, 12),
    location: "Vik Golf",
    status: "registered" as const,
    type: "Stroke",
    preparationProgress: 30,
  },
];

const preparationChecklist = [
  { id: "1", task: "Registrer deg på turneringen", completed: true },
  { id: "2", task: "Book overnatting", completed: true },
  { id: "3", task: "Planlegg treningsøkter uken før", completed: false },
  { id: "4", task: "Forbered utstyr", completed: false },
  { id: "5", task: "Studer banen", completed: false },
  { id: "6", task: "Planlegg måltider", completed: false },
];

export default function TurneringsplanPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTournamentForDay = (day: Date) => {
    return mockTournaments.find((t) => isSameDay(t.date, day));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1c1c16]">Turneringsplan</h1>
          <p className="text-[#6b7366] mt-1">Planlegg og forbered dine turneringer</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#154212] text-white text-sm font-medium hover:bg-[#0d2e0c] transition-colors">
          <Plus className="w-4 h-4" />
          Legg til turnering
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#c2c9bb]/50 text-center">
          <p className="text-3xl font-bold text-[#1c1c16]">{mockTournaments.length}</p>
          <p className="text-xs text-[#6b7366] uppercase tracking-wider mt-1">Planlagt</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#c2c9bb]/50 text-center">
          <p className="text-3xl font-bold text-[#154212]">
            {mockTournaments.filter((t) => t.status === "registered").length}
          </p>
          <p className="text-xs text-[#6b7366] uppercase tracking-wider mt-1">Påmeldt</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#c2c9bb]/50 text-center">
          <p className="text-3xl font-bold text-[#f59e0b]">2</p>
          <p className="text-xs text-[#6b7366] uppercase tracking-wider mt-1">Fullført</p>
        </div>
      </div>

      {/* Calendar & List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-4 border border-[#c2c9bb]/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#1c1c16]">
              {format(currentMonth, "MMMM yyyy", { locale: nb })}
            </h3>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
                className="p-1.5 rounded-lg hover:bg-[#f7f3ea] transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-[#6b7366]" />
              </button>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-1.5 rounded-lg hover:bg-[#f7f3ea] transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-[#6b7366]" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"].map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-[#8a9385] py-2">
                {day}
              </div>
            ))}
            {days.map((day, index) => {
              const tournament = getTournamentForDay(day);
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => tournament && setSelectedTournament(tournament.id)}
                  className={`aspect-square rounded-lg p-1 text-sm transition-colors ${
                    tournament
                      ? "bg-[#154212] text-white hover:bg-[#0d2e0c]"
                      : "hover:bg-[#f7f3ea] text-[#1c1c16]"
                  }`}
                >
                  {format(day, "d")}
                  {tournament && (
                    <div className="text-[8px] truncate mt-0.5 opacity-80">{tournament.name}</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Upcoming */}
        <div className="bg-white rounded-2xl p-5 border border-[#c2c9bb]/50">
          <h3 className="font-semibold text-[#1c1c16] mb-4">Kommende</h3>
          <div className="space-y-3">
            {mockTournaments.map((tournament) => (
              <motion.div
                key={tournament.id}
                whileHover={{ scale: 1.02 }}
                className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                  selectedTournament === tournament.id
                    ? "border-[#154212] bg-[#e8f0e5]"
                    : "border-[#c2c9bb]/30 hover:border-[#c2c9bb]"
                }`}
                onClick={() => setSelectedTournament(tournament.id)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-[#8a9385]">{tournament.type}</span>
                  {tournament.status === "registered" ? (
                    <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
                  ) : (
                    <Clock className="w-4 h-4 text-[#f59e0b]" />
                  )}
                </div>
                <h4 className="font-medium text-[#1c1c16]">{tournament.name}</h4>
                <p className="text-xs text-[#6b7366] mt-1">
                  {format(tournament.date, "d. MMMM", { locale: nb })}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Tournament Details */}
      {selectedTournament && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 border border-[#c2c9bb]/50"
        >
          {(() => {
            const tournament = mockTournaments.find((t) => t.id === selectedTournament)!;
            return (
              <>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-5 h-5 text-[#f59e0b]" />
                      <span className="text-sm text-[#6b7366]">{tournament.type}</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#1c1c16]">{tournament.name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-[#6b7366]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(tournament.date, "EEEE d. MMMM yyyy", { locale: nb })}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {tournament.location}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      tournament.status === "registered"
                        ? "bg-[#22c55e]/10 text-[#22c55e]"
                        : "bg-[#f59e0b]/10 text-[#f59e0b]"
                    }`}
                  >
                    {tournament.status === "registered" ? "Påmeldt" : "Planlegger"}
                  </span>
                </div>

                {/* Preparation Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#1c1c16]">Forberedelse</span>
                    <span className="text-sm text-[#6b7366]">{tournament.preparationProgress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#f7f3ea] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#154212] transition-all duration-500"
                      style={{ width: `${tournament.preparationProgress}%` }}
                    />
                  </div>
                </div>

                {/* Checklist */}
                <h4 className="font-medium text-[#1c1c16] mb-3">Sjekkliste</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {preparationChecklist.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-[#f7f3ea] cursor-pointer hover:bg-[#e8e4db] transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        readOnly
                        className="w-5 h-5 rounded border-[#c2c9bb] text-[#154212] focus:ring-[#154212]"
                      />
                      <span className={`text-sm ${item.completed ? "text-[#8a9385] line-through" : "text-[#1c1c16]"}`}>
                        {item.task}
                      </span>
                    </label>
                  ))}
                </div>
              </>
            );
          })()}
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <QuickAction href="#" icon={Plus} label="Finn turneringer" description="Søk i terminlisten" />
        <QuickAction href="#" icon={MapPin} label="Baneguide" description="Utforsk baner" />
        <QuickAction href="#" icon={Calendar} label="Reiseplanlegger" description="Bestill reise" />
      </div>
    </div>
  );
}
