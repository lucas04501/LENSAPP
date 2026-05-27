"use client";

import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Cell, CartesianGrid
} from "recharts";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface WeeklyBarChartProps {
  data: {
    day: string;
    habits: number;
    focusMin: number;
    isToday: boolean;
    isFuture: boolean;
    fullDate: Date;
  }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  
  const data = payload[0].payload;
  const dateStr = format(new Date(data.fullDate), "dd 'de' MMMM", { locale: ptBR });

  return (
    <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-2">{dateStr}</p>
      <div className="space-y-1.5">
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center justify-between gap-8">
            <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-tight">
              {p.name === "habits" ? "Hábitos" : "Foco"}
            </span>
            <span className={cn(
              "text-[12px] font-black tabular-nums",
              p.name === "habits" ? "text-purple-400" : "text-red-400"
            )}>
              {p.name === "habits" ? p.value : `${p.value}m`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export function WeeklyBarChart({ data }: WeeklyBarChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 h-full flex flex-col group hover:bg-white/[0.04] transition-all duration-500">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-1">Performance Semanal</h2>
          <p className="text-[18px] font-semibold text-white tracking-tighter italic">Visão Geral</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#A855F7] shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Hábitos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Foco</span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -40, bottom: 0 }} barGap={6}>
            <CartesianGrid vertical={false} stroke="#ffffff05" strokeDasharray="3 3" />
            <XAxis 
              dataKey="day" 
              tick={({ x, y, payload }) => {
                const isToday = data[payload.index]?.isToday;
                return (
                  <text 
                    x={x} 
                    y={y + 24} 
                    fill={isToday ? "#FFF" : "#3F3F46"} 
                    fontSize={10} 
                    fontWeight={isToday ? "900" : "600"} 
                    textAnchor="middle"
                    className="uppercase tracking-[0.1em]"
                  >
                    {payload.value}
                  </text>
                );
              }}
              axisLine={false} 
              tickLine={false} 
            />
            <YAxis hide domain={[0, 'auto']} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            
            <Bar dataKey="habits" name="habits" radius={[4, 4, 0, 0]} barSize={6}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-habits-${index}`}
                  fill={entry.isToday ? "#A855F7" : "#A855F740"}
                  className="transition-all duration-300"
                />
              ))}
            </Bar>

            <Bar dataKey="focusMin" name="focusMin" radius={[4, 4, 0, 0]} barSize={6}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-focus-${index}`}
                  fill={entry.isToday ? "#EF4444" : "#EF444440"}
                  className="transition-all duration-300"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

