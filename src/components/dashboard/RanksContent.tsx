"use client";

import { motion } from "framer-motion";
import { Lock, CheckCircle2, Sprout, Hammer, Layers, Brain, Ghost, Zap, Crown } from "lucide-react";
import { RANKS } from "@/types";
import { cn } from "@/lib/utils";

const RANK_ICONS: Record<string, any> = {
  Sprout: Sprout,
  Hammer: Hammer,
  Layers: Layers,
  Brain: Brain,
  Ghost: Ghost,
  Zap: Zap,
  Crown: Crown,
};

const RANK_DESCRIPTIONS: Record<string, string> = {
  INITIATE: "O começo da jornada. O despertar da consciência sobre o tempo.",
  BUILDER: "Construindo as fundações. A disciplina começa a tomar forma.",
  "ARCHITECT OF FLOW": "Mestre da estrutura. Você molda seu ambiente para o foco absoluto.",
  "DEEP WORKER": "Imersão total. Distrações não têm mais poder sobre você.",
  "GHOST MODE": "Invisível para o mundo, focado no objetivo. Execução pura e silenciosa.",
  "NEURAL MASTER": "Sincronia cerebral perfeita. Sua produtividade é uma extensão do seu pensamento.",
  TRANSCENDENT: "Além do limite humano. O estado de flow é sua morada permanente.",
};

interface RanksContentProps {
  userXp: number;
  currentRankId: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const HexagonRank = ({ icon: Icon, active, color, locked }: { icon: any, active: boolean, color: string, locked: boolean }) => (
  <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
      <path
        d="M50 5 L89 27.5 L89 72.5 L50 95 L11 72.5 L11 27.5 Z"
        fill="transparent"
        stroke={locked ? "#222" : active ? color : "#333"}
        strokeWidth="2"
        className={cn(active ? "shadow-[inset_0_0_10px_rgba(168,85,247,0.4)]" : "")}
      />
    </svg>
    <Icon strokeWidth={1.5} className="w-5 h-5 relative z-10" style={{ color: locked ? "#222" : active ? color : "#444" }} />
  </div>
);

export function RanksContent({ userXp, currentRankId }: RanksContentProps) {
  return (
    <div className="space-y-12 pb-20 max-w-5xl mx-auto selection:bg-purple-500/30">
      
      {/* ── Header ── */}
      <div className="pb-8 border-b border-[#1A1A1A]">
        <p className="text-purple-500 font-mono text-[10px] tracking-[0.4em] uppercase mb-2">System // Hierarchy Protocol</p>
        <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Active Ranks</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {RANKS.map((rank, index) => {
          const isCurrent = rank.id === currentRankId;
          const isUnlocked = userXp >= rank.minXP;
          const isLocked = !isUnlocked;
          const Icon = RANK_ICONS[rank.icon] || Sprout;

          return (
            <div
              key={rank.id}
              className={cn(
                "flex items-center gap-6 p-5 border transition-all duration-500 group relative overflow-hidden bg-black/20 backdrop-blur-sm",
                isLocked 
                  ? "border-[#1A1A1A] opacity-30 grayscale" 
                  : isCurrent 
                    ? "border-purple-500/50 shadow-[inset_0_0_20px_rgba(168,85,247,0.05)]"
                    : "border-[#1A1A1A] hover:border-[#333]"
              )}
            >
              <HexagonRank 
                icon={Icon} 
                active={isCurrent} 
                color={rank.color} 
                locked={isLocked}
              />

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold text-[#2D2D3A] uppercase tracking-widest">RANK LEVEL 0{index + 1}</span>
                  {isCurrent && (
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-purple-500 uppercase tracking-widest">ACTIVE PROTOCOL</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7] animate-pulse" />
                    </div>
                  )}
                </div>
                
                <h3 className="text-[14px] font-bold text-white uppercase tracking-tight">
                  {rank.name}
                </h3>
                
                <div className="flex items-center gap-4 text-[10px] font-mono">
                  <span className="text-[#4B5563]">{rank.minXP.toLocaleString()} XP</span>
                  <div className="h-[1px] flex-1 bg-[#1A1A1A]">
                    {isCurrent && (
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((userXp / rank.maxXP) * 100, 100)}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-purple-500 shadow-[0_0_10px_#a855f7]"
                      />
                    )}
                  </div>
                  <span className="text-[#4B5563]">{rank.maxXP === 999999 ? "MAX" : rank.maxXP.toLocaleString()} XP</span>
                </div>

                <p className="text-[11px] text-[#4B5563] font-mono uppercase tracking-tight leading-relaxed">
                  {RANK_DESCRIPTIONS[rank.name] || ""}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
