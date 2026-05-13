"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { format, subDays, startOfWeek, addDays, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

// Generate mock data — replace with real API
function generateMockData() {
  const data: Record<string, number> = {};
  for (let i = 365; i >= 0; i--) {
    const date = format(subDays(new Date(), i), "yyyy-MM-dd");
    const rand = Math.random();
    data[date] = rand < 0.25 ? 0 : rand < 0.45 ? 1 : rand < 0.65 ? 2 : rand < 0.82 ? 3 : 4;
  }
  return data;
}

const INTENSITY_COLORS = [
  "rgba(168,85,247,0.05)",  // 0 = empty
  "rgba(168,85,247,0.25)",  // 1 = low
  "rgba(168,85,247,0.45)",  // 2 = medium
  "rgba(168,85,247,0.70)",  // 3 = high
  "#A855F7",                // 4 = max
];

const MONTHS = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const DAYS   = ["Dom","","Ter","","Qui","","Sáb"];

export function HabitHeatmap() {
  const data = useMemo(() => generateMockData(), []);

  // Build grid: 53 weeks × 7 days
  const today = new Date();
  const startDate = startOfWeek(subDays(today, 364), { weekStartsOn: 0 });
  const totalDays = differenceInDays(today, startDate) + 1;
  const weeks: string[][] = [];

  for (let w = 0; w < 53; w++) {
    const week: string[] = [];
    for (let d = 0; d < 7; d++) {
      const date = addDays(startDate, w * 7 + d);
      week.push(format(date, "yyyy-MM-dd"));
    }
    weeks.push(week);
  }

  // Month labels
  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const month = new Date(week[0]).getMonth();
    if (month !== lastMonth) {
      monthLabels.push({ label: MONTHS[month], col: i });
      lastMonth = month;
    }
  });

  const totalCompleted = Object.values(data).filter(v => v > 0).length;
  const currentStreak = (() => {
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const d = format(subDays(today, i), "yyyy-MM-dd");
      if ((data[d] ?? 0) > 0) streak++;
      else break;
    }
    return streak;
  })();

  return (
    <div>
      {/* Summary */}
      <div className="flex gap-6 mb-4 text-xs text-text-muted">
        <span><span className="text-purple font-semibold">{totalCompleted}</span> dias ativos</span>
        <span><span className="text-red font-semibold">{currentStreak}</span> streak atual</span>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <div className="min-w-max">
          {/* Month labels */}
          <div className="flex mb-1 ml-8">
            {monthLabels.map(({ label, col }) => (
              <div
                key={label + col}
                className="text-[10px] text-text-muted absolute"
                style={{ marginLeft: col * 14 }}
              >
                {label}
              </div>
            ))}
          </div>
          <div className="h-3" />

          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 mr-1">
              {DAYS.map((d, i) => (
                <div key={i} className="w-7 h-3 text-[10px] text-text-muted leading-3 flex items-center">
                  {d}
                </div>
              ))}
            </div>

            {/* Cells */}
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.map((date, di) => {
                  const intensity = data[date] ?? 0;
                  const isFuture = new Date(date) > today;
                  return (
                    <motion.div
                      key={date}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (wi * 7 + di) * 0.0005, duration: 0.2 }}
                      title={`${date}: ${intensity === 0 ? "Nenhum" : intensity === 4 ? "Perfeito" : intensity + " hábitos"}`}
                      className="heatmap-cell cursor-pointer hover:scale-125 hover:z-10 relative"
                      style={{
                        backgroundColor: isFuture ? "transparent" : INTENSITY_COLORS[intensity],
                        border: isFuture ? "1px solid rgba(255,255,255,0.04)" : intensity > 0 ? `1px solid rgba(168,85,247,${intensity * 0.1})` : "1px solid rgba(255,255,255,0.06)",
                        boxShadow: intensity === 4 ? "0 0 6px rgba(168,85,247,0.5)" : undefined,
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-3 justify-end">
            <span className="text-[10px] text-text-muted">Menos</span>
            {INTENSITY_COLORS.map((c, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: c, border: "1px solid rgba(255,255,255,0.06)" }}
              />
            ))}
            <span className="text-[10px] text-text-muted">Mais</span>
          </div>
        </div>
      </div>
    </div>
  );
}
