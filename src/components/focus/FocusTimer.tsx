"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, CheckCircle2, Target, Shield } from "lucide-react";
import { saveFocusSession } from "@/lib/actions/focus";
import { toast } from "react-hot-toast";
import { showAchievementToast } from "../gamification/AchievementToast";
import { cn } from "@/lib/utils";

interface FocusTimerProps {
  userId: string;
}

type SessionType = "DEEP_WORK" | "POMODORO" | "FLOW" | "STUDY";

const SESSION_TYPES: Record<SessionType, { label: string; color: string; duration: number }> = {
  DEEP_WORK: { label: "DEEP WORK PROTOCOL", color: "#7C3AED", duration: 90 },
  POMODORO:  { label: "POMODORO CYCLE",    color: "#EF4444", duration: 25 },
  FLOW:      { label: "FLOW STATE MODE",   color: "#7C3AED", duration: 60 },
  STUDY:     { label: "ACQUISITION MODE",  color: "#3B82F6", duration: 45 },
};

export function FocusTimer({ userId }: FocusTimerProps) {
  const [type, setType] = useState<SessionType>("DEEP_WORK");
  const [timeLeft, setTimeLeft] = useState(SESSION_TYPES["DEEP_WORK"].duration * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [title, setTitle] = useState("");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const playSuccessSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5);
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
    if (!isActive && !startTime) setStartTime(new Date());
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
      toast.success("Protocol Complete // +XP Secured");
      res.unlockedAchievements?.forEach(showAchievementToast);
      setTitle("");
    } catch (error) {
      toast.error("Telemetry Sync Error");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const totalTime = SESSION_TYPES[type].duration * 60;
  const progress = 1 - timeLeft / totalTime;

  return (
    <div className="flex flex-col items-center justify-center space-y-16">
      
      {/* ── Type & Title Controls ── */}
      <div className="w-full max-w-lg space-y-6">
        <div className="flex justify-center gap-4">
          {(Object.keys(SESSION_TYPES) as SessionType[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                if (!isActive) {
                  setType(t);
                  setTimeLeft(SESSION_TYPES[t].duration * 60);
                  setStartTime(null);
                }
              }}
              disabled={isActive}
              className={cn(
                "h-8 px-4 rounded-sm border transition-all text-[10px] font-bold uppercase tracking-wider",
                type === t 
                  ? "bg-purple-600/10 border-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.2)]" 
                  : "border-[#1A1A1A] text-[#4B5563] hover:border-[#333]"
              )}
            >
              {SESSION_TYPES[t].label.split(' ')[0]}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="[ ENTER OBJECTIVE IDENTIFIER... ]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isActive}
            className="w-full bg-black border border-[#1A1A1A] rounded-md h-11 px-5 text-[11px] font-mono text-zinc-300 placeholder:text-[#2D2D3A] focus:outline-none focus:border-purple-500 transition-all uppercase tracking-widest"
          />
        </div>
      </div>

      {/* ── Immersive HUD Timer ── */}
      <div className="relative flex items-center justify-center group">
        {/* Animated Background Grids */}
        <div className="absolute inset-0 w-[500px] h-[500px] -z-10 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.03)_0%,transparent_70%)] rounded-full blur-3xl" />
        
        {/* Glowing HUD Ring */}
        <div className="relative w-96 h-96 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            {/* Background static ring */}
            <circle
              cx="192" cy="192" r="180"
              fill="none" stroke="#111118" strokeWidth="1"
            />
            {/* Active progress ring */}
            <motion.circle
              cx="192" cy="192" r="180"
              fill="none"
              stroke="#7C3AED"
              strokeWidth="2"
              strokeDasharray={`${2 * Math.PI * 180}`}
              strokeDashoffset={2 * Math.PI * 180 * (1 - progress)}
              transition={{ duration: 1, ease: "linear" }}
              strokeLinecap="butt"
              className="shadow-[0_0_20px_#7C3AED]"
            />
          </svg>

          <div className="flex flex-col items-center">
            <AnimatePresence mode="wait">
              {isFinished ? (
                <motion.div
                  key="finished"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center"
                >
                  <Shield className="w-12 h-12 text-purple-500 mb-4 animate-pulse" />
                  <span className="text-sm font-bold text-white uppercase tracking-[0.4em]">Protocol Secured</span>
                </motion.div>
              ) : (
                <motion.div
                  key="time"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-[120px] font-mono font-medium text-white tracking-[-0.05em] leading-none tabular-nums">
                    {formatTime(timeLeft)}
                  </span>
                  <span className="text-[10px] text-[#4B5563] mt-6 font-bold tracking-[0.5em] uppercase">
                    {SESSION_TYPES[type].label}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Tactical Controls ── */}
      <div className="flex items-center gap-10">
        <button
          onClick={resetTimer}
          className="h-11 px-8 rounded-md border border-[#1A1A1A] text-[#4B5563] hover:border-purple-500 hover:text-white transition-all uppercase text-[10px] font-bold tracking-widest flex items-center gap-2 group"
        >
          <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-[-90deg] transition-transform" />
          Abort
        </button>

        <button
          onClick={toggleTimer}
          className={cn(
            "h-14 px-12 rounded-md border text-white transition-all uppercase text-[11px] font-bold tracking-[0.2em] flex items-center gap-3",
            isActive 
              ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]" 
              : "border-purple-500 bg-purple-600/10 hover:bg-purple-600/20 shadow-[0_0_20px_rgba(124,58,237,0.3)]"
          )}
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              Pause Session
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              Initialize Focus
            </>
          )}
        </button>

        <button
          onClick={handleFinish}
          disabled={!startTime || isFinished}
          className="h-11 px-8 rounded-md border border-[#1A1A1A] text-[#4B5563] hover:border-green-500 hover:text-white transition-all uppercase text-[10px] font-bold tracking-widest flex items-center gap-2 disabled:opacity-20"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Finalize
        </button>
      </div>

    </div>
  );
}
