'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Quote as QuoteIcon, Copy, Check } from "lucide-react";
import { getQuoteOfTheDay, Quote } from "@/lib/quotes";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export function DailyQuote() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setQuote(getQuoteOfTheDay());
  }, []);

  const handleCopy = () => {
    if (!quote) return;
    navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`);
    setCopied(true);
    toast.success("Frase copiada!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!quote) return null;

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 10,
    },
  };

  return (
    <div className="relative glass rounded-[2rem] border border-white/5 p-6 sm:p-8 bg-[#050505] overflow-hidden group">
      {/* Decorative Quotes */}
      <QuoteIcon className="absolute -top-4 -left-4 w-24 h-24 text-purple opacity-[0.03] -rotate-12" />
      <QuoteIcon className="absolute -bottom-4 -right-4 w-24 h-24 text-purple opacity-[0.03] rotate-12" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className={cn(
            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border",
            quote.category === "Disciplina" && "bg-gold/10 border-gold/20 text-gold",
            quote.category === "Neurociência" && "bg-purple/10 border-purple/20 text-purple",
            quote.category === "Mindset" && "bg-red/10 border-red/20 text-red"
          )}>
            {quote.category}
          </span>
          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-text-muted hover:text-white"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-x-[0.3em] gap-y-1"
        >
          {quote.text.split(" ").map((word, i) => (
            <motion.span
              key={i}
              variants={child}
              className="text-lg sm:text-xl font-medium text-white italic font-syne"
            >
              {word}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-4 flex justify-end"
        >
          <span className="text-xs sm:text-sm font-bold text-text-muted italic">
            — {quote.author}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
