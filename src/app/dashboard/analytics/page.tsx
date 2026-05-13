"use client";

import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { TrendingUp, Zap, Timer, Target } from "lucide-react";

const XP_DATA = [
  { week: "S1",  xp: 320 }, { week: "S2",  xp: 480 }, { week: "S3",  xp: 390 },
  { week: "S4",  xp: 620 }, { week: "S5",  xp: 750 }, { week: "S6",  xp: 580 },
  { week: "S7",  xp: 890 }, { week: "S8",  xp: 1020 }, { week: "S9",  xp: 940 },
  { week: "S10", xp: 1180 }, { week: "S11", xp: 1350 }, { week: "S12", xp: 1620 },
];

const FOCUS_DATA = [
  { day: "Seg", minutos: 90 }, { day: "Ter", minutos: 150 }, { day: "Qua", minutos: 60 },
  { day: "Qui", minutos: 180 }, { day: "Sex", minutos: 200 }, { day: "Sáb", minutos: 45 }, { day: "Dom", minutos: 30 },
];

const HABIT_RATE = [
  { name: "Meditação",   rate: 92 }, { name: "Exercício",  rate: 85 },
  { name: "Leitura",     rate: 78 }, { name: "Sem redes",  rate: 65 },
  { name: "Água 2L",     rate: 95 }, { name: "Planej. noturno", rate: 71 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass border border-white/10 rounded-xl px-3 py-2 text-xs">
      <p className="text-text-muted mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="font-bold" style={{ color: p.color || "#A855F7" }}>
          {p.value}{p.name === "minutos" ? "min" : p.name === "rate" ? "%" : " XP"}
        </p>
      ))}
    </div>
  );
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};
const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

export default function AnalyticsPage() {
  const totalFocusWeek = FOCUS_DATA.reduce((a, d) => a + d.minutos, 0);
  const avgHabitRate   = Math.round(HABIT_RATE.reduce((a, h) => a + h.rate, 0) / HABIT_RATE.length);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-text-primary">Analytics</h1>
        <p className="text-text-muted text-sm mt-1">Sua performance detalhada em números.</p>
      </motion.div>

      {/* Quick stats */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "XP esta semana",    value: "+1.620",  icon: Zap,        color: "#A855F7" },
          { label: "Foco total",         value: `${totalFocusWeek}min`, icon: Timer, color: "#EF4444" },
          { label: "Taxa de hábitos",    value: `${avgHabitRate}%`, icon: Target,  color: "#22C55E" },
          { label: "Tendência XP",       value: "+24%",   icon: TrendingUp, color: "#F59E0B" },
        ].map((s) => (
          <div key={s.label} className="stat-card" style={{ borderColor: `${s.color}25`, backgroundColor: `${s.color}08` }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${s.color}20` }}>
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <p className="text-xl font-bold text-text-primary">{s.value}</p>
            <p className="text-xs text-text-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* XP growth area chart */}
      <motion.div variants={item} className="glass rounded-2xl border border-white/5 p-5">
        <h2 className="font-semibold text-sm text-text-primary mb-4">Crescimento de XP (12 semanas)</h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={XP_DATA}>
            <defs>
              <linearGradient id="xpArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#A855F7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#A855F7" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="week" tick={{ fill: "#505050", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="xp" name="xp" stroke="#A855F7" strokeWidth={2}
                  fill="url(#xpArea)" dot={{ fill: "#A855F7", r: 3, strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Focus per day */}
        <motion.div variants={item} className="glass rounded-2xl border border-white/5 p-5">
          <h2 className="font-semibold text-sm text-text-primary mb-4">Minutos de foco por dia</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={FOCUS_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "#505050", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(239,68,68,0.05)", radius: 6 }} />
              <Bar dataKey="minutos" name="minutos" radius={[6, 6, 0, 0]} maxBarSize={32}>
                {FOCUS_DATA.map((_, i) => (
                  <Cell
                    key={i}
                    fill={FOCUS_DATA[i].minutos >= 120 ? "#EF4444" : "rgba(239,68,68,0.35)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Habit completion rates */}
        <motion.div variants={item} className="glass rounded-2xl border border-white/5 p-5">
          <h2 className="font-semibold text-sm text-text-primary mb-4">Taxa de conclusão por hábito</h2>
          <div className="space-y-3">
            {HABIT_RATE.map((h, i) => (
              <motion.div
                key={h.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-secondary">{h.name}</span>
                  <span className="font-semibold" style={{
                    color: h.rate >= 90 ? "#22C55E" : h.rate >= 70 ? "#A855F7" : "#F59E0B"
                  }}>
                    {h.rate}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-surface-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${h.rate}%` }}
                    transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
                    className="h-full rounded-full"
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
        </motion.div>

      </div>
    </motion.div>
  );
}
