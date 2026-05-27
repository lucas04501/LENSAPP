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
    <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg px-3 py-2 shadow-2xl">
      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="text-[10px] text-zinc-400 uppercase">{p.name === "habits" ? "Habits" : "Focus"}</span>
          <span className={cn("text-[11px] font-black", p.name === "habits" ? "text-purple-400" : "text-red-400")}>
            {p.value}{p.name === "focusMin" ? "m" : ""}
          </span>
        </div>
      ))}
    </div>
  );
};

export function WeeklyBarChart({ data }: WeeklyBarChartProps) {
  if (!data || data.length === 0) return null;

  // Convert day labels to Mon, Tue...
  const daysMap: Record<string, string> = {
    "Seg": "Mon", "Ter": "Tue", "Qua": "Wed", "Qui": "Thu", "Sex": "Fri", "Sáb": "Sat", "Dom": "Sun"
  };

  const chartData = data.map(d => ({
    ...d,
    dayLabel: daysMap[d.day] || d.day
  }));

  return (
    <div className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-2xl p-6 h-full flex flex-col group hover:bg-white/[0.04] transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Weekly Performance</h2>
        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Last 7 days</span>
      </div>

      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -40, bottom: 0 }} barGap={6}>
            <XAxis 
              dataKey="dayLabel" 
              tick={{ fill: '#52525b', fontSize: 10, fontWeight: 700 }}
              axisLine={false} 
              tickLine={false} 
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            
            <Bar dataKey="focusMin" name="focusMin" radius={[2, 2, 0, 0]} barSize={8}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-focus-${index}`}
                  fill="#EF4444"
                  fillOpacity={entry.isFuture ? 0.2 : 1}
                />
              ))}
            </Bar>

            <Bar dataKey="habits" name="habits" radius={[2, 2, 0, 0]} barSize={8}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-habits-${index}`}
                  fill="#A855F7"
                  fillOpacity={entry.isFuture ? 0.2 : 1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


