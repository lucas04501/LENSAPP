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
          animate={{ height: "auto", opacity: 1, marginBottom: 20 }}
          exit={{ height: 0, opacity: 0, marginBottom: 0 }}
          className="overflow-hidden"
        >
          <div className="relative bg-[#0F0F14] border border-[#EF4444]/20 rounded-md p-4 flex items-center gap-4 group">
            <div className="w-8 h-8 rounded bg-[#EF4444]/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-white uppercase tracking-wider">
                STREAK AT RISK
              </p>
              <p className="text-[12px] text-[#4B5563] mt-0.5 leading-relaxed">
                You have <span className="text-white font-semibold">{pendingHabitsCount}</span> pending {pendingHabitsCount === 1 ? 'habit' : 'habits'}. Your <span className="text-white font-semibold">{totalStreak} day streak</span> is in danger.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/habits"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded bg-[#EF4444] text-white text-[10px] font-semibold uppercase tracking-wider hover:bg-[#DC2626] transition-all active:scale-95 whitespace-nowrap"
              >
                Review habits
                <ChevronRight className="w-3 h-3" />
              </Link>
              
              <button
                onClick={handleDismiss}
                className="p-1.5 rounded hover:bg-white/5 text-[#4B5563] hover:text-white transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
