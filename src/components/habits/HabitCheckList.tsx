"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { completeHabit, uncompleteHabit } from "@/lib/actions/habits";
import { toast } from "react-hot-toast";
import { showAchievementToast } from "../gamification/AchievementToast";
import { AddHabitModal } from "./AddHabitModal";
import { Skeleton } from "../layout/Skeleton";

interface HabitCheckListProps {
  habits?: any[];
  userId: string;
  loading?: boolean;
}

export function HabitCheckList({ habits, userId, loading }: HabitCheckListProps) {
  const [isPending, startTransition] = useTransition();
  const [justCompleted, setJustCompleted] = useState<string | null>(null);

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
          setTimeout(() => setJustCompleted(null), 1000);
        } else {
          toast.error(res.error || "Erro ao concluir");
          setJustCompleted(null);
        }
      }
    });
  };

  return (
    <div className="space-y-2">
      {habits.map((habit, i) => {
        const isDone = habit.todayDone;
        const isBurst = justCompleted === habit.id;

        return (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => !isPending && handleToggle(habit.id, isDone)}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 group",
              isDone
                ? "bg-surface-2 opacity-60"
                : "hover:bg-surface-2 border border-transparent hover:border-white/5",
              isPending && "pointer-events-none opacity-40"
            )}
          >
            {/* Checkbox */}
            <div className="relative">
              <motion.div
                animate={isBurst ? { scale: [1, 1.4, 1] } : {}}
                transition={{ duration: 0.4 }}
                className={cn(
                  "w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0",
                  isDone
                    ? "border-none"
                    : "border-2 border-border group-hover:border-purple/40"
                )}
                style={isDone ? { backgroundColor: habit.color } : {}}
              >
                {isDone && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                  >
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </motion.div>
                )}
              </motion.div>

              {/* Burst particles */}
              <AnimatePresence>
                {isBurst && (
                  <>
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                      <motion.div
                        key={angle}
                        initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                        animate={{
                          scale: 1,
                          x: Math.cos((angle * Math.PI) / 180) * 16,
                          y: Math.sin((angle * Math.PI) / 180) * 16,
                          opacity: 0,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full pointer-events-none"
                        style={{ backgroundColor: habit.color, transform: "translate(-50%,-50%)" }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Icon + title */}
            <span className="text-sm">{habit.icon}</span>
            <span className={cn(
              "text-sm flex-1 transition-all",
              isDone ? "line-through text-text-muted" : "text-text-primary"
            )}>
              {habit.title}
            </span>

            {/* Streak */}
            <div className="flex items-center gap-1 shrink-0">
              <Flame className="w-3 h-3 text-red" />
              <span className="text-[11px] text-text-muted">{habit.currentStreak}</span>
            </div>

            {/* XP badge */}
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                  style={{ backgroundColor: `${habit.color}15`, color: habit.color }}>
              +{habit.xpReward}
            </span>
          </motion.div>
        );
      })}

      <AddHabitModal userId={userId} />
    </div>
  );
}
