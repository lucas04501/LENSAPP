"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

interface WeeklyBarChartProps {
  data: any[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0F0F14] border border-[#111118] rounded-md px-3 py-2 text-[11px] shadow-2xl">
      <p className="font-semibold text-white mb-2 uppercase tracking-wider">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-[#4B5563]">{p.name}:</span>
          <span className="font-semibold text-white">
            {p.value}
            {p.dataKey === "focus" ? "min" : ""}
            {p.dataKey === "xp" ? " XP" : ""}
          </span>
        </div>
      ))}
    </div>
  );
};

export function WeeklyBarChart({ data }: WeeklyBarChartProps) {
  return (
    <div className="bg-[#0F0F14] border border-[#111118] rounded-md p-5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[10px] font-semibold text-[#4B5563] uppercase tracking-wider">WEEKLY PERFORMANCE</h2>
        <span className="text-[10px] text-[#4B5563] px-2 py-1 rounded bg-[#111118] border border-[#111118]">Last 7 days</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barGap={4} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="0" stroke="#111118" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: "#4B5563", fontSize: 10, fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(124,58,237,0.03)", radius: 2 }} />
          <Bar dataKey="habits" name="HABITS" fill="#EF4444" radius={[2,2,0,0]} maxBarSize={12} />
          <Bar dataKey="focus" name="FOCUS" fill="#7C3AED" radius={[2,2,0,0]} maxBarSize={12} />
          <Bar dataKey="xp" name="XP" fill="#7C3AED" opacity={0.2} radius={[2,2,0,0]} maxBarSize={12} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
