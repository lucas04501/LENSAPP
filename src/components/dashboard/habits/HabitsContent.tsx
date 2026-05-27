"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Flame, 
  Check, 
  Trash2, 
  MoreVertical, 
  Edit3, 
  AlertTriangle,
  Calendar,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import { 
  deleteHabit, 
  completeHabit, 
  uncompleteHabit 
} from "@/lib/actions/habits";
import { toast } from "react-hot-toast";
import { AddHabitModal } from "@/components/habits/AddHabitModal";
import { showAchievementToast } from "@/components/gamification/AchievementToast";
import { useRouter } from "next/navigation";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

const CATEGORIES = ["Todos", "HEALTH", "MIND", "WORK", "SOCIAL", "FINANCE", "CREATIVE", "OTHER"];

interface HabitsContentProps {
  initialHabits: any[];
  userId: string;
}

export function HabitsContent({ initialHabits, userId }: HabitsContentProps) {
  const router = useRouter();
  const [habits, setHabits] = useState(initialHabits);
  const [filter, setFilter] = useState("Todos");
  const [habitToDelete, setHabitToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const daysOfWeek = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  }, []);

  const filtered = filter === "Todos" 
    ? habits 
    : habits.filter(h => h.category === filter);
  
  const doneCount = habits.filter(h => h.todayDone).length;

  const handleToggleDone = async (habitId: string, isDone: boolean) => {
    const todayStr = format(new Date(), "yyyy-MM-dd");
    
    // Optimistic update
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const newWeeklyStatus = h.weeklyStatus.map((s: any) => 
          s.day === todayStr ? { ...s, isDone: !isDone } : s
        );
        return { ...h, todayDone: !isDone, weeklyStatus: newWeeklyStatus };
      }
      return h;
    }));

    try {
      if (isDone) {
        await uncompleteHabit(habitId, userId);
        toast.success("Hábito desmarcado");
      } else {
        const res = await completeHabit(habitId, userId);
        if (res.success) {
          toast.success("Hábito concluído! +XP");
          res.unlockedAchievements?.forEach(showAchievementToast);
        }
      }
      router.refresh();
    } catch (error) {
      // Revert on error
      setHabits(prev => prev.map(h => {
        if (h.id === habitId) {
          const newWeeklyStatus = h.weeklyStatus.map((s: any) => 
            s.day === todayStr ? { ...s, isDone: isDone } : s
          );
          return { ...h, todayDone: isDone, weeklyStatus: newWeeklyStatus };
        }
        return h;
      }));
      toast.error("Erro ao atualizar hábito");
    }
  };

  const handleDeleteHabit = async () => {
    if (!habitToDelete) return;
    setIsDeleting(true);

    try {
      const res = await deleteHabit(habitToDelete.id, userId);
      if (res.success) {
        toast.success("Hábito removido");
        setHabits(prev => prev.filter(h => h.id !== habitToDelete.id));
        setHabitToDelete(null);
        router.refresh();
      } else {
        toast.error("Erro ao remover hábito");
      }
    } catch (error) {
      toast.error("Erro ao remover hábito");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-10 pb-20 max-w-6xl mx-auto px-4 selection:bg-purple-500/30 font-sans">

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">
            Protocolo de Hábitos
          </h1>
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-[0.2em] flex items-center gap-2">
            <Zap className="w-3 h-3 text-purple-500" />
            {doneCount} Objetivos Assegurados Hoje • {habits.length} Ativos
          </p>
        </div>
        
        <AddHabitModal 
          userId={userId} 
          onSuccess={() => router.refresh()}
          trigger={
            <button className="h-10 px-6 rounded-xl bg-purple-600 text-white font-bold text-[11px] uppercase tracking-widest hover:bg-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-95">
              <Plus className="w-4 h-4" />
              Novo Hábito
            </button>
          }
        />
      </header>

      {/* Global Progress */}
      {habits.length > 0 && (
        <div className="space-y-3 bg-[#0F0F14] border border-white/5 p-4 rounded-2xl">
          <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
            <span>Sincronização Diária</span>
            <span className="text-purple-400">{Math.round((doneCount / habits.length) * 100)}%</span>
          </div>
          <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 via-purple-400 to-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${(doneCount / habits.length) * 100}%` }}
              transition={{ duration: 1, ease: "circOut" }}
            />
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "h-8 px-4 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border shrink-0",
              filter === cat
                ? "bg-white text-black border-white"
                : "border-white/5 bg-zinc-900/50 text-zinc-500 hover:text-zinc-300 hover:border-white/10"
            )}
          >
            {cat === "Todos" ? "Todos" : cat}
          </button>
        ))}
      </div>

      {/* Habits Grid Interaction */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center space-y-4"
            >
              <div className="w-16 h-16 bg-zinc-900/50 border border-white/5 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6 text-zinc-700" />
              </div>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Nenhum hábito encontrado nesta frequência</p>
            </motion.div>
          ) : (
              filtered.map((habit, i) => {
              const weeklyPerformance = Math.round(
                (habit.weeklyStatus.filter((s: any) => s.isDone).length / 7) * 100
              );
              const isHighPerformance = weeklyPerformance >= 70;

              return (
                <motion.div
                  key={habit.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "relative group bg-[#0F0F14] border border-white/5 rounded-[2rem] p-6 transition-all duration-500 hover:border-white/10",
                    habit.todayDone && "bg-zinc-900/40"
                  )}
                >
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center text-[16px] font-black transition-all duration-500 tabular-nums border",
                        habit.todayDone 
                          ? "bg-purple-600/10 border-purple-500/10" 
                          : "bg-white/[0.02] border-white/5 shadow-[0_0_20px_rgba(0,0,0,0.2)]",
                        isHighPerformance 
                          ? "text-purple-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.4)] border-purple-500/20" 
                          : "text-zinc-600 border-transparent"
                      )}>
                        {weeklyPerformance}%
                      </div>
                      <div className="space-y-1">
                      <h3 className={cn(
                        "text-sm font-bold uppercase tracking-tight transition-all duration-500",
                        habit.todayDone ? "text-zinc-500 line-through" : "text-white"
                      )}>
                        {habit.title}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{habit.category}</span>
                        <div className="flex items-center gap-1">
                          <Flame className={cn("w-3 h-3", habit.currentStreak > 0 ? "text-red-500" : "text-zinc-700")} />
                          <span className={cn("text-[10px] font-black italic", habit.currentStreak > 0 ? "text-white" : "text-zinc-700")}>
                            {habit.currentStreak}D
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleDone(habit.id, habit.todayDone)}
                      className={cn(
                        "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 active:scale-90",
                        habit.todayDone
                          ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]"
                          : "bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-white border border-white/5"
                      )}
                    >
                      <Check className={cn("w-5 h-5 transition-transform duration-500", habit.todayDone ? "scale-100" : "scale-0")} strokeWidth={4} />
                      {!habit.todayDone && <Plus className="w-5 h-5 absolute" />}
                    </button>

                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button className="p-2 rounded-xl hover:bg-white/5 text-zinc-600 hover:text-zinc-300 transition-all">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content className="min-w-[140px] bg-[#0F0F14] border border-white/5 rounded-xl p-1 shadow-2xl z-[100] animate-in fade-in zoom-in-95 duration-200">
                          <AddHabitModal 
                            userId={userId} 
                            habit={habit}
                            onSuccess={() => router.refresh()}
                            trigger={
                              <DropdownMenu.Item onSelect={(e) => e.preventDefault()} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[9px] font-black text-zinc-500 hover:text-white hover:bg-white/5 outline-none cursor-pointer uppercase tracking-[0.2em]">
                                <Edit3 className="w-3.5 h-3.5" />
                                Editar
                              </DropdownMenu.Item>
                            }
                          />
                          <DropdownMenu.Item 
                            onSelect={() => setHabitToDelete(habit)}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[9px] font-black text-red-500/70 hover:text-red-500 hover:bg-red-500/5 outline-none cursor-pointer uppercase tracking-[0.2em]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Excluir
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                </div>

                {/* Weekly Timeline */}
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  {daysOfWeek.map((day, dayIndex) => {
                    const dateStr = format(day, "yyyy-MM-dd");
                    const status = habit.weeklyStatus.find((s: any) => s.day === dateStr);
                    const isToday = isSameDay(day, new Date());
                    const isDone = status?.isDone;

                    return (
                      <div key={dateStr} className="flex flex-col items-center gap-2">
                        <span className={cn(
                          "text-[8px] font-black uppercase tracking-widest",
                          isToday ? "text-purple-400" : "text-zinc-600"
                        )}>
                          {format(day, "EEE", { locale: ptBR })}
                        </span>
                        <div className={cn(
                          "w-2.5 h-2.5 rounded-full transition-all duration-500",
                          isDone 
                            ? "bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]" 
                            : isToday 
                              ? "border border-purple-500/30" 
                              : "bg-zinc-800"
                        )} />
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog.Root open={!!habitToDelete} onOpenChange={(open) => !open && setHabitToDelete(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[200] animate-in fade-in duration-300" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-[#0F0F14] border border-white/5 rounded-[2rem] p-8 shadow-2xl z-[201] animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              
              <Dialog.Title className="text-lg font-black text-white italic uppercase tracking-tighter mb-2">
                Encerrar Objetivo?
              </Dialog.Title>
              
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-8 leading-relaxed">
                Confirmar remoção de <span className="text-white">&quot;{habitToDelete?.title}&quot;</span>. O histórico de dados será arquivado.
              </p>

              <div className="flex gap-3 w-full">
                <Dialog.Close asChild>
                  <button className="flex-1 h-12 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-white/5 transition-all">
                    Cancelar
                  </button>
                </Dialog.Close>
                <button
                  disabled={isDeleting}
                  onClick={handleDeleteHabit}
                  className="flex-1 h-12 rounded-xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-50 active:scale-95"
                >
                  {isDeleting ? "Arquivando..." : "Confirmar"}
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  );
}
