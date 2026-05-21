"use client";

import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { TrendingUp, Zap, Clock, Target, BarChart3, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface AnalyticsContentProps {
  initialData?: {
    weeklyData: any[];
    habitRates: any[];
    xpGrowth: any[];
    totalFocusWeek: number;
    avgHabitRate: number;
    xpThisWeek: number;
  };
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-md px-3 py-2 text-[10px] shadow-2xl">
      <p className="text-[#4B5563] mb-1 font-bold uppercase tracking-widest">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="font-bold text-white uppercase tracking-tight">
          {p.name.toUpperCase()}: {p.value}{p.name === "foco" ? "MIN" : p.name === "rate" ? "%" : " XP"}
        </p>
      ))}
    </div>
  );
};

const EmptyState = ({ icon: Icon, link, label }: { icon: any, link: any, label: string }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-[#1A1A1A] rounded-xl bg-transparent">
    <div className="w-12 h-12 rounded-full border border-[#1A1A1A] flex items-center justify-center mb-6 text-[#2D2D3A]">
      <Icon strokeWidth={1.5} className="w-6 h-6" />
    </div>
    <h3 className="text-[#555] font-bold text-[11px] uppercase tracking-[0.3em]">Connection Timeout // No Data</h3>
    <p className="text-[#3D3D4A] text-[10px] mt-2 max-w-[200px] leading-relaxed font-mono uppercase">
      Initialize activity protocols to index metrics here.
    </p>
    <Link 
      href={link} 
      className="mt-8 text-[9px] font-bold uppercase tracking-[0.2em] text-[#4B5563] hover:text-white transition-colors flex items-center gap-2 group"
    >
      Initialize Interface <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
    </Link>
  </div>
);

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};
const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

