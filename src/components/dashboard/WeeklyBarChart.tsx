"use client";

import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { cn } from "@/lib/utils";

interface WeeklyBarChartProps {
  data: {
    day: string;
    habits: number;
    focusMin: number;
    isToday: boolean;
    isFuture: boolean;
  }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-md px-3 py-2 text-[10px] shadow-2xl">
      <p className="text-[#4B5563] mb-1 font-bold uppercase tracking-widest">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="font-bold text-white uppercase tracking-tight">
          {p.name === "habits" ? `${p.value} HÁBITOS` : `${p.value} MIN DE FOCO`}
        </p>
      ))}
    </div>
  );
};

export function WeeklyBarChart({ data }: WeeklyBarChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-[#0F0F14] border border-white/5 rounded-[2rem] p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Performance Semanal</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Hábitos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Foco</span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -40, bottom: 0 }} barGap={4}>
            <XAxis 
              dataKey="day" 
              tick={({ x, y, payload }) => {
                const isToday = data[payload.index]?.isToday;
                return (
                  <text 
                    x={x} 
                    y={y + 16} 
                    fill={isToday ? "#FFF" : "#6B7280"} 
                    fontSize={10} 
                    fontWeight="black" 
                    textAnchor="middle"
                    className="uppercase tracking-tighter"
                  >
                    {payload.value}
                  </text>
                );
              }}
              axisLine={false} 
              tickLine={false} 
            />
            <YAxis hide domain={[0, 'auto']} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            
            <Bar dataKey="habits" name="habits" radius={[2, 2, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-habits-${index}`}
                  fill={entry.isToday ? "#9F67FF" : "#7C3AED"}
                  fillOpacity={entry.isFuture ? 0.2 : 1}
                  stroke={entry.isFuture ? "#7C3AED" : "none"}
                  strokeDasharray={entry.isFuture ? "3 3" : "0"}
                />
              ))}
            </Bar>

            <Bar dataKey="focusMin" name="focusMin" radius={[2, 2, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-focus-${index}`}
                  fill={entry.isToday ? "#FF5F5F" : "#EF4444"}
                  fillOpacity={entry.isFuture ? 0.2 : 1}
                  stroke={entry.isFuture ? "#EF4444" : "none"}
                  strokeDasharray={entry.isFuture ? "3 3" : "0"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
