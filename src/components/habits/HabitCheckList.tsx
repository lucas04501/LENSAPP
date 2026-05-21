"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Flame, Trash2, AlertTriangle } from "lucide-react";
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
      <div className="space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[52px] rounded-xl" />
        ))}
      </div>
    );
  }

  const handleToggle = (habitId: string, isDone: boolean) => {
    startTransition(async () => {
      if (isDone) {
        // Uncomplete
        const res = await uncompleteHabit(habitId, userId);
        if (res.success) {
          toast.success("Hábito desmarcado");
          router.refresh();
        } else {
          toast.error(res.error || "Erro ao desmarcar");
        }
      } else {
        // Complete
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
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {habits.map((habit, i) => {
          const isDone = habit.todayDone;
          const isBurst = justCompleted === habit.id;

          return (
            <motion.div
              key={habit.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "flex items-center gap-3 py-3 border-b border-[#111118] last:border-0 group relative",
                isPending && "pointer-events-none opacity-40"
              )}
            >
              {/* Checkbox */}
              <div 
                className="relative cursor-pointer"
                onClick={() => !isPending && handleToggle(habit.id, isDone)}
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded-sm flex items-center justify-center transition-all duration-200 shrink-0",
                    isDone
                      ? "bg-purple border-purple"
                      : "border border-[#374151] hover:border-purple/60"
                  )}
                >
                  {isDone && (
                    <Check className="w-3 h-3 text-white" strokeWidth={4} />
                  )}
                </div>
              </div>

              {/* title */}
              <div className="flex items-center gap-2 flex-1 cursor-pointer" onClick={() => !isPending && handleToggle(habit.id, isDone)}>
                <span className={cn(
                  "text-sm transition-all",
                  isDone ? "line-through text-[#4B5563]" : "text-white"
                )}>
                  {habit.title}
                </span>
              </div>

              {/* Actions & Stats */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 shrink-0 opacity-60">
                  <Flame className="w-3 h-3 text-[#EF4444]" />
                  <span className="text-[10px] text-[#4B5563] font-semibold">{habit.currentStreak}</span>
                </div>

                <span className="text-[10px] font-semibold text-[#4B5563] bg-[#111118] px-1.5 py-0.5 rounded">
                  +{habit.xpReward}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setHabitToDelete(habit);
                  }}
                  className="p-1 rounded text-[#4B5563] hover:text-[#EF4444] hover:bg-[#EF4444]/10 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
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
                Tem certeza que quer remover <span className="text-white font-bold">&quot;{habitToDelete?.title}&quot;</span>?
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
    </div>
  );
}
