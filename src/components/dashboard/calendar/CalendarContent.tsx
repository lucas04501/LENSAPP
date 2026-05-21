"use client";

import { useState, useMemo, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  CheckCircle2, XCircle, Zap, Flame, Trophy,
  Info, Filter, Plus, X, ArrowUpRight
} from "lucide-react";
import { 
  format, addMonths, subMonths, startOfMonth, 
  endOfMonth, eachDayOfInterval, isSameMonth, 
  isSameDay, isToday, startOfWeek, endOfWeek,
  getDay
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { getCalendarData } from "@/lib/actions/calendar";
import { toast } from "react-hot-toast";

interface CalendarContentProps {
  userId: string;
  initialData: any;
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function CalendarContent({ userId, initialData }: CalendarContentProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [data, setData] = useState(initialData);
  const [selectedHabitId, setSelectedHabitId] = useState<string>("all");
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [isPending, startTransition] = useTransition();

  const habits = data.habits;
  const logsByDate = data.logsByDate;
  const stats = data.stats;

  const handleNavigate = (direction: "prev" | "next" | "today") => {
    let newDate = currentDate;
    if (direction === "prev") newDate = subMonths(currentDate, 1);
    if (direction === "next") newDate = addMonths(currentDate, 1);
    if (direction === "today") newDate = new Date();

    setCurrentDate(newDate);
    
    startTransition(async () => {
      const res = await getCalendarData(userId, newDate.getFullYear(), newDate.getMonth());
      if (res.success) {
        setData(res.data);
      } else {
        toast.error("Erro ao carregar dados");
      }
    });
  };

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const selectedDayLogs = useMemo(() => {
    if (!selectedDay) return null;
    const dateStr = format(selectedDay, "yyyy-MM-dd");
    const completedIds = logsByDate[dateStr] || [];
    
    return habits.map((h: any) => ({
      ...h,
      isCompleted: completedIds.includes(h.id)
    }));
  }, [selectedDay, logsByDate, habits]);

  return (
    <div className="space-y-5 pb-10 max-w-[1100px] mx-auto">
      
      {/* ── Header ── */}
      <header className="flex items-end justify-between gap-6 pb-2 border-b border-[#111118]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-[18px] font-bold text-white uppercase tracking-wider">
              {format(currentDate, "MMMM yyyy", { locale: ptBR })}
            </h1>
            <div className="flex items-center gap-1 ml-2">
              <button onClick={() => handleNavigate("prev")} className="p-1 text-[#6B7280] hover:text-white transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => handleNavigate("next")} className="p-1 text-[#6B7280] hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleNavigate("today")} 
                className="ml-2 text-[11px] font-medium text-[#6B7280] border border-[#2D2D3A] px-2.5 py-1 rounded-[4px] hover:text-white hover:border-[#3D3D4A] transition-all"
              >
                HOJE
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center">
          {[
            { label: "DIAS PERFEITOS", value: stats.perfectDays },
            { label: "CONCLUSÃO", value: `${stats.completionRate}%` },
            { label: "MELHOR SEQ.", value: `${stats.bestStreak}d` },
            { label: "XP GANHO", value: stats.totalXP },
          ].map((s, i) => (
            <div key={i} className={cn(
              "flex flex-col px-4 first:pl-0 last:pr-0",
              i !== 3 && "border-r border-[#111118]"
            )}>
              <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1">{s.label}</span>
              <p className="text-[20px] font-bold text-white leading-none">{s.value}</p>
            </div>
          ))}
        </div>
      </header>

      {/* ── Habit Selector ── */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
        <button
          onClick={() => setSelectedHabitId("all")}
          className={cn(
            "h-[28px] px-4 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-all shrink-0",
            selectedHabitId === "all" 
              ? "bg-[#7C3AED] text-white" 
              : "border border-[#1E1E2E] text-[#6B7280] hover:border-[#374151]"
          )}
        >
          TODOS
        </button>
        {habits.map((h: any) => (
          <button
            key={h.id}
            onClick={() => setSelectedHabitId(h.id)}
            className={cn(
              "h-[28px] px-4 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-all shrink-0",
              selectedHabitId === h.id 
                ? "bg-[#7C3AED] text-white" 
                : "border border-[#1E1E2E] text-[#6B7280] hover:border-[#374151]"
            )}
          >
            {h.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ── Calendar Grid ── */}
        <div className="lg:col-span-9">
          <div className="bg-[#09090B] border border-[#111118] rounded-md overflow-hidden">
            <div className="grid grid-cols-7 border-b border-[#111118]">
              {WEEKDAYS.map(w => (
                <div key={w} className="text-center text-[10px] font-semibold text-[#3D3D4A] uppercase tracking-wider py-2">
                  {w}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7">
              {days.map((day, i) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const isCurrentMonth = isSameMonth(day, currentDate);
                const completedIds = logsByDate[dateStr] || [];
                const allDone = habits.length > 0 && completedIds.length === habits.length;
                const someDone = completedIds.length > 0;
                
                return (
                  <div
                    key={dateStr}
                    onClick={() => setSelectedDay(day)}
                    className={cn(
                      "h-[52px] border-r border-b border-[#111118] flex flex-col items-center justify-between p-1.5 cursor-pointer relative transition-all duration-200",
                      (i + 1) % 7 === 0 && "border-r-0",
                      !isCurrentMonth && "opacity-30",
                      isToday(day) && "ring-1 ring-inset ring-[#7C3AED]",
                      selectedDay && isSameDay(day, selectedDay) && "bg-[#1E1E2E]/50",
                      allDone ? "bg-[#7C3AED]/25" : someDone ? "bg-[#7C3AED]/15" : "hover:bg-[#111118]"
                    )}
                  >
                    <span className={cn(
                      "text-[13px] font-medium self-start leading-none",
                      isCurrentMonth ? "text-white" : "text-[#6B7280]"
                    )}>
                      {format(day, "d")}
                    </span>
                    
                    {/* Habit Dots */}
                    <div className="flex items-center gap-1 mt-auto">
                      {completedIds.slice(0, 3).map((id: string) => {
                        const h = habits.find((h: any) => h.id === id);
                        return (
                          <div 
                            key={id} 
                            className="w-1 h-1 rounded-full" 
                            style={{ backgroundColor: h?.color || "#7C3AED" }} 
                          />
                        );
                      })}
                      {completedIds.length > 3 && (
                        <span className="text-[10px] text-[#6B7280] leading-none">+{completedIds.length - 3}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Side Panel ── */}
        <div className="lg:col-span-3 min-w-[240px]">
          <AnimatePresence mode="wait">
            {selectedDay ? (
              <motion.div
                key={format(selectedDay, "yyyy-MM-dd")}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="bg-[#0F0F14] border border-[#111118] rounded-md p-5 sticky top-5 h-fit"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-[14px] font-bold text-white uppercase tracking-tight">
                      {format(selectedDay, "dd MMM yyyy", { locale: ptBR })}
                    </h2>
                    <p className="text-[10px] text-[#6B7280] uppercase font-semibold tracking-wider mt-0.5">
                      {format(selectedDay, "EEEE", { locale: ptBR })}
                    </p>
                  </div>
                  <button onClick={() => setSelectedDay(null)} className="p-1 hover:bg-[#111118] rounded transition-colors text-[#4B5563]">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <h3 className="text-[10px] font-semibold text-[#4B5563] uppercase tracking-wider mb-2">PROGRESS</h3>
                  {selectedDayLogs?.map((h: any) => (
                    <div key={h.id} className="flex items-center gap-3 py-2 border-b border-[#111118] last:border-0">
                      <div className="flex-1">
                        <p className={cn(
                          "text-[12px] font-medium transition-all",
                          h.isCompleted ? "text-white" : "text-[#4B5563]"
                        )}>{h.title}</p>
                      </div>
                      {h.isCompleted ? (
                        <div className="w-3.5 h-3.5 rounded-sm bg-purple flex items-center justify-center">
                          <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                        </div>
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-sm border border-[#374151]" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-4 border-t border-[#111118]">
                  <p className="text-[10px] font-semibold text-[#4B5563] uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Info className="w-3 h-3" />
                    Insight
                  </p>
                  <p className="text-[11px] text-[#6B7280] italic leading-relaxed">
                    Clique para ver sua reflexão no diário desta data.
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="h-full border border-[#111118] border-dashed rounded-md flex flex-col items-center justify-center text-center p-8 min-h-[300px]">
                <p className="text-[12px] font-semibold text-[#3D3D4A] uppercase tracking-wider">
                  SELECIONE UM DIA
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
