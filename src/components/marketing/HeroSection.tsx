"use client";

import React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { TextEffect } from "@/components/ui/text-effect";
import { motion } from "framer-motion";

export function HeroSection() {
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-80px)] mt-20 flex flex-col items-center justify-center px-6 overflow-hidden bg-[#09090B]">
      {/* Radial Gradient Glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 30%, rgba(124,58,237,0.12), transparent 60%)"
        }}
      />

      <div className="relative z-10 max-w-[800px] w-full flex flex-col items-center text-center">
        {/* Neuro Pill Badge */}
        <AnimatedGroup preset="blur-slide" className="mb-8">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#27272A] bg-[#09090B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
            <span className="text-[12px] text-[#A1A1AA] font-medium tracking-tight">
              Baseado em neurociência real
            </span>
          </div>
        </AnimatedGroup>

        {/* Headline */}
        <div className="flex flex-col gap-1 mb-6">
          <TextEffect 
            preset="blur" 
            per="word"
            className="text-[clamp(40px,8vw,64px)] font-light text-[#71717A] tracking-tighter leading-none"
          >
            Master Your
          </TextEffect>
          <TextEffect 
            preset="blur" 
            per="word" 
            delay={0.3}
            className="text-[clamp(48px,10vw,80px)] font-extrabold text-white tracking-tighter leading-none"
          >
            Mind.
          </TextEffect>
        </div>

        {/* Subtitle */}
        <AnimatedGroup preset="slide" stagger={0.2} className="mb-10">
          <p className="text-[16px] text-[#A1A1AA] max-w-[480px] leading-relaxed font-medium">
            Hábitos, foco e disciplina em um único sistema. Construído a partir de uma transformação real — não de teoria.
          </p>
        </AnimatedGroup>

        {/* CTA Row */}
        <AnimatedGroup preset="scale" className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link href="/register">
            <Button 
              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-8 py-7 rounded-lg font-semibold text-base transition-all hover:-translate-y-0.5 shadow-xl shadow-[#7C3AED]/20"
            >
              Começar agora →
            </Button>
          </Link>
          <Button 
            variant="ghost"
            onClick={() => handleScrollTo("how-it-works")}
            className="text-white border border-[#27272A] bg-transparent hover:bg-[#111111] px-8 py-7 rounded-lg font-semibold text-base transition-all"
          >
            Ver como funciona
          </Button>
        </AnimatedGroup>

        {/* Feature Bullets */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-12">
          {[
            "Rastreamento de hábitos com streak",
            "Gamificação com XP e ranks",
            "Timer de foco profundo"
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[#52525B] text-[11px] font-bold uppercase tracking-widest">
                — {feature}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 text-[#52525B] cursor-pointer"
        onClick={() => handleScrollTo("how-it-works")}
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  );
}
