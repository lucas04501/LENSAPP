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

export function RanksContent({ userXp, currentRankId }: RanksContentProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20"
    >
      {RANKS.map((rank, index) => {
        const isCurrent = rank.id === currentRankId;
        const isUnlocked = userXp >= rank.minXP;
        const isLocked = !isUnlocked;
        const Icon = RANK_ICONS[rank.icon] || Sprout;

        return (
          <motion.div
            key={rank.id}
            variants={item}
            className={cn(
              "relative group overflow-hidden rounded-2xl border transition-all duration-500",
              "bg-[#0D0D0D]/50 backdrop-blur-xl",
              isCurrent 
                ? "border-purple shadow-[0_0_30px_-10px_rgba(168,85,247,0.4)] scale-105 z-10" 
                : "border-white/5",
              isLocked && "opacity-40 grayscale-[0.5]"
            )}
          >
            {/* Background Glow */}
            {isCurrent && (
              <div 
                className="absolute inset-0 opacity-10 blur-[60px] pointer-events-none"
                style={{ backgroundColor: rank.color }}
              />
            )}

            <div className="p-6 flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="p-3 rounded-xl border transition-colors"
                  style={{ 
                    backgroundColor: `${rank.color}10`, 
                    borderColor: isCurrent ? `${rank.color}50` : 'transparent' 
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color: rank.color }} />
                </div>
                
                {isLocked ? (
                  <Lock className="w-4 h-4 text-text-muted" />
                ) : isCurrent ? (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-purple/20 border border-purple/30">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple animate-pulse" />
                    <span className="text-[10px] font-bold text-purple tracking-wider uppercase">Atual</span>
                  </div>
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-green-500/50" />
                )}
              </div>

              <div className="space-y-1 mb-4">
                <h3 className="text-lg font-black text-white tracking-tight uppercase italic leading-none">
                  {rank.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-text-muted tracking-widest uppercase">
                    {rank.minXP} — {rank.maxXP === 999999 ? "∞" : rank.maxXP} XP
                  </span>
                </div>
              </div>

              <p className="text-xs text-text-muted leading-relaxed mb-6 flex-1">
                {RANK_DESCRIPTIONS[rank.name] || ""}
              </p>

              {/* Progress Bar (Only for current or locked next) */}
              {isCurrent && (
                <div className="space-y-1.5 mt-auto">
                  <div className="flex justify-between text-[9px] font-bold text-text-muted uppercase tracking-tighter">
                    <span>Progresso</span>
                    <span>{Math.round((userXp / rank.maxXP) * 100)}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((userXp / rank.maxXP) * 100, 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: rank.color }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
