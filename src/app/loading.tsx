'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]">
      <div className="relative">
        {/* Spinner animado com gradiente */}
        <motion.div
          className="h-24 w-24 rounded-full border-t-4 border-l-4 border-transparent"
          style={{
            borderImage: 'linear-gradient(to right, #A855F7, #EF4444) 1',
            borderRadius: '50%',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Logo LENS centralizado pulsando */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span 
            className="text-2xl font-black tracking-tighter text-white"
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            LENS
          </motion.span>
        </div>
      </div>
      
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-sm font-medium tracking-widest text-zinc-500 uppercase"
      >
        Initializing Flow...
      </motion.p>
    </div>
  );
}
