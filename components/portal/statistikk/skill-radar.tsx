"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface SkillData {
  skill: string;
  player: number;
  scratch: number;
  tour: number;
  fullSkill: string;
}

interface SkillRadarProps {
  playerSkills: {
    driving: number;
    irons: number;
    chipping: number;
    putting: number;
    mental: number;
    physical: number;
  };
  showComparison?: boolean;
}

// Benchmark values (0-100 scale)
const BENCHMARKS = {
  scratch: {
    driving: 75,
    irons: 75,
    chipping: 75,
    putting: 75,
    mental: 75,
    physical: 75,
  },
  tour: {
    driving: 92,
    irons: 92,
    chipping: 92,
    putting: 92,
    mental: 90,
    physical: 90,
  },
};

const SKILL_LABELS: Record<string, string> = {
  driving: "Driving",
  irons: "Jern",
  chipping: "Chipping",
  putting: "Putting",
  mental: "Mental",
  physical: "Fysisk",
};

const SKILL_DESCRIPTIONS: Record<string, string> = {
  driving: "Driving accuracy & distance",
  irons: "Approach & iron play",
  chipping: "Short game around green",
  putting: "Putting accuracy & lag",
  mental: "Course management & focus",
  physical: "Fitness & flexibility",
};

export function SkillRadar({
  playerSkills,
  showComparison = true,
}: SkillRadarProps) {
  const data: SkillData[] = [
    {
      skill: SKILL_LABELS.driving,
      fullSkill: SKILL_DESCRIPTIONS.driving,
      player: playerSkills.driving,
      scratch: BENCHMARKS.scratch.driving,
      tour: BENCHMARKS.tour.driving,
    },
    {
      skill: SKILL_LABELS.irons,
      fullSkill: SKILL_DESCRIPTIONS.irons,
      player: playerSkills.irons,
      scratch: BENCHMARKS.scratch.irons,
      tour: BENCHMARKS.tour.irons,
    },
    {
      skill: SKILL_LABELS.chipping,
      fullSkill: SKILL_DESCRIPTIONS.chipping,
      player: playerSkills.chipping,
      scratch: BENCHMARKS.scratch.chipping,
      tour: BENCHMARKS.tour.chipping,
    },
    {
      skill: SKILL_LABELS.putting,
      fullSkill: SKILL_DESCRIPTIONS.putting,
      player: playerSkills.putting,
      scratch: BENCHMARKS.scratch.putting,
      tour: BENCHMARKS.tour.putting,
    },
    {
      skill: SKILL_LABELS.mental,
      fullSkill: SKILL_DESCRIPTIONS.mental,
      player: playerSkills.mental,
      scratch: BENCHMARKS.scratch.mental,
      tour: BENCHMARKS.tour.mental,
    },
    {
      skill: SKILL_LABELS.physical,
      fullSkill: SKILL_DESCRIPTIONS.physical,
      player: playerSkills.physical,
      scratch: BENCHMARKS.scratch.physical,
      tour: BENCHMARKS.tour.physical,
    },
  ];

  // Calculate overall scores
  const playerOverall = Math.round(
    Object.values(playerSkills).reduce((a, b) => a + b, 0) / 6
  );
  const scratchOverall = 75;
  const tourOverall = 91;

  // Find strongest and weakest skills
  const skillsArray = Object.entries(playerSkills).map(([key, value]) => ({
    name: SKILL_LABELS[key],
    value,
  }));
  const strongest = skillsArray.reduce((best, current) =>
    current.value > best.value ? current : best
  );
  const weakest = skillsArray.reduce((worst, current) =>
    current.value < worst.value ? current : worst
  );

  return (
    <div className="w-full">
      {/* Stats summary */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="text-center p-2 rounded-lg bg-[#1E293B]/50">
          <p className="text-[9px] font-medium uppercase tracking-wider text-[#94A3B8] mb-1">
            Din score
          </p>
          <p className="text-lg font-bold text-[#F8FAFC]">{playerOverall}</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-[#1E293B]/50">
          <p className="text-[9px] font-medium uppercase tracking-wider text-[#94A3B8] mb-1">
            Scratch
          </p>
          <p className="text-lg font-bold text-[#94A3B8]">{scratchOverall}</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-[#1E293B]/50">
          <p className="text-[9px] font-medium uppercase tracking-wider text-[#94A3B8] mb-1">
            Tour
          </p>
          <p className="text-lg font-bold text-[#D4AF37]">{tourOverall}</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-[#1E293B]/50">
          <p className="text-[9px] font-medium uppercase tracking-wider text-[#94A3B8] mb-1">
            Gap til Tour
          </p>
          <p className="text-lg font-bold text-[#B84233]">+{tourOverall - playerOverall}</p>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="h-[260px] sm:h-[320px]" role="img" aria-label="Ferdighetsprofil radar">
        <ResponsiveContainer>
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="#334155" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fill: "#F8FAFC", fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              domain={[0, 100]}
              tick={{ fill: "#64748B", fontSize: 9 }}
              tickCount={5}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#1E293B",
                border: "1px solid #334155",
                borderRadius: 8,
                fontSize: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
              itemStyle={{ color: "#F8FAFC" }}
              formatter={(value, name, props) => {
                const payload = (props as { payload?: SkillData })?.payload;
                const skillDesc = payload?.fullSkill || "";
                return [`${Number(value)}/100`, `${name}${skillDesc ? ` - ${skillDesc}` : ""}`];
              }}
            />
            {showComparison && (
              <>
                <Radar
                  name="Tour Pro"
                  dataKey="tour"
                  stroke="#D4AF37"
                  fill="#D4AF37"
                  fillOpacity={0.1}
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                />
                <Radar
                  name="Scratch"
                  dataKey="scratch"
                  stroke="#94A3B8"
                  fill="#94A3B8"
                  fillOpacity={0.1}
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                />
              </>
            )}
            <Radar
              name="Din profil"
              dataKey="player"
              stroke="#2A7D5A"
              fill="#2A7D5A"
              fillOpacity={0.25}
              strokeWidth={2.5}
              dot={{ fill: "#2A7D5A", r: 4, strokeWidth: 2, stroke: "#1E293B" }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 16 }}
              iconType="circle"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Skill insights */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-[#2A7D5A]/10 border border-[#2A7D5A]/30">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#2A7D5A] mb-1">
            Sterkeste omrade
          </p>
          <p className="text-sm font-semibold text-[#F8FAFC]">{strongest.name}</p>
          <p className="text-xs text-[#94A3B8]">{strongest.value}/100</p>
        </div>
        <div className="p-3 rounded-lg bg-[#B84233]/10 border border-[#B84233]/30">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#B84233] mb-1">
            Utviklingsomrade
          </p>
          <p className="text-sm font-semibold text-[#F8FAFC]">{weakest.name}</p>
          <p className="text-xs text-[#94A3B8]">{weakest.value}/100</p>
        </div>
      </div>
    </div>
  );
}
