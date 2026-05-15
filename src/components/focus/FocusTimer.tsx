"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, CheckCircle2, Timer as TimerIcon, Brain, Zap, Coffee, Target } from "lucide-react";
import { saveFocusSession } from "@/lib/actions/focus";
import { toast } from "react-hot-toast";
import { showAchievementToast } from "../gamification/AchievementToast";
import { cn } from "@/lib/utils";

interface FocusTimerProps {
  userId: string;
}

type SessionType = "DEEP_WORK" | "POMODORO" | "FLOW" | "STUDY";

const SESSION_TYPES: Record<SessionType, { label: string; icon: any; color: string; duration: number }> = {
  DEEP_WORK: { label: "Deep Work", icon: Brain, color: "#A855F7", duration: 90 },
  POMODORO:  { label: "Pomodoro",  icon: TimerIcon, color: "#EF4444", duration: 25 },
  FLOW:      { label: "Flow Mode", icon: Zap, color: "#F59E0B", duration: 60 },
  STUDY:     { label: "Estudo",    icon: Coffee, color: "#3B82F6", duration: 45 },
};

export function FocusTimer({ userId }: FocusTimerProps) {
  const [type, setType] = useState<SessionType>("DEEP_WORK");
  const [timeLeft, setTimeLeft] = useState(SESSION_TYPES["DEEP_WORK"].duration * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [title, setTitle] = useState("");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sound Effect using Web Audio API
  const playSuccessSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5); // A5

      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.error("Audio failed", e);
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleFinish();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    if (!isActive && !startTime) {
      setStartTime(new Date());
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsFinished(false);
    setTimeLeft(SESSION_TYPES[type].duration * 60);
    setStartTime(null);
  };

  const handleFinish = async () => {
    setIsActive(false);
    setIsFinished(true);
    playSuccessSound();
    
    const duration = SESSION_TYPES[type].duration;
    
    try {
      const res = await saveFocusSession({
        userId,
        durationMin: duration,
        type,
        title: title || undefined,
        startedAt: startTime || new Date(Date.now() - duration * 60000),
        endedAt: new Date(),
      });
      toast.success(`Sessão concluída! +${duration} XP`);
      res.unlockedAchievements?.forEach(showAchievementToast);
      setTitle("");
    } catch (error) {
      toast.error("Erro ao salvar sessão");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = 1 - timeLeft / (SESSION_TYPES[type].duration * 60);

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto py-8">
      {/* Session Title Input */}
      <div className="w-full max-w-sm mb-10 relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
          <Target className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="No que você vai focar?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isActive}
          className="w-full bg-surface-2 border border-white/5 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-purple/50 transition-all"
        />
      </div>

      {/* Type Selector */}
      <div className="flex bg-surface-2 p-1 rounded-2xl border border-white/5 mb-12">
        {(Object.keys(SESSION_TYPES) as SessionType[]).map((t) => {
          const T = SESSION_TYPES[t];
          return (
            <button
              key={t}
              onClick={() => {
                if (!isActive) {
                  setType(t);
                  setTimeLeft(T.duration * 60);
                  setStartTime(null);
                }
              }}
              disabled={isActive}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                type === t ? "bg-white/10 text-white shadow-lg" : "text-text-muted hover:text-white"
              )}
            >
              <T.icon className="w-4 h-4" style={type === t ? { color: T.color } : {}} />
              <span className="hidden sm:inline">{T.label}</span>
            </button>
          );
        })}
      </div>

      {/* Timer Circle */}
      <div className="relative w-80 h-80 flex items-center justify-center mb-12">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="160"
            cy="160"
            r="145"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-white/5"
          />
          <motion.circle
            cx="160"
            cy="160"
            r="145"
            fill="none"
            stroke={SESSION_TYPES[type].color}
            strokeWidth="6"
            strokeDasharray="911"
            initial={{ strokeDashoffset: 911 }}
            animate={{ strokeDashoffset: 911 * (1 - progress) }}
            transition={{ duration: 1, ease: "linear" }}
            strokeLinecap="round"
            className="drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
            style={{ stroke: SESSION_TYPES[type].color }}
          />
        </svg>

        <div className="relative flex flex-col items-center">
          <AnimatePresence mode="wait">
            {isFinished ? (
              <motion.div
                key="finished"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center"
              >
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-2" />
                <span className="text-xl font-bold text-white italic uppercase tracking-tighter">Missão Cumprida</span>
              </motion.div>
            ) : (
              <motion.span
                key="time"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-7xl font-black text-white tracking-tighter tabular-nums"
              >
                {formatTime(timeLeft)}
              </motion.span>
            )}
          </AnimatePresence>
          <span className="text-xs text-text-muted mt-2 font-bold tracking-[0.3em] uppercase opacity-60">
            {SESSION_TYPES[type].label}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-8">
        <button
          onClick={resetTimer}
          className="p-4 rounded-2xl bg-surface-2 border border-white/5 text-text-muted hover:text-white hover:border-white/10 transition-all active:scale-90"
        >
          <RotateCcw className="w-6 h-6" />
        </button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTimer}
          className="w-24 h-24 rounded-full flex items-center justify-center shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] transition-all"
          style={{ backgroundColor: SESSION_TYPES[type].color }}
        >
          {isActive ? (
            <Pause className="w-10 h-10 text-white fill-white" />
          ) : (
            <Play className="w-10 h-10 text-white fill-white ml-1.5" />
          )}
        </motion.button>

        <button
          onClick={handleFinish}
          disabled={!startTime || isFinished}
          className="p-4 rounded-2xl bg-surface-2 border border-white/5 text-text-muted hover:text-green-500 hover:border-green-500/20 transition-all disabled:opacity-30 active:scale-90"
        >
          <CheckCircle2 className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
