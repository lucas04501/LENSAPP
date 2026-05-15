"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, CheckCircle2, ChevronRight, 
  Target, Zap, Flame, Award, 
  Sparkles, BookOpen, ShoppingCart,
  ArrowRight, Dumbbell, GraduationCap,
  Briefcase, Banknote, Rocket
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createHabit } from "@/lib/actions/habits";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface OnboardingProps {
  user: {
    id: string;
    name: string;
  };
}

const OBJECTIVES = [
  { id: "health",    label: "Saúde & Corpo",        icon: Dumbbell },
  { id: "mind",      label: "Disciplina Mental",    icon: Brain },
  { id: "learn",     label: "Aprendizado",         icon: GraduationCap },
  { id: "career",    label: "Carreira & Prod.",     icon: Briefcase },
  { id: "finance",   label: "Finanças",            icon: Banknote },
  { id: "perform",   label: "Alta Performance",     icon: Rocket },
];

const EMOJIS = ["🧘","🏋️","📚","💧","🛏️","📝","🚶","🍎","🧹","💊","🎯","⭐"];

const FREQUENCIES = [
  { id: "DAILY",   label: "Diário" },
  { id: "WEEKDAY", label: "Dias úteis" },
  { id: "WEEKEND", label: "Final de semana" },
];

