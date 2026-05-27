"use client";

import { useMemo } from "react";
import { 
  format, startOfMonth, endOfMonth, eachDayOfInterval, 
  isSameMonth, isToday, startOfWeek, endOfWeek, isSameDay
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface CompactCalendarProps {
  heatmapData: Record<string, number>;
  habitsCount: number;
}

export function CompactCalendar({ heatmapData, habitsCount }: CompactCalendarProps) {
  const currentDate = new Date();
  
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

  return (
    <div className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-[2rem] p-6 h-full flex flex-col group hover:bg-white/[0.04] transition-all duration-500">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-1">Calendário</h2>
          <p className="text-[14px] font-bold text-white uppercase tracking-tight">
            {format(currentDate, "MMMM yyyy", { locale: ptBR })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((w, i) => (
          <div key={i} className="text-center text-[10px] font-black text-zinc-600 uppercase">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const isCurrentMonth = isSameMonth(day, currentDate);
          const completedCount = heatmapData[dateStr] || 0;
          const completionRate = habitsCount > 0 ? completedCount / habitsCount : 0;
          
          return (
            <div
              key={dateStr}
              className={cn(
                "aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold transition-all relative group cursor-default",
                !isCurrentMonth && "opacity-10",
                isToday(day) && "ring-1 ring-purple-500/50",
                completionRate >= 1 
                  ? "bg-purple-500/30 text-white shadow-[0_0_10px_rgba(168,85,247,0.2)]" 
                  : completionRate > 0.5
                  ? "bg-purple-500/20 text-purple-200"
                  : completionRate > 0 
                  ? "bg-purple-500/10 text-purple-300/50" 
                  : "text-zinc-600 hover:bg-white/5"
              )}
            >
              {format(day, "d")}
              {isToday(day) && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-500 rounded-full" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm bg-purple-500/10" />
            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Início</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm bg-purple-500/30" />
            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Foco Total</span>
          </div>
        </div>
      </div>
    </div>
  );
}

