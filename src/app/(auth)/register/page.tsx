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
        
        // Auto sign in after registration
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
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white tracking-tight">Crie sua conta</h1>
        <p className="text-gray-400 text-sm mt-1">Junte-se à elite da produtividade</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 ml-1">Nome completo</label>
          <input
            type="text"
            required
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            placeholder="Seu Nome"
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 ml-1">Username</label>
          <input
            type="text"
            required
            value={data.username}
            onChange={(e) => setData({ ...data, username: e.target.value.toLowerCase().replace(/\s/g, "") })}
            placeholder="username"
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>

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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Senha</label>
            <input
              type="password"
              required
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              placeholder="••••••••"
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Confirmar</label>
            <input
              type="password"
              required
              value={data.confirmPassword}
              onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-red-500 hover:from-purple-500 hover:to-red-400 text-white font-semibold py-3 rounded-xl shadow-lg shadow-purple-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Criando conta..." : "Criar minha conta"}
        </button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-400">
          Já tem conta?{" "}
          <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
