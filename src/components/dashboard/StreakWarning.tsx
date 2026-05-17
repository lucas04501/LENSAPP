'use client';

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
    const interval = setInterval(checkVisibility, 60000); // Check every minute
    
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
          <div className="relative glass bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 sm:p-5 flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-orange-500 animate-pulse" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-white uppercase tracking-tight italic">
                Streak em Risco! 🔥
              </p>
              <p className="text-xs text-orange-200/70 mt-0.5 leading-relaxed">
                Você tem <span className="text-white font-bold">{pendingHabitsCount}</span> {pendingHabitsCount === 1 ? 'hábito não completado' : 'hábitos não completados'} hoje. Seu streak de <span className="text-white font-bold">{totalStreak} dias</span> está em perigo!
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/habits"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all active:scale-95 whitespace-nowrap"
              >
                Ver hábitos
                <ChevronRight className="w-3 h-3" />
              </Link>
              
              <button
                onClick={handleDismiss}
                className="p-2 rounded-lg hover:bg-white/5 text-orange-500/40 hover:text-orange-500 transition-all"
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