export function OnboardingContent({ user }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [objective, setObjective] = useState("");
  const [habitName, setHabitName] = useState("");
  const [habitIcon, setHabitIcon] = useState("🧘");
  const [frequency, setFrequency] = useState("DAILY");
  const [hasEbook, setHasEbook] = useState<boolean | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const nextStep = () => setStep(s => s + 1);

  const handleCreateHabit = async () => {
    if (!habitName.trim()) {
      toast.error("Dê um nome ao seu hábito");
      return;
    }

    startTransition(async () => {
      const res = await createHabit({
        title: habitName,
        icon: habitIcon,
        category: "OTHER", // Default for onboarding
        xpReward: 10,
        color: "#A855F7",
      }, user.id);

      if (res.success) {
        nextStep();
      } else {
        toast.error(res.error || "Erro ao criar hábito");
      }
    });
  };

  const steps = [
    // STEP 1: WELCOME
    <motion.div
      key="step1"
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -40, opacity: 0 }}
      className="max-w-xl mx-auto text-center space-y-8"
    >
      <div className="flex justify-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple to-red p-0.5"
        >
          <div className="w-full h-full bg-[#050505] rounded-[22px] flex items-center justify-center">
            <Brain className="w-12 h-12 text-white" />
          </div>
        </motion.div>
      </div>

      <div className="space-y-3">
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
          Bem-vindo ao LENS, <span className="text-purple">{user.name}</span>
        </h1>
        <p className="text-text-muted text-lg font-medium">
          Você está prestes a construir a melhor versão de si mesmo.
        </p>
      </div>

      <div className="glass rounded-[2rem] border border-purple/20 p-8 bg-purple/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Award className="w-24 h-24 text-purple" />
        </div>
        <div className="relative text-left">
          <span className="px-3 py-1 rounded-full bg-purple/10 border border-purple/20 text-[10px] font-black text-purple uppercase tracking-widest">Rank Atual</span>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tight mt-2">INITIATE</h2>
          <p className="text-sm text-text-muted mt-3 leading-relaxed">
            Todo grande mestre começou como um iniciante. Sua jornada de maestria pessoal e foco absoluto começa agora.
          </p>
        </div>
      </div>

      <button
        onClick={nextStep}
        className="group w-full py-5 rounded-[2rem] bg-gradient-to-r from-purple to-red text-white font-black uppercase italic tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-purple/20 hover:scale-[1.02] transition-all active:scale-[0.98]"
      >
        Começar minha jornada
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>,

    // STEP 2: OBJECTIVE
    <motion.div
      key="step2"
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -40, opacity: 0 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Qual é o seu principal objetivo agora?</h2>
        <p className="text-text-muted uppercase font-bold tracking-widest text-xs">Isso nos ajudará a personalizar sua experiência</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {OBJECTIVES.map((obj) => (
          <button
            key={obj.id}
            onClick={() => setObjective(obj.id)}
            className={cn(
              "glass rounded-3xl border p-6 flex flex-col items-center text-center gap-4 transition-all duration-300 relative group",
              objective === obj.id 
                ? "border-purple bg-purple/10 shadow-[0_0_30px_rgba(168,85,247,0.2)]" 
                : "border-white/5 bg-[#050505] hover:border-white/20"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
              objective === obj.id ? "bg-purple text-white" : "bg-surface-2 text-text-muted group-hover:text-white"
            )}>
              <obj.icon className="w-6 h-6" />
            </div>
            <span className={cn(
              "text-xs font-black uppercase tracking-widest",
              objective === obj.id ? "text-white" : "text-text-muted"
            )}>
              {obj.label}
            </span>
            {objective === obj.id && (
              <motion.div layoutId="check" className="absolute top-3 right-3">
                <CheckCircle2 className="w-4 h-4 text-purple" />
              </motion.div>
            )}
          </button>
        ))}
      </div>

      <button
        disabled={!objective}
        onClick={nextStep}
        className="w-full py-5 rounded-[2rem] bg-white text-black font-black uppercase italic tracking-widest disabled:opacity-20 transition-all hover:bg-white/90"
      >
        Continuar
      </button>
    </motion.div>,

    // STEP 3: FIRST HABIT
    <motion.div
      key="step3"
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -40, opacity: 0 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Crie seu primeiro hábito</h2>
        <p className="text-text-muted uppercase font-bold tracking-widest text-xs">O segredo do sucesso está na sua rotina diária</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Nome do Hábito</label>
            <input
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              placeholder="Ex: Treino de Força"
              className="w-full bg-surface-2 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-purple/50 transition-all"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Ícone</label>
            <div className="grid grid-cols-6 gap-2">
              {EMOJIS.map(e => (
                <button
                  key={e}
                  onClick={() => setHabitIcon(e)}
                  className={cn(
                    "aspect-square rounded-xl bg-surface-2 border border-white/5 flex items-center justify-center text-xl hover:border-purple/30 transition-all",
                    habitIcon === e && "border-purple bg-purple/10"
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Frequência</label>
            <div className="flex gap-2">
              {FREQUENCIES.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFrequency(f.id)}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                    frequency === f.id ? "bg-white text-black border-white" : "bg-surface-2 text-text-muted border-white/5"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PREVIEW */}
        <div className="space-y-6">
          <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1 text-center block">Preview do Card</label>
          <div className="glass rounded-[2rem] border border-white/10 p-8 bg-[#080808] flex flex-col items-center text-center gap-6 shadow-2xl relative">
            <div className="w-20 h-24 rounded-3xl bg-purple/10 flex items-center justify-center text-4xl border border-purple/20">
              {habitIcon}
            </div>
            <div>
              <h3 className="text-xl font-black text-white italic uppercase tracking-tight truncate max-w-full">
                {habitName || "Seu Hábito Aqui"}
              </h3>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">
                {FREQUENCIES.find(f => f.id === frequency)?.label}
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple/10 border border-purple/20">
              <Zap className="w-3.5 h-3.5 text-purple" />
              <span className="text-[10px] font-black text-purple uppercase tracking-widest">+10 XP</span>
            </div>
          </div>
        </div>
      </div>

      <button
        disabled={!habitName.trim() || isPending}
        onClick={handleCreateHabit}
        className="w-full py-5 rounded-[2rem] bg-gradient-to-r from-purple to-red text-white font-black uppercase italic tracking-widest disabled:opacity-20 transition-all shadow-xl shadow-purple/20"
      >
        {isPending ? "Configurando..." : "Criar Hábito →"}
      </button>
    </motion.div>,

    // STEP 4: E-BOOK
    <motion.div
      key="step4"
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -40, opacity: 0 }}
      className="max-w-xl mx-auto space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Você tem o e-book Vire a Chave?</h2>
        <p className="text-text-muted uppercase font-bold tracking-widest text-xs">O guia definitivo para alta performance</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => setHasEbook(true)}
          className={cn(
            "glass rounded-3xl border p-6 flex items-center gap-6 transition-all duration-300 text-left",
            hasEbook === true ? "border-purple bg-purple/10" : "border-white/5 bg-surface-2"
          )}
        >
          <div className="w-12 h-12 rounded-2xl bg-purple/20 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-purple" />
          </div>
          <div>
            <p className="text-sm font-black text-white uppercase italic tracking-tighter">Sim, já tenho</p>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">Pronto para colocar em prática no LENS</p>
          </div>
        </button>

        <button
          onClick={() => setHasEbook(false)}
          className={cn(
            "glass rounded-3xl border p-6 flex items-center gap-6 transition-all duration-300 text-left",
            hasEbook === false ? "border-red bg-red/10" : "border-white/5 bg-surface-2"
          )}
        >
          <div className="w-12 h-12 rounded-2xl bg-red/20 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-red" />
          </div>
          <div>
            <p className="text-sm font-black text-white uppercase italic tracking-tighter">Não conheço</p>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">Quero acelerar meus resultados agora</p>
          </div>
        </button>
      </div>

      <AnimatePresence>
        {hasEbook === true && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-3xl bg-green/5 border border-green/20 text-center">
            <Sparkles className="w-6 h-6 text-green mx-auto mb-3" />
            <p className="text-sm text-text-muted leading-relaxed">
              Perfeito! Use o <span className="text-white font-bold">LENS</span> para aplicar o framework do e-book e trackear sua evolução diária.
            </p>
          </motion.div>
        )}
        {hasEbook === false && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[2rem] border border-white/10 p-6 flex items-center gap-6 bg-gradient-to-br from-surface to-surface-2">
            <div className="w-24 h-32 bg-[#1A1A1A] rounded-xl flex-shrink-0 shadow-2xl flex items-center justify-center p-4 border border-white/5">
              <BookOpen className="w-full h-full text-purple opacity-40" />
            </div>
            <div className="space-y-4">
              <p className="text-xs text-text-muted leading-relaxed">
                Descubra o sistema que mudou a vida de milhares de pessoas.
              </p>
              <button className="text-[10px] font-black text-purple uppercase tracking-[0.2em] flex items-center gap-2 hover:gap-3 transition-all">
                Conhecer o E-book <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => router.push("/dashboard")}
        className="w-full py-5 rounded-[2rem] bg-white text-black font-black uppercase italic tracking-widest transition-all hover:bg-white/90"
      >
        Acessar meu painel
      </button>
    </motion.div>
  ];

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* BACKGROUND GRADIENT */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple/10 rounded-full blur-[120px] pointer-events-none" />

      {/* PROGRESS BAR */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-white/5 flex gap-1 z-50">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex-1 h-full overflow-hidden">
            <motion.div 
              initial={false}
              animate={{ x: s <= step ? "0%" : "-100%" }}
              transition={{ duration: 0.5 }}
              className="w-full h-full bg-gradient-to-r from-purple to-red" 
            />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {steps[step - 1]}
      </AnimatePresence>
    </div>
  );
}
