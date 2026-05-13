"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Flame, Plus } from "lucide-react";
import { useHabitsStore } from "@/store";
import { cn } from "@/lib/utils";

const MOCK_HABITS = [
  { id: "1", title: "Meditação 10min",   icon: "🧘", color: "#A855F7", xpReward: 10, currentStreak: 12 },
  { id: "2", title: "Exercício",          icon: "🏋️", color: "#EF4444", xpReward: 20, currentStreak: 8  },
  { id: "3", title: "Leitura 30min",      icon: "📚", color: "#3B82F6", xpReward: 15, currentStreak: 5  },
  { id: "4", title: "Sem redes sociais",  icon: "🧠", color: "#22C55E", xpReward: 25, currentStreak: 3  },
  { id: "5", title: "Água 2L",            icon: "💧", color: "#06B6D4", xpReward: 10, currentStreak: 15 },
  { id: "6", title: "Planejamento noturno",icon: "📝",color: "#F59E0B", xpReward: 10, currentStreak: 7  },
];

export function HabitCheckList() {
  const [completed, setCompleted] = useState<string[]>(["1", "3", "5"]);
  const [justCompleted, setJustCompleted] = useState<string | null>(null);

  const toggle = (id: string) => {
    if (completed.includes(id)) {
      setCompleted(c => c.filter(x => x !== id));
    } else {
      setCompleted(c => [...c, id]);
      setJustCompleted(id);
      setTimeout(() => setJustCompleted(null), 1000);
    }
  };

  return (
    <div className="space-y-2">
      {MOCK_HABITS.map((habit, i) => {
        const isDone = completed.includes(habit.id);
        const isBurst = justCompleted === habit.id;

        return (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => toggle(habit.id)}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 group",
              isDone
                ? "bg-surface-2 opacity-60"
                : "hover:bg-surface-2 border border-transparent hover:border-white/5"
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

      {/* Add button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center gap-2 p-3 rounded-xl border border-dashed border-border text-text-muted hover:border-purple/30 hover:text-purple transition-all text-sm mt-2"
      >
        <Plus className="w-4 h-4" />
        <span>Adicionar hábito</span>
      </motion.button>
    </div>
  );
}
