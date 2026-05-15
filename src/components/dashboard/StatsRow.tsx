"use client";

import { motion } from "framer-motion";
import { Flame, Timer, Zap, Target } from "lucide-react";
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 sm:h-32 rounded-2xl" />
        ))}
      </div>
    );
  }

  const habitPercentage = stats.habitsToday > 0 
    ? Math.round((stats.habitsCompleted / stats.habitsToday) * 100)
    : 0;

  const hours = Math.floor(stats.focusMinutesToday / 60);
  const minutes = stats.focusMinutesToday % 60;

  const displayStats = [
    {
      label: "Streak atual",
      value: `${stats.currentStreak} d`,
      sub: "Consistência",
      icon: Flame,
      color: "#EF4444",
      bg: "rgba(239,68,68,0.08)",
      border: "rgba(239,68,68,0.2)",
    },
    {
      label: "Foco hoje",
      value: `${hours}h ${minutes}m`,
      sub: "Em sessões",
      icon: Timer,
      color: "#A855F7",
      bg: "rgba(168,85,247,0.08)",
      border: "rgba(168,85,247,0.2)",
    },
    {
      label: "Total XP",
      value: `${stats.xp.toLocaleString()}`,
      sub: "Acumulado",
      icon: Zap,
      color: "#F59E0B",
      bg: "rgba(245,158,11,0.08)",
      border: "rgba(245,158,11,0.2)",
    },
    {
      label: "Hábitos",
      value: `${stats.habitsCompleted}/${stats.habitsToday}`,
      sub: `${habitPercentage}% feito`,
      icon: Target,
      color: "#22C55E",
      bg: "rgba(34,197,94,0.08)",
      border: "rgba(34,197,94,0.2)",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {displayStats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          whileHover={{ y: -2 }}
          className="glass border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[110px] sm:min-h-0"
          style={{ borderColor: stat.border, backgroundColor: stat.bg }}
        >
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center mb-2 sm:mb-3"
            style={{ backgroundColor: `${stat.color}20` }}
          >
            <stat.icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" style={{ color: stat.color }} />
          </div>
          <div>
            <p className="text-lg sm:text-xl font-black text-white italic tracking-tighter truncate">{stat.value}</p>
            <p className="text-[10px] text-text-muted mt-0.5 font-bold uppercase tracking-wider truncate">{stat.label}</p>
            <p className="text-[9px] sm:text-[11px] mt-1 font-black uppercase tracking-tighter" style={{ color: stat.color }}>{stat.sub}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
