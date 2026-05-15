"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

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
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase italic tracking-tighter">Bem-vindo</h1>
        <p className="text-text-muted text-xs sm:text-sm mt-1 uppercase font-bold tracking-widest">Elite da Produtividade</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Acesso</label>
          <input
            type="email"
            required
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            placeholder="seu@email.com"
            className="w-full bg-surface-2 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white placeholder:text-text-muted/30 focus:outline-none focus:border-purple/50 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Senha</label>
          <input
            type="password"
            required
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            placeholder="••••••••"
            className="w-full bg-surface-2 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white placeholder:text-text-muted/30 focus:outline-none focus:border-purple/50 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple to-red hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] text-white font-black py-4 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 uppercase tracking-[0.2em] text-xs"
        >
          {loading ? "Entrando..." : "Entrar no LENS"}
        </button>
      </form>

      <div className="text-center">
        <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
          Não tem conta?{" "}
          <Link href="/register" className="text-purple hover:text-purple-light transition-colors">
            Criar agora
          </Link>
        </p>
      </div>
    </div>
  );
}
