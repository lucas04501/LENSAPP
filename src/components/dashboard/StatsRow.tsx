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
          <Skeleton key={i} className="h-[90px] rounded-2xl bg-[#0F0F14] border border-white/5" />
        ))}
      </div>
    );
  }

  const displayStats = [
    {
      label: "STREAK",
      value: `${stats.currentStreak} dias`,
      icon: Flame,
      color: "#EF4444",
    },
    {
      label: "RANK ATUAL",
      value: stats.rank.name,
      icon: Zap,
      color: stats.rank.color || "#A855F7",
    },
    {
      label: "XP ACUMULADO",
      value: `${stats.xp.toLocaleString()}`,
      icon: Zap,
      color: "#A855F7",
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
          className="bg-[#0F0F14] border border-white/5 rounded-2xl p-4 flex flex-col justify-between min-h-[90px]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em]">{stat.label}</span>
            <stat.icon className="w-3 h-3" style={{ color: stat.color }} />
          </div>
          <p className="text-lg font-black text-white italic tracking-tighter uppercase">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
