"use client";

import { motion } from "framer-motion";
import { Flame, Timer, Zap, TrendingUp, Target, Brain, ChevronRight } from "lucide-react";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { HabitHeatmap } from "@/components/dashboard/HabitHeatmap";
import { WeeklyBarChart } from "@/components/dashboard/WeeklyBarChart";
import { RadarChart } from "@/components/dashboard/RadarChart";
import { HabitCheckList } from "@/components/habits/HabitCheckList";
import { XPCard } from "@/components/gamification/XPCard";
import { getRankByXP, getLevelByXP } from "@/types";
import Link from "next/link";

// Mock data — replace with real API
const MOCK_XP = 1620;
const rank = getRankByXP(MOCK_XP);
const level = getLevelByXP(MOCK_XP);

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show:  { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function DashboardPage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* ── Greeting ── */}
      <motion.div variants={item}>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-text-muted text-sm mb-1">
              {getGreeting()}, <span className="text-purple font-semibold">lucasCEO</span>
            </p>
            <h1 className="text-2xl font-bold text-text-primary">
              Seu painel de controle 🧠
            </h1>
          </div>
          <div
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold tracking-wide"
            style={{ borderColor: `${rank.color}40`, backgroundColor: `${rank.color}10`, color: rank.color }}
          >
            <span>{rank.name}</span>
            <span className="opacity-60">LVL {level}</span>
          </div>
        </div>
      </motion.div>

      {/* ── Stats Row ── */}
      <motion.div variants={item}>
        <StatsRow />
      </motion.div>

      {/* ── XP Card ── */}
      <motion.div variants={item}>
        <XPCard xp={MOCK_XP} />
      </motion.div>

      {/* ── Grid: Habits + Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Habits today */}
        <motion.div variants={item} className="lg:col-span-1">
          <div className="glass rounded-2xl border border-white/5 p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-red" />
                <h2 className="font-semibold text-sm text-text-primary">Hábitos de hoje</h2>
              </div>
              <Link href="/dashboard/habits" className="text-xs text-text-muted hover:text-purple transition-colors flex items-center gap-1">
                Ver todos <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <HabitCheckList />
          </div>
        </motion.div>

        {/* Charts */}
        <motion.div variants={item} className="lg:col-span-2 space-y-6">
          <WeeklyBarChart />
          <RadarChart />
        </motion.div>
      </div>

      {/* ── Heatmap ── */}
      <motion.div variants={item}>
        <div className="glass rounded-2xl border border-white/5 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-purple" />
            <h2 className="font-semibold text-sm text-text-primary">Consistência de Hábitos</h2>
            <span className="ml-auto text-xs text-text-muted">Últimos 12 meses</span>
          </div>
          <HabitHeatmap />
        </div>
      </motion.div>
    </motion.div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}
