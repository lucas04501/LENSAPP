"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trash2, Edit3, Check, Calendar, AlertCircle, ChevronDown, ChevronUp, Zap
} from "lucide-react";
import { differenceInDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toggleGoalStep, deleteGoal } from "@/lib/actions/goals";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AddGoalModal } from "./AddGoalModal";

interface GoalCardProps {
  goal: any;
  userId: string;
}

export function GoalCard({ goal, userId }: GoalCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const daysLeft = differenceInDays(new Date(goal.targetDate), new Date());
  const isOverdue = daysLeft < 0 && !goal.isCompleted;
  const completedSteps = goal.steps?.filter((s: any) => s.isCompleted).length || 0;
  const totalSteps = goal.steps?.length || 0;

  const handleToggleStep = (stepId: string) => {
    startTransition(async () => {
      const res = await toggleGoalStep(stepId, userId);
      if (!res.success) {
        toast.error("Erro ao atualizar etapa");
      }
    });
  };

  const handleDelete = async () => {
    if (!confirm("Remover esta meta permanentemente?")) return;
    const res = await deleteGoal(goal.id, userId);
    if (res.success) {
      toast.success("Meta removida");
    } else {
      toast.error("Erro ao remover");
    }
  };

  return (
    <div className={cn(
      "bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 group transition-all duration-500 hover:bg-white/[0.04]",
      goal.isCompleted && "opacity-60"
    )}>
      {/* ── Top Row: Tags ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {isOverdue ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-3 h-3 text-red-500" />
              <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Atrasada</span>
            </div>
          ) : daysLeft <= 7 ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              <AlertCircle className="w-3 h-3 text-amber-500" />
              <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">{daysLeft} dias restantes</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
              <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest">{goal.category}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsEditOpen(true)}
            className="p-2 rounded-full hover:bg-white/5 text-zinc-600 hover:text-white transition-all"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={handleDelete}
            className="p-2 rounded-full hover:bg-white/5 text-zinc-600 hover:text-red-500 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Title & Description ── */}
      <div className="mb-8">
        <h3 className={cn(
          "text-2xl font-black text-white italic uppercase tracking-tighter mb-2",
          goal.isCompleted && "line-through text-zinc-500"
        )}>
          {goal.title}
        </h3>
        {goal.description && (
          <p className="text-zinc-500 text-sm font-medium leading-relaxed italic">
            {goal.description}
          </p>
        )}
      </div>

      {/* ── Progress ── */}
      <div className="space-y-3 mb-8">
        <div className="flex justify-between items-end">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white tabular-nums italic">{goal.progress}%</span>
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Concluído</span>
          </div>
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest tabular-nums">
            {completedSteps} / {totalSteps} Etapas
          </span>
        </div>
        <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${goal.progress}%` }}
            transition={{ duration: 1, ease: "circOut" }}
            className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.3)]"
          />
        </div>
      </div>

      {/* ── Steps ── */}
      {totalSteps > 0 && (
        <div className="space-y-4 pt-6 border-t border-white/5">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] hover:text-zinc-300 transition-colors"
          >
            Etapas
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 overflow-hidden"
              >
                {goal.steps.map((step: any) => (
                  <div 
                    key={step.id}
                    onClick={() => handleToggleStep(step.id)}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-2xl border border-transparent transition-all cursor-pointer group/step",
                      step.isCompleted ? "bg-purple-500/5" : "hover:bg-white/[0.02] hover:border-white/5"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
                      step.isCompleted 
                        ? "bg-purple-500 border-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]" 
                        : "border-zinc-800 group-hover/step:border-purple-500/50"
                    )}>
                      {step.isCompleted && <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />}
                    </div>
                    <span className={cn(
                      "text-[13px] font-medium transition-all",
                      step.isCompleted ? "text-zinc-600 line-through italic" : "text-zinc-300"
                    )}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── Footer ── */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
        <div className="flex items-center gap-2 text-zinc-600">
          <Calendar className="w-3.5 h-3.5" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Prazo: {format(new Date(goal.targetDate), "dd 'de' MMMM", { locale: ptBR })}
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
          <Zap className="w-3 h-3 text-purple-400" />
          <span className="text-[10px] font-black text-purple-400 tabular-nums">+{goal.xpReward} XP</span>
        </div>
      </div>

      <AddGoalModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        userId={userId} 
        goal={goal} 
      />
    </div>
  );
}

