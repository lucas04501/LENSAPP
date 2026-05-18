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
    <div className="glass border border-white/10 rounded-xl px-3 py-2 text-xs">
      <p className="text-text-muted mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="font-bold" style={{ color: p.color || "#A855F7" }}>
          {p.value}{p.name === "foco" ? "min" : p.name === "rate" ? "%" : " XP"}
        </p>
      ))}
    </div>
  );
};

const EmptyState = ({ icon: Icon, title, message, link, label }: any) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-white/5 flex items-center justify-center mb-4 text-text-muted/20">
      <Icon className="w-8 h-8" />
    </div>
    <h3 className="text-white font-bold text-sm uppercase tracking-widest">{title}</h3>
    <p className="text-text-muted text-xs mt-2 max-w-[200px] leading-relaxed">{message}</p>
    {link && (
      <Link 
        href={link} 
        className="mt-6 px-4 py-2 rounded-xl bg-surface-3 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all"
      >
        {label}
      </Link>
    )}
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

  // Calculando tendência (comparando última semana com a anterior se possível, mas aqui usamos simplificado)
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
        <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">Analytics</h1>
        <p className="text-text-muted text-sm mt-1">Sua performance detalhada em números.</p>
      </motion.div>

      {/* Quick stats */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "XP esta semana",    value: xpThisWeek > 0 ? `+${xpThisWeek.toLocaleString()}` : "0",  icon: Zap,        color: "#A855F7" },
          { label: "Foco total",         value: totalFocusWeek > 0 ? `${totalFocusWeek}min` : "—", icon: Timer, color: "#EF4444" },
          { label: "Taxa de hábitos",    value: hasHabitData ? `${avgHabitRate}%` : "—", icon: Target,  color: "#22C55E" },
          { label: "Tendência XP",       value: xpTrend !== 0 ? `${xpTrend > 0 ? '+' : ''}${xpTrend}%` : "—", icon: TrendingUp, color: "#F59E0B" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl border p-4 sm:p-5" style={{ borderColor: `${s.color}25`, backgroundColor: `${s.color}08` }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${s.color}20` }}>
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <p className="text-lg sm:text-xl font-black text-white italic tracking-tighter truncate">{s.value}</p>
            <p className="text-[10px] text-text-muted mt-0.5 font-bold uppercase tracking-widest truncate">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* XP growth area chart */}
      <motion.div variants={item} className="glass rounded-[2rem] border border-white/5 p-5 sm:p-8 bg-[#050505]">
        <h2 className="font-black text-sm text-white uppercase italic tracking-widest mb-6">Crescimento de XP (12 semanas)</h2>
        {hasXpData ? (
          <div className="h-[180px] sm:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={xpGrowth}>
                <defs>
                  <linearGradient id="xpArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#A855F7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: "#505050", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="xp" name="xp" stroke="#A855F7" strokeWidth={2}
                      fill="url(#xpArea)" dot={{ fill: "#A855F7", r: 3, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState 
            icon={Zap}
            title="Nenhum XP ganho ainda"
            message="Complete tarefas e objetivos para ver sua curva de crescimento."
            link="/dashboard"
            label="Ver Dashboard"
          />
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">

        {/* Focus per day */}
        <motion.div variants={item} className="glass rounded-[2rem] border border-white/5 p-5 sm:p-8 bg-[#050505]">
          <h2 className="font-black text-sm text-white uppercase italic tracking-widest mb-6">Minutos de foco por dia</h2>
          {hasFocusData ? (
            <div className="h-[180px] sm:h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: "#505050", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(239,68,68,0.05)", radius: 6 }} />
                  <Bar dataKey="foco" name="foco" radius={[4, 4, 0, 0]} maxBarSize={24}>
                    {weeklyData.map((d, i) => (
                      <Cell
                        key={i}
                        fill={d.foco >= 120 ? "#EF4444" : "rgba(239,68,68,0.35)"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState 
              icon={Timer}
              title="Sem sessões de foco"
              message="Inicie o timer e concentre-se para registrar seus primeiros minutos."
              link="/dashboard/focus"
              label="Ir para Foco"
            />
          )}
        </motion.div>

        {/* Habit completion rates */}
        <motion.div variants={item} className="glass rounded-[2rem] border border-white/5 p-5 sm:p-8 bg-[#050505]">
          <h2 className="font-black text-sm text-white uppercase italic tracking-widest mb-6">Taxa de conclusão por hábito</h2>
          {hasHabitData ? (
            <div className="space-y-4">
              {habitRates.map((h, i) => (
                <motion.div
                  key={h.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1.5">
                    <span className="text-text-muted">{h.name}</span>
                    <span style={{
                      color: h.rate >= 90 ? "#22C55E" : h.rate >= 70 ? "#A855F7" : "#F59E0B"
                    }}>
                      {h.rate}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${h.rate}%` }}
                      transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
                      className="h-full rounded-full shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                      style={{
                        background: h.rate >= 90
                          ? "linear-gradient(90deg, #22C55E, #16A34A)"
                          : h.rate >= 70
                          ? "linear-gradient(90deg, #A855F7, #7C3AED)"
                          : "linear-gradient(90deg, #F59E0B, #D97706)",
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState 
              icon={Target}
              title="Nenhum hábito rastreado"
              message="Crie e complete hábitos para ver suas taxas de disciplina aqui."
              link="/dashboard/habits"
              label="Gerenciar Hábitos"
            />
          )}
        </motion.div>

      </div>
    </motion.div>
  );
}
