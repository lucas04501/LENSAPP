"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Flame, Trash2, AlertTriangle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { completeHabit, uncompleteHabit, deleteHabit } from "@/lib/actions/habits";
import { toast } from "react-hot-toast";
import { showAchievementToast } from "../gamification/AchievementToast";
import { AddHabitModal } from "./AddHabitModal";
import { Skeleton } from "../layout/Skeleton";
import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";

interface HabitCheckListProps {
  habits?: any[];
  userId: string;
  loading?: boolean;
}

export function HabitCheckList({ habits, userId, loading }: HabitCheckListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [justCompleted, setJustCompleted] = useState<string | null>(null);
  const [habitToDelete, setHabitToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (loading || !habits) {
    return (
      <div className="space-y-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[60px] rounded-[1.5rem] bg-white/[0.02]" />
        ))}
      </div>
    );
  }

  const handleToggle = (habitId: string, isDone: boolean) => {
    startTransition(async () => {
      if (isDone) {
        const res = await uncompleteHabit(habitId, userId);
        if (res.success) {
          toast.success("Hábito desmarcado");
          router.refresh();
        } else {
          toast.error(res.error || "Erro ao desmarcar");
        }
      } else {
        setJustCompleted(habitId);
        const res = await completeHabit(habitId, userId);
        if (res.success) {
          toast.success("Hábito concluído! +XP");
          res.unlockedAchievements?.forEach(showAchievementToast);
          router.refresh();
          setTimeout(() => setJustCompleted(null), 1000);
        } else {
          toast.error(res.error || "Erro ao concluir");
          setJustCompleted(null);
        }
      }
    });
  };

  const handleDeleteHabit = async () => {
    if (!habitToDelete) return;
    setIsDeleting(true);

    try {
      const res = await deleteHabit(habitToDelete.id, userId);
      if (res.success) {
        toast.success("Hábito removido");
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
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {habits.map((habit, i) => {
          const isDone = habit.todayDone;

          return (
            <motion.div
              key={habit.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "flex items-center gap-4 p-4 rounded-[1.5rem] border border-white/[0.03] bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 group relative",
                isPending && "pointer-events-none opacity-40"
              )}
            >
              {/* Checkbox */}
              <button 
                onClick={() => handleToggle(habit.id, isDone)}
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 shrink-0",
                  isDone
                    ? "bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                    : "border-2 border-zinc-800 hover:border-purple-500/50"
                )}
              >
                {isDone && (
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />
                )}
              </button>

              {/* Title */}
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-[13px] font-bold transition-all truncate",
                  isDone ? "text-zinc-600 line-through italic" : "text-white"
                )}>
                  {habit.title}
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 border border-white/5">
                  <Flame className={cn("w-3 h-3", habit.currentStreak > 0 ? "text-red-500" : "text-zinc-600")} />
                  <span className="text-[10px] text-zinc-400 font-black tabular-nums">{habit.currentStreak}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setHabitToDelete(habit);
                  }}
                  className="p-1.5 rounded-full text-zinc-700 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <AddHabitModal userId={userId} onSuccess={() => router.refresh()} />

      {/* Delete Confirmation Modal */}
      <Dialog.Root open={!!habitToDelete} onOpenChange={(open) => !open && setHabitToDelete(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[200] animate-in fade-in duration-300" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-[#050505] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl z-[201] animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              
              <Dialog.Title className="text-xl font-black text-white italic uppercase tracking-tighter mb-2">
                Remover hábito?
              </Dialog.Title>
              
              <p className="text-[13px] text-zinc-500 mb-8 px-4 leading-relaxed">
                Tem certeza que quer remover <span className="text-white font-bold">&quot;{habitToDelete?.title}&quot;</span>? Seu histórico será preservado.
              </p>

              <div className="flex gap-4 w-full">
                <Dialog.Close asChild>
                  <button className="flex-1 py-4 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:bg-white/10 transition-all">
                    Não
                  </button>
                </Dialog.Close>
                <button
                  disabled={isDeleting}
                  onClick={handleDeleteHabit}
                  className="flex-1 py-4 rounded-full bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all"
                >
                  {isDeleting ? "..." : "Sim"}
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

