"use client";

import { motion } from "framer-motion";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { WeeklyBarChart } from "@/components/dashboard/WeeklyBarChart";
import { HabitCheckList } from "@/components/habits/HabitCheckList";
import { XPCard } from "@/components/gamification/XPCard";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DashboardContentProps {
  user: any;
  stats: any;
  habitsToday: any[];
  heatmapData: any;
}

export function DashboardContent({ user, stats, habitsToday, heatmapData }: DashboardContentProps) {
  const { rank, level, xp, weeklyData } = stats;

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto selection:bg-purple-500/30">
      
      {/* ── 1. Header ── */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-black text-white leading-tight italic uppercase tracking-tighter">
            Dashboard
          </h1>
          <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-[0.2em] mt-0.5">
            {getGreeting()}, <span className="text-zinc-400">{(user.name || user.username).toUpperCase()}</span>
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-md border border-white/5 bg-white/[0.02] backdrop-blur-md">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-500">
            {rank.name} LVL {level}
          </span>
        </div>
      </header>

      {/* ── 2. Grid of 4 Stats Cards ── */}
      <StatsRow stats={stats} />

      {/* ── 3. Progress Section (XPCard) ── */}
      <XPCard xp={xp} />

      {/* ── 4. Quote ── */}
      <div className="py-2">
        <p className="text-[13px] text-zinc-500 italic font-medium leading-relaxed">
          — &quot;Mude o ambiente e você mudará o comportamento.&quot;
        </p>
      </div>

      {/* ── 5. Bottom Grid (2 Columns) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Habits (approx 5/12) */}
        <div className="lg:col-span-5">
          <div className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-2xl p-6 h-full flex flex-col group hover:bg-white/[0.04] transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Habits for Today</h2>
              <Link href="/dashboard/habits" className="text-[9px] font-black text-zinc-600 hover:text-white transition-colors flex items-center gap-1 uppercase tracking-widest">
                View All &gt;
              </Link>
            </div>
            <div className="flex-1">
              <HabitCheckList habits={habitsToday} userId={user.id} />
            </div>
          </div>
        </div>

        {/* Right Col: Weekly Performance (approx 7/12) */}
        <div className="lg:col-span-7">
          <WeeklyBarChart data={weeklyData} />
        </div>

      </div>

    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}


