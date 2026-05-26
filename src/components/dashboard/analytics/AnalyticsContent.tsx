"use client";

import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis,
  Tooltip, ResponsiveContainer
} from "recharts";
import { Zap, Clock, Target, Flame, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, startOfWeek, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AnalyticsContentProps {
  initialData?: {
    totalXPMonth: number;
    habitRateMonth: number;
    totalFocusHoursWeek: number;
    currentStreak: number;
    xpGrowth: any[];
    habitRates: any[];
    focusHeatmap: any[];
  };
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0A0A0A] border border-[#1E1E2E] rounded-md px-3 py-2 text-[10px] shadow-2xl">
      <p className="text-[#4B5563] mb-1 font-bold uppercase tracking-widest">{label}</p>
      <p className="font-black text-white uppercase tracking-tight">
        {payload[0].value.toLocaleString()} XP
      </p>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color }: { label: string, value: string | number, icon: any, color: string }) => (
  <div className="bg-[#0F0F14] border border-[#1E1E2E] p-5 rounded-lg flex flex-col justify-between min-h-[100px]">
    <div className="flex items-center justify-between">
      <div className="p-2 rounded-md bg-opacity-10" style={{ backgroundColor: `${color}1A` }}>
        <Icon size={16} style={{ color }} />
      </div>
      <span className="text-[11px] font-bold text-[#4B5563] uppercase tracking-[0.1em]">{label}</span>
    </div>
    <p className="text-2xl font-bold text-white tracking-tight mt-4">{value}</p>
  </div>
);

const EmptyState = ({ message, submessage }: { message: string, submessage: string }) => (
  <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center border border-dashed border-[#1E1E2E] rounded-lg">
    <p className="text-[13px] text-[#4B5563] font-medium">{message}</p>
    <p className="text-[11px] text-[#374151] mt-1">{submessage}</p>
  </div>
);

export function AnalyticsContent({ initialData }: AnalyticsContentProps) {
  if (!initialData) return null;

  const {
    totalXPMonth,
    habitRateMonth,
    totalFocusHoursWeek,
    currentStreak,
    xpGrowth,
    habitRates,
    focusHeatmap
  } = initialData;

  const hasXpData = xpGrowth.some(d => d.xp > 0);
  const hasHabitData = habitRates.length > 0;
  const hasFocusData = focusHeatmap.some(d => d.focusMin > 0);

  // Heatmap configuration
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const weeks = Array.from({ length: 8 }).map((_, i) => {
    const d = subDays(new Date(), (7 - i) * 7);
    return format(d, 'MMM', { locale: ptBR });
  });

  return (
    <div className="p-6 space-y-5 bg-[#09090B] min-h-screen text-white">
      
      {/* ROW 1: Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="XP ESTE MÊS" value={totalXPMonth.toLocaleString()} icon={Zap} color="#7C3AED" />
        <StatCard label="TAXA DE HÁBITOS" value={`${habitRateMonth}%`} icon={Target} color="#22C55E" />
        <StatCard label="FOCO SEMANAL" value={`${totalFocusHoursWeek}h`} icon={Timer} color="#EF4444" />
        <StatCard label="STREAK ATUAL" value={`${currentStreak} DIAS`} icon={Flame} color="#F59E0B" />
      </div>

      {/* ROW 2: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* XP Growth */}
        <div className="lg:col-span-6 bg-[#0F0F14] border border-[#1E1E2E] p-6 rounded-lg flex flex-col">
          <h3 className="text-[13px] font-medium text-white mb-6 uppercase tracking-wider">Evolução de XP</h3>
          <div className="flex-1 min-h-[200px]">
            {hasXpData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={xpGrowth}>
                  <defs>
                    <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="week" 
                    tick={{ fill: "#6B7280", fontSize: 10 }} 
                    axisLine={false} 
                    tickLine={false} 
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="xp" 
                    stroke="#7C3AED" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorXp)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="Nenhum dado de XP ainda" submessage="Complete atividades para ver seu progresso" />
            )}
          </div>
        </div>

        {/* Habit Rates */}
        <div className="lg:col-span-6 bg-[#0F0F14] border border-[#1E1E2E] p-6 rounded-lg">
          <h3 className="text-[13px] font-medium text-white mb-6 uppercase tracking-wider">Taxa por hábito</h3>
          <div className="space-y-4 max-h-[240px] overflow-y-auto no-scrollbar pr-2">
            {hasHabitData ? (
              habitRates.map((habit) => {
                const color = habit.rate < 50 ? "#EF4444" : habit.rate < 80 ? "#F59E0B" : "#22C55E";
                return (
                  <div key={habit.name} className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] text-[#E5E7EB] truncate max-w-[70%]">{habit.name}</span>
                      <span className="text-[11px] font-bold" style={{ color }}>{habit.rate}%</span>
                    </div>
                    <div className="h-[6px] w-full bg-[#1E1E2E] rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-1000" 
                        style={{ width: `${habit.rate}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyState message="Nenhum hábito ativo" submessage="Crie hábitos para começar a trackear" />
            )}
          </div>
        </div>

      </div>

      {/* ROW 3: Focus Heatmap */}
      <div className="bg-[#0F0F14] border border-[#1E1E2E] p-6 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[13px] font-medium text-white uppercase tracking-wider">Foco por dia</h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#4B5563]">0 min</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-[2px] bg-[#1E1E2E]" />
              <div className="w-3 h-3 rounded-[2px] bg-[#4C1D95]" />
              <div className="w-3 h-3 rounded-[2px] bg-[#7C3AED]" />
            </div>
            <span className="text-[10px] text-[#4B5563]">60+ min</span>
          </div>
        </div>

        {hasFocusData ? (
          <div className="flex flex-col gap-2">
            <div className="flex gap-1 ml-8">
              {days.map((day, i) => (
                <div key={i} className="w-[14px] text-center text-[9px] font-bold text-[#4B5563]">{day}</div>
              ))}
            </div>
            <div className="space-y-1">
              {Array.from({ length: 8 }).map((_, weekIdx) => (
                <div key={weekIdx} className="flex items-center gap-2">
                  <span className="w-6 text-[9px] font-bold text-[#4B5563] uppercase text-right">
                    W{8 - weekIdx}
                  </span>
                  <div className="flex gap-1">
                    {Array.from({ length: 7 }).map((_, dayIdx) => {
                      const dataIdx = weekIdx * 7 + dayIdx;
                      const dayData = focusHeatmap[dataIdx];
                      if (!dayData) return <div key={dayIdx} className="w-3.5 h-3.5 rounded-[2px] bg-transparent" />;
                      
                      const min = dayData.focusMin;
                      const bgColor = min === 0 ? "#1E1E2E" : min < 60 ? "#4C1D95" : "#7C3AED";
                      
                      return (
                        <div 
                          key={dayIdx} 
                          title={`${format(dayData.date, 'dd/MM')}: ${min} min`}
                          className="w-3.5 h-3.5 rounded-[2px] transition-colors hover:ring-1 hover:ring-white/20" 
                          style={{ backgroundColor: bgColor }}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-[120px]">
            <EmptyState message="Nenhuma sessão de foco registrada" submessage="Inicie o timer para ver seus dados aqui" />
          </div>
        )}
      </div>

    </div>
  );
}

function subDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}
