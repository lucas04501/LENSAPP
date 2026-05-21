"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import dynamic from "next/dynamic";

const ThreeBrain = dynamic(() => import("@/components/ThreeBrain"), { ssr: false });

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
    <div className="flex h-screen w-full bg-[#06060A] overflow-hidden selection:bg-purple-500/30">
      {/* Left Column - Visual Branding (55%) */}
      <div className="relative hidden lg:flex lg:w-[55%] h-full flex-col justify-between p-12 bg-[#06060A]">
        {/* Subtle Radial Gradient */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ 
            background: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.08) 0%, transparent 70%)' 
          }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <span className="font-mono text-[13px] font-medium tracking-[0.2em] text-white opacity-90">LENS</span>
        </div>

        {/* 3D Brain Visual */}
        <div className="absolute inset-0 z-0">
          <ThreeBrain />
        </div>

        {/* Bottom Content */}
        <div className="relative z-10 space-y-12">
          {/* Tagline */}
          <div className="flex flex-col tracking-[-0.02em]">
            <span className="text-[42px] font-light text-white opacity-40 leading-none">Master Your</span>
            <span className="text-[56px] font-extrabold text-white leading-tight">Mind.</span>
          </div>

          {/* Feature Bullets */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[11px] font-bold text-[#4B5563] uppercase tracking-widest">
              <span className="w-4 h-[1px] bg-[#4B5563]/30" />
              HABIT TRACKING WITH STREAK SYSTEM
            </div>
            <div className="flex items-center gap-3 text-[11px] font-bold text-[#4B5563] uppercase tracking-widest">
              <span className="w-4 h-[1px] bg-[#4B5563]/30" />
              XP & RANK GAMIFICATION
            </div>
            <div className="flex items-center gap-3 text-[11px] font-bold text-[#4B5563] uppercase tracking-widest">
              <span className="w-4 h-[1px] bg-[#4B5563]/30" />
              DEEP WORK FOCUS TIMER
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Form (45%) */}
      <div className="w-full lg:w-[45%] h-full flex flex-col items-center justify-center p-8 bg-[#09090D] border-l border-[#111118]">
        <div className="w-full max-w-[340px] flex flex-col h-full justify-center">
          <div className="mb-7">
            <h2 className="text-white text-[26px] font-semibold tracking-[-0.01em]">Sign in</h2>
            <p className="text-[#6B7280] text-[14px] mt-1">Enter your credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-[#9CA3AF] text-[11px] font-bold uppercase tracking-[0.08em]">
                Email
              </label>
              <input
                type="email"
                required
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                placeholder="Email address"
                className="w-full h-11 bg-[#0F0F14] border border-[#1E1E2E] rounded-md px-[14px] text-[14px] text-white placeholder:text-[#3D3D4A] focus:outline-none focus:border-[#7C3AED] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[#9CA3AF] text-[11px] font-bold uppercase tracking-[0.08em]">
                Password
              </label>
              <input
                type="password"
                required
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                placeholder="••••••••"
                className="w-full h-11 bg-[#0F0F14] border border-[#1E1E2E] rounded-md px-[14px] text-[14px] text-white placeholder:text-[#3D3D4A] focus:outline-none focus:border-[#7C3AED] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-medium rounded-md transition-all disabled:opacity-50 text-[14px] mt-2 flex items-center justify-center gap-1 group"
            >
              {loading ? "Processing..." : (
                <>
                  Continue
                  <span className="text-[16px] transition-transform group-hover:translate-x-1">→</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#6B7280] text-[13px]">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#7C3AED] hover:text-[#6D28D9] transition-colors font-medium">
                Register
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pb-8">
          <span className="text-[11px] text-[#2D2D3A] font-medium tracking-wider uppercase">© 2026 LENS CORE</span>
        </div>
      </div>
    </div>
  );
}
