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
  AlertTriangle 
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

  return (
    <div className="space-y-10 pb-20 max-w-5xl mx-auto selection:bg-purple-500/30">

      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#1A1A1A]">
        <div>
          <h1 className="text-[22px] font-semibold text-white uppercase tracking-wider">Tactical Hub // Habits</h1>
          <p className="text-[#4B5563] text-[11px] mt-1 uppercase font-semibold tracking-[0.15em]">
            <span className="text-purple">{doneCount}</span> of <span className="text-white">{habits.length}</span> objectives secured today
          </p>
        </div>
        
        <AddHabitModal 
          userId={userId} 
          onSuccess={() => router.refresh()}
          trigger={
            <button className="h-9 px-5 rounded-md border border-purple/50 bg-purple/10 text-white font-bold text-[11px] uppercase tracking-widest hover:bg-purple/20 transition-all flex items-center gap-2">
              <Plus className="w-3.5 h-3.5" />
              New Objective
            </button>
          }
        />
      </header>

      {/* Global Progress */}
      {habits.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between text-[10px] font-semibold uppercase tracking-widest text-[#4B5563]">
            <span>Daily Sync Progress</span>
            <span className="text-purple">{Math.round((doneCount / habits.length) * 100)}%</span>
          </div>
          <div className="h-1 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 to-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${(doneCount / habits.length) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "h-7 px-4 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all whitespace-nowrap border",
              filter === cat
                ? "bg-purple text-white border-purple"
                : "border-[#1A1A1A] text-[#4B5563] hover:border-[#333] text-white"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Habits tactical list */}
      <div className="flex flex-col">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 text-[10px] font-bold text-[#2D2D3A] uppercase tracking-widest border-b border-[#1A1A1A]">
          <div className="col-span-1 flex justify-center">Status</div>
          <div className="col-span-6">Objective Name</div>
          <div className="col-span-2 text-center">Streak</div>
          <div className="col-span-2 text-center">XP Reward</div>
          <div className="col-span-1 text-right">Ops</div>
        </div>

        <AnimatePresence mode="popLayout">
          {filtered.map((habit, i) => (
            <motion.div
              key={habit.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ delay: i * 0.03 }}
              className={cn(
                "grid grid-cols-12 gap-4 px-4 py-5 bg-transparent border-b border-[#1A1A1A] items-center group transition-all",
                habit.todayDone ? "opacity-40" : "hover:bg-white/[0.02]"
              )}
            >
              {/* Check-in */}
              <div className="col-span-1 flex justify-center">
                <button
                  onClick={() => handleToggleDone(habit.id, habit.todayDone)}
                  className={cn(
                    "w-5 h-5 border transition-all duration-300 flex items-center justify-center rounded-[2px]",
                    habit.todayDone
                      ? "bg-purple-600 border-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.5)]"
                      : "border-[#333] hover:border-purple-500/50"
                  )}
                >
                  {habit.todayDone && <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />}
                </button>
              </div>

              {/* Title & Info */}
              <div className="col-span-6 space-y-2">
                <h3 className={cn(
                  "text-[13px] font-semibold tracking-tight transition-all",
                  habit.todayDone ? "line-through text-[#4B5563]" : "text-zinc-200"
                )}>
                  {habit.title.toUpperCase()}
                </h3>
                <div className="flex items-center gap-4">
                  <span className="text-[9px] font-mono text-[#2D2D3A] uppercase tracking-widest">{habit.category}</span>
                  <div className="h-[2px] flex-1 max-w-[100px] bg-[#1A1A1A] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-600/50" 
                      style={{ width: `${Math.min(100, (habit.totalCompletions / 30) * 100)}%` }} 
                    />
                  </div>
                </div>
              </div>

              {/* Streak */}
              <div className="col-span-2 flex justify-center items-center gap-2">
                <Flame className={cn("w-3.5 h-3.5", habit.currentStreak > 0 ? "text-red-500" : "text-[#2D2D3A]")} />
                <span className={cn("text-xs font-mono font-semibold", habit.currentStreak > 0 ? "text-white" : "text-[#2D2D3A]")}>
                  {habit.currentStreak.toString().padStart(2, '0')}
                </span>
              </div>

              {/* XP */}
              <div className="col-span-2 flex justify-center">
                <span className="text-[10px] font-bold text-purple bg-purple/5 px-2 py-0.5 rounded border border-purple/20">
                  +{habit.xpReward} XP
                </span>
              </div>

              {/* Options */}
              <div className="col-span-1 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="p-1.5 rounded hover:bg-white/5 text-[#4B5563] hover:text-white transition-all">
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content className="min-w-[140px] bg-black border border-[#1A1A1A] rounded-md p-1 shadow-2xl z-[100]">
                      <AddHabitModal 
                        userId={userId} 
                        habit={habit}
                        onSuccess={() => router.refresh()}
                        trigger={
                          <DropdownMenu.Item onSelect={(e) => e.preventDefault()} className="flex items-center gap-2 px-3 py-2 rounded text-[10px] font-bold text-[#6B7280] hover:text-white hover:bg-[#111] outline-none cursor-pointer uppercase tracking-widest">
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit
                          </DropdownMenu.Item>
                        }
                      />
                      <DropdownMenu.Item 
                        onSelect={() => setHabitToDelete(habit)}
                        className="flex items-center gap-2 px-3 py-2 rounded text-[10px] font-bold text-red-500/70 hover:text-red-500 hover:bg-red-500/5 outline-none cursor-pointer uppercase tracking-widest"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog.Root open={!!habitToDelete} onOpenChange={(open) => !open && setHabitToDelete(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[200] animate-in fade-in duration-200" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-black border border-[#1A1A1A] rounded-md p-8 shadow-2xl z-[201] animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              
              <Dialog.Title className="text-base font-bold text-white uppercase tracking-widest mb-2">
                Terminate Objective?
              </Dialog.Title>
              
              <p className="text-xs text-[#6B7280] mb-8 leading-relaxed">
                CONFIRM DELETION OF <span className="text-white font-bold">&quot;{habitToDelete?.title.toUpperCase()}&quot;</span>. DATA HISTORY WILL BE ARCHIVED.
              </p>

              <div className="flex gap-3 w-full">
                <Dialog.Close asChild>
                  <button className="flex-1 h-10 rounded border border-[#1A1A1A] text-[10px] font-bold uppercase tracking-widest text-[#4B5563] hover:bg-[#111] transition-all">
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  disabled={isDeleting}
                  onClick={handleDeleteHabit}
                  className="flex-1 h-10 rounded bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-50"
                >
                  {isDeleting ? "ARCHIVING..." : "CONFIRM"}
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  );
}
