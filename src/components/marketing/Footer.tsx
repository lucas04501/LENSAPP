"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#18181B] bg-[#09090B] flex flex-col md:flex-row justify-between items-center px-10 py-6 md:py-5 gap-4">
      {/* LEFT */}
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
        <span className="font-mono text-[12px] font-semibold tracking-[0.1em] text-white">
          LENS
        </span>
      </div>

      {/* CENTER */}
      <div className="flex flex-wrap justify-center gap-6">
        <a
          href="#how-it-works"
          className="text-[12px] text-[#52525B] hover:text-white transition-colors duration-150"
        >
          Como funciona
        </a>
        <a
          href="#features"
          className="text-[12px] text-[#52525B] hover:text-white transition-colors duration-150"
        >
          Recursos
        </a>
        <Link
          href="/login"
          className="text-[12px] text-[#52525B] hover:text-white transition-colors duration-150"
        >
          Entrar
        </Link>
        <Link
          href="/register"
          className="text-[12px] text-[#52525B] hover:text-white transition-colors duration-150"
        >
          Criar conta
        </Link>
      </div>

      {/* RIGHT */}
      <div className="text-[11px] text-[#3F3F46] font-mono">
        © 2026 LENS
      </div>
    </footer>
  );
}
