"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, Calendar, CheckCircle2, Trash2, 
  MoreHorizontal, PlusCircle, Target, Trophy
} from "lucide-react";
import { differenceInDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { updateProgress, deleteGoal } from "@/lib/actions/goals";
import { toast } from "react-hot-toast";
import { showAchievementToast } from "../../gamification/AchievementToast";
import { cn } from "@/lib/utils";

interface GoalCardProps {
  goal: any;
  userId: string;
}

export function GoalCard({ goal, userId }: GoalCardProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfetti, setShowConfetti] = useState(false);

  const daysLeft = differenceInDays(new Date(goal.targetDate), new Date());
  const isOverdue = daysLeft < 0 && !goal.isCompleted;

  const getProgressColor = (progress: number) => {
    if (progress <= 30) return "#EF4444"; // red
    if (progress <= 70) return "#F59E0B"; // gold
    return "#22C55E"; // green
  };

  const progressColor = getProgressColor(goal.progress);

  const handleUpdateProgress = (increment: number) => {
    const newProgress = Math.min(goal.progress + increment, 100);
    startTransition(async () => {
      const res = await updateProgress(goal.id, newProgress, userId);
      if (res.success) {
        if (newProgress === 100 && !goal.isCompleted) {
          setShowConfetti(true);
          toast.success("META CONCLUÍDA! ✨ +XP");
          res.unlockedAchievements?.forEach(showAchievementToast);
          setTimeout(() => setShowConfetti(false), 3000);
        } else {
          toast.success(`Progresso atualizado: ${newProgress}%`);
        }
      } else {
        toast.error(res.error || "Erro ao atualizar progresso");
      }
    });
  };

  const handleDelete = async () => {
    if (!confirm("Deseja realmente excluir esta meta?")) return;
    const res = await deleteGoal(goal.id, userId);
    if (res.success) {
      toast.success("Meta excluída");
    } else {
      toast.error(res.error || "Erro ao excluir meta");
    }
  };

  return (
    <motion.div
      layout
      className={cn(
        "glass rounded-[2rem] border border-white/5 p-6 bg-[#050505] flex flex-col gap-4 relative overflow-hidden group transition-all duration-300",
        goal.isCompleted ? "opacity-60 grayscale-[0.5]" : "hover:border-white/10"
      )}
      style={{ borderLeft: `4px solid ${progressColor}` }}
    >
      {/* ── Celebration Overlay ── */}
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none z-10">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: 0, x: "50%", scale: 0 }}
                animate={{ 
                  y: [-20, 200], 
                  x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                  scale: [0, 1, 0],
                  rotate: [0, 360]
                }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute w-2 h-2 rounded-full"
                style={{ backgroundColor: ["#A855F7", "#EF4444", "#F59E0B"][i % 3] }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-start">
        <div className={cn(
          "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
          goal.isCompleted ? "bg-green/10 text-green border-green/20" : "bg-white/5 text-text-muted border-white/5"
        )}>
          {goal.category}
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={handleDelete}
            className="p-2 rounded-lg hover:bg-red/10 text-text-muted hover:text-red transition-all opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-black text-white italic tracking-tighter uppercase leading-tight">
          {goal.title}
        </h3>
        {goal.description && (
          <p className="text-xs text-text-muted mt-2 line-clamp-2 leading-relaxed italic">
            "{goal.description}"
          </p>
        )}
      </div>

      <div className="flex items-center justify-between text-[10px] font-bold text-text-muted uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" />
          <span className={cn(isOverdue && "text-red")}>
            {goal.isCompleted 
              ? `Concluída em ${format(new Date(goal.updatedAt), "dd/MM/yy")}`
              : isOverdue 
                ? "Atrasada!" 
                : `${daysLeft} dias restantes`}
          </span>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-surface-2 border border-white/5">
          <Zap className="w-3 h-3 text-purple" />
          <span className="text-purple">+{goal.xpReward} XP</span>
        </div>
      </div>

      {/* Progress Section */}
      <div className="space-y-2 mt-auto">
        <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest">
          <span style={{ color: progressColor }}>Progresso</span>
          <span className="text-white">{goal.progress}%</span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${goal.progress}%` }}
            transition={{ type: "spring", bounce: 0, duration: 1 }}
            className="h-full rounded-full"
            style={{ 
              backgroundColor: progressColor,
              boxShadow: `0 0 10px ${progressColor}40`
            }}
          />
        </div>
      </div>

      {!goal.isCompleted && (
        <div className="grid grid-cols-3 gap-2 pt-2">
          <button
            onClick={() => handleUpdateProgress(10)}
            disabled={isPending}
            className="py-2 rounded-xl bg-surface-2 border border-white/5 text-[10px] font-black text-white uppercase hover:bg-white/5 transition-all active:scale-95 disabled:opacity-50"
          >
            +10%
          </button>
          <button
            onClick={() => handleUpdateProgress(25)}
            disabled={isPending}
            className="py-2 rounded-xl bg-surface-2 border border-white/5 text-[10px] font-black text-white uppercase hover:bg-white/5 transition-all active:scale-95 disabled:opacity-50"
          >
            +25%
          </button>
          <button
            onClick={() => handleUpdateProgress(100)}
            disabled={isPending}
            className="py-2 rounded-xl bg-green/10 border border-green/20 text-[10px] font-black text-green uppercase hover:bg-green/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1"
          >
            <CheckCircle2 className="w-3 h-3" />
            OK
          </button>
        </div>
      )}

      {goal.isCompleted && (
        <div className="py-2 rounded-xl bg-green/5 border border-green/10 text-center">
          <p className="text-[10px] font-black text-green uppercase tracking-widest flex items-center justify-center gap-2">
            <Trophy className="w-3.5 h-3.5" />
            Meta Alcançada
          </p>
        </div>
      )}
    </motion.div>
  );
}
