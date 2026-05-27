"use client";

import { motion } from "framer-motion";
import { Flame, Zap, CheckCircle2, Target } from "lucide-react";
import { Skeleton } from "@/components/layout/Skeleton";
import { cn } from "@/lib/utils";

interface StatsRowProps {
  stats?: {
    xp: number;
    currentStreak: number;
    habitsToday: number;
    habitsCompleted: number;
    rank: { name: string; color: string };
  };
  loading?: boolean;
}

export function StatsRow({ stats, loading }: StatsRowProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[100px] rounded-[2rem] bg-white/[0.02] border border-white/5" />
        ))}
      </div>
    );
  }

  const displayStats = [
    {
      label: "STREAK",
      value: `${stats.currentStreak}D`,
      icon: Flame,
      color: "#EF4444",
    },
    {
      label: "RANK",
      value: stats.rank.name,
      icon: Target,
      color: "#A855F7",
    },
    {
      label: "XP",
      value: stats.xp.toLocaleString(),
      icon: Zap,
      color: "#F59E0B",
    },
    {
      label: "OBJETIVOS",
      value: `${stats.habitsCompleted}/${stats.habitsToday}`,
      icon: CheckCircle2,
      color: "#22C55E",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {displayStats.map((stat, i) => (
        <div
          key={stat.label}
          className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-[2rem] p-6 flex flex-col justify-between min-h-[100px] hover:bg-white/[0.04] transition-all duration-300 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em] group-hover:text-zinc-400 transition-colors">{stat.label}</span>
            <stat.icon className="w-3.5 h-3.5 opacity-20 group-hover:opacity-100 transition-opacity duration-500" style={{ color: stat.color }} />
          </div>
          <p className="text-2xl font-black text-white italic tracking-tighter uppercase tabular-nums">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}

