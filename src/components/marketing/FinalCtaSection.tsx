"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/ui/text-effect";

export function FinalCtaSection() {
  return (
    <section id="cta" className="relative py-32 lg:py-48 bg-[#09090B] px-6 overflow-hidden">
      {/* Pronounced Glow Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(124,58,237,0.15) 0%, rgba(239,68,68,0.05) 40%, transparent 70%)"
        }}
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-[600px] mx-auto text-center flex flex-col items-center"
      >
        <TextEffect 
          preset="blur" 
          per="word"
          className="text-4xl lg:text-5xl font-extrabold text-white tracking-tighter leading-tight"
        >
          Pare de tentar sozinho.
        </TextEffect>
        
        <p className="mt-6 text-base lg:text-lg text-[#A1A1AA] leading-relaxed max-w-[480px]">
          Construa o sistema que vai te levar até onde você quer chegar.
        </p>

        <div className="mt-12 flex flex-col items-center gap-4 w-full">
          <Link href="/register" className="w-full sm:w-auto">
            <Button 
              className="w-full sm:w-auto bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-10 py-8 rounded-xl font-bold text-lg transition-all hover:scale-[1.03] shadow-[0_8px_40px_rgba(124,58,237,0.4)]"
            >
              Criar minha conta gratuita →
            </Button>
          </Link>
          
          <p className="text-[12px] text-[#52525B] font-medium uppercase tracking-wider">
            Sem cartão de crédito. Comece em menos de 1 minuto.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
