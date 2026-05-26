"use client";

import { motion } from "framer-motion";
import { Flame, Target, ChevronRight, CheckCircle2 } from "lucide-react";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { HabitHeatmap } from "@/components/dashboard/HabitHeatmap";
import { WeeklyBarChart } from "@/components/dashboard/WeeklyBarChart";
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
  const { rank, level, xp, totalStreak, weeklyData } = stats;
  const pendingHabitsCount = habitsToday.filter(h => !h.todayDone).length;

  return (
    <div className="space-y-5">
      {/* ── Greeting ── */}
      <motion.div variants={item}>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[28px] font-semibold text-white leading-tight italic uppercase tracking-tighter">
              Protocolo Dashboard
            </h1>
            <p className="text-[#4B5563] text-sm mt-1 uppercase font-bold tracking-widest text-[10px]">
              Sincronização: <span className="text-white">{getGreeting()}</span>, {user.name || user.username}
            </p>
          </div>
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 bg-[#0F0F14] text-[10px] font-black uppercase tracking-[0.2em] text-purple-500"
          >
            <span>{rank.name}</span>
            <span className="opacity-40 text-zinc-500">• LVL {level}</span>
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

      {/* ── Grid: Habits + Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Habits today */}
        <motion.div variants={item} className="lg:col-span-1 order-2 lg:order-1">
          <div className="bg-[#0F0F14] border border-white/5 rounded-[2rem] p-4 sm:p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
                <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Check-list Hoje</h2>
              </div>
              <Link href="/dashboard/habits" className="text-[9px] font-black text-zinc-600 hover:text-white transition-colors flex items-center gap-1 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">
                Ver Todos <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <HabitCheckList habits={habitsToday} userId={user.id} />
          </div>
        </motion.div>

        {/* Weekly Performance */}
        <motion.div variants={item} className="lg:col-span-2 order-1 lg:order-2">
          <WeeklyBarChart data={weeklyData} />
        </motion.div>
      </div>

      {/* ── XP Card ── */}
      <motion.div variants={item}>
        <XPCard xp={xp} />
      </motion.div>

      {/* ── Daily Quote ── */}
      <motion.div variants={item}>
        <DailyQuote />
      </motion.div>

      {/* ── Consistency ── */}
      <motion.div variants={item}>
        <div className="bg-[#0F0F14] border border-white/5 rounded-[2rem] p-4 sm:p-8">
          <div className="flex items-center gap-2 mb-8">
            <Target className="w-4 h-4 text-purple-500" />
            <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Arquitetura de Consistência Anual</h2>
          </div>
          <div className="overflow-x-auto no-scrollbar -mx-2 px-2">
            <HabitHeatmap data={heatmapData} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}
