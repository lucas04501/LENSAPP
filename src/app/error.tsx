'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCcw, ArrowLeft } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('System Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] p-4 text-center">
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
        className="mb-2 text-3xl font-black tracking-tight text-white"
      >
        OPS! ALGO SAIU DO <span className="text-red-500">FLOW</span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8 max-w-md text-zinc-400"
      >
        Encontramos um erro inesperado no sistema. Não se preocupe, seus dados estão seguros.
        {error.digest && (
          <span className="mt-2 block text-xs font-mono text-zinc-600">
            ID: {error.digest}
          </span>
        )}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col gap-4 sm:flex-row"
      >
        <button
          onClick={() => reset()}
          className="flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3 font-bold text-black transition-all hover:bg-zinc-200 active:scale-95"
        >
          <RefreshCcw className="h-4 w-4" />
          Tentar novamente
        </button>
        
        <Link 
          href="/"
          className="flex items-center justify-center gap-2 rounded-full border border-zinc-800 bg-transparent px-8 py-3 font-bold text-white transition-all hover:bg-zinc-900 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao início
        </Link>
      </motion.div>

      <div className="mt-16 flex items-center gap-2">
        <div className="h-1 w-1 rounded-full bg-red-500 animate-pulse" />
        <span className="text-[10px] font-black tracking-[0.3em] text-zinc-700 uppercase">
          LENS OS CRITICAL ERROR HANDLER
        </span>
      </div>
    </div>
  );
}
