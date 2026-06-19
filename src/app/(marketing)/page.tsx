"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Nav from "@/components/marketing/Nav";
import HeroSection from "@/components/marketing/HeroSection";
import FeaturesGrid from "@/components/marketing/FeaturesGrid";
import HowItWorksSection from "@/components/marketing/HowItWorksSection";
import EbookSection from "@/components/marketing/EbookSection";
import Footer from "@/components/marketing/Footer";

export default function MarketingPage() {
  const handleScrollToEbook = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.getElementById("vire-a-chave");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#09090B] text-white">
      {/* 1. NAV */}
      <Nav />

      {/* 2. HERO */}
      <HeroSection />

      {/* 3. QUOTE STRIP */}
      <div className="w-full border-t border-b border-[#18181B] bg-[#09090B] py-8 px-6 md:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-12 select-none">
        <div className="text-[18px] font-medium text-white italic flex-1">
          &quot;Se as coisas continuarem assim, não vão chegar a lugar nenhum.&quot;
        </div>
        <div className="text-[11px] text-[#52525B] leading-[1.6] max-w-[280px]">
          <div>A frase que mudou tudo.</div>
          <div>O LENS é o sistema que nasceu depois.</div>
        </div>
        <div>
          <button
            onClick={handleScrollToEbook}
            className="font-mono text-[11px] text-[#7C3AED] hover:text-[#6D28D9] tracking-[0.05em] whitespace-nowrap cursor-pointer bg-transparent border-0"
          >
            VER A HISTÓRIA →
          </button>
        </div>
      </div>

      {/* 4. FEATURES GRID */}
      <FeaturesGrid />

      {/* 5. HOW IT WORKS */}
      <HowItWorksSection />

      {/* 6. EBOOK SECTION */}
      <EbookSection />

      {/* 7. FINAL CTA */}
      <section className="w-full border-t border-[#18181B] bg-[#09090B] py-[100px] px-6 md:px-12 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="max-w-[560px] mx-auto flex flex-col items-center"
        >
          <h2 className="text-[36px] md:text-[40px] font-extrabold text-white tracking-[-0.02em]">
            Pare de tentar sozinho.
          </h2>
          <p className="text-[15px] text-[#71717A] mt-3 leading-[1.6]">
            Construa o sistema que vai te levar até onde você quer chegar.
          </p>
          <motion.div whileHover={{ scale: 1.03 }} className="mt-7">
            <Link
              href="/register"
              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-8 py-3.5 rounded-lg font-medium text-[14px] inline-block transition-colors duration-150"
            >
              Criar minha conta gratuita →
            </Link>
          </motion.div>
          <span className="text-[12px] text-[#3F3F46] mt-3.5">
            Sem cartão de crédito. Comece em menos de 1 minuto.
          </span>
        </motion.div>
      </section>

      {/* 8. FOOTER */}
      <Footer />
    </div>
  );
}
