"use client";

import {
  Radar, RadarChart as ReRadarChart, PolarGrid,
  PolarAngleAxis, ResponsiveContainer, Tooltip
} from "recharts";

const DATA = [
  { subject: "Disciplina",   value: 85 },
  { subject: "Foco",         value: 70 },
  { subject: "Hábitos",      value: 90 },
  { subject: "Consistência", value: 65 },
  { subject: "Energia",      value: 78 },
  { subject: "Clareza",      value: 82 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass border border-white/10 rounded-xl px-3 py-2 text-xs">
      <p className="text-text-muted">{payload[0]?.payload?.subject}</p>
      <p className="font-bold text-purple">{payload[0]?.value}%</p>
    </div>
  );
};

export function RadarChart() {
  return (
    <div className="glass rounded-2xl border border-white/5 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-sm text-text-primary">Mapa mental</h2>
        <span className="text-[10px] text-text-muted px-2 py-1 rounded-lg bg-surface-2 border border-border">
          Score geral: 78%
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <ReRadarChart data={DATA} outerRadius="70%">
          <PolarGrid stroke="rgba(255,255,255,0.06)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#505050", fontSize: 10 }}
          />
          <Radar
            dataKey="value"
            stroke="#A855F7"
            fill="#A855F7"
            fillOpacity={0.15}
            strokeWidth={2}
          />
          <Tooltip content={<CustomTooltip />} />
        </ReRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
