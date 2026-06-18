"use client";

import React, { useRef } from "react";
import { UserPlus, Target, Flame, TrendingUp, Trophy } from "lucide-react";
import { motion, useInView } from "framer-motion";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const onboardingTimelineData = [
  {
    id: 1,
    title: "Crie sua conta",
    date: "Passo 1",
    content: "Cadastro rápido. Sem burocracia, sem formulário longo — em menos de 1 minuto você já está dentro.",
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
    content: "Escolha o que mais importa agora: saúde, disciplina mental, carreira ou alta performance.",
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
    content: "Pequeno, específico, com horário definido. O começo não precisa ser perfeito — precisa existir.",
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
    content: "Streaks, XP, heatmap mensal. Veja sua consistência ganhar forma visual dia após dia.",
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
    content: "De INITIATE a TRANSCENDENT — cada nível reflete uma identidade que você está construindo, não só um número.",
    category: "Evolução",
    icon: Trophy,
    relatedIds: [4],
    status: "pending" as const,
    energy: 15,
  },
];

export function HowItWorksSection() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });

  return (
    <section id="how-it-works" className="relative py-24 lg:py-32 bg-[#09090B] overflow-hidden" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-16"
        >
          <span className="text-[11px] uppercase tracking-[0.15em] text-[#7C3AED] font-bold mb-4">
            COMO FUNCIONA
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
            Da primeira ação ao hábito automático
          </h2>
          <p className="text-sm lg:text-base text-[#71717A] max-w-[600px] leading-relaxed">
            5 passos simples para sair do loop e construir um sistema que funciona de verdade.
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative h-[700px] w-full flex items-center justify-center">
          {/* We pass a custom prop or wrap the component if we want to control rotation via isInView.
              The original component has internal state for autoRotate. 
              To avoid editing the UI component directly, we'll rely on it starting when it mounts, 
              but since it's in a section, we use the height constraint provided. */}
          <div className="w-full h-full">
             <RadialOrbitalTimeline timelineData={onboardingTimelineData} />
          </div>
        </div>
      </div>
    </section>
  );
}
