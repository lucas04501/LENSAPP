"use client";

import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { TrendingUp, Zap, Timer, Target, BarChart3 } from "lucide-react";
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
    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl px-3 py-2 text-xs shadow-2xl">
      <p className="text-[#666] mb-1 font-bold">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="font-black" style={{ color: p.color || "#A855F7" }}>
          {p.value}{p.name === "foco" ? "min" : p.name === "rate" ? "%" : " XP"}
        </p>
      ))}
    </div>
  );
};

const EmptyState = ({ icon: Icon, link, label }: { icon: any, link: string, label: string }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-[#050505] rounded-[2rem]">
    <div className="w-16 h-16 rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] flex items-center justify-center mb-6 text-[#333]">
      <Icon className="w-8 h-8" />
    </div>
    <h3 className="text-white font-black text-sm uppercase tracking-[0.2em] italic">Nenhum dado ainda</h3>
    <p className="text-[#666] text-xs mt-3 max-w-[240px] leading-relaxed font-medium">
      Complete hábitos e sessões de foco para ver seus analytics aqui
    </p>
    <Link 
      href={link} 
      className="mt-8 px-6 py-3 rounded-xl bg-[#0A0A0A] border border-[#1A1A1A] text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all duration-300"
    >
      {label}
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
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 sm:space-y-8">

      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Performance</h1>
        <p className="text-[#666] text-sm mt-1 font-medium">Análise em tempo real do seu progresso.</p>
      </motion.div>

      {/* Quick stats */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "XP esta semana",    value: xpThisWeek > 0 ? `+${xpThisWeek.toLocaleString()}` : "0",  icon: Zap,        color: "#A855F7" },
          { label: "Foco total",         value: totalFocusWeek > 0 ? `${totalFocusWeek}min` : "—", icon: Timer, color: "#EF4444" },
          { label: "Taxa de hábitos",    value: hasHabitData ? `${avgHabitRate}%` : "—", icon: Target,  color: "#22C55E" },
          { label: "Tendência XP",       value: xpTrend !== 0 ? `${xpTrend > 0 ? '+' : ''}${xpTrend}%` : "—", icon: TrendingUp, color: "#F59E0B" },
        ].map((s) => (
          <div key={s.label} className="bg-[#050505] rounded-2xl border border-[#1A1A1A] p-4 sm:p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <s.icon className="w-12 h-12" style={{ color: s.color }} />
            </div>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3 bg-[#0A0A0A] border border-white/5">
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <p className="text-xl sm:text-2xl font-black text-white italic tracking-tighter truncate relative z-10">{s.value}</p>
            <p className="text-[10px] text-[#666] mt-0.5 font-bold uppercase tracking-widest truncate relative z-10">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* XP growth area chart */}
      <motion.div variants={item} className="bg-[#050505] rounded-[2rem] border border-[#1A1A1A] p-6 sm:p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-black text-sm text-white uppercase italic tracking-widest flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#A855F7]" />
            Crescimento de XP
          </h2>
          <div className="text-[10px] font-bold text-[#444] uppercase tracking-widest bg-[#0A0A0A] px-3 py-1 rounded-full border border-[#1A1A1A]">
            Últimas 12 Semanas
          </div>
        </div>
        
        {hasXpData ? (
          <div className="h-[200px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={xpGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="xpArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#A855F7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                <XAxis 
                  dataKey="week" 
                  tick={{ fill: "#444", fontSize: 10, fontWeight: "bold" }} 
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
                  stroke="#A855F7" 
                  strokeWidth={3}
                  fill="url(#xpArea)" 
                  dot={{ fill: "#A855F7", r: 4, strokeWidth: 0 }} 
                  activeDot={{ r: 6, strokeWidth: 0, fill: "#fff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState 
            icon={BarChart3}
            link="/dashboard"
            label="Ir para Dashboard"
          />
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">

        {/* Focus per day */}
        <motion.div variants={item} className="bg-[#050505] rounded-[2rem] border border-[#1A1A1A] p-6 sm:p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-black text-sm text-white uppercase italic tracking-widest flex items-center gap-2">
              <Timer className="w-4 h-4 text-[#EF4444]" />
              Minutos de Foco
            </h2>
            <div className="text-[10px] font-bold text-[#444] uppercase tracking-widest bg-[#0A0A0A] px-3 py-1 rounded-full border border-[#1A1A1A]">
              Últimos 7 Dias
            </div>
          </div>

          {hasFocusData ? (
            <div className="h-[200px] sm:h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fill: "#444", fontSize: 10, fontWeight: "bold" }} 
                    axisLine={false} 
                    tickLine={false} 
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)", radius: 8 }} />
                  <Bar dataKey="foco" name="foco" radius={[6, 6, 0, 0]} maxBarSize={32}>
                    {weeklyData.map((d, i) => (
                      <Cell
                        key={i}
                        fill={d.foco >= 60 ? "#EF4444" : "#EF444440"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState 
              icon={Timer}
              link="/dashboard/focus"
              label="Ir para Foco"
            />
          )}
        </motion.div>

        {/* Habit completion rates */}
        <motion.div variants={item} className="bg-[#050505] rounded-[2rem] border border-[#1A1A1A] p-6 sm:p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-black text-sm text-white uppercase italic tracking-widest flex items-center gap-2">
              <Target className="w-4 h-4 text-[#22C55E]" />
              Consistência
            </h2>
            <div className="text-[10px] font-bold text-[#444] uppercase tracking-widest bg-[#0A0A0A] px-3 py-1 rounded-full border border-[#1A1A1A]">
              Últimos 30 Dias
            </div>
          </div>

          {hasHabitData ? (
            <div className="space-y-6">
              {habitRates.map((h, i) => (
                <motion.div
                  key={h.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 px-1">
                    <span className="text-[#666]">{h.name}</span>
                    <span style={{
                      color: h.rate >= 90 ? "#22C55E" : h.rate >= 70 ? "#A855F7" : "#F59E0B"
                    }}>
                      {h.rate}%
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-[#0A0A0A] border border-[#1A1A1A] overflow-hidden p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${h.rate}%` }}
                      transition={{ duration: 1, delay: i * 0.1, ease: "circOut" }}
                      className="h-full rounded-full"
                      style={{
                        background: h.rate >= 90
                          ? "linear-gradient(90deg, #22C55E, #16A34A)"
                          : h.rate >= 70
                          ? "linear-gradient(90deg, #A855F7, #7C3AED)"
                          : "linear-gradient(90deg, #F59E0B, #D97706)",
                        boxShadow: `0 0 15px ${h.rate >= 90 ? '#22C55E30' : h.rate >= 70 ? '#A855F730' : '#F59E0B30'}`
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState 
              icon={Target}
              link="/dashboard/habits"
              label="Gerenciar Hábitos"
            />
          )}
        </motion.div>

      </div>
    </motion.div>
  );
}
