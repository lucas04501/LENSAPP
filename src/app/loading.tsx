"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#050505] z-[9999] flex flex-col items-center justify-center gap-6">
      <div className="relative w-20 h-20">
        {/* Spinner rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-purple/10 border-t-purple shadow-[0_0_20px_rgba(168,85,247,0.3)]"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border-2 border-red/10 border-t-red shadow-[0_0_20px_rgba(239,68,68,0.2)]"
        />
        
        {/* Core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-4 h-4 bg-white rounded-full blur-[2px]"
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-1"
      >
        <p className="text-xs font-black text-white uppercase tracking-[0.4em] italic">Carregando</p>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-1 h-1 bg-purple rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
