'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Ghost, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] p-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8"
      >
        <div className="relative inline-block">
          <span className="text-9xl font-black tracking-tighter text-white opacity-10">404</span>
          <div className="absolute inset-0 flex items-center justify-center">
            <Ghost className="h-16 w-16 text-purple-500" />
          </div>
        </div>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-2 text-2xl font-bold text-white"
      >
        Essa página está em <span className="text-purple-500 italic">Ghost Mode</span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8 max-w-md text-zinc-400"
      >
        O conteúdo que você procura desapareceu no vácuo ou nunca existiu. 
        Mantenha o foco no que importa.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Link 
          href="/dashboard"
          className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-white px-8 py-3 font-bold text-black transition-all hover:pr-10 active:scale-95"
        >
          <Home className="h-4 w-4" />
          <span>Voltar ao Dashboard</span>
          <div className="absolute right-4 translate-x-4 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
            →
          </div>
        </Link>
      </motion.div>

      <div className="mt-12">
        <span className="text-xs font-black tracking-[0.2em] text-zinc-800 uppercase">
          LENS OS // SYSTEM ERROR
        </span>
      </div>
    </div>
  );
}
