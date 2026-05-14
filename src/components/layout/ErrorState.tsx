"use client";

import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface ErrorStateProps {
  error?: Error;
  reset?: () => void;
  message?: string;
}

export function ErrorState({ error, reset, message }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-20 h-20 rounded-3xl bg-red/10 border border-red/20 flex items-center justify-center mb-8 shadow-2xl shadow-red/20"
      >
        <AlertTriangle className="w-10 h-10 text-red" />
      </motion.div>

      <div className="space-y-2 mb-8">
        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">
          Falha no <span className="text-red">Sistema</span>
        </h2>
        <p className="text-text-muted text-sm max-w-xs mx-auto leading-relaxed">
          {message || error?.message || "Ocorreu um erro inesperado na sincronização da rede neural."}
        </p>
      </div>

      {reset && (
        <button
          onClick={reset}
          className="flex items-center gap-2 px-8 py-4 bg-surface-2 border border-white/5 text-white font-bold rounded-2xl hover:bg-surface-3 transition-all active:scale-95 group"
        >
          <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          Tentar novamente
        </button>
      )}
    </div>
  );
}
