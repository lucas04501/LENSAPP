"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Edit2, User, AtSign, AlignLeft } from "lucide-react";
import { updateProfile } from "@/lib/actions/user";
import { toast } from "react-hot-toast";

interface EditProfileModalProps {
  user: {
    id: string;
    name: string;
    username: string;
    bio: string | null;
  };
}

export function EditProfileModal({ user }: EditProfileModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: user.name,
    username: user.username,
    bio: user.bio || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(user.id, data);
      toast.success("Perfil atualizado! ✨");
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-2 border border-white/5 text-xs font-bold text-text-muted hover:text-white hover:border-white/20 transition-all">
          <Edit2 className="w-3.5 h-3.5" />
          <span>Editar Perfil</span>
        </button>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-2xl z-50 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white uppercase italic tracking-tighter">Editar Perfil</h2>
            <Dialog.Close asChild>
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-text-muted">
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Nome</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  required
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  className="w-full bg-surface-2 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Username</label>
              <div className="relative">
                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  required
                  value={data.username}
                  onChange={(e) => setData({ ...data, username: e.target.value.toLowerCase().replace(/\s/g, "") })}
                  className="w-full bg-surface-2 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Bio</label>
              <div className="relative">
                <AlignLeft className="absolute left-4 top-3 w-4 h-4 text-text-muted" />
                <textarea
                  value={data.bio}
                  onChange={(e) => setData({ ...data, bio: e.target.value })}
                  rows={3}
                  className="w-full bg-surface-2 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple/50 transition-all resize-none"
                  placeholder="Conte um pouco sobre você..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-red-500 hover:from-purple-500 hover:to-red-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-500/20 transition-all active:scale-[0.98] disabled:opacity-50 mt-2 uppercase tracking-widest text-xs"
            >
              {loading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
