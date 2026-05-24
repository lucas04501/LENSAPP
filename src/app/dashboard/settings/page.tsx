'use client';

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { 
  User, Mail, ShieldAlert, Bell, Moon, 
  ChevronRight, LogOut, Trash2, AlertTriangle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ExportData } from "@/components/settings/ExportData";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [deleteStep, setDeleteStep] = useState(0);

  const user = session?.user as any;

  const handleDeleteAccount = async () => {
    console.log("Deleting account for:", user.id);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12 py-10 px-4">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-white tracking-tight">Configurações</h1>
        <p className="text-zinc-500 text-xs uppercase tracking-widest font-medium">Conta & Preferências</p>
      </div>

      {/* 1. Account Info */}
      <section className="space-y-6">
        <div className="flex items-center justify-between group cursor-pointer border-b border-white/5 pb-6">
          <Link href="/dashboard/profile" className="flex items-center gap-4 flex-1">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 font-bold text-sm">
              {(user?.username || user?.name || "U")[0].toUpperCase()}
            </div>
            <div>
              <span className="block text-zinc-200 font-bold text-sm leading-none">{user?.name || "Usuário"}</span>
              <span className="block text-zinc-500 text-[10px] mt-1 uppercase tracking-wider font-mono">@{user?.username || "username"}</span>
            </div>
          </Link>
          <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-all" />
        </div>
      </section>

      {/* 2. Preferences */}
      <section className="space-y-6">
        <h2 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Sistema</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-4">
              <Moon className="w-4 h-4 text-zinc-500" />
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Modo Escuro</span>
            </div>
            <span className="text-[9px] text-zinc-600 uppercase font-black">Ativo</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-4">
              <Bell className="w-4 h-4 text-zinc-500" />
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Notificações</span>
            </div>
            <div className="w-8 h-4 rounded-full bg-purple-500/20 border border-purple-500/40 p-0.5 flex justify-end">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Export Data */}
      <section className="space-y-6 pt-4">
        <h2 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Dados</h2>
        <ExportData />
      </section>

      {/* 4. Danger Zone */}
      <section className="pt-10 space-y-6 border-t border-red-500/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest">Excluir Conta</h3>
            <p className="text-[10px] text-zinc-500 leading-relaxed max-w-sm">Esta ação apagará permanentemente todos os seus dados. O processo é irreversível.</p>
          </div>

          <div className="shrink-0">
            {deleteStep === 0 && (
              <button
                onClick={() => setDeleteStep(1)}
                className="px-4 py-2 rounded-lg bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 transition-all"
              >
                Remover Conta
              </button>
            )}

            {deleteStep > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDeleteStep(0)}
                  className="px-3 py-2 rounded-lg bg-zinc-900 text-zinc-500 text-[9px] font-bold uppercase tracking-widest"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white text-[9px] font-bold uppercase tracking-widest"
                >
                  {deleteStep === 1 ? "Confirmar?" : "Excluir Agora"}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Logout */}
      <div className="flex justify-center pt-20">
        <button 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 hover:text-zinc-200 uppercase tracking-[0.3em] transition-all"
        >
          <LogOut className="w-3 h-3" />
          Encerrar Sessão
        </button>
      </div>
    </div>
  );
}
