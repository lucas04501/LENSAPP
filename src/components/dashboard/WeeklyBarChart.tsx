"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

const DATA = [
  { day: "Seg", foco: 90,  habitos: 5, xp: 120 },
  { day: "Ter", foco: 120, habitos: 6, xp: 160 },
  { day: "Qua", foco: 60,  habitos: 3, xp: 80  },
  { day: "Qui", foco: 150, habitos: 6, xp: 200 },
  { day: "Sex", foco: 180, habitos: 6, xp: 240 },
  { day: "Sáb", foco: 45,  habitos: 4, xp: 70  },
  { day: "Dom", foco: 30,  habitos: 2, xp: 40  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass border border-white/10 rounded-xl px-4 py-3 text-xs shadow-xl">
      <p className="font-semibold text-text-primary mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-text-muted">{p.name}:</span>
          <span className="font-semibold text-text-primary">{p.value}{p.name === "Foco" ? "min" : ""}</span>
        </div>
      ))}
    </div>
  );
};

export function WeeklyBarChart() {
  return (
    <div className="glass rounded-2xl border border-white/5 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-sm text-text-primary">Performance semanal</h2>
        <span className="text-[10px] text-text-muted px-2 py-1 rounded-lg bg-surface-2 border border-border">Esta semana</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={DATA} barGap={4} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: "#505050", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(168,85,247,0.05)", radius: 6 }} />
          <Bar dataKey="foco"    name="Foco"    fill="#A855F7" radius={[6,6,0,0]} maxBarSize={28} />
          <Bar dataKey="habitos" name="Hábitos" fill="#EF4444" radius={[6,6,0,0]} maxBarSize={28} />
          <Bar dataKey="xp"      name="XP"      fill="#F59E0B" radius={[6,6,0,0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