export function AnalyticsContent({ initialData }: AnalyticsContentProps) {
  const weeklyData = initialData?.weeklyData || [];
  const habitRates = initialData?.habitRates || [];
  const xpGrowth = initialData?.xpGrowth || [];
  
  const totalFocusWeek = initialData?.totalFocusWeek ?? 0;
  const avgHabitRate = initialData?.avgHabitRate ?? 0;
  const xpThisWeek = initialData?.xpThisWeek ?? 0;

  // Calculando tendência real
  const xpTrend = xpGrowth.length >= 2 
    ? Math.round(((xpGrowth[xpGrowth.length-1].xp - xpGrowth[xpGrowth.length-2].xp) / (xpGrowth[xpGrowth.length-2].xp || 1)) * 100)
    : 0;

  const hasXpData = xpGrowth.some(d => d.xp > 0);
  const hasFocusData = weeklyData.some(d => d.foco > 0);
  const hasHabitData = habitRates.length > 0;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-10 pb-20">

      {/* Header */}
      <motion.div variants={item} className="pb-6 border-b border-[#1A1A1A]">
        <h1 className="text-[22px] font-semibold text-white uppercase tracking-wider">Performance Analytics</h1>
        <p className="text-[#4B5563] text-[11px] mt-1 uppercase font-semibold tracking-[0.15em]">Real-time neural feedback and metric tracking</p>
      </motion.div>

      {/* Quick stats */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "XP THIS WEEK",    value: xpThisWeek > 0 ? `+${xpThisWeek.toLocaleString()}` : "0",  icon: Zap,        color: "#A855F7" },
          { label: "TOTAL FOCUS",     value: totalFocusWeek > 0 ? `${totalFocusWeek}MIN` : "—", icon: Clock, color: "#EF4444" },
          { label: "HABIT RATE",      value: hasHabitData ? `${avgHabitRate}%` : "—", icon: Target,  color: "#22C55E" },
          { label: "XP TREND",        value: xpTrend !== 0 ? `${xpTrend > 0 ? '+' : ''}${xpTrend}%` : "—", icon: TrendingUp, color: "#F59E0B" },
        ].map((s) => (
          <div key={s.label} className="bg-[#09090D] border border-[#1A1A1A] p-5 rounded-md relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] text-[#4B5563] font-semibold uppercase tracking-widest">{s.label}</span>
              <s.icon strokeWidth={1.5} className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-white tracking-tight">{s.value}</p>
          </div>
        ))}
      </motion.div>

      {/* XP growth area chart */}
      <motion.div variants={item} className="bg-[#09090D] border border-[#1A1A1A] p-8 rounded-md">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] flex items-center gap-3">
            <div className="w-1 h-4 bg-purple-600 rounded-full" />
            XP GROWTH PROTOCOL
          </h2>
          <div className="text-[9px] font-bold text-[#4B5563] uppercase tracking-widest border border-[#1A1A1A] px-3 py-1 rounded-sm">
            LAST 12 CYCLES
          </div>
        </div>
        
        {hasXpData ? (
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={xpGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="xpArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#7C3AED" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" stroke="#1A1A1A" vertical={false} />
                <XAxis 
                  dataKey="week" 
                  tick={{ fill: "#2D2D3A", fontSize: 9, fontWeight: "bold" }} 
                  axisLine={false} 
                  tickLine={false} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="xp" 
                  name="XP" 
                  stroke="#7C3AED" 
                  strokeWidth={2}
                  fill="url(#xpArea)" 
                  dot={{ fill: "#7C3AED", r: 3, strokeWidth: 0 }} 
                  activeDot={{ r: 4, strokeWidth: 0, fill: "#fff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState 
            icon={BarChart3}
            link="/dashboard"
            label="Return to Command"
          />
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Focus per day */}
        <motion.div variants={item} className="bg-[#09090D] border border-[#1A1A1A] p-8 rounded-md">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] flex items-center gap-3">
              <Clock strokeWidth={1.5} className="w-4 h-4 text-purple-500" />
              FOCUS TIME TELEMETRY
            </h2>
            <div className="text-[9px] font-bold text-[#4B5563] uppercase tracking-widest border border-[#1A1A1A] px-3 py-1 rounded-sm">
              7 DAY WINDOW
            </div>
          </div>

          {hasFocusData ? (
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="0" stroke="#1A1A1A" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fill: "#2D2D3A", fontSize: 9, fontWeight: "bold" }} 
                    axisLine={false} 
                    tickLine={false} 
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(124,58,237,0.03)", radius: 2 }} />
                  <Bar dataKey="foco" name="foco" radius={[2, 2, 0, 0]} maxBarSize={16}>
                    {weeklyData.map((d, i) => (
                      <Cell
                        key={i}
                        fill={d.foco >= 60 ? "#7C3AED" : "#7C3AED40"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState 
              icon={Clock}
              link="/dashboard/focus"
              label="Initialize Focus"
            />
          )}
        </motion.div>

        {/* Habit completion rates */}
        <motion.div variants={item} className="bg-[#09090D] border border-[#1A1A1A] p-8 rounded-md">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] flex items-center gap-3">
              <Target strokeWidth={1.5} className="w-4 h-4 text-purple-500" />
              CONSISTENCY INDEX
            </h2>
            <div className="text-[9px] font-bold text-[#4B5563] uppercase tracking-widest border border-[#1A1A1A] px-3 py-1 rounded-sm">
              30 DAY STABILITY
            </div>
          </div>

          {hasHabitData ? (
            <div className="space-y-8">
              {habitRates.map((h, i) => (
                <motion.div
                  key={h.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-3 px-1">
                    <span className="text-[#4B5563]">{h.name}</span>
                    <span className="text-white">
                      {h.rate}%
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-[#1A1A1A] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${h.rate}%` }}
                      transition={{ duration: 1, delay: i * 0.1, ease: "circOut" }}
                      className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-500"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState 
              icon={Target}
              link="/dashboard/habits"
              label="Deploy Objectives"
            />
          )}
        </motion.div>

      </div>
    </motion.div>
  );
}
