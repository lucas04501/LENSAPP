"use client";

import { motion } from "framer-motion";

export default function EbookSection() {
  return (
    <section
      id="vire-a-chave"
      className="w-full grid grid-cols-1 md:grid-cols-[55%_45%] border-t border-[#18181B] bg-[#09090B]"
    >
      {/* LEFT COLUMN */}
      <div className="p-6 md:p-[64px_48px] flex flex-col justify-center border-b md:border-b-0 md:border-r border-[#18181B]">
        <span className="text-[10px] tracking-[0.15em] text-[#EF4444] font-mono">
          A ORIGEM
        </span>
        <h2 className="text-[28px] font-medium text-white mt-4 mb-4 leading-tight">
          LENS nasceu de um e-book
        </h2>
        <p className="text-[14px] text-[#71717A] leading-[1.75] mb-6">
          Antes de ser um app, Vire a Chave foi um guia sobre neurociência dos
          hábitos, disciplina e como sair do loop que prende tanta gente. O LENS
          é o sistema prático que nasceu dessa mesma jornada.
        </p>
        <div className="border-l-2 border-[#7C3AED] pl-4 text-[14px] italic text-[#A1A1AA] leading-[1.65] mb-6">
          &quot;Se as coisas continuarem assim, não vão chegar a lugar nenhum.&quot;
        </div>
        <div>
          <a
            href="https://vire-a-chave.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-[rgba(124,58,237,0.35)] text-[#7C3AED] hover:bg-[#7C3AED]/5 px-[18px] py-2 rounded-md font-mono text-[12px] tracking-[0.05em] inline-flex items-center transition-colors duration-150"
          >
            CONHECER O E-BOOK →
          </a>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="p-12 md:p-[64px_48px] bg-[#0A0A0A] flex items-center justify-center">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-[140px] h-[196px] select-none"
        >
          {/* Main Book Cover Rect */}
          <div className="w-[140px] h-[196px] bg-[#0D0D0D] border border-[#27272A] rounded-[3px] overflow-hidden flex flex-col items-center justify-center shadow-none">
            {/* Spine Strip */}
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-[rgba(124,58,237,0.5)]"></div>

            {/* Title */}
            <div className="text-[18px] font-bold text-white text-center leading-[1.2] px-3 ml-2">
              Vire a <br /> Chave
            </div>

            {/* Accent Line */}
            <div className="w-10 h-[2px] bg-[#7C3AED] mt-3.5 mx-auto ml-2"></div>

            {/* Sub-label */}
            <div className="font-mono text-[8px] text-[#52525B] tracking-[0.1em] mt-3.5 text-center ml-2">
              E-BOOK PREMIUM
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
