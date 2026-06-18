"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Como funciona", href: "#how-it-works" },
  { name: "Recursos", href: "#features" },
  { name: "Vire a Chave", href: "#cta" },
];

export function MarketingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const id = href.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setIsMobileMenuOpen(false);
      }
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled
          ? "bg-[#09090B]/80 backdrop-blur-lg border-b border-[#1A1A1A]"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="font-mono text-white tracking-[0.1em] text-lg font-bold flex items-center gap-2">
          <span className="text-[#7C3AED]">•</span> LENS
        </Link>

        {/* Center: Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="text-[13px] text-[#9CA3AF] hover:text-white transition-colors uppercase tracking-wider font-medium"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-white hover:bg-[#111111] border border-[#1E1E2E] h-10 px-6 rounded-xl text-sm"
              >
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white h-10 px-6 rounded-xl text-sm transition-all shadow-lg shadow-[#7C3AED]/20">
                Criar conta
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-[#9CA3AF] hover:text-white p-2"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-[#09090B] z-[60] flex flex-col p-8 md:hidden"
          >
            <div className="flex items-center justify-between mb-12">
              <div className="font-mono text-white tracking-[0.1em] text-lg font-bold">
                <span className="text-[#7C3AED]">•</span> LENS
              </div>
              <button
                className="text-[#9CA3AF] hover:text-white p-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col gap-8 mb-auto">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className="text-2xl text-[#9CA3AF] hover:text-white transition-colors font-semibold"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            <div className="flex flex-col gap-4 mt-auto">
              <Link href="/login" className="w-full">
                <Button
                  variant="ghost"
                  className="w-full text-white hover:bg-[#111111] border border-[#1E1E2E] h-14 rounded-xl text-base"
                >
                  Entrar
                </Button>
              </Link>
              <Link href="/register" className="w-full">
                <Button className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white h-14 rounded-xl text-base font-semibold">
                  Criar conta
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
