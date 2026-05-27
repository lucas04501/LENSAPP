"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Target, Zap, Clock } from "lucide-react";
import { AddGoalModal } from "./AddGoalModal";
import { GoalCard } from "./GoalCard";
import { differenceInDays } from "date-fns";

interface GoalsContentProps {
  goals: any[];
  userId: string;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function GoalsContent({ goals, userId }: GoalsContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeGoals = goals.filter(g => !g.isCompleted);
  const completedGoals = goals.filter(g => g.isCompleted);
  
  const totalMetas = goals.length;
  const overallProgress = totalMetas > 0 
    ? Math.round((goals.reduce((acc, g) => acc + g.progress, 0) / (totalMetas * 100)) * 100)
    : 0;

  // Find next deadline
  const nextDeadlineGoal = activeGoals.length > 0 
    ? activeGoals.reduce((prev, curr) => {
        const prevDays = differenceInDays(new Date(prev.targetDate), new Date());
        const currDays = differenceInDays(new Date(curr.targetDate), new Date());
        return currDays < prevDays ? curr : prev;
      }, activeGoals[0])
    : null;

  const daysToNextDeadline = nextDeadlineGoal 
    ? differenceInDays(new Date(nextDeadlineGoal.targetDate), new Date())
    : null;

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12 pb-24 max-w-6xl mx-auto"
    >
      {/* ── Header ── */}
      <motion.header variants={item} className="flex flex-col gap-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-[32px] font-black text-white italic uppercase tracking-tighter">Metas</h1>
            <p className="text-zinc-600 text-[10px] mt-1 uppercase font-black tracking-[0.3em]">
              {completedGoals.length} de {totalMetas} metas com progresso 
              {daysToNextDeadline !== null && (
                <span className="text-zinc-500 ml-2 border-l border-white/10 pl-2">
                  Próximo prazo em {daysToNextDeadline} dias
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="h-12 px-8 rounded-full bg-purple-500 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-purple-600 transition-all active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nova meta
          </button>
        </div>

        {/* Global Progress */}
        <div className="space-y-4 bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-[2rem] p-8">
          <div className="flex justify-between items-end">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-white italic tabular-nums">{overallProgress}%</span>
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Sucesso Operacional</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Ativas</span>
                <span className="text-sm font-bold text-white tabular-nums">{activeGoals.length}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Concluídas</span>
                <span className="text-sm font-bold text-purple-500 tabular-nums">{completedGoals.length}</span>
              </div>
            </div>
          </div>
          <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className="h-full bg-gradient-to-r from-purple-600 to-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            />
          </div>
        </div>
      </motion.header>

      {/* ── Active Goals ── */}
      <section className="space-y-8">
        <motion.div variants={item} className="flex items-center gap-4">
          <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em]">Em Andamento</h2>
          <div className="h-px flex-1 bg-white/5" />
        </motion.div>

        {activeGoals.length === 0 ? (
          <motion.div variants={item} className="py-20 text-center border border-dashed border-white/5 rounded-[2.5rem] bg-white/[0.01]">
            <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em]">Nenhuma meta ativa no momento.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {activeGoals.map((goal) => (
              <motion.div key={goal.id} variants={item}>
                <GoalCard goal={goal} userId={userId} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ── Completed Goals ── */}
      {completedGoals.length > 0 && (
        <section className="space-y-8 opacity-60 hover:opacity-100 transition-opacity duration-500">
          <motion.div variants={item} className="flex items-center gap-4">
            <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em]">Concluídas</h2>
            <div className="h-px flex-1 bg-white/5" />
          </motion.div>

          <div className="grid grid-cols-1 gap-6">
            {completedGoals.map((goal) => (
              <motion.div key={goal.id} variants={item}>
                <GoalCard goal={goal} userId={userId} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <AddGoalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        userId={userId}
      />
    </motion.div>
  );
}

