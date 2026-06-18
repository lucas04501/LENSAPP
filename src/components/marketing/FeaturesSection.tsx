"use client";

import React from "react";
import { 
  LayoutDashboard, 
  Kanban, 
  CalendarClock, 
  Flame,
  LucideIcon 
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatedGroup } from "@/components/ui/animated-group";

interface FeatureProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  description: string;
  mockup: React.ReactNode;
  reversed?: boolean;
}

const FeatureBlock = ({ 
  icon: Icon, 
  iconColor, 
  title, 
  description, 
  mockup, 
  reversed = false 
}: FeatureProps) => {
  return (
    <div className={cn(
      "flex flex-col lg:flex-row items-center gap-12 lg:gap-24",
      reversed ? "lg:flex-row-reverse" : ""
    )}>
      {/* Mockup Column */}
      <motion.div 
        initial={{ opacity: 0, x: reversed ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex-1 w-full"
      >
        <div className="relative group">
          {/* Subtle Glow Background */}
          <div className={cn(
            "absolute -inset-4 rounded-[20px] opacity-20 blur-3xl transition-opacity group-hover:opacity-30",
            reversed ? "bg-red-500/20" : "bg-[#7C3AED]/20"
          )} />
          {mockup}
        </div>
      </motion.div>

      {/* Text Column */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        className="flex-1 max-w-[480px]"
      >
        <div className="flex items-center justify-center lg:justify-start mb-6">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/5"
            style={{ backgroundColor: `${iconColor}15` }}
          >
            <Icon size={24} style={{ color: iconColor }} />
          </div>
        </div>
        <h3 className="text-2xl lg:text-3xl font-semibold text-white mb-4 text-center lg:text-left tracking-tight">
          {title}
        </h3>
        <p className="text-sm lg:text-base text-[#A1A1AA] leading-relaxed text-center lg:text-left">
          {description}
        </p>
      </motion.div>
    </div>
  );
};

// --- MOCKUP COMPONENTS ---

const DashboardMockup = () => (
  <div className="w-full aspect-[4/3] bg-[#0F0F14] border border-[#1E1E2E] rounded-2xl p-6 shadow-[0_20px_60px_rgba(124,58,237,0.1)] overflow-hidden">
    <div className="flex gap-4 mb-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex-1 h-16 bg-[#1A1A1E] rounded-xl border border-white/5" />
      ))}
    </div>
    <div className="flex gap-6 h-full">
      <div className="flex-1 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-4 bg-[#1A1A1E] rounded-full w-full opacity-50" />
        ))}
        <div className="h-4 bg-[#7C3AED]/30 rounded-full w-2/3" />
      </div>
      <div className="w-1/3 flex items-end gap-2 pb-12">
        {[0.4, 0.7, 0.5, 0.9, 0.6].map((h, i) => (
          <div 
            key={i} 
            className="flex-1 bg-gradient-to-t from-[#7C3AED] to-[#7C3AED]/40 rounded-t-sm" 
            style={{ height: `${h * 100}%` }}
          />
        ))}
      </div>
    </div>
  </div>
);

const KanbanMockup = () => (
  <div className="w-full aspect-[4/3] bg-[#0F0F14] border border-[#1E1E2E] rounded-2xl p-6 flex gap-4 overflow-hidden">
    {[1, 2, 3].map((col) => (
      <div key={col} className="flex-1 space-y-4">
        <div className="h-2 w-12 bg-[#1A1A1E] rounded-full mb-4" />
        {[1, 2].map((card) => (
          <div key={card} className="bg-[#1A1A1E] border border-white/5 rounded-lg p-3 space-y-2">
            <div className="h-1.5 w-full bg-white/5 rounded-full" />
            <div className="h-1.5 w-2/3 bg-white/5 rounded-full" />
          </div>
        ))}
        {col === 2 && (
           <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg p-3 space-y-2">
            <div className="h-1.5 w-full bg-[#EF4444]/40 rounded-full" />
            <div className="h-1.5 w-2/3 bg-[#EF4444]/20 rounded-full" />
          </div>
        )}
      </div>
    ))}
  </div>
);

const RoutineMockup = () => (
  <div className="w-full aspect-[4/3] bg-[#0F0F14] border border-[#1E1E2E] rounded-2xl p-6 flex gap-8 overflow-hidden">
    <div className="w-px bg-white/10 h-full relative">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="absolute w-2 h-2 bg-white/10 rounded-full -left-1" style={{ top: `${i * 20}%` }} />
      ))}
    </div>
    <div className="flex-1 space-y-8 pt-4">
      <div className="h-12 w-[80%] bg-[#7C3AED]/20 border border-[#7C3AED]/30 rounded-xl" />
      <div className="h-16 w-[95%] bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl" />
      <div className="h-10 w-[60%] bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-xl" />
      <div className="h-14 w-[75%] bg-white/5 border border-white/10 rounded-xl" />
    </div>
  </div>
);

const HabitMockup = () => (
  <div className="w-full aspect-[4/3] bg-[#0F0F14] border border-[#1E1E2E] rounded-2xl p-8 flex flex-col justify-center overflow-hidden">
    <div className="grid grid-cols-7 gap-2">
      {Array.from({ length: 35 }).map((_, i) => (
        <div 
          key={i} 
          className="aspect-square rounded-sm"
          style={{ 
            backgroundColor: "#7C3AED",
            opacity: [0.05, 0.1, 0.2, 0.4, 0.7, 0.9][Math.floor(Math.random() * 6)]
          }} 
        />
      ))}
    </div>
    <div className="mt-8 flex gap-2">
       {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="h-1 flex-1 bg-white/5 rounded-full" />
      ))}
    </div>
  </div>
);

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 lg:py-40 bg-[#09090B] px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center text-center mb-32"
        >
          <motion.span 
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.5 }}
            className="text-[11px] uppercase tracking-[0.15em] text-[#7C3AED] font-bold mb-4"
          >
            RECURSOS
          </motion.span>
          <motion.h2 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight"
          >
            Tudo que você precisa para evoluir
          </motion.h2>
          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm lg:text-base text-[#71717A] max-w-[600px] leading-relaxed"
          >
            Um sistema completo, não um app a mais para abandonar em uma semana.
          </motion.p>
        </motion.div>

        {/* Feature Blocks */}
        <div className="space-y-32 lg:space-y-48">
          <FeatureBlock 
            icon={LayoutDashboard}
            iconColor="#7C3AED"
            title="Seu painel de controle"
            description="Veja seu XP, streak, performance semanal e progresso de rank em um único lugar — sem ruído visual."
            mockup={<DashboardMockup />}
          />

          <FeatureBlock 
            icon={Kanban}
            iconColor="#EF4444"
            title="Organize tudo visualmente"
            description="Arraste tarefas entre colunas, crie checklists e transforme objetivos grandes em passos pequenos."
            mockup={<KanbanMockup />}
            reversed
          />

          <FeatureBlock 
            icon={CalendarClock}
            iconColor="#7C3AED"
            title="Sua semana, no controle"
            description="Monte blocos de tempo do início ao fim do dia, de segunda a domingo. Sem precisar de outro app de agenda."
            mockup={<RoutineMockup />}
          />

          <FeatureBlock 
            icon={Flame}
            iconColor="#EF4444"
            title="Construa consistência real"
            description="Acompanhe streaks, veja seu histórico em um mapa de calor mensal e nunca perca de vista o motivo de ter começado."
            mockup={<HabitMockup />}
            reversed
          />
        </div>
      </div>
    </section>
  );
}
