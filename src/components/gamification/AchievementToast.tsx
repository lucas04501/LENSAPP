"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Award, Zap, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast, Toast } from "react-hot-toast";

interface AchievementToastProps {
  t: Toast;
  achievement: {
    title: string;
    icon: string;
    xpReward: number;
  };
}

export function AchievementToast({ t, achievement }: AchievementToastProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => Math.max(0, prev - (100 / 40))); // 4s total
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className="max-w-md w-full bg-[#0D0D0D] border border-gold/30 rounded-2xl p-4 shadow-[0_0_40px_rgba(255,215,0,0.15)] pointer-events-auto flex gap-4 relative overflow-hidden"
    >
      <div className="shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 shadow-inner">
        <motion.span
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: [0, 1.4, 1], rotate: 0 }}
          transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
          className="text-3xl"
        >
          {achievement.icon}
        </motion.span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black text-gold uppercase tracking-[0.2em] mb-1 flex items-center gap-1.5">
            <Award className="w-3 h-3" />
            Conquista desbloqueada!
          </p>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="p-1 hover:bg-white/5 rounded-lg transition-colors text-text-muted"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
        <h3 className="text-base font-black text-white italic tracking-tighter uppercase truncate">
          {achievement.title}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple/10 border border-purple/20">
            <Zap className="w-3 h-3 text-purple" />
            <span className="text-[10px] font-black text-purple">+{achievement.xpReward} XP</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/5 w-full">
        <motion.div
          className="h-full bg-gold"
          initial={{ width: "100%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}

export const showAchievementToast = (achievement: any) => {
  toast.custom((t) => <AchievementToast t={t} achievement={achievement} />, {
    duration: 4000,
    position: "bottom-right",
  });
};
