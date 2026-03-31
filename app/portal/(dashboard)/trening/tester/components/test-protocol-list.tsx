"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock,
  Target,
  ChevronRight,
  Search,
  Zap,
  Crosshair,
  Ruler,
  Wind,
  RotateCcw,
  Gauge,
  CircleDot,
  Disc,
  Car,
  Trophy,
} from "lucide-react";

interface TestProtocol {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  min_category: string;
  max_category: string;
  duration_minutes: number;
  shots_required: number;
  clubs: string[];
  metrics_tracked: string[];
  is_official: boolean;
}

interface Category {
  key: string;
  label: string;
  description: string;
}

interface Props {
  categories: Category[];
  grouped: Record<string, TestProtocol[]>;
  userCategory: string;
}

const categoryIcons: Record<string, React.ElementType> = {
  speed: Zap,
  accuracy: Crosshair,
  distance_control: Ruler,
  ball_flight: Wind,
  consistency: RotateCcw,
  efficiency: Gauge,
  wedge: CircleDot,
  iron: Disc,
  driver: Car,
  benchmark: Trophy,
};

const difficultyColors: Record<string, string> = {
  nybegynner: "bg-[var(--color-grey-100)] text-[var(--color-success)]",
  rekrutt: "bg-[var(--color-grey-100)] text-[var(--color-info)]",
  klubb: "bg-[var(--color-grey-100)] text-[var(--color-warning)]",
  regional: "bg-[var(--color-grey-100)] text-[var(--color-grey-700)]",
  nasjonal: "bg-[var(--color-grey-100)] text-[var(--color-error)]",
  elite: "bg-[var(--color-grey-100)] text-[var(--color-grey-900)]",
};

const difficultyLabels: Record<string, string> = {
  nybegynner: "Nybegynner",
  rekrutt: "Rekrutt",
  klubb: "Klubb",
  regional: "Regional",
  nasjonal: "Nasjonal",
  elite: "Elite",
};

export function TestProtocolList({ categories, grouped, userCategory }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const difficulties = ["nybegynner", "rekrutt", "klubb", "regional", "nasjonal", "elite"];

  const filteredCategories = categories.filter((cat) => {
    if (selectedCategory && cat.key !== selectedCategory) return false;
    return true;
  });

  const filterProtocols = (protocols: TestProtocol[]) => {
    return protocols.filter((p) => {
      if (selectedDifficulty && p.difficulty !== selectedDifficulty) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.description.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-grey-400)]" />
          <input
            type="text"
            placeholder="Sok etter test..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-[var(--color-grey-200)] rounded-[12px] text-[var(--color-grey-900)] placeholder-[var(--color-grey-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-400)]"
          />
        </div>

        <select
          value={selectedCategory ?? ""}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
          className="px-4 py-2 bg-white border border-[var(--color-grey-200)] rounded-[12px] text-[var(--color-grey-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-400)]"
        >
          <option value="">Alle kategorier</option>
          {categories.map((cat) => (
            <option key={cat.key} value={cat.key}>
              {cat.label}
            </option>
          ))}
        </select>

        <select
          value={selectedDifficulty ?? ""}
          onChange={(e) => setSelectedDifficulty(e.target.value || null)}
          className="px-4 py-2 bg-white border border-[var(--color-grey-200)] rounded-[12px] text-[var(--color-grey-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-400)]"
        >
          <option value="">Alle nivaer</option>
          {difficulties.map((diff) => (
            <option key={diff} value={diff}>
              {difficultyLabels[diff]}
            </option>
          ))}
        </select>
      </div>

      {/* Categories and tests */}
      <div className="space-y-8">
        {filteredCategories.map((cat) => {
          const protocols = filterProtocols(grouped[cat.key] ?? []);
          if (protocols.length === 0) return null;

          const Icon = categoryIcons[cat.key] ?? Target;

          return (
            <div key={cat.key} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-[var(--color-grey-100)] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[var(--color-grey-900)]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[var(--color-grey-900)]">{cat.label}</h2>
                  <p className="text-sm text-[var(--color-grey-500)]">{cat.description}</p>
                </div>
                <span className="ml-auto text-sm text-[var(--color-grey-400)]">
                  {protocols.length} tester
                </span>
              </div>

              <div className="grid gap-3">
                {protocols.map((protocol) => (
                  <Link
                    key={protocol.id}
                    href={`/portal/trening/tester/${protocol.id}`}
                    className="group bg-white border border-[var(--color-grey-200)] rounded-[20px] p-4 hover:border-[var(--color-grey-400)] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-[var(--color-grey-900)] group-hover:text-[var(--color-grey-600)] transition-colors">
                            {protocol.name}
                          </h3>
                          {protocol.is_official && (
                            <span className="px-2 py-0.5 text-xs bg-[var(--color-grey-100)] text-[var(--color-grey-900)] rounded-full">
                              Offisiell
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[var(--color-grey-500)] line-clamp-1">
                          {protocol.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[var(--color-grey-400)]">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {protocol.duration_minutes} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            {protocol.shots_required} slag
                          </span>
                          <span>
                            {protocol.clubs.slice(0, 2).join(", ")}
                            {protocol.clubs.length > 2 && ` +${protocol.clubs.length - 2}`}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            difficultyColors[protocol.difficulty] ?? "bg-[var(--color-grey-100)] text-[var(--color-grey-500)]"
                          }`}
                        >
                          {difficultyLabels[protocol.difficulty] ?? protocol.difficulty}
                        </span>
                        <ChevronRight className="w-5 h-5 text-[var(--color-grey-400)] group-hover:text-[var(--color-grey-600)] transition-colors" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
