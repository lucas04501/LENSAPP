"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const callback = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (callback?.error) {
        toast.error("Credenciais inválidas");
      }

      if (callback?.ok && !callback?.error) {
        toast.success("Login realizado com sucesso!");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao entrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen selection:bg-purple-500/30">
      {/* Left Column - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-20 border-r border-[#1B1B1F] bg-[#09090B]">
        <div>
          <h1 className="text-white text-xl font-mono tracking-tighter">LENS</h1>
        </div>
        
        <div className="max-w-md">
          <p className="text-[18px] text-[#52525B] italic font-serif leading-relaxed mb-10" style={{ fontFamily: 'Georgia, serif' }}>
            &quot;Discipline is the bridge between goals and accomplishment.&quot;
          </p>
          
          <ul className="space-y-5 text-[12px] font-mono uppercase tracking-[0.1em] text-[#3F3F46]">
            <li className="flex items-center gap-4">
              <span className="text-[#27272A]">—</span>
              Habit tracking with streak system
            </li>
            <li className="flex items-center gap-4">
              <span className="text-[#27272A]">—</span>
              XP & rank gamification
            </li>
            <li className="flex items-center gap-4">
              <span className="text-[#27272A]">—</span>
              Deep work focus timer
            </li>
          </ul>
        </div>

        <div className="text-[10px] text-[#27272A] font-mono uppercase tracking-widest">
          © 2026 LENS CORE
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#09090B]">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-[440px] bg-[#111113] border border-[#27272A] rounded-lg p-10 shadow-2xl"
        >
          <div className="mb-10">
            <h2 className="text-white text-2xl font-bold mb-2 tracking-tight">Sign in</h2>
            <p className="text-[#71717A] text-sm font-sans">Enter your credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[#A1A1AA] text-[12px] uppercase tracking-[0.05em] font-medium">
                Email
              </label>
              <input
                type="email"
                required
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                placeholder="email@example.com"
                className="w-full bg-[#18181B] border border-[#3F3F46] rounded-md px-4 py-3 text-sm text-white placeholder:text-[#3F3F46] focus:outline-none focus:border-[#A855F7] transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[#A1A1AA] text-[12px] uppercase tracking-[0.05em] font-medium">
                Password
              </label>
              <input
                type="password"
                required
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-[#18181B] border border-[#3F3F46] rounded-md px-4 py-3 text-sm text-white placeholder:text-[#3F3F46] focus:outline-none focus:border-[#A855F7] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#A855F7] hover:bg-[#9333EA] text-white font-medium py-3 rounded-md transition-all disabled:opacity-50 text-sm mt-2 flex items-center justify-center gap-2"
            >
              {loading ? "Processing..." : "Continue"}
              {!loading && <span className="text-lg">→</span>}
            </button>
          </form>

          <div className="mt-10 text-center">
            <Link 
              href="/register" 
              className="text-[#71717A] text-sm hover:text-[#A1A1AA] transition-colors"
            >
              Don&apos;t have an account? <span className="underline underline-offset-4 text-[#71717A]">Register</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
