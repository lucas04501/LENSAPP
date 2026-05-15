"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Target, Calendar, Zap, AlignLeft, Briefcase } from "lucide-react";
import { createGoal } from "@/lib/actions/goals";
import { toast } from "react-hot-toast";
import { addDays, format, isBefore, isAfter } from "date-fns";

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const CATEGORIES = ["WORK", "HEALTH", "MIND", "SOCIAL", "FINANCE", "CREATIVE", "OTHER"];

export function AddGoalModal({ isOpen, onClose, userId }: AddGoalModalProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    category: "WORK",
    targetDate: format(addDays(new Date(), 90), "yyyy-MM-dd"),
    xpReward: 100,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const targetDate = new Date(data.targetDate);
    const minDate = addDays(new Date(), 6); // at least 7 days (including today)
    const maxDate = addDays(new Date(), 366);

    if (isBefore(targetDate, minDate)) {
      return toast.error("A meta deve ter pelo menos 7 dias de duração.");
    }
    if (isAfter(targetDate, maxDate)) {
      return toast.error("A meta não pode exceder 365 dias.");
    }

    setLoading(true);
    try {
      const res = await createGoal({
        ...data,
        targetDate: new Date(data.targetDate),
      }, userId);

      if (res.success) {
        toast.success("Meta definida! Vá em frente. ✨");
        onClose();
        setData({
          title: "",
          description: "",
          category: "WORK",
          targetDate: format(addDays(new Date(), 90), "yyyy-MM-dd"),
          xpReward: 100,
        });
      } else {
        toast.error(res.error || "Erro ao criar meta");
      }
    } catch (error) {
      toast.error("Erro ao processar requisição");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-200" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#111111] border border-white/10 rounded-3xl p-6 shadow-2xl z-[101] animate-in zoom-in-95 duration-200 overflow-hidden">
          
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple/10 blur-3xl rounded-full" />
          
          <div className="flex items-center justify-between mb-8 relative">
            <div>
              <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Nova Meta</h2>
              <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mt-1">Defina o seu norte para os próximos 90 dias</p>
            </div>
            <Dialog.Close asChild>
              <button className="p-2 hover:bg-white/5 rounded-xl transition-colors text-text-muted">
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative">
            {/* Título */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">O que você quer alcançar?</label>
              <div className="relative">
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Aprender Next.js 14 do zero"
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  className="w-full bg-surface-2 border border-white/5 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple/50 transition-all placeholder:text-text-muted/30"
                />
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Detalhes (opcional)</label>
              <div className="relative">
                <AlignLeft className="absolute left-4 top-3 w-4 h-4 text-text-muted" />
                <textarea
                  value={data.description}
                  onChange={(e) => setData({ ...data, description: e.target.value })}
                  rows={2}
                  placeholder="Como você vai saber que conseguiu?"
                  className="w-full bg-surface-2 border border-white/5 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple/50 transition-all resize-none placeholder:text-text-muted/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Categoria */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Categoria</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                  <select
                    value={data.category}
                    onChange={(e) => setData({ ...data, category: e.target.value })}
                    className="w-full bg-surface-2 border border-white/5 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple/50 transition-all appearance-none cursor-pointer"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Data Alvo */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Data Alvo</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={data.targetDate}
                    onChange={(e) => setData({ ...data, targetDate: e.target.value })}
                    className="w-full bg-surface-2 border border-white/5 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple/50 transition-all [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            {/* XP Reward */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Recompensa (XP)</label>
              <div className="relative">
                <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple" />
                <input
                  type="number"
                  required
                  min={50}
                  max={1000}
                  step={50}
                  value={data.xpReward}
                  onChange={(e) => setData({ ...data, xpReward: parseInt(e.target.value) })}
                  className="w-full bg-surface-2 border border-white/5 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple/50 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple to-red hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] text-white font-black py-4 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 mt-4 uppercase tracking-[0.2em] text-xs"
            >
              {loading ? "Estabelecendo Meta..." : "Começar Agora"}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
