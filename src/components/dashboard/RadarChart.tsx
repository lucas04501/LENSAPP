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
    <div className="bg-[#0F0F14] border border-[#111118] rounded-md px-2 py-1 text-[10px]">
      <p className="text-[#4B5563] font-semibold">{payload[0]?.payload?.subject}</p>
      <p className="font-semibold text-purple">{payload[0]?.value}%</p>
    </div>
  );
};

export function RadarChart() {
  return (
    <div className="bg-[#0F0F14] border border-[#111118] rounded-md p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[10px] font-semibold text-[#4B5563] uppercase tracking-wider">MIND MAP</h2>
        <span className="text-[10px] text-[#4B5563] px-2 py-1 rounded bg-[#111118] border border-[#111118]">
          Overall: 78%
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <ReRadarChart data={DATA} outerRadius="70%">
          <PolarGrid stroke="#111118" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#4B5563", fontSize: 9, fontWeight: 600 }}
          />
          <Radar
            dataKey="value"
            stroke="#7C3AED"
            fill="#7C3AED"
            fillOpacity={0.05}
            strokeWidth={2}
          />
          <Tooltip content={<CustomTooltip />} />
        </ReRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
