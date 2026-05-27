"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface StreakWarningProps {
  pendingHabitsCount: number;
  totalStreak: number;
}

export function StreakWarning({ pendingHabitsCount, totalStreak }: StreakWarningProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    const dismissedDate = localStorage.getItem("streak-warning-dismissed");
    
    const checkVisibility = () => {
      const now = new Date();
      const hours = now.getHours();
      
      if (
        hours >= 18 && 
        pendingHabitsCount > 0 && 
        totalStreak > 0 && 
        dismissedDate !== today
      ) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    checkVisibility();
    const interval = setInterval(checkVisibility, 60000); 
    
    return () => clearInterval(interval);
  }, [pendingHabitsCount, totalStreak]);

  const handleDismiss = () => {
    const today = format(new Date(), "yyyy-MM-dd");
    localStorage.setItem("streak-warning-dismissed", today);
    setIsDismissed(true);
  };

  return (
    <AnimatePresence>
      {isVisible && !isDismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0, marginBottom: 0 }}
          animate={{ height: "auto", opacity: 1, marginBottom: 24 }}
          exit={{ height: 0, opacity: 0, marginBottom: 0 }}
          className="overflow-hidden"
        >
          <div className="relative bg-red-500/5 backdrop-blur-md border border-red-500/20 rounded-[1.5rem] p-6 flex items-center gap-6 group">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] mb-1">
                Alerta de Consistência
              </p>
              <p className="text-[13px] text-zinc-400 leading-relaxed italic">
                Sua sequência de <span className="text-white font-bold">{totalStreak} dias</span> está em risco. Você ainda tem <span className="text-white font-bold">{pendingHabitsCount} hábitos</span> pendentes hoje.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/habits"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-600 transition-all active:scale-95 whitespace-nowrap shadow-[0_0_20px_rgba(239,68,68,0.3)]"
              >
                Resolver Agora
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              
              <button
                onClick={handleDismiss}
                className="p-2 rounded-full hover:bg-white/5 text-zinc-600 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

