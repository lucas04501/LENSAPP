"use client";

import React from "react";
import Link from "next/link";

export function MarketingFooter() {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-[#09090B] border-t border-[#18181B] pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24 mb-16">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="font-mono text-white tracking-[0.1em] text-lg font-bold">
              <span className="text-[#7C3AED]">•</span> LENS
            </div>
            <p className="text-[13px] text-[#52525B] font-medium leading-relaxed max-w-[200px]">
              Construa hábitos. Domine sua mente.
            </p>
          </div>

          {/* Column 2: Produto */}
          <div className="space-y-6">
            <h4 className="text-[12px] uppercase tracking-widest text-white font-bold">Produto</h4>
            <nav className="flex flex-col gap-4">
              <a 
                href="#features" 
                onClick={(e) => handleScrollTo(e, "features")}
                className="text-[13px] text-[#71717A] hover:text-white transition-colors"
              >
                Recursos
              </a>
              <a 
                href="#how-it-works" 
                onClick={(e) => handleScrollTo(e, "how-it-works")}
                className="text-[13px] text-[#71717A] hover:text-white transition-colors"
              >
                Como funciona
              </a>
              <a 
                href="#vire-a-chave" 
                onClick={(e) => handleScrollTo(e, "vire-a-chave")}
                className="text-[13px] text-[#71717A] hover:text-white transition-colors"
              >
                Vire a Chave
              </a>
            </nav>
          </div>

          {/* Column 3: Conta */}
          <div className="space-y-6">
            <h4 className="text-[12px] uppercase tracking-widest text-white font-bold">Conta</h4>
            <nav className="flex flex-col gap-4">
              <Link href="/login" className="text-[13px] text-[#71717A] hover:text-white transition-colors">
                Entrar
              </Link>
              <Link href="/register" className="text-[13px] text-[#71717A] hover:text-white transition-colors">
                Criar conta
              </Link>
            </nav>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#18181B] pt-8 flex flex-col items-center justify-center">
          <p className="text-[11px] text-[#3F3F46] font-medium tracking-wider uppercase">
            © {new Date().getFullYear()} LENS. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
