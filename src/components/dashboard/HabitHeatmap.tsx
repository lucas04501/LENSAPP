"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { format, subDays, startOfWeek, addDays } from "date-fns";
import { Skeleton } from "../layout/Skeleton";

interface HabitHeatmapProps {
  data?: { date: string; count: number }[];
  loading?: boolean;
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

export function HabitHeatmap({ data: heatmapData, loading }: HabitHeatmapProps) {
  const dataMap = useMemo(() => {
    if (loading || !heatmapData) return {};
    const map: Record<string, number> = {};
    heatmapData.forEach(item => {
      // Map counts to intensity 0-4
      map[item.date] = Math.min(item.count, 4);
    });
    return map;
  }, [heatmapData, loading]);

  if (loading || !heatmapData) {
    return <Skeleton className="w-full h-40 rounded-2xl" />;
  }

  // Build grid: 53 weeks × 7 days
  const today = new Date();
  const startDate = startOfWeek(subDays(today, 364), { weekStartsOn: 0 });
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

  const totalCompleted = heatmapData.length;

  return (
    <div>
      {/* Summary */}
      <div className="flex gap-6 mb-4 text-xs text-text-muted">
        <span><span className="text-purple font-semibold">{totalCompleted}</span> dias ativos nos últimos 12 meses</span>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <div className="min-w-max relative">
          {/* Month labels */}
          <div className="flex mb-1 ml-8 relative h-4">
            {monthLabels.map(({ label, col }) => (
              <div
                key={label + col}
                className="text-[10px] text-text-muted absolute"
                style={{ left: col * 14 }}
              >
                {label}
              </div>
            ))}
          </div>

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
                  const intensity = dataMap[date] ?? 0;
                  const isFuture = new Date(date) > today;
                  return (
                    <motion.div
                      key={date}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (wi * 7 + di) * 0.0005, duration: 0.2 }}
                      title={`${date}: ${intensity === 0 ? "Nenhum" : intensity + " hábitos"}`}
                      className="w-3 h-3 rounded-sm cursor-pointer hover:scale-125 hover:z-10 relative"
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
