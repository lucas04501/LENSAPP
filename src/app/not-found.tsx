"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col items-center text-center space-y-8"
      >
        <div className="relative">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple to-red flex items-center justify-center p-1 shadow-2xl shadow-purple/20"
          >
            <div className="w-full h-full bg-[#050505] rounded-[22px] flex items-center justify-center">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          <div className="absolute -bottom-2 -right-2 bg-red text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-xl uppercase italic">
            Erro 404
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">
            Conexão <span className="text-purple">Perdida</span>
          </h1>
          <p className="text-text-muted text-sm max-w-xs mx-auto">
            Essa página não existe na rede neural do LENS ou foi removida para otimização.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/dashboard">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-purple text-white font-bold rounded-2xl hover:bg-purple/80 transition-all active:scale-95 shadow-xl shadow-purple/20">
              <Home className="w-4 h-4" />
              Dashboard
            </button>
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-surface-2 border border-white/5 text-white font-bold rounded-2xl hover:bg-surface-3 transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>
      </motion.div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
    </div>
  );
}
