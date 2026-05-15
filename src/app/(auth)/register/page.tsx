"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";

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
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase italic tracking-tighter">Criar Conta</h1>
        <p className="text-text-muted text-xs sm:text-sm mt-1 uppercase font-bold tracking-widest">Junte-se à Elite da Produtividade</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Identidade</label>
          <input
            type="text"
            required
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            placeholder="Seu Nome Real"
            className="w-full bg-surface-2 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white placeholder:text-text-muted/30 focus:outline-none focus:border-purple/50 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Codinome</label>
          <input
            type="text"
            required
            value={data.username}
            onChange={(e) => setData({ ...data, username: e.target.value.toLowerCase().replace(/\s/g, "") })}
            placeholder="username"
            className="w-full bg-surface-2 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white placeholder:text-text-muted/30 focus:outline-none focus:border-purple/50 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Contato</label>
          <input
            type="email"
            required
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            placeholder="seu@email.com"
            className="w-full bg-surface-2 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white placeholder:text-text-muted/30 focus:outline-none focus:border-purple/50 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Senha</label>
            <input
              type="password"
              required
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              placeholder="••••"
              className="w-full bg-surface-2 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white placeholder:text-text-muted/30 focus:outline-none focus:border-purple/50 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Confirmar</label>
            <input
              type="password"
              required
              value={data.confirmPassword}
              onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
              placeholder="••••"
              className="w-full bg-surface-2 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white placeholder:text-text-muted/30 focus:outline-none focus:border-purple/50 transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple to-red hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] text-white font-black py-4 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 uppercase tracking-[0.2em] text-xs mt-2"
        >
          {loading ? "Processando..." : "Criar Minha Identidade"}
        </button>
      </form>

      <div className="text-center">
        <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
          Já faz parte?{" "}
          <Link href="/login" className="text-purple hover:text-purple-light transition-colors">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
