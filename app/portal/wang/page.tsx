/**
 * Wang Hub — Multi-Sport Management Dashboard
 * Part of AK Sports OS Heritage Tech platform
 * 
 * Features:
 * - Multi-sport overview (11 sports supported)
 * - Load management and monitoring
 * - Student-athlete tracking
 * - Integration with school competency goals
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Users,
  School,
  Trophy,
  TrendingUp,
  Calendar,
  ArrowRight,
  Zap,
  Target,
  BarChart3,
  Clock,
  AlertCircle,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════════
// HERITAGE TECH TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

const heritage = {
  colors: {
    deep: '#2D5A27',
    lime: '#DFFF00',
    limeMuted: 'rgba(223, 255, 0, 0.12)',
    graphite: '#2A2D2A',
    charcoal: '#3A3D3A',
    ink: '#1A1D1A',
    pure: '#0A0D0A',
    cream: '#F5F1E8',
    warmGrey: '#8A8680',
    wangBlue: '#00D4FF',
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════

const sportsData = [
  { name: "Golf", students: 24, load: "Moderat", trend: "up", color: heritage.colors.lime },
  { name: "Fotball", students: 42, load: "Høy", trend: "stable", color: "#FF6B6B" },
  { name: "Håndball", students: 38, load: "Høy", trend: "up", color: "#4ECDC4" },
  { name: "Ski", students: 31, load: "Moderat", trend: "down", color: "#95E1D3" },
  { name: "Svømming", students: 19, load: "Lav", trend: "stable", color: "#6C5CE7" },
  { name: "Friidrett", students: 27, load: "Moderat", trend: "up", color: "#FDCB6E" },
];

const recentActivities = [
  { sport: "Golf", activity: "Treningscamp Oslo", date: "I dag", status: "Pågår" },
  { sport: "Fotball", activity: "Kamp vs Vålerenga", date: "I morgen", status: "Planlagt" },
  { sport: "Håndball", activity: "Styrkeøkt", date: "3 dager", status: "Fullført" },
];

const loadWarnings = [
  { student: "Ola Nordmann", sport: "Fotball", issue: "Høy belastning 5 dager på rad", severity: "high" },
  { student: "Kari Hansen", sport: "Håndball", issue: "Manglende restitusjon", severity: "medium" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  trend, 
  color = heritage.colors.lime 
}: { 
  icon: any; 
  label: string; 
  value: string; 
  trend?: string;
  color?: string;
}) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="p-6 rounded-2xl"
    style={{ 
      backgroundColor: heritage.colors.charcoal,
      border: '1px solid rgba(255, 255, 255, 0.06)'
    }}
  >
    <div className="flex items-start justify-between mb-4">
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      {trend && (
        <span 
          className="text-xs font-medium px-2 py-1 rounded-full"
          style={{ 
            backgroundColor: trend === "up" ? 'rgba(0, 200, 83, 0.2)' : 'rgba(255, 184, 0, 0.2)',
            color: trend === "up" ? '#00C853' : '#FFB800'
          }}
        >
          {trend === "up" ? "+12%" : "-5%"}
        </span>
      )}
    </div>
    <div 
      className="text-3xl font-bold mb-1"
      style={{ color: heritage.colors.cream }}
    >
      {value}
    </div>
    <div className="text-sm" style={{ color: heritage.colors.warmGrey }}>
      {label}
    </div>
  </motion.div>
);

const SportCard = ({ sport }: { sport: typeof sportsData[0] }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="p-5 rounded-2xl cursor-pointer group"
    style={{ 
      backgroundColor: heritage.colors.charcoal,
      border: '1px solid rgba(255, 255, 255, 0.06)'
    }}
  >
    <div className="flex items-center justify-between mb-4">
      <div 
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: sport.color }}
      />
      <ArrowRight 
        className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: heritage.colors.warmGrey }}
      />
    </div>
    <h3 
      className="text-lg font-semibold mb-2"
      style={{ color: heritage.colors.cream }}
    >
      {sport.name}
    </h3>
    <div className="flex items-center gap-4 text-sm">
      <span style={{ color: heritage.colors.warmGrey }}>
        {sport.students} elever
      </span>
      <span 
        className="px-2 py-0.5 rounded text-xs"
        style={{ 
          backgroundColor: sport.load === "Høy" ? 'rgba(255, 61, 113, 0.2)' : 
                           sport.load === "Moderat" ? 'rgba(255, 184, 0, 0.2)' : 
                           'rgba(0, 200, 83, 0.2)',
          color: sport.load === "Høy" ? '#FF3D71' : 
                 sport.load === "Moderat" ? '#FFB800' : 
                 '#00C853'
        }}
      >
        {sport.load} belastning
      </span>
    </div>
  </motion.div>
);

const LoadWarningCard = ({ warning }: { warning: typeof loadWarnings[0] }) => (
  <div 
    className="p-4 rounded-xl flex items-start gap-3"
    style={{ 
      backgroundColor: warning.severity === "high" ? 'rgba(255, 61, 113, 0.1)' : 'rgba(255, 184, 0, 0.1)',
      border: `1px solid ${warning.severity === "high" ? 'rgba(255, 61, 113, 0.3)' : 'rgba(255, 184, 0, 0.3)'}`
    }}
  >
    <AlertCircle 
      className="w-5 h-5 flex-shrink-0 mt-0.5" 
      style={{ color: warning.severity === "high" ? '#FF3D71' : '#FFB800' }}
    />
    <div>
      <p className="text-sm font-medium" style={{ color: heritage.colors.cream }}>
        {warning.student} ({warning.sport})
      </p>
      <p className="text-xs mt-1" style={{ color: heritage.colors.warmGrey }}>
        {warning.issue}
      </p>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function WangHubPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${heritage.colors.wangBlue}20` }}
            >
              <School className="w-5 h-5" style={{ color: heritage.colors.wangBlue }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Wang Hub</h1>
              <p className="text-sm" style={{ color: heritage.colors.warmGrey }}>
                Multi-sport management for 11 idretter
              </p>
            </div>
          </div>
        </div>
        <button
          className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
          style={{ 
            backgroundColor: heritage.colors.wangBlue,
            color: heritage.colors.pure
          }}
        >
          <Calendar className="w-4 h-4" />
          Ny aktivitet
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Users} 
          label="Totalt elever" 
          value="181" 
          trend="up"
          color={heritage.colors.wangBlue}
        />
        <StatCard 
          icon={Activity} 
          label="Aktive idretter" 
          value="11" 
          color={heritage.colors.lime}
        />
        <StatCard 
          icon={Trophy} 
          label="Turneringer denne måned" 
          value="8" 
          color="#FF6B6B"
        />
        <StatCard 
          icon={TrendingUp} 
          label="Gjennomsnittlig belastning" 
          value="72%" 
          trend="stable"
          color="#FDCB6E"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sports Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold" style={{ color: heritage.colors.cream }}>
              Idrettsoversikt
            </h2>
            <button 
              className="text-sm flex items-center gap-1 transition-colors hover:text-white"
              style={{ color: heritage.colors.warmGrey }}
            >
              Se alle <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {sportsData.map((sport) => (
              <SportCard key={sport.name} sport={sport} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Load Warnings */}
          <div 
            className="p-6 rounded-2xl"
            style={{ 
              backgroundColor: heritage.colors.charcoal,
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5" style={{ color: '#FF3D71' }} />
              <h3 className="font-semibold" style={{ color: heritage.colors.cream }}>
                Belastningsadvarsler
              </h3>
            </div>
            <div className="space-y-3">
              {loadWarnings.map((warning, index) => (
                <LoadWarningCard key={index} warning={warning} />
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div 
            className="p-6 rounded-2xl"
            style={{ 
              backgroundColor: heritage.colors.charcoal,
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <h3 className="font-semibold mb-4" style={{ color: heritage.colors.cream }}>
              Kommende aktiviteter
            </h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div 
                    className="w-2 h-2 rounded-full mt-2"
                    style={{ 
                      backgroundColor: activity.status === "Pågår" ? heritage.colors.lime :
                                       activity.status === "Planlagt" ? heritage.colors.wangBlue :
                                       heritage.colors.warmGrey
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: heritage.colors.cream }}>
                      {activity.activity}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs" style={{ color: heritage.colors.warmGrey }}>
                        {activity.sport}
                      </span>
                      <span className="text-xs" style={{ color: heritage.colors.warmGrey }}>•</span>
                      <span className="text-xs" style={{ color: heritage.colors.warmGrey }}>
                        {activity.date}
                      </span>
                    </div>
                  </div>
                  <span 
                    className="text-xs px-2 py-1 rounded"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: heritage.colors.warmGrey
                    }}
                  >
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
