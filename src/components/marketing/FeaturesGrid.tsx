"use client";

import { motion } from "framer-motion";
import {
  Flame,
  Kanban,
  CalendarClock,
  Trophy,
  Target,
  Clock,
} from "lucide-react";

export default function FeaturesGrid() {
  const cellVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.08,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <section id="features" className="w-full bg-[#09090B]">
      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* CELL 1 — HÁBITOS */}
        <motion.div
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={cellVariants}
          className="p-8 md:p-[32px_28px] flex flex-col justify-between border-b md:border-r border-[#18181B] min-h-[320px]"
        >
          <div>
            <div className="font-mono text-[10px] text-[#3F3F46] tracking-[0.1em] mb-5">
              01 — HÁBITOS
            </div>
            <div className="w-8 h-8 rounded-lg border border-[#1E1E2E] flex items-center justify-center mb-3.5">
              <Flame size={16} className="text-[#EF4444]" />
            </div>
            <h3 className="text-[14px] font-medium text-white mb-2">
              Rastreamento com streak
            </h3>
            <p className="text-[12px] text-[#71717A] line-height-[1.65]">
              Check-in diário, sequências e mapa de calor mensal. Veja sua
              consistência ganhar forma.
            </p>
          </div>
          <div>
            {/* Visual Element */}
            <div className="flex items-center gap-1 my-4">
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[#7C3AED]/10"></div>
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[#7C3AED]/30"></div>
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[#7C3AED]"></div>
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[#7C3AED]"></div>
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[#7C3AED]/15"></div>
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[#7C3AED]/50"></div>
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[#7C3AED]"></div>
            </div>
            <div className="font-mono text-[10px] text-[#7C3AED]">
              → CONSISTÊNCIA REAL
            </div>
          </div>
        </motion.div>

        {/* CELL 2 — KANBAN */}
        <motion.div
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={cellVariants}
          className="p-8 md:p-[32px_28px] flex flex-col justify-between border-b md:border-r border-[#18181B] min-h-[320px]"
        >
          <div>
            <div className="font-mono text-[10px] text-[#3F3F46] tracking-[0.1em] mb-5">
              02 — KANBAN
            </div>
            <div className="w-8 h-8 rounded-lg border border-[#1E1E2E] flex items-center justify-center mb-3.5">
              <Kanban size={16} className="text-[#7C3AED]" />
            </div>
            <h3 className="text-[14px] font-medium text-white mb-2">
              Organize visualmente
            </h3>
            <p className="text-[12px] text-[#71717A] line-height-[1.65]">
              Arraste tarefas, crie checklists e transforme objetivos grandes
              em passos pequenos.
            </p>
          </div>
          <div>
            {/* Visual Element */}
            <div className="grid grid-cols-3 gap-1.5 my-4">
              {/* Backlog */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 mb-1">
                  <span className="w-1 h-1 rounded-full bg-[#6B7280]"></span>
                  <span className="text-[7px] text-[#52525B] font-mono">BACK</span>
                </div>
                <div className="bg-[#0D0D0D] border border-[#1E1E2E] rounded p-1 h-[18px] text-[8px] text-[#71717A] flex items-center">
                  Task A
                </div>
                <div className="bg-[#0D0D0D] border border-[#1E1E2E] rounded p-1 h-[18px] text-[8px] text-[#71717A] flex items-center">
                  Task B
                </div>
              </div>
              {/* Fazendo */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 mb-1">
                  <span className="w-1 h-1 rounded-full bg-[#7C3AED]"></span>
                  <span className="text-[7px] text-[#52525B] font-mono">DOING</span>
                </div>
                <div className="bg-[#0D0D0D] border border-[#1E1E2E] border-l-2 border-l-[#7C3AED] rounded p-1 h-[18px] text-[8px] text-white flex items-center">
                  Task C
                </div>
              </div>
              {/* Feito */}
              <div className="flex flex-col gap-1 opacity-40">
                <div className="flex items-center gap-1 mb-1">
                  <span className="w-1 h-1 rounded-full bg-[#22C55E]"></span>
                  <span className="text-[7px] text-[#52525B] font-mono">DONE</span>
                </div>
                <div className="bg-[#0D0D0D] border border-[#1E1E2E] rounded p-1 h-[18px] text-[8px] text-[#71717A] flex items-center">
                  Task D
                </div>
              </div>
            </div>
            <div className="font-mono text-[10px] text-[#7C3AED]">
              → FOCO EM EXECUÇÃO
            </div>
          </div>
        </motion.div>

        {/* CELL 3 — ROTINA */}
        <motion.div
          custom={2}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={cellVariants}
          className="p-8 md:p-[32px_28px] flex flex-col justify-between border-b border-[#18181B] min-h-[320px]"
        >
          <div>
            <div className="font-mono text-[10px] text-[#3F3F46] tracking-[0.1em] mb-5">
              03 — ROTINA
            </div>
            <div className="w-8 h-8 rounded-lg border border-[#1E1E2E] flex items-center justify-center mb-3.5">
              <CalendarClock size={16} className="text-[#7C3AED]" />
            </div>
            <h3 className="text-[14px] font-medium text-white mb-2">
              Sua semana planejada
            </h3>
            <p className="text-[12px] text-[#71717A] line-height-[1.65]">
              Blocos de tempo do início ao fim do dia, de segunda a domingo.
            </p>
          </div>
          <div>
            {/* Visual Element */}
            <div className="flex flex-col gap-1 my-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[8px] text-[#52525B] w-9">06:00</span>
                <div className="h-2 rounded bg-[rgba(124,58,237,0.7)] flex-1 max-w-[80%]"></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[8px] text-[#52525B] w-9">08:30</span>
                <div className="h-2 rounded bg-[rgba(239,68,68,0.5)] flex-1 max-w-[55%]"></div>
              </div>
              <div className="flex item-center gap-2">
                <span className="font-mono text-[8px] text-[#52525B] w-9">09:00</span>
                <div className="h-2 rounded bg-[rgba(124,58,237,0.4)] flex-1 max-w-[70%]"></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[8px] text-[#52525B] w-9">22:00</span>
                <div className="h-2 rounded bg-[rgba(80,80,80,0.3)] flex-1 max-w-[30%]"></div>
              </div>
            </div>
            <div className="font-mono text-[10px] text-[#7C3AED]">
              → ROTINA SEM ATRITO
            </div>
          </div>
        </motion.div>

        {/* CELL 4 — GAMIFICAÇÃO */}
        <motion.div
          custom={3}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={cellVariants}
          className="p-8 md:p-[32px_28px] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#18181B] min-h-[320px]"
        >
          <div>
            <div className="font-mono text-[10px] text-[#3F3F46] tracking-[0.1em] mb-5">
              04 — GAMIFICAÇÃO
            </div>
            <div className="w-8 h-8 rounded-lg border border-[#1E1E2E] flex items-center justify-center mb-3.5">
              <Trophy size={16} className="text-[#F5A623]" />
            </div>
            <h3 className="text-[14px] font-medium text-white mb-2">
              XP, ranks e identidade
            </h3>
            <p className="text-[12px] text-[#71717A] line-height-[1.65]">
              7 ranks de INITIATE a TRANSCENDENT. Cada ação constrói uma
              versão melhor de você.
            </p>
          </div>
          <div>
            {/* Visual Element */}
            <div className="flex flex-wrap gap-1.5 my-4">
              <span className="border border-[#1E1E2E] text-[#52525B] rounded-full font-mono text-[9px] px-2 py-0.5">
                INITIATE
              </span>
              <span className="bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.3)] text-[#7C3AED] rounded-full font-mono text-[9px] px-2 py-0.5">
                BUILDER
              </span>
              <span className="border border-[#1E1E2E] text-[#52525B] rounded-full font-mono text-[9px] px-2 py-0.5">
                ARCHITECT
              </span>
            </div>
            <div className="font-mono text-[10px] text-[#7C3AED]">
              → EVOLUÇÃO VISÍVEL
            </div>
          </div>
        </motion.div>

        {/* CELL 5 — METAS */}
        <motion.div
          custom={4}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={cellVariants}
          className="p-8 md:p-[32px_28px] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#18181B] min-h-[320px]"
        >
          <div>
            <div className="font-mono text-[10px] text-[#3F3F46] tracking-[0.1em] mb-5">
              05 — METAS
            </div>
            <div className="w-8 h-8 rounded-lg border border-[#1E1E2E] flex items-center justify-center mb-3.5">
              <Target size={16} className="text-[#EF4444]" />
            </div>
            <h3 className="text-[14px] font-medium text-white mb-2">
              Sistema dos 90 dias
            </h3>
            <p className="text-[12px] text-[#71717A] line-height-[1.65]">
              Metas com prazo, etapas e o porquê real. Sem perder de vista o
              motivo de ter começado.
            </p>
          </div>
          <div>
            {/* Visual Element */}
            <div className="flex flex-col gap-2 my-4">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[9px]">
                  <span className="text-[#A1A1AA]">UERJ</span>
                  <span className="font-mono text-[#EF4444]">10%</span>
                </div>
                <div className="w-full h-1 bg-[#1E1E2E] rounded-full overflow-hidden">
                  <div className="h-full bg-[#EF4444]" style={{ width: "10%" }}></div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[9px]">
                  <span className="text-[#A1A1AA]">Empresa RJ</span>
                  <span className="font-mono text-[#7C3AED]">35%</span>
                </div>
                <div className="w-full h-1 bg-[#1E1E2E] rounded-full overflow-hidden">
                  <div className="h-full bg-[#7C3AED]" style={{ width: "35%" }}></div>
                </div>
              </div>
            </div>
            <div className="font-mono text-[10px] text-[#7C3AED]">
              → CLAREZA DE DIREÇÃO
            </div>
          </div>
        </motion.div>

        {/* CELL 6 — FOCO */}
        <motion.div
          custom={5}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={cellVariants}
          className="p-8 md:p-[32px_28px] flex flex-col justify-between min-h-[320px]"
        >
          <div>
            <div className="font-mono text-[10px] text-[#3F3F46] tracking-[0.1em] mb-5">
              06 — FOCO
            </div>
            <div className="w-8 h-8 rounded-lg border border-[#1E1E2E] flex items-center justify-center mb-3.5">
              <Clock size={16} className="text-[#7C3AED]" />
            </div>
            <h3 className="text-[14px] font-medium text-white mb-2">
              Deep Work timer
            </h3>
            <p className="text-[12px] text-[#71717A] line-height-[1.65]">
              Pomodoro, 90min ou Flow. Cada minuto em foco vira XP. Modo
              imersivo sem distrações.
            </p>
          </div>
          <div>
            {/* Visual Element */}
            <div className="flex items-center gap-3 my-4">
              <div className="w-11 h-11 border-2 border-[#7C3AED] rounded-full flex items-center justify-center font-mono text-[10px] text-[#7C3AED]">
                47:32
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-white font-medium">Deep Work</span>
                <span className="text-[9px] text-[#52525B]">90 min · +90 XP</span>
              </div>
            </div>
            <div className="font-mono text-[10px] text-[#7C3AED]">
              → FOCO PROFUNDO
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
