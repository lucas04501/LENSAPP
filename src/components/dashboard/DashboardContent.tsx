"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Target } from "lucide-react";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { WeeklyBarChart } from "@/components/dashboard/WeeklyBarChart";
import { CompactCalendar } from "@/components/dashboard/CompactCalendar";
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
  const { rank, level, xp, currentStreak, weeklyData } = stats;
  const pendingHabitsCount = habitsToday.filter(h => !h.todayDone).length;

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-12"
    >
      {/* ── Header ── */}
      <motion.div variants={item} className="flex items-end justify-between border-b border-white/5 pb-6">
        <div>
          <h1 className="text-[32px] font-black text-white leading-tight italic uppercase tracking-tighter">
            Dashboard
          </h1>
          <p className="text-zinc-600 text-[10px] mt-1 uppercase font-bold tracking-[0.2em]">
            Sessão ativa: <span className="text-zinc-400">{user.name || user.username}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-500">{rank.name}</span>
            <span className="ml-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">LVL {level}</span>
          </div>
        </div>
      </motion.div>

      {/* ── Streak Warning ── */}
      <StreakWarning 
        pendingHabitsCount={pendingHabitsCount} 
        totalStreak={currentStreak} 
      />

      {/* ── Stats Row ── */}
      <motion.div variants={item}>
        <StatsRow stats={stats} />
      </motion.div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Habits Checklist */}
        <motion.div variants={item} className="lg:col-span-1">
          <div className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 h-full group hover:bg-white/[0.04] transition-all duration-500">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-purple-500" />
                <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Hábitos</h2>
              </div>
              <Link href="/dashboard/habits" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </Link>
            </div>
            <HabitCheckList habits={habitsToday} userId={user.id} />
          </div>
        </motion.div>

        {/* Weekly Performance */}
        <motion.div variants={item} className="lg:col-span-2">
          <WeeklyBarChart data={weeklyData} />
        </motion.div>
      </div>

      {/* ── Secondary Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2">
          <XPCard xp={xp} />
        </motion.div>
        
        <motion.div variants={item} className="lg:col-span-1">
          <CompactCalendar heatmapData={heatmapData} habitsCount={habitsToday.length} />
        </motion.div>
      </div>

      {/* ── Footer Info ── */}
      <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <DailyQuote />
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/[0.01]">
          <Target className="w-3 h-3 text-zinc-600" />
          <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Foco em Alta Performance</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

