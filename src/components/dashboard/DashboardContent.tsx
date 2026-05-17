"use client";

import { motion } from "framer-motion";
import { Flame, Target, ChevronRight } from "lucide-react";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { HabitHeatmap } from "@/components/dashboard/HabitHeatmap";
import { WeeklyBarChart } from "@/components/dashboard/WeeklyBarChart";
import { RadarChart } from "@/components/dashboard/RadarChart";
import { HabitCheckList } from "@/components/habits/HabitCheckList";
import { XPCard } from "@/components/gamification/XPCard";
import { DailyQuote } from "@/components/dashboard/DailyQuote";
import { StreakWarning } from "@/components/dashboard/StreakWarning";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DashboardContentProps {
  user: any;
  stats: any;
  habitsToday: any[];
  heatmapData: any;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show:  { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function DashboardContent({ user, stats, habitsToday, heatmapData }: DashboardContentProps) {
  const { rank, level, xp, totalStreak } = stats;
  const pendingHabitsCount = habitsToday.filter(h => !h.todayDone).length;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 sm:space-y-8"
    >
      {/* ── Greeting ── */}
      <motion.div variants={item}>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-text-muted text-xs sm:text-sm mb-1">
              {getGreeting()}, <span className="text-purple font-semibold">{user.name || user.username}</span>
            </p>
            <h1 className="text-xl sm:text-2xl font-black text-white italic uppercase tracking-tighter">
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

      {/* ── Streak Warning ── */}
      <StreakWarning 
        pendingHabitsCount={pendingHabitsCount} 
        totalStreak={totalStreak} 
      />

      {/* ── Stats Row ── */}
      <motion.div variants={item}>
        <StatsRow stats={stats} />
      </motion.div>

      {/* ── XP Card ── */}
      <motion.div variants={item}>
        <XPCard xp={xp} />
      </motion.div>

      {/* ── Daily Quote ── */}
      <motion.div variants={item}>
        <DailyQuote />
      </motion.div>

      {/* ── Grid: Habits + Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

        {/* Habits today */}
        <motion.div variants={item} className="lg:col-span-1 order-2 lg:order-1">
          <div className="glass rounded-[2rem] border border-white/5 p-5 sm:p-6 h-full bg-[#050505]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Flame className="w-4.5 h-4.5 text-red" />
                <h2 className="font-black text-sm text-white uppercase italic tracking-widest">Hábitos de hoje</h2>
              </div>
              <Link href="/dashboard/habits" className="text-[10px] font-bold text-text-muted hover:text-purple transition-colors flex items-center gap-1 uppercase tracking-widest">
                Ver todos <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <HabitCheckList habits={habitsToday} userId={user.id} />
          </div>
        </motion.div>

        {/* Charts */}
        <motion.div variants={item} className="lg:col-span-2 space-y-6 sm:space-y-8 order-1 lg:order-2">
          <WeeklyBarChart data={stats.weeklyData} />
          {/* Radar Chart hidden on small mobile or simplified? Let's keep for now */}
          <RadarChart />
        </motion.div>
      </div>

      {/* ── Heatmap ── */}
      <motion.div variants={item}>
        <div className="glass rounded-[2rem] border border-white/5 p-5 sm:p-8 bg-[#050505]">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-4.5 h-4.5 text-purple" />
            <h2 className="font-black text-sm text-white uppercase italic tracking-widest">Consistência de Hábitos</h2>
            <span className="ml-auto text-[10px] font-bold text-text-muted uppercase tracking-widest">Últimos 12 meses</span>
          </div>
          <div className="overflow-x-auto no-scrollbar -mx-2 px-2">
            <HabitHeatmap data={heatmapData} />
          </div>
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
