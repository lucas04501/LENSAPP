"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  ChevronRight, 
  Loader2, 
  Activity, 
  Brain, 
  Book, 
  Briefcase, 
  CircleDollarSign, 
  Zap,
  Target,
  Star,
  Dumbbell,
  Flame,
  CheckCircle,
  Lightbulb,
  Shield,
  Cpu
} from "lucide-react";

const STEPS = [
  { id: 1, title: "INITIALIZATION" },
  { id: 2, title: "OBJECTIVE" },
  { id: 3, title: "PROTOCOL" },
  { id: 4, title: "SYNCHRONIZED" },
];

const GOALS = [
  { id: "health", label: "Saúde & Corpo", icon: Activity },
  { id: "discipline", label: "Disciplina Mental", icon: Brain },
  { id: "learning", label: "Aprendizado", icon: Book },
  { id: "career", label: "Carreira", icon: Briefcase },
  { id: "finance", label: "Finanças", icon: CircleDollarSign },
  { id: "performance", label: "Alta Performance", icon: Zap },
];

const ICON_OPTIONS = [
  { id: "activity", icon: Activity },
  { id: "brain", icon: Brain },
  { id: "book", icon: Book },
  { id: "briefcase", icon: Briefcase },
  { id: "finance", icon: CircleDollarSign },
  { id: "zap", icon: Zap },
  { id: "target", icon: Target },
  { id: "star", icon: Star },
  { id: "dumbbell", icon: Dumbbell },
  { id: "flame", icon: Flame },
  { id: "check", icon: CheckCircle },
  { id: "lightbulb", icon: Lightbulb },
];

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [habitTitle, setHabitTitle] = useState("");
  const [habitIcon, setHabitIcon] = useState("target");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  const handleCreateHabit = async () => {
    if (!habitTitle.trim()) return;

    setIsLoading(true);
    try {
      await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: habitTitle,
          icon: habitIcon, // Now sending a string identifier instead of emoji
          userId: session?.user?.id,
        }),
      });
    } catch (error) {
      console.error("Failed to create habit:", error);
    } finally {
      setIsLoading(false);
      setStep(4);
    }
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30 overflow-hidden">
      {/* HUD Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-white/5 z-50">
        <motion.div
          className="h-full bg-[#7C3AED] shadow-[0_0_10px_#7C3AED]"
          initial={{ width: "0%" }}
          animate={{ width: `${(step / 4) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <main className="max-w-2xl mx-auto pt-24 px-6 pb-12 relative z-10">
        {/* Background Decorative Elements */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <AnimatePresence mode="wait" custom={step}>
          <motion.div
            key={step}
            custom={step}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            {step === 1 && (
              <div className="space-y-12 text-center">
                <div className="space-y-4">
                  <p className="text-purple-500 font-mono text-xs tracking-[0.4em] uppercase">System Initialization</p>
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    WELCOME, <span className="text-white">{session?.user?.name?.split(" ")[0].toUpperCase()}</span>
                  </h1>
                  <p className="text-zinc-500 text-sm font-mono tracking-wider max-w-md mx-auto">
                    ESTABLISHING NEURAL PATHWAYS FOR MAXIMUM PERFORMANCE OUTPUT.
                  </p>
                </div>

                <div className="bg-[#050505] border border-[#1A1A1A] backdrop-blur-md rounded-2xl p-10 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                  <div className="w-16 h-16 border border-purple-500/30 rounded-xl mx-auto mb-8 flex items-center justify-center bg-purple-500/5 shadow-[0_0_20px_rgba(139,92,246,0.1)]">
                    <Shield className="w-8 h-8 text-purple-500" />
                  </div>
                  <h2 className="text-xs font-mono font-bold tracking-[0.3em] text-zinc-400 mb-2 uppercase">Status: Initiate</h2>
                  <p className="text-zinc-500 text-sm leading-relaxed font-mono tracking-tight">
                    EVERY MASTER WAS ONCE A NOVICE. YOUR JOURNEY TOWARDS COGNITIVE DOMINANCE BEGINS NOW. 
                    CONSISTENCY IS THE CORE PROTOCOL.
                  </p>
                </div>

                <button
                  onClick={nextStep}
                  className="group relative w-full py-4 border border-purple-500/50 bg-purple-500/10 rounded-xl font-bold text-sm tracking-[0.2em] uppercase hover:bg-purple-500/20 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all flex items-center justify-center gap-3 overflow-hidden"
                >
                  <span className="relative z-10">Execute Protocol</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-10">
                <div className="text-center space-y-3">
                  <p className="text-purple-500 font-mono text-xs tracking-[0.4em] uppercase">Core Calibration</p>
                  <h1 className="text-3xl font-bold tracking-tight">SELECT PRIMARY OBJECTIVE</h1>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {GOALS.map((goal) => {
                    const Icon = goal.icon;
                    const isSelected = selectedGoal === goal.id;
                    return (
                      <button
                        key={goal.id}
                        onClick={() => setSelectedGoal(goal.id)}
                        className={`p-6 rounded-xl border backdrop-blur-md transition-all duration-300 flex flex-col items-center gap-4 text-center group ${
                          isSelected
                            ? "bg-[#050505] border-purple-500/50 shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                            : "bg-[#050505] border-[#1A1A1A] hover:border-purple-500/30"
                        }`}
                      >
                        <div className={`p-3 rounded-lg border transition-colors ${
                          isSelected ? "border-purple-500/50 bg-purple-500/10" : "border-[#1A1A1A] bg-zinc-900/30 group-hover:border-purple-500/20"
                        }`}>
                          <Icon className={`w-6 h-6 ${isSelected ? "text-purple-500" : "text-zinc-600 group-hover:text-zinc-400"}`} />
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? "text-purple-400" : "text-zinc-500"}`}>
                          {goal.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <button
                  disabled={!selectedGoal}
                  onClick={nextStep}
                  className="w-full py-4 border border-purple-500/50 bg-purple-500/10 rounded-xl font-bold text-sm tracking-[0.2em] uppercase disabled:opacity-30 disabled:cursor-not-allowed hover:bg-purple-500/20 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all flex items-center justify-center gap-3"
                >
                  Confirm Selection <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-10">
                <div className="text-center space-y-3">
                  <p className="text-purple-500 font-mono text-xs tracking-[0.4em] uppercase">Protocol Definition</p>
                  <h1 className="text-3xl font-bold tracking-tight">INITIALIZE FIRST HABIT</h1>
                </div>

                <div className="space-y-8 bg-[#050505] border border-[#1A1A1A] rounded-2xl p-10 backdrop-blur-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Cpu className="w-24 h-24" />
                  </div>
                  
                  <div className="space-y-3 relative z-10">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Habit Designation</label>
                    <input
                      type="text"
                      placeholder="Enter routine identifier..."
                      value={habitTitle}
                      onChange={(e) => setHabitTitle(e.target.value)}
                      className="w-full bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl px-5 py-4 text-sm font-mono focus:outline-none focus:border-purple-500/50 focus:shadow-[0_0_15px_rgba(139,92,246,0.1)] transition-all placeholder:text-zinc-700"
                      required
                    />
                  </div>

                  <div className="space-y-4 relative z-10">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Interface Icon</label>
                    <div className="grid grid-cols-6 gap-3">
                      {ICON_OPTIONS.map(({ id, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => setHabitIcon(id)}
                          className={`w-full aspect-square flex items-center justify-center rounded-xl border transition-all ${
                            habitIcon === id
                              ? "bg-purple-500/10 border-purple-500/50 shadow-[0_0_15px_rgba(139,92,246,0.15)] text-purple-400 scale-105"
                              : "bg-[#0D0D0D] border-[#1A1A1A] hover:border-purple-500/30 text-zinc-600 hover:text-zinc-400"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  disabled={!habitTitle.trim() || isLoading}
                  onClick={handleCreateHabit}
                  className="w-full py-4 border border-purple-500/50 bg-purple-500/10 rounded-xl font-bold text-sm tracking-[0.2em] uppercase disabled:opacity-30 disabled:cursor-not-allowed hover:bg-purple-500/20 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>Commit Routine <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-12 text-center">
                <div className="w-24 h-24 border border-green-500/30 bg-green-500/5 rounded-full mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                  <Check className="w-12 h-12 text-green-500" />
                </div>

                <div className="space-y-4">
                  <p className="text-green-500 font-mono text-xs tracking-[0.4em] uppercase">Synchronization Complete</p>
                  <h1 className="text-4xl font-bold tracking-tight">SYSTEMS READY</h1>
                  <p className="text-zinc-500 text-sm font-mono tracking-wider max-w-sm mx-auto">
                    USER PROFILE OPTIMIZED. INITIAL ROUTINE SEEDED.
                  </p>
                </div>

                <button
                  onClick={() => router.push("/dashboard")}
                  className="w-full py-4 border border-purple-500 bg-purple-500/10 rounded-xl font-bold text-sm tracking-[0.2em] uppercase hover:bg-purple-500 hover:text-white hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all"
                >
                  Enter Interface
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
