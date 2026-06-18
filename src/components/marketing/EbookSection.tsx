"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function EbookSection() {
  return (
    <section id="vire-a-chave" className="relative py-24 lg:py-32 bg-[#09090B] px-6">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        
        {/* Left Column: Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1 space-y-6"
        >
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.15em] text-[#EF4444] font-bold">
              A ORIGEM
            </span>
            <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
              LENS nasceu de um e-book
            </h2>
          </div>
          
          <p className="text-[15px] text-[#A1A1AA] leading-relaxed">
            Antes de ser um app, Vire a Chave foi um e-book sobre neurociência dos hábitos, disciplina e como sair do loop que prende tanta gente. O LENS é o sistema prático que nasceu dessa mesma jornada — a ferramenta que eu gostaria de ter tido quando comecei.
          </p>
          
          <div className="border-l-2 border-[#7C3AED] pl-4 py-1">
            <p className="text-[14px] text-[#D4D4D8] italic leading-relaxed">
              &quot;Se as coisas continuarem assim, não vão chegar a lugar nenhum. Essa frase mudou minha trajetória.&quot;
            </p>
          </div>
          
          <div className="pt-4">
            <a href="https://vire-a-chave.vercel.app" target="_blank" rel="noopener noreferrer">
              <Button 
                variant="outline" 
                className="border-[#27272A] bg-transparent hover:bg-[#111111] text-white px-8 py-6 rounded-lg font-semibold transition-all"
              >
                Conhecer o e-book →
              </Button>
            </a>
          </div>
        </motion.div>

        {/* Right Column: Book Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 flex justify-center items-center relative"
        >
          {/* Soft Radial Glow */}
          <div className="absolute w-64 h-64 bg-[#7C3AED]/20 blur-[100px] rounded-full pointer-events-none" />
          
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            {/* 3D Book Container */}
            <div 
              className="w-64 h-96 bg-[#0D0D0D] border border-[#27272A] rounded-r-lg shadow-[20px_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-between py-12 px-6"
              style={{ 
                transform: "perspective(1000px) rotateY(-8deg)",
                transformStyle: "preserve-3d"
              }}
            >
              {/* Book Spine Detail */}
              <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/40 to-transparent rounded-l-sm" />
              
              <div className="mt-12 text-center">
                <h3 className="text-3xl font-bold text-white tracking-tighter leading-none" style={{ fontFamily: "serif" }}>
                  Vire a <br /> Chave
                </h3>
              </div>
              
              <div className="w-12 h-0.5 bg-[#7C3AED] mb-8" />
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
