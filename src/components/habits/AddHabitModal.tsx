"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Plus, Sparkles } from "lucide-react";
import { createHabit } from "@/lib/actions/habits";
import { toast } from "react-hot-toast";

interface AddHabitModalProps {
  userId: string;
}

export function AddHabitModal({ userId }: AddHabitModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    icon: "🧘",
    category: "HEALTH" as any,
    targetDays: [1, 2, 3, 4, 5, 6, 7],
    targetCount: 1,
    xpReward: 10,
    color: "#A855F7",
  });

  const categories = ["HEALTH", "MIND", "WORK", "SOCIAL", "FINANCE", "CREATIVE", "OTHER"];
  const days = [
    { label: "S", val: 1 }, { label: "T", val: 2 }, { label: "Q", val: 3 },
    { label: "Q", val: 4 }, { label: "S", val: 5 }, { label: "S", val: 6 }, { label: "D", val: 7 }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createHabit(data, userId);
      toast.success("Hábito criado com sucesso! ✨");
      setOpen(false);
      setData({ ...data, title: "" });
    } catch (error) {
      toast.error("Erro ao criar hábito");
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day: number) => {
    setData(prev => ({
      ...prev,
      targetDays: prev.targetDays.includes(day)
        ? prev.targetDays.filter(d => d !== day)
        : [...prev.targetDays, day]
    }));
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="w-full flex items-center gap-2 p-3 rounded-xl border border-dashed border-border text-text-muted hover:border-purple/30 hover:text-purple transition-all text-sm mt-2">
          <Plus className="w-4 h-4" />
          <span>Adicionar hábito</span>
        </button>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#111111] border border-white/10 rounded-2xl p-6 shadow-2xl z-50 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple/10 rounded-lg">
                <Sparkles className="w-4 h-4 text-purple" />
              </div>
              <Dialog.Title className="text-lg font-bold text-white">Novo Hábito</Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-text-muted">
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted ml-1">O que você quer rastrear?</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={data.icon}
                  onChange={(e) => setData({ ...data, icon: e.target.value })}
                  className="w-12 bg-surface-2 border border-white/5 rounded-xl text-center text-xl focus:outline-none focus:border-purple/50"
                  maxLength={2}
                />
                <input
                  type="text"
                  required
                  placeholder="Ex: Meditação matinal"
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  className="flex-1 bg-surface-2 border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple/50 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted ml-1">Frequência semanal</label>
              <div className="flex justify-between gap-1">
                {days.map((day) => (
                  <button
                    key={day.val}
                    type="button"
                    onClick={() => toggleDay(day.val)}
                    className={`w-10 h-10 rounded-xl text-xs font-bold transition-all border ${
                      data.targetDays.includes(day.val)
                        ? "bg-purple text-white border-purple"
                        : "bg-surface-2 text-text-muted border-white/5 hover:border-purple/30"
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted ml-1">Categoria</label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setData({ ...data, category: cat })}
                    className={`px-3 py-2 rounded-lg text-[10px] font-bold transition-all border ${
                      data.category === cat
                        ? "bg-white/10 text-white border-white/20"
                        : "bg-surface-2 text-text-muted border-transparent hover:border-white/5"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !data.title}
              className="w-full bg-gradient-to-r from-purple-600 to-red-500 hover:from-purple-500 hover:to-red-400 text-white font-semibold py-3 rounded-xl shadow-lg shadow-purple-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Criando..." : "Criar Hábito"}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
