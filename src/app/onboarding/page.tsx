"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Loader2 } from "lucide-react";

const STEPS = [
  { id: 1, title: "Boas-vindas" },
  { id: 2, title: "Objetivo" },
  { id: 3, title: "Hábito" },
  { id: 4, title: "Concluído" },
];

const GOALS = [
  { id: "health", label: "Saúde & Corpo", emoji: "🏋️" },
  { id: "discipline", label: "Disciplina Mental", emoji: "🧠" },
  { id: "learning", label: "Aprendizado", emoji: "📚" },
  { id: "career", label: "Carreira", emoji: "💼" },
  { id: "finance", label: "Finanças", emoji: "💰" },
  { id: "performance", label: "Alta Performance", emoji: "⚡" },
];

const EMOJIS = ["🧘", "🏋️", "📚", "💧", "🛏️", "📝", "🚶", "🍎", "🎯", "⭐", "💪", "🔥"];

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [habitTitle, setHabitTitle] = useState("");
  const [habitIcon, setHabitIcon] = useState("🎯");
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
          icon: habitIcon,
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
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-white/5 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-600 to-red-500"
          initial={{ width: "0%" }}
          animate={{ width: `${(step / 4) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <main className="max-w-2xl mx-auto pt-20 px-6 pb-12">
        <AnimatePresence mode="wait" custom={step}>
          <motion.div
            key={step}
            custom={step}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full"
          >
            {step === 1 && (
              <div className="space-y-8 text-center">
                <div className="space-y-2">
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Bem-vindo ao LENS, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-red-400">{session?.user?.name?.split(" ")[0]}</span>!
                  </h1>
                  <p className="text-zinc-400 text-lg">
                    Você está prestes a construir a melhor versão de si mesmo.
                  </p>
                </div>

                <div className="bg-[#0D0D0D]/90 border border-purple-500/20 rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-purple-500/5">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-900 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <span className="text-3xl">🛡️</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Rank: INITIATE</h2>
                  <p className="text-zinc-400 leading-relaxed">
                    Todo mestre foi um dia um aprendiz. Sua jornada de maestria começa agora. 
                    Mantenha a constância e veja sua evolução refletida em sua vida.
                  </p>
                </div>

                <button
                  onClick={nextStep}
                  className="group relative w-full py-4 bg-gradient-to-r from-purple-600 to-red-600 rounded-xl font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 overflow-hidden"
                >
                  <span className="relative z-10">Começar minha jornada</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-bold">Qual é o seu principal objetivo agora?</h1>
                  <p className="text-zinc-400">Isso nos ajuda a personalizar sua experiência.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {GOALS.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => setSelectedGoal(goal.id)}
                      className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 text-center ${
                        selectedGoal === goal.id
                          ? "bg-purple-500/10 border-purple-500 shadow-lg shadow-purple-500/10"
                          : "bg-[#0D0D0D]/90 border-white/5 hover:border-white/20"
                      }`}
                    >
                      <span className="text-3xl">{goal.emoji}</span>
                      <span className={`font-medium ${selectedGoal === goal.id ? "text-purple-400" : "text-zinc-300"}`}>
                        {goal.label}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  disabled={!selectedGoal}
                  onClick={nextStep}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-red-600 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  Continuar <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-bold">Crie seu primeiro hábito</h1>
                  <p className="text-zinc-400">Pequenas ações diárias levam a grandes resultados.</p>
                </div>

                <div className="space-y-6 bg-[#0D0D0D]/90 border border-white/5 rounded-2xl p-8 backdrop-blur-xl">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400 ml-1">Nome do hábito</label>
                    <input
                      type="text"
                      placeholder="Ex: Ler 20 páginas, Meditar, Treinar..."
                      value={habitTitle}
                      onChange={(e) => setHabitTitle(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-zinc-400 ml-1">Escolha um ícone</label>
                    <div className="grid grid-cols-6 gap-3">
                      {EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => setHabitIcon(emoji)}
                          className={`w-full aspect-square text-2xl flex items-center justify-center rounded-xl transition-all ${
                            habitIcon === emoji
                              ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20 scale-110"
                              : "bg-white/5 hover:bg-white/10 text-zinc-400"
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  disabled={!habitTitle.trim() || isLoading}
                  onClick={handleCreateHabit}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-red-600 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>Criar hábito e continuar <ChevronRight className="w-5 h-5" /></>
                  )}
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8 text-center">
                <div className="w-24 h-24 bg-green-500/10 border-2 border-green-500/20 rounded-full mx-auto flex items-center justify-center">
                  <Check className="w-12 h-12 text-green-500" />
                </div>

                <div className="space-y-2">
                  <h1 className="text-4xl font-bold">Tudo pronto!</h1>
                  <p className="text-zinc-400 text-lg">
                    Seu perfil foi configurado e seu primeiro hábito foi criado.
                  </p>
                </div>

                <button
                  onClick={() => router.push("/dashboard")}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-red-600 rounded-xl font-bold text-lg hover:opacity-90 transition-all"
                >
                  Acessar meu painel
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
