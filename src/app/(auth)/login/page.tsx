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
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white tracking-tight">Bem-vindo de volta</h1>
        <p className="text-gray-400 text-sm mt-1">Insira suas credenciais para acessar sua conta</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
          <input
            type="email"
            required
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            placeholder="seu@email.com"
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between ml-1">
            <label className="text-sm font-medium text-gray-300">Senha</label>
          </div>
          <input
            type="password"
            required
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            placeholder="••••••••"
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-red-500 hover:from-purple-500 hover:to-red-400 text-white font-semibold py-3 rounded-xl shadow-lg shadow-purple-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Entrando..." : "Entrar no LENS"}
        </button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-400">
          Não tem conta?{" "}
          <Link href="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
            Criar agora
          </Link>
        </p>
      </div>
    </div>
  );
}
