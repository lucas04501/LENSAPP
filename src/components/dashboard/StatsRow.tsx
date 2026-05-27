"use client";

import { motion } from "framer-motion";
import { Flame, Timer, Zap, CheckCircle2 } from "lucide-react";
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
          <Skeleton key={i} className="h-[90px] rounded-2xl bg-white/[0.02] border border-white/5" />
        ))}
      </div>
    );
  }

  const displayStats = [
    {
      label: "STREAK",
      value: `${stats.currentStreak} days`,
      icon: Flame,
      color: "#EF4444",
    },
    {
      label: "FOCUS",
      value: "0h 0m",
      icon: Timer,
      color: "#A855F7",
    },
    {
      label: "TOTAL XP",
      value: stats.xp.toLocaleString(),
      icon: Zap,
      color: "#A855F7",
    },
    {
      label: "HABITS",
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
          className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-xl p-4 flex flex-col justify-between min-h-[90px] group hover:bg-white/[0.04] transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">{stat.label}</span>
            <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
          </div>
          <p className="text-xl font-black text-white italic tracking-tighter uppercase">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}


