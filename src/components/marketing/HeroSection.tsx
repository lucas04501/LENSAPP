"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  const lineVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.15,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const handleScrollToHowItWorks = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.getElementById("how-it-works");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-[55%_45%] border-b border-[#18181B] bg-[#09090B] pt-[52px]">
      {/* LEFT COLUMN */}
      <div className="flex flex-col justify-between p-6 md:p-[64px_48px] border-b md:border-b-0 md:border-r border-[#18181B] min-h-[600px] md:min-h-[700px]">
        {/* TOP BLOCK */}
        <div>
          <span className="inline-block text-[10px] tracking-[0.15em] text-[#52525B] font-mono mb-6">
            SISTEMA DE ALTA PERFORMANCE
          </span>

          <h1 className="flex flex-col tracking-[-0.02em] select-none">
            <motion.span
              variants={lineVariants}
              initial="hidden"
              animate="visible"
              custom={0}
              className="text-[56px] md:text-[64px] font-light text-[#52525B] leading-[1.0]"
            >
              Master
            </motion.span>
            <motion.span
              variants={lineVariants}
              initial="hidden"
              animate="visible"
              custom={1}
              className="text-[56px] md:text-[64px] font-light text-[#A1A1AA] leading-[1.0]"
            >
              Your
            </motion.span>
            <motion.span
              variants={lineVariants}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-[56px] md:text-[64px] font-extrabold text-white leading-[1.0]"
            >
              Mind.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-[14px] text-[#71717A] leading-[1.7] max-w-[340px] mt-5"
          >
            Hábitos, foco e disciplina em um único sistema. Construído a partir de uma transformação real — não de teoria.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex items-center gap-3 mt-7"
          >
            <Link
              href="/register"
              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-5 py-2.5 rounded-md text-[13px] font-medium transition-colors duration-150"
            >
              Começar agora →
            </Link>
            <button
              onClick={handleScrollToHowItWorks}
              className="border border-[#27272A] text-[#A1A1AA] hover:text-white px-5 py-2.5 rounded-md text-[13px] transition-colors duration-150 bg-transparent"
            >
              Ver como funciona
            </button>
          </motion.div>
        </div>

        {/* BOTTOM BLOCK */}
        <div className="border-t border-[#18181B] pt-6 mt-8 md:mt-auto">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="font-mono text-[22px] font-medium text-white">7</div>
              <div className="text-[11px] text-[#52525B] mt-0.5 leading-tight">Ranks de evolução</div>
            </div>
            <div>
              <div className="font-mono text-[22px] font-medium text-white">66</div>
              <div className="text-[11px] text-[#52525B] mt-0.5 leading-tight">Dias para hábito automático</div>
            </div>
            <div>
              <div className="font-mono text-[22px] font-medium text-white">∞</div>
              <div className="text-[11px] text-[#52525B] mt-0.5 leading-tight">Potencial de crescimento</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="p-6 md:p-[40px_32px] overflow-hidden flex items-center justify-center bg-[#09090B]"
      >
        {/* Mockup Container */}
        <div className="w-full max-w-[420px] bg-[#0A0A0A] border border-[#1E1E2E] rounded-xl p-4 shadow-none">
          {/* Mockup Top Bar */}
          <div className="flex justify-between items-center mb-3">
            <span className="font-mono text-[10px] text-[#71717A]">• LENS</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-[#7C3AED]">⚡ 345 XP</span>
              <span className="bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.3)] rounded-full px-2 py-0.5 font-mono text-[9px] text-[#7C3AED] flex items-center gap-1 select-none">
                <span className="w-1 h-1 rounded-full bg-[#7C3AED]" /> INITIATE
              </span>
            </div>
          </div>

          {/* Mockup Body */}
          <div className="grid grid-cols-[110px_1fr] gap-2.5">
            {/* Sidebar */}
            <div className="bg-[#0D0D0D] border border-[#1E1E2E] rounded-lg p-2.5 flex flex-col gap-1.5">
              <div className="text-[10px] px-2 py-1 rounded bg-[#141414] border-l-2 border-[#7C3AED] text-white font-medium">
                Dashboard
              </div>
              <div className="text-[10px] px-2 py-1 text-[#52525B] font-medium">
                Hábitos
              </div>
              <div className="text-[10px] px-2 py-1 text-[#52525B] font-medium">
                Metas
              </div>
              <div className="text-[10px] px-2 py-1 text-[#52525B] font-medium">
                Rotina
              </div>
              <div className="text-[10px] px-2 py-1 text-[#52525B] font-medium">
                Kanban
              </div>
              <div className="text-[10px] px-2 py-1 text-[#52525B] font-medium">
                Analytics
              </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col gap-2">
              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-1.5">
                <div className="bg-[#0D0D0D] border border-[#1E1E2E] rounded-md p-2">
                  <div className="font-mono text-[14px] font-medium text-white leading-tight">8d</div>
                  <div className="text-[9px] text-[#52525B] uppercase tracking-wider font-semibold">Streak</div>
                </div>
                <div className="bg-[#0D0D0D] border border-[#1E1E2E] rounded-md p-2">
                  <div className="font-mono text-[14px] font-medium text-white leading-tight">345</div>
                  <div className="text-[9px] text-[#52525B] uppercase tracking-wider font-semibold">XP Total</div>
                </div>
                <div className="bg-[#0D0D0D] border border-[#1E1E2E] rounded-md p-2">
                  <div className="font-mono text-[14px] font-medium text-white leading-tight">5/7</div>
                  <div className="text-[9px] text-[#52525B] uppercase tracking-wider font-semibold">Hábitos</div>
                </div>
              </div>

              {/* Chart Area */}
              <div className="bg-[#0D0D0D] border border-[#1E1E2E] rounded-md p-2.5">
                <div className="text-[9px] text-[#52525B] uppercase tracking-wider font-semibold">
                  PERFORMANCE SEMANAL
                </div>
                <div className="flex items-end h-12 gap-1 mt-2">
                  <div className="flex-1 rounded-t bg-[#7C3AED]/25" style={{ height: "60%" }}></div>
                  <div className="flex-1 rounded-t bg-[#7C3AED]/45" style={{ height: "80%" }}></div>
                  <div className="flex-1 rounded-t bg-[#7C3AED]/30" style={{ height: "45%" }}></div>
                  <div className="flex-1 rounded-t bg-[#7C3AED]/70" style={{ height: "90%" }}></div>
                  <div className="flex-1 rounded-t bg-[#7C3AED]" style={{ height: "100%" }}></div>
                  <div className="flex-1 rounded-t bg-[#7C3AED]/10" style={{ height: "20%" }}></div>
                  <div className="flex-1 rounded-t bg-[#7C3AED]/10" style={{ height: "20%" }}></div>
                </div>
              </div>

              {/* Habits List */}
              <div className="bg-[#0D0D0D] border border-[#1E1E2E] rounded-md p-2.5 flex flex-col gap-1.5">
                <div className="flex justify-between items-center py-1 border-b border-[#1A1A1A]">
                  <span className="text-[10px] text-white">Estudar 1h30</span>
                  <div className="w-3.5 h-3.5 bg-[#7C3AED] rounded flex items-center justify-center select-none text-white text-[8px] font-bold">
                    ✓
                  </div>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#1A1A1A]">
                  <span className="text-[10px] text-white">Treino</span>
                  <div className="w-3.5 h-3.5 bg-[#7C3AED] rounded flex items-center justify-center select-none text-white text-[8px] font-bold">
                    ✓
                  </div>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[10px] text-white">Ler ao acordar</span>
                  <div className="w-3.5 h-3.5 border border-[#2D2D2D] rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
