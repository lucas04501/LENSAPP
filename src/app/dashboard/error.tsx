'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCcw, ArrowLeft } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#050505] p-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10"
      >
        <AlertCircle className="h-10 w-10 text-red-500" />
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-2 text-2xl font-black tracking-tight text-white uppercase italic"
      >
        Algo deu errado nessa seção
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8 max-w-md text-sm text-text-muted"
      >
        Não conseguimos carregar os dados desta parte do sistema. 
        Tente atualizar ou volte para o dashboard principal.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col gap-4 sm:flex-row"
      >
        <button
          onClick={() => reset()}
          className="flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3 font-bold text-black transition-all hover:bg-zinc-200 active:scale-95 text-xs uppercase tracking-widest"
        >
          <RefreshCcw className="w-4 h-4" />
          Tentar novamente
        </button>
        
        <Link 
          href="/dashboard"
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-transparent px-8 py-3 font-bold text-white transition-all hover:bg-white/5 active:scale-95 text-xs uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao início
        </Link>
      </motion.div>

      <div className="mt-16 flex items-center gap-2">
        <div className="h-1 w-1 rounded-full bg-red-500 animate-pulse" />
        <span className="text-[10px] font-black tracking-[0.3em] text-zinc-800 uppercase">
          LENS OS ERROR HANDLER
        </span>
      </div>
    </div>
  );
}
