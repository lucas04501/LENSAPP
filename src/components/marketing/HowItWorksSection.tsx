"use client";

import { UserPlus, Target, Flame, TrendingUp, Trophy } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const timelineData = [
  {
    id: 1,
    title: "Crie sua conta",
    date: "Passo 1",
    content: "Cadastro em menos de 1 minuto. Sem formulário longo.",
    category: "Início",
    icon: UserPlus,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Defina seu objetivo",
    date: "Passo 2",
    content: "Saúde, disciplina, carreira ou alta performance — você escolhe.",
    category: "Clareza",
    icon: Target,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 85,
  },
  {
    id: 3,
    title: "Crie seu primeiro hábito",
    date: "Passo 3",
    content: "Pequeno, específico, com horário. O começo não precisa ser perfeito.",
    category: "Ação",
    icon: Flame,
    relatedIds: [2, 4],
    status: "in-progress" as const,
    energy: 60,
  },
  {
    id: 4,
    title: "Acompanhe seu progresso",
    date: "Passo 4",
    content: "Streaks, XP, heatmap mensal. Veja sua consistência ganhar forma.",
    category: "Consistência",
    icon: TrendingUp,
    relatedIds: [3, 5],
    status: "pending" as const,
    energy: 35,
  },
  {
    id: 5,
    title: "Suba de rank",
    date: "Passo 5",
    content: "De INITIATE a TRANSCENDENT. Cada nível é uma identidade construída.",
    category: "Evolução",
    icon: Trophy,
    relatedIds: [4],
    status: "pending" as const,
    energy: 15,
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full bg-[#09090B] border-b border-[#18181B]">
      {/* Header */}
      <div className="flex flex-col items-center text-center pt-20 pb-10 px-4">
        <span className="font-mono text-[10px] tracking-[0.15em] text-[#7C3AED] uppercase">
          COMO FUNCIONA
        </span>
        <h2 className="text-[32px] font-bold text-white mt-3 tracking-tight">
          Da primeira ação ao hábito automático
        </h2>
        <p className="text-[14px] text-[#71717A] mt-2 max-w-[360px]">
          5 passos simples para sair do loop.
        </p>
      </div>

      {/* Timeline container */}
      <div className="w-full h-[600px] relative">
        <RadialOrbitalTimeline timelineData={timelineData} />
      </div>
    </section>
  );
}
