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
  const [habitToDelete, setHabitToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (loading || !habits) {
    return (
      <div className="space-y-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[52px] rounded-lg bg-white/[0.02]" />
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
        }
      } else {
        const res = await completeHabit(habitId, userId);
        if (res.success) {
          toast.success("Hábito concluído! +XP");
          res.unlockedAchievements?.forEach(showAchievementToast);
          router.refresh();
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
      }
    } catch (error) {
      toast.error("Erro ao remover");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-1">
        <AnimatePresence mode="popLayout">
          {habits.map((habit, i) => {
            const isDone = habit.todayDone;

            return (
              <motion.div
                key={habit.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "flex items-center gap-3 py-2 group",
                  isPending && "pointer-events-none opacity-40"
                )}
              >
                {/* Square Checkbox */}
                <button 
                  onClick={() => handleToggle(habit.id, isDone)}
                  className={cn(
                    "w-4 h-4 rounded-sm flex items-center justify-center transition-all duration-200 shrink-0",
                    isDone
                      ? "bg-purple-500 border-purple-500"
                      : "border border-zinc-700 hover:border-purple-500/50"
                  )}
                >
                  {isDone && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
                </button>

                {/* Title */}
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleToggle(habit.id, isDone)}>
                  <p className={cn(
                    "text-[13px] font-medium transition-all truncate",
                    isDone ? "text-zinc-800 line-through" : "text-zinc-300"
                  )}>
                    {habit.title}
                  </p>
                </div>

                {/* Stats & Pill */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 opacity-40">
                    <Flame className="w-3 h-3 text-red-500" />
                    <span className="text-[10px] text-zinc-400 font-bold">{habit.currentStreak}</span>
                  </div>
                  <div className="px-1.5 py-0.5 rounded bg-zinc-900 border border-white/5">
                    <span className="text-[9px] font-black text-zinc-500">+{habit.xpReward}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="mt-6">
        <AddHabitModal 
          userId={userId} 
          onSuccess={() => router.refresh()} 
          trigger={
            <button className="text-[10px] font-black text-zinc-600 hover:text-white transition-all uppercase tracking-[0.2em] flex items-center gap-2">
              <Plus className="w-3 h-3" />
              APPEND NEW OBJECTIVE
            </button>
          }
        />
      </div>

      {/* Delete Confirmation Modal (kept hidden/radix) */}
      <Dialog.Root open={!!habitToDelete} onOpenChange={(open) => !open && setHabitToDelete(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-[#050505] border border-white/10 rounded-2xl p-8 z-[201]">
            <div className="flex flex-col items-center text-center">
              <AlertTriangle className="w-8 h-8 text-red-500 mb-4" />
              <Dialog.Title className="text-xl font-black text-white uppercase italic">Remove habit?</Dialog.Title>
              <div className="flex gap-4 w-full mt-8">
                <Dialog.Close asChild>
                  <button className="flex-1 py-3 rounded-xl bg-white/5 text-[10px] font-bold uppercase text-zinc-400">Cancel</button>
                </Dialog.Close>
                <button
                  disabled={isDeleting}
                  onClick={handleDeleteHabit}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white text-[10px] font-bold uppercase"
                >
                  {isDeleting ? "..." : "Remove"}
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}


