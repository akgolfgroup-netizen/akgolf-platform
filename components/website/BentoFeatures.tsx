"use client";

import { motion } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  ResponsiveContainer,
} from "recharts";
import { StaggerContainer, StaggerItem } from "./RevealOnScroll";
import { SectionLabel } from "./SectionLabel";
import { Target, Sparkles, Crosshair } from "lucide-react";
import { RevealOnScroll } from "./RevealOnScroll";

const sgData = [
  { subject: "OtT", normalized: 1.8 },
  { subject: "App", normalized: 0.7 },
  { subject: "NS", normalized: 1.1 },
  { subject: "Putt", normalized: 1.4 },
];

const trainingDays = [
  { day: "Ma", done: true },
  { day: "Ti", done: true },
  { day: "On", done: true },
  { day: "To", done: false },
];

export function BentoFeatures() {
  return (
    <section className="py-[120px] md:py-[160px] bg-white">
      <div className="w-container">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <SectionLabel>Metodikk</SectionLabel>
            <h2 className="w-heading-lg mt-5">Data-drevet coaching</h2>
            <p className="text-[#5A6E66] max-w-xl mx-auto mt-5 text-lg leading-relaxed">
              Kombinasjonen av TrackMan-data, Strokes Gained-analyse og
              individuell oppfolging gir deg en klar retning.
            </p>
          </div>
        </RevealOnScroll>

        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          staggerDelay={0.12}
        >
          {/* ── SG Card (large 2x2) ── */}
          <StaggerItem className="md:col-span-2 md:row-span-2">
            <div className="bg-white rounded-[20px] p-10 md:p-12 h-full border border-[#D5DFDB] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 bg-[#ECF0EF]">
                <Target className="w-5 h-5 text-[#0A1F18]" />
              </div>
              <h3 className="font-display text-xl md:text-2xl font-bold mb-3 text-[#0A1F18]">
                Strokes Gained-analyse
              </h3>
              <p className="text-sm leading-relaxed text-[#5A6E66] max-w-md">
                Identifiser noyaktig hvor du taper og vinner slag sammenlignet
                med ditt handicap-niva. Data-drevet beslutninger for treningen
                din.
              </p>

              {/* Animated Recharts Radar */}
              <motion.div
                className="absolute right-4 bottom-4 w-44 h-44 md:w-56 md:h-56"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={sgData} cx="50%" cy="50%" outerRadius="75%">
                    <PolarGrid stroke="#D5DFDB" strokeWidth={0.5} />
                    <Radar
                      dataKey="normalized"
                      stroke="#005840"
                      fill="#005840"
                      fillOpacity={0.1}
                      strokeWidth={2}
                      animationDuration={1200}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
          </StaggerItem>

          {/* ── AI Card (small) ── */}
          <StaggerItem className="md:col-span-1">
            <div className="bg-[var(--color-brand-light)] rounded-[20px] p-8 h-full border border-[#D5DFDB] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 bg-[var(--color-brand)]/10">
                <Sparkles className="w-5 h-5 text-[var(--color-brand)]" />
              </div>
              <h3 className="font-display text-xl font-bold mb-3 text-[#0A1F18]">
                AI-drevet treningsplan
              </h3>
              <p className="text-sm leading-relaxed text-[#5A6E66]">
                Personlig treningsplan som oppdateres etter hver okt basert pa
                dine data.
              </p>

              {/* Mini training plan preview */}
              <div className="mt-5 flex gap-2">
                {trainingDays.map((d) => (
                  <div key={d.day} className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-10 h-10 rounded-lg ${
                        d.done ? "bg-[#005840]" : "bg-[#D5DFDB]"
                      }`}
                    />
                    <span className="text-[10px] font-medium text-[#5A6E66]">
                      {d.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </StaggerItem>

          {/* ── TrackMan Card (small, dark) ── */}
          <StaggerItem className="md:col-span-1">
            <div className="bg-[#0A1F18] rounded-[20px] p-8 h-full border border-transparent transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 bg-white/10">
                <Crosshair className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold mb-3 text-white">
                TrackMan-integrasjon
              </h3>
              <p className="text-sm leading-relaxed text-[#7A8C85]">
                Hver okt inkluderer fullstendig TrackMan-analyse med balldata og
                klubbdata.
              </p>

              {/* TrackMan data preview */}
              <div className="mt-5 space-y-1.5 font-mono text-xs tabular-nums text-white/60">
                <div className="flex justify-between">
                  <span>Klubbhastighet</span>
                  <span>98 mph</span>
                </div>
                <div className="flex justify-between">
                  <span>Ballhastighet</span>
                  <span>145 mph</span>
                </div>
                <div className="flex justify-between">
                  <span>Carry</span>
                  <span>245 m</span>
                </div>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
