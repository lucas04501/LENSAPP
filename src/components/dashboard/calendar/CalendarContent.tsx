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
    <div className="space-y-8 pb-20 max-w-7xl mx-auto">
      
      {/* ── Header ── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple/10 border border-purple/20 flex items-center justify-center">
            <CalendarIcon className="w-6 h-6 text-purple" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
              <span className="text-purple">{format(currentDate, "MMMM", { locale: ptBR })}</span>
              <span>{format(currentDate, "yyyy")}</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <button onClick={() => handleNavigate("prev")} className="p-1 hover:text-purple transition-colors"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => handleNavigate("today")} className="text-[10px] font-black uppercase tracking-widest px-2 hover:text-purple transition-colors">Hoje</button>
              <button onClick={() => handleNavigate("next")} className="p-1 hover:text-purple transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1 lg:max-w-2xl">
          {[
            { label: "Dias Perfeitos", value: stats.perfectDays, icon: Trophy, color: "#F59E0B" },
            { label: "Conclusão", value: `${stats.completionRate}%`, icon: Zap, color: "#A855F7" },
            { label: "Melhor Seq.", value: `${stats.bestStreak}d`, icon: Flame, color: "#EF4444" },
            { label: "XP Ganho", value: stats.totalXP, icon: ArrowUpRight, color: "#22C55E" },
          ].map((s, i) => (
            <div key={i} className="glass rounded-xl border border-white/5 p-3 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1">
                <s.icon className="w-3 h-3" style={{ color: s.color }} />
                <span className="text-[9px] font-black text-text-muted uppercase tracking-wider">{s.label}</span>
              </div>
              <p className="text-lg font-black text-white italic leading-none">{s.value}</p>
            </div>
          ))}
        </div>
      </header>

      {/* ── Habit Selector ── */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        <button
          onClick={() => setSelectedHabitId("all")}
          className={cn(
            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border",
            selectedHabitId === "all" 
              ? "bg-purple text-white border-purple shadow-[0_0_15px_rgba(168,85,247,0.4)]" 
              : "bg-surface-2 text-text-muted border-white/5 hover:border-white/20"
          )}
        >
          Todos
        </button>
        {habits.map((h: any) => (
          <button
            key={h.id}
            onClick={() => setSelectedHabitId(h.id)}
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border flex items-center gap-2",
              selectedHabitId === h.id 
                ? "text-white shadow-xl" 
                : "bg-surface-2 text-text-muted border-white/5 hover:border-white/20"
            )}
            style={selectedHabitId === h.id ? { 
              backgroundColor: h.color, 
              borderColor: h.color,
              boxShadow: `0 0 15px ${h.color}40`
            } : {}}
          >
            <span>{h.icon}</span>
            <span>{h.title}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── Calendar Grid ── */}
        <div className="lg:col-span-8">
          <div className="glass rounded-[2.5rem] border border-white/5 p-8 bg-[#050505]">
            <div className="grid grid-cols-7 mb-4">
              {WEEKDAYS.map(w => (
                <div key={w} className="text-center text-[10px] font-black text-text-muted uppercase tracking-[0.2em] py-2">
                  {w}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, i) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const isCurrentMonth = isSameMonth(day, currentDate);
                const completedIds = logsByDate[dateStr] || [];
                const isDone = selectedHabitId === "all" 
                  ? completedIds.length > 0 
                  : completedIds.includes(selectedHabitId);
                
                // Intensity for "All"
                const intensity = selectedHabitId === "all" 
                  ? habits.length > 0 ? completedIds.length / habits.length : 0
                  : isDone ? 1 : 0;

                const dayColor = selectedHabitId === "all" 
                  ? "#A855F7" 
                  : habits.find((h: any) => h.id === selectedHabitId)?.color || "#A855F7";

                return (
                  <motion.div
                    key={dateStr}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.005 }}
                    onClick={() => setSelectedDay(day)}
                    className={cn(
                      "aspect-square rounded-2xl flex flex-col items-center justify-center cursor-pointer relative group transition-all duration-300",
                      !isCurrentMonth && "opacity-20",
                      isToday(day) && "border-2 border-white/40",
                      !isDone && isCurrentMonth && "hover:bg-white/5",
                      selectedDay && isSameDay(day, selectedDay) && "ring-2 ring-purple ring-offset-4 ring-offset-[#050505] z-10"
                    )}
                    style={isDone && isCurrentMonth ? { 
                      backgroundColor: `${dayColor}${Math.round(Math.max(0.3, intensity) * 255).toString(16).padStart(2, '0')}`,
                    } : {}}
                  >
                    <span className={cn(
                      "text-sm font-black italic tracking-tighter transition-colors",
                      isDone && isCurrentMonth ? "text-white" : "text-text-primary",
                      !isCurrentMonth && "text-text-muted"
                    )}>
                      {format(day, "d")}
                    </span>
                    
                    {/* Tooltip hint */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black text-[9px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                      {completedIds.length} hábitos concluídos
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Side Panel ── */}
        <div className="lg:col-span-4">
          <AnimatePresence mode="wait">
            {selectedDay ? (
              <motion.div
                key={format(selectedDay, "yyyy-MM-dd")}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass rounded-[2.5rem] border border-white/5 p-8 bg-[#050505] sticky top-8 h-fit"
              >
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                      {format(selectedDay, "dd 'de' MMMM", { locale: ptBR })}
                    </h2>
                    <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mt-1">
                      {format(selectedDay, "EEEE", { locale: ptBR })}
                    </p>
                  </div>
                  <button onClick={() => setSelectedDay(null)} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-text-muted">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-4">Progresso do Dia</h3>
                  {selectedDayLogs?.map((h: any) => (
                    <div key={h.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#050505] text-lg">
                        {h.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] font-black text-white uppercase tracking-tight">{h.title}</p>
                        <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">{h.category}</p>
                      </div>
                      {h.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red opacity-30" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Note placeholder/link to Journal */}
                <div className="mt-10 p-4 rounded-2xl bg-purple/5 border border-purple/10 border-dashed">
                  <p className="text-[10px] font-black text-purple uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Info className="w-3 h-3" />
                    Insight do Dia
                  </p>
                  <p className="text-xs text-text-muted italic leading-relaxed">
                    Clique para ver sua reflexão no diário desta data.
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="glass rounded-[2.5rem] border border-white/5 p-8 bg-[#050505] border-dashed flex flex-col items-center justify-center text-center py-20 h-full">
                <CalendarIcon className="w-12 h-12 text-text-muted opacity-20 mb-4" />
                <p className="text-sm font-bold text-text-muted uppercase tracking-widest leading-relaxed">
                  Selecione um dia<br />para ver detalhes
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
