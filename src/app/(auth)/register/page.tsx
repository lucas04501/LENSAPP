"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });

      if (response.ok) {
        toast.success("Conta criada com sucesso!");
        
        const callback = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (callback?.ok && !callback?.error) {
          router.push("/dashboard");
        } else {
          router.push("/login");
        }
      } else {
        const errorText = await response.text();
        toast.error(errorText || "Erro ao criar conta");
      }
    } catch (error) {
      toast.error("Ocorreu um erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-8 bg-[#09090B] selection:bg-purple-500/30">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[480px] bg-[#111113] border border-[#27272A] rounded-lg p-10 shadow-2xl"
      >
        <div className="mb-10">
          <h2 className="text-white text-2xl font-bold mb-2 tracking-tight">Create account</h2>
          <p className="text-[#71717A] text-sm font-sans">Join the LENS community and start your journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-[#A1A1AA] text-[12px] uppercase tracking-[0.05em] font-medium">Name</label>
            <input
              type="text"
              required
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              placeholder="Your Name"
              className="w-full bg-[#18181B] border border-[#3F3F46] rounded-md px-4 py-3 text-sm text-white placeholder:text-[#3F3F46] focus:outline-none focus:border-[#A855F7] transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[#A1A1AA] text-[12px] uppercase tracking-[0.05em] font-medium">Username</label>
            <input
              type="text"
              required
              value={data.username}
              onChange={(e) => setData({ ...data, username: e.target.value.toLowerCase().replace(/\s/g, "") })}
              placeholder="username"
              className="w-full bg-[#18181B] border border-[#3F3F46] rounded-md px-4 py-3 text-sm text-white placeholder:text-[#3F3F46] focus:outline-none focus:border-[#A855F7] transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[#A1A1AA] text-[12px] uppercase tracking-[0.05em] font-medium">Email</label>
            <input
              type="email"
              required
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              placeholder="email@example.com"
              className="w-full bg-[#18181B] border border-[#3F3F46] rounded-md px-4 py-3 text-sm text-white placeholder:text-[#3F3F46] focus:outline-none focus:border-[#A855F7] transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[#A1A1AA] text-[12px] uppercase tracking-[0.05em] font-medium">Password</label>
              <input
                type="password"
                required
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                placeholder="••••"
                className="w-full bg-[#18181B] border border-[#3F3F46] rounded-md px-4 py-3 text-sm text-white placeholder:text-[#3F3F46] focus:outline-none focus:border-[#A855F7] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[#A1A1AA] text-[12px] uppercase tracking-[0.05em] font-medium">Confirm</label>
              <input
                type="password"
                required
                value={data.confirmPassword}
                onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                placeholder="••••"
                className="w-full bg-[#18181B] border border-[#3F3F46] rounded-md px-4 py-3 text-sm text-white placeholder:text-[#3F3F46] focus:outline-none focus:border-[#A855F7] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#A855F7] hover:bg-[#9333EA] text-white font-medium py-3 rounded-md transition-all disabled:opacity-50 text-sm mt-4 flex items-center justify-center gap-2"
          >
            {loading ? "Processing..." : "Create account"}
            {!loading && <span className="text-lg">→</span>}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[#71717A] text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-[#71717A] underline underline-offset-4 hover:text-[#A1A1AA] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
