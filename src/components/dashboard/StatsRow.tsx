"use client";

import { motion } from "framer-motion";
import { Flame, Timer, Zap, Target } from "lucide-react";

const STATS = [
  {
    label: "Streak atual",
    value: "12 dias",
    sub: "+3 esta semana",
    icon: Flame,
    color: "#EF4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.2)",
  },
  {
    label: "Foco hoje",
    value: "2h 40min",
    sub: "Meta: 4h",
    icon: Timer,
    color: "#A855F7",
    bg: "rgba(168,85,247,0.08)",
    border: "rgba(168,85,247,0.2)",
  },
  {
    label: "XP ganho hoje",
    value: "+180 XP",
    sub: "Top 12% global",
    icon: Zap,
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
  },
  {
    label: "Hábitos completos",
    value: "4 / 6",
    sub: "67% do dia",
    icon: Target,
    color: "#22C55E",
    bg: "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.2)",
  },
];

export function StatsRow() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          whileHover={{ y: -2 }}
          className="stat-card"
          style={{ borderColor: stat.border, backgroundColor: stat.bg }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
            style={{ backgroundColor: `${stat.color}20` }}
          >
            <stat.icon className="w-4.5 h-4.5" style={{ color: stat.color }} />
          </div>
          <p className="text-xl font-bold text-text-primary">{stat.value}</p>
          <p className="text-xs text-text-muted mt-0.5">{stat.label}</p>
          <p className="text-[11px] mt-1" style={{ color: stat.color }}>{stat.sub}</p>
        </motion.div>
      ))}
    </div>
  );
}
