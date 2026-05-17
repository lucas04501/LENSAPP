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
  const [deleteStep, setDeleteStep] = useState(0); // 0: idle, 1: confirm, 2: final confirm

  const user = session?.user as any;

  const handleDeleteAccount = async () => {
    // In a real app, call a server action to delete user data
    console.log("Deleting account for:", user.id);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 px-2 sm:px-0">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Configurações</h1>
        <p className="text-text-muted text-sm mt-1 uppercase font-bold tracking-widest">Gerencie sua conta e preferências do sistema LENS.</p>
      </div>

      {/* 1. Account Info */}
      <section className="space-y-4">
        <h2 className="text-xs font-black text-text-muted uppercase tracking-[0.2em] px-4">Informações da Conta</h2>
        <div className="glass rounded-[2rem] border border-white/5 bg-[#050505] overflow-hidden">
          <Link href="/dashboard/profile" className="flex items-center gap-4 p-6 hover:bg-white/[0.02] transition-colors group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple to-red flex items-center justify-center text-white font-black text-lg shrink-0">
              {(user?.username || user?.name || "U")[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <span className="block text-white font-bold text-lg leading-none">{user?.name || "Usuário"}</span>
              <span className="block text-text-muted text-sm mt-1">@{user?.username || "username"} • {user?.email}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-white transition-all group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* 2. Preferences */}
      <section className="space-y-4">
        <h2 className="text-xs font-black text-text-muted uppercase tracking-[0.2em] px-4">Preferências</h2>
        <div className="glass rounded-[2rem] border border-white/5 bg-[#050505] divide-y divide-white/5">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center">
                <Moon className="w-5 h-5 text-text-muted" />
              </div>
              <div>
                <span className="block text-sm font-bold text-white uppercase tracking-widest">Modo Escuro</span>
                <span className="block text-[10px] text-text-muted uppercase mt-0.5">Sempre ativo (LENS Original)</span>
              </div>
            </div>
            <div className="w-12 h-6 rounded-full bg-purple/20 border border-purple/30 p-1 flex justify-end">
              <div className="w-4 h-4 rounded-full bg-purple" />
            </div>
          </div>

          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center">
                <Bell className="w-5 h-5 text-text-muted" />
              </div>
              <div>
                <span className="block text-sm font-bold text-white uppercase tracking-widest">Notificações In-App</span>
                <span className="block text-[10px] text-text-muted uppercase mt-0.5">Alertas de hábitos e social</span>
              </div>
            </div>
            <div className="w-12 h-6 rounded-full bg-purple p-1 flex justify-end cursor-pointer">
              <div className="w-4 h-4 rounded-full bg-white shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Export Data */}
      <section className="space-y-4">
        <h2 className="text-xs font-black text-text-muted uppercase tracking-[0.2em] px-4">Portabilidade</h2>
        <ExportData />
      </section>

      {/* 4. Danger Zone */}
      <section className="space-y-4">
        <h2 className="text-xs font-black text-red uppercase tracking-[0.2em] px-4">Zona de Perigo</h2>
        <div className="glass rounded-[2rem] border border-red/10 bg-[#050505] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red/10 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6 text-red" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Excluir Conta</h3>
                <p className="text-sm text-text-muted mt-1">Isso apagará permanentemente todos os seus hábitos, conquistas e histórico social. Esta ação não pode ser desfeita.</p>
              </div>
            </div>

            <div className="shrink-0 flex flex-col gap-2">
              {deleteStep === 0 && (
                <button
                  onClick={() => setDeleteStep(1)}
                  className="px-6 py-3 rounded-xl bg-red/10 border border-red/20 text-red text-xs font-black uppercase tracking-widest hover:bg-red/20 transition-all active:scale-95"
                >
                  Excluir Conta
                </button>
              )}

              {deleteStep === 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDeleteStep(0)}
                    className="px-4 py-3 rounded-xl bg-surface-2 border border-white/5 text-text-muted text-[10px] font-black uppercase tracking-widest"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => setDeleteStep(2)}
                    className="px-6 py-3 rounded-xl bg-red text-white text-[10px] font-black uppercase tracking-widest animate-pulse"
                  >
                    Tem certeza?
                  </button>
                </div>
              )}

              {deleteStep === 2 && (
                <div className="flex flex-col gap-2 items-end">
                  <span className="text-[10px] font-black text-red uppercase tracking-widest flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Ação Irreversível
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDeleteStep(0)}
                      className="px-4 py-3 rounded-xl bg-surface-2 border border-white/5 text-text-muted text-[10px] font-black uppercase tracking-widest"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="px-6 py-3 rounded-xl bg-red text-white text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                    >
                      Confirmar Exclusão
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Logout */}
      <div className="flex justify-center pt-8">
        <button 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 px-8 py-4 rounded-full bg-surface-2 border border-white/5 text-text-muted hover:text-white hover:border-white/20 transition-all text-xs font-black uppercase tracking-widest active:scale-95"
        >
          <LogOut className="w-4 h-4" />
          Encerrar Sessão
        </button>
      </div>
    </div>
  );
}
