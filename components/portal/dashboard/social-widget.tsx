"use client";

import { motion } from "framer-motion";
import { Users, Trophy, Flame, ChevronRight } from "lucide-react";
import Link from "next/link";

interface SocialData {
  rank: number;
  totalPlayers: number;
  challenges: {
    id: string;
    name: string;
    progress: number;
    endDate: string;
  }[];
  streak: number;
  friendsOnline: number;
}

interface SocialWidgetProps {
  data?: SocialData;
}

export function SocialWidget({ data }: SocialWidgetProps) {
  const hasData = data != null;

  if (!hasData) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold text-slate-100">Sosialt</h3>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Bli med i fellesskapet. Konkurrer med venner og andre spillere.
        </p>
        <Link
          href="/portal/sosialt"
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg text-sm font-medium hover:bg-amber-500/30 transition-colors"
        >
          <Trophy className="w-4 h-4" />
          Utforsk
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold text-slate-100">Sosialt</h3>
        </div>
        <Link
          href="/portal/sosialt"
          className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
        >
          Se alt →
        </Link>
      </div>

      {/* Rangering */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 p-3 bg-slate-800/50 rounded-xl text-center">
          <p className="text-2xl font-bold text-slate-100">#{data.rank}</p>
          <p className="text-xs text-slate-400">av {data.totalPlayers}</p>
        </div>
        <div className="flex-1 p-3 bg-slate-800/50 rounded-xl text-center">
          <div className="flex items-center justify-center gap-1">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-2xl font-bold text-slate-100">{data.streak}</span>
          </div>
          <p className="text-xs text-slate-400">dager streak</p>
        </div>
      </div>

      {/* Aktive utfordringer */}
      {data.challenges.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-400">Aktive utfordringer</p>
          {data.challenges.slice(0, 2).map((challenge) => (
            <div key={challenge.id} className="p-2 bg-slate-800/30 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-200">{challenge.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5">
                <div
                  className="bg-amber-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${challenge.progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">{challenge.progress}% • Slutter {challenge.endDate}</p>
            </div>
          ))}
        </div>
      )}

      {data.friendsOnline > 0 && (
        <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          {data.friendsOnline} venn{data.friendsOnline > 1 ? 'er' : ''} online
        </p>
      )}
    </motion.div>
  );
}
