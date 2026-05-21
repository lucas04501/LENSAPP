"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { AddGoalModal } from "./AddGoalModal";
import { GoalCard } from "./GoalCard";

interface GoalsContentProps {
  goals: any[];
  userId: string;
}

export function GoalsContent({ goals, userId }: GoalsContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const completedGoals = goals.filter(g => g.isCompleted);
  const totalMetas = goals.length;
  const overallProgress = totalMetas > 0 
    ? Math.round((completedGoals.length / totalMetas) * 100)
    : 0;

  return (
    <div className="space-y-10 pb-20 max-w-5xl mx-auto selection:bg-purple-500/30 font-sans">
      {/* ── Header ── */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#1A1A1A]">
        <div>
          <h1 className="text-[22px] font-semibold text-white uppercase tracking-wider">Mission Command // Objectives</h1>
          <p className="text-[#4B5563] text-[11px] mt-1 uppercase font-semibold tracking-[0.15em]">
            <span className="text-purple">{completedGoals.length}</span> of <span className="text-white">{totalMetas}</span> secondary targets neutralized
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="h-9 px-5 rounded-md border border-purple/50 bg-purple/10 text-white font-bold text-[11px] uppercase tracking-widest hover:bg-purple/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          Initialize Mission
        </button>
      </header>

      {/* ── Global Metrics ── */}
      <div className="space-y-3">
        <div className="flex justify-between text-[10px] font-semibold uppercase tracking-widest text-[#4B5563]">
          <span>Operational Success Rate</span>
          <span className="text-purple font-mono">{overallProgress}%</span>
        </div>
        <div className="h-1 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-purple-600 to-red-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
          />
        </div>
      </div>

      {/* ── Missions List ── */}
      <div className="flex flex-col">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 text-[10px] font-bold text-[#2D2D3A] uppercase tracking-widest border-b border-[#1A1A1A]">
          <div className="col-span-1 flex justify-center">STATUS</div>
          <div className="col-span-6">OBJECTIVE PARAMETERS</div>
          <div className="col-span-2 text-center">DEADLINE</div>
          <div className="col-span-2 text-center">REWARD</div>
          <div className="col-span-1 text-right">OPS</div>
        </div>

        {goals.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-[#1A1A1A] rounded-md mt-4">
            <p className="text-[10px] font-mono text-[#2D2D3A] uppercase tracking-[0.2em]">NO ACTIVE MISSIONS FOUND.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} userId={userId} />
            ))}
          </div>
        )}
      </div>

      <AddGoalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        userId={userId}
      />
    </div>
  );
}
