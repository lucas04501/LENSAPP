"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Flame, 
  Check, 
  Trash2, 
  MoreVertical, 
  Edit3, 
  AlertTriangle,
  X 
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

  const filtered = filter === "Todos" 
    ? habits 
    : habits.filter(h => h.category === filter);
  
  const doneCount = habits.filter(h => h.todayDone).length;

  const handleToggleDone = async (habitId: string, isDone: boolean) => {
    // Optimistic update
    setHabits(prev => prev.map(h => 
      h.id === habitId ? { ...h, todayDone: !isDone } : h
    ));

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
      // Revert optimistic update
      setHabits(prev => prev.map(h => 
        h.id === habitId ? { ...h, todayDone: isDone } : h
      ));
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

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 sm:space-y-8 pb-20">

      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white italic uppercase tracking-tighter">Seus hábitos</h1>
          <p className="text-text-muted text-xs sm:text-sm mt-1 uppercase font-bold tracking-widest">
            <span className="text-purple font-black">{doneCount}</span> de{" "}
            <span className="text-white font-black">{habits.length}</span> completados hoje
          </p>
        </div>
        
        <AddHabitModal 
          userId={userId} 
          onSuccess={() => router.refresh()}
          trigger={
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-to-r from-purple to-red text-white font-black px-6 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-purple/20 text-sm uppercase tracking-widest"
            >
              <Plus className="w-4 h-4" />
              Novo hábito
            </motion.button>
          }
        />
      </motion.div>

      {/* Progress bar */}
      {habits.length > 0 && (
        <motion.div variants={item} className="glass rounded-[2rem] border border-white/5 p-5 sm:p-6 bg-[#050505]">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
            <span className="text-text-muted">Progresso de hoje</span>
            <span className="text-purple">{Math.round((doneCount / habits.length) * 100)}%</span>
          </div>
          <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple to-red rounded-full shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              initial={{ width: 0 }}
              animate={{ width: `${(doneCount / habits.length) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div variants={item} className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
              filter === cat
                ? "bg-purple text-white border-purple shadow-xl"
                : "bg-surface-2 text-text-muted border-white/5 hover:border-white/20"
            )}
          >
            {cat === "Todos" ? "Todos" : cat}
          </button>
        ))}
      </motion.div>

      {/* Habits grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((habit, i) => (
            <motion.div
              key={habit.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "glass rounded-[2rem] border p-5 sm:p-6 transition-all duration-300 bg-[#050505] flex flex-col justify-between group relative",
                habit.todayDone
                  ? "border-white/10 opacity-60"
                  : "border-white/5 hover:border-purple/20"
              )}
            >
              {/* Options Menu */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="p-2 rounded-xl bg-white/5 text-text-muted hover:text-white hover:bg-white/10 transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </DropdownMenu.Trigger>
                  
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content className="min-w-[160px] bg-[#0A0A0A] border border-white/10 rounded-2xl p-2 shadow-2xl z-[100] animate-in fade-in zoom-in-95 duration-200">
                      <AddHabitModal 
                        userId={userId} 
                        habit={habit}
                        onSuccess={() => router.refresh()}
                        trigger={
                          <DropdownMenu.Item onSelect={(e) => e.preventDefault()} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-text-muted hover:text-white hover:bg-white/5 outline-none cursor-pointer">
                            <Edit3 className="w-4 h-4" />
                            Editar hábito
                          </DropdownMenu.Item>
                        }
                      />
                      <DropdownMenu.Item 
                        onSelect={() => setHabitToDelete(habit)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red hover:bg-red/10 outline-none cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remover hábito
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>

              <div>
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xl"
                    style={{ backgroundColor: `${habit.color}15`, border: `1px solid ${habit.color}30` }}
                  >
                    {habit.icon}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red/10 border border-red/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                    <Flame className="w-3.5 h-3.5 text-red" />
                    <span className="text-xs font-black text-white italic">{habit.currentStreak}</span>
                  </div>
                </div>

                <h3 className={cn(
                  "font-black text-base uppercase italic tracking-tighter mb-2 transition-all",
                  habit.todayDone ? "line-through text-text-muted" : "text-white"
                )}>
                  {habit.title}
                </h3>

                <div className="flex items-center gap-3 mb-6">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{habit.totalCompletions} total</span>
                  <span
                    className="text-[9px] px-2 py-0.5 rounded-lg font-black uppercase tracking-widest"
                    style={{ backgroundColor: `${habit.color}15`, color: habit.color }}
                  >
                    +{habit.xpReward} XP
                  </span>
                </div>
              </div>

              {/* Complete button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleToggleDone(habit.id, habit.todayDone)}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all min-h-[52px]",
                  habit.todayDone
                    ? "bg-surface-2 text-text-muted border border-white/5"
                    : "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-purple/40"
                )}
              >
                {habit.todayDone ? (
                  <>
                    <Check className="w-4 h-4" style={{ color: habit.color }} />
                    <span style={{ color: habit.color }}>Completado</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Check-in
                  </>
                )}
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog.Root open={!!habitToDelete} onOpenChange={(open) => !open && setHabitToDelete(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] animate-in fade-in duration-200" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-[#050505] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl z-[201] animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-red/10 border border-red/20 flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8 text-red" />
              </div>
              
              <Dialog.Title className="text-xl font-black text-white italic uppercase tracking-tighter mb-2">
                Remover hábito?
              </Dialog.Title>
              
              <p className="text-sm text-text-muted mb-1">
                Tem certeza que quer remover <span className="text-white font-bold">"{habitToDelete?.title}"</span>?
              </p>
              <p className="text-[10px] font-black text-red uppercase tracking-widest mb-8">
                Seu histórico de conclusões será preservado.
              </p>

              <div className="flex gap-3 w-full">
                <Dialog.Close asChild>
                  <button className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-text-muted hover:bg-white/10 transition-all">
                    Cancelar
                  </button>
                </Dialog.Close>
                <button
                  disabled={isDeleting}
                  onClick={handleDeleteHabit}
                  className="flex-1 py-4 rounded-2xl bg-red text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isDeleting ? "Removendo..." : "Remover"}
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </motion.div>
  );
}
