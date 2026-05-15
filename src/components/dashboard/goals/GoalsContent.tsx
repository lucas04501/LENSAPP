"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Plus, Calendar, Trophy, ChevronRight } from "lucide-react";
import { AddGoalModal } from "./AddGoalModal";
import { GoalCard } from "./GoalCard";
import { differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";

interface GoalsContentProps {
  goals: any[];
  userId: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export function GoalsContent({ goals, userId }: GoalsContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeGoals = goals.filter(g => !g.isCompleted);
  const completedGoals = goals.filter(g => g.isCompleted);
  
  const totalActive = activeGoals.length;
  const completedActive = completedGoals.length; // This logic might be slightly off if we want "X of Y active completed", let's assume Y is total metas including completed ones
  const totalMetas = goals.length;
  
  const overallProgress = totalMetas > 0 
    ? Math.round((completedGoals.length / totalMetas) * 100)
    : 0;

  // Find nearest goal
  const nearestGoal = activeGoals.length > 0
    ? activeGoals.reduce((prev, curr) => 
        new Date(prev.targetDate) < new Date(curr.targetDate) ? prev : curr
      )
    : null;

  const daysToNearest = nearestGoal 
    ? differenceInDays(new Date(nearestGoal.targetDate), new Date())
    : null;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-20"
    >
      {/* ── Header ── */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
            <Target className="w-8 h-8 text-purple" />
            Metas dos 90 Dias
          </h1>
          <p className="text-text-muted text-sm mt-1">Transforme sua visão em realidade através de marcos consistentes.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple to-red text-white font-bold text-sm shadow-lg shadow-purple/20 hover:scale-[1.02] transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Nova Meta
        </button>
      </motion.div>

      {/* ── Progresso Geral ── */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-3xl border border-white/5 p-6 bg-[#050505] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Trophy className="w-32 h-32 text-gold" />
          </div>
          <div className="relative">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">Progresso Geral</p>
                <h2 className="text-2xl font-black text-white italic tracking-tighter">
                  {completedGoals.length} de {totalMetas} metas completadas
                </h2>
              </div>
              <span className="text-3xl font-black text-purple italic tracking-tighter">{overallProgress}%</span>
            </div>
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 1.5, ease: "easeOut", type: "spring" }}
                className="h-full bg-gradient-to-r from-purple to-red rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)]"
              />
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl border border-white/5 p-6 bg-[#050505] flex flex-col justify-center">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">Meta mais próxima</p>
          {nearestGoal ? (
            <>
              <h2 className="text-2xl font-black text-white italic tracking-tighter line-clamp-1">
                {daysToNearest === 0 ? "HOJE!" : `${daysToNearest} dias restantes`}
              </h2>
              <p className="text-xs text-text-muted mt-2 flex items-center gap-2">
                <ChevronRight className="w-3 h-3 text-purple" />
                {nearestGoal.title}
              </p>
            </>
          ) : (
            <p className="text-sm text-text-muted italic">Nenhuma meta ativa.</p>
          )}
        </div>
      </motion.div>

      {/* ── Grid de Metas ── */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <p className="text-text-muted italic">Você ainda não definiu nenhuma meta. Comece agora!</p>
          </div>
        ) : (
          goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} userId={userId} />
          ))
        )}
      </motion.div>

      <AddGoalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        userId={userId}
      />
    </motion.div>
  );
}
