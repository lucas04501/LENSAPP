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
    focusMinutesToday: number;
  };
  loading?: boolean;
}

export function StatsRow({ stats, loading }: StatsRowProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[100px] rounded-md bg-[#0F0F14] border border-[#111118]" />
        ))}
      </div>
    );
  }

  const hours = Math.floor(stats.focusMinutesToday / 60);
  const minutes = stats.focusMinutesToday % 60;

  const displayStats = [
    {
      label: "STREAK",
      value: `${stats.currentStreak} days`,
      icon: Flame,
      color: "#EF4444",
    },
    {
      label: "FOCUS",
      value: `${hours}h ${minutes}m`,
      icon: Timer,
      color: "#A855F7",
    },
    {
      label: "TOTAL XP",
      value: `${stats.xp.toLocaleString()}`,
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      {displayStats.map((stat, i) => (
        <div
          key={stat.label}
          className="bg-[#0F0F14] border border-[#111118] rounded-md p-4 flex flex-col justify-between min-h-[100px]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#4B5563] font-semibold uppercase tracking-wider">{stat.label}</span>
            <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
          </div>
          <p className="text-xl font-semibold text-white tracking-tight">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
