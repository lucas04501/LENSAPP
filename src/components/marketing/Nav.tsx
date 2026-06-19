"use client";

import Link from "next/link";

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[52px] bg-[#09090B]/85 backdrop-blur-[12px] border-b border-[#18181B] flex justify-between items-center px-8">
      {/* LEFT */}
      <Link href="/" className="flex items-center gap-2 group">
        <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
        <span className="font-mono text-[13px] font-medium tracking-widest text-white">
          LENS
        </span>
      </Link>

      {/* CENTER */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6">
        <a
          href="#how-it-works"
          className="text-[12px] text-[#71717A] hover:text-white transition-colors duration-150"
        >
          Como funciona
        </a>
        <a
          href="#features"
          className="text-[12px] text-[#71717A] hover:text-white transition-colors duration-150"
        >
          Recursos
        </a>
        <a
          href="#vire-a-chave"
          className="text-[12px] text-[#71717A] hover:text-white transition-colors duration-150"
        >
          Vire a Chave
        </a>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-[12px] text-[#A1A1AA] hover:text-white transition-colors duration-150"
        >
          Entrar
        </Link>
        <Link
          href="/register"
          className="text-[12px] bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-4 py-1.5 rounded-md transition-colors duration-150 font-medium"
        >
          Criar conta
        </Link>
      </div>
    </nav>
  );
}
