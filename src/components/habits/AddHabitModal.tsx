"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Plus, Sparkles, Save } from "lucide-react";
import { createHabit, updateHabit } from "@/lib/actions/habits";
import { toast } from "react-hot-toast";
import { showAchievementToast } from "../gamification/AchievementToast";
import { cn } from "@/lib/utils";

interface AddHabitModalProps {
  userId: string;
  habit?: any;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function AddHabitModal({ userId, habit, trigger, onSuccess }: AddHabitModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    icon: "target",
    category: "HEALTH" as any,
    targetDays: [1, 2, 3, 4, 5, 6, 7],
    targetCount: 1,
    xpReward: 10,
    color: "#A855F7",
  });

  const isEdit = !!habit;

  useEffect(() => {
    if (habit) {
      setData({
        title: habit.title,
        icon: habit.icon || "target",
        category: habit.category,
        targetDays: habit.targetDays || [1, 2, 3, 4, 5, 6, 7],
        targetCount: habit.targetCount || 1,
        xpReward: habit.xpReward || 10,
        color: habit.color || "#A855F7",
      });
    }
  }, [habit]);

  const categories = [
    { label: "SAÚDE", val: "HEALTH" },
    { label: "MENTE", val: "MIND" },
    { label: "TRABALHO", val: "WORK" },
    { label: "SOCIAL", val: "SOCIAL" },
    { label: "FINANÇAS", val: "FINANCE" },
    { label: "CRIATIVO", val: "CREATIVE" },
    { label: "OUTRO", val: "OTHER" },
  ];
  const days = [
    { label: "S", val: 1 }, { label: "T", val: 2 }, { label: "Q", val: 3 },
    { label: "Q", val: 4 }, { label: "S", val: 5 }, { label: "S", val: 6 }, { label: "D", val: 7 }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.title.trim()) {
      toast.error("O título é obrigatório");
      return;
    }
    setLoading(true);

    try {
      if (isEdit) {
        const res = await updateHabit(habit.id, userId, data);
        if (res.success) {
          toast.success("Hábito atualizado");
          setOpen(false);
          onSuccess?.();
        } else {
          toast.error(res.error || "Erro ao atualizar");
        }
      } else {
        const res = await createHabit(data, userId);
        if (res.success) {
          toast.success("Novo hábito criado");
          res.unlockedAchievements?.forEach(showAchievementToast);
          setOpen(false);
          setData({
            title: "",
            icon: "target",
            category: "HEALTH" as any,
            targetDays: [1, 2, 3, 4, 5, 6, 7],
            targetCount: 1,
            xpReward: 10,
            color: "#A855F7",
          });
          onSuccess?.();
        } else {
          toast.error(res.error || "Erro ao criar");
        }
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Erro no processamento");
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
        {trigger || (
          <button className="w-full flex items-center justify-center gap-2 h-12 px-6 rounded-full border border-white/5 bg-white/[0.02] text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-all text-[10px] font-black uppercase tracking-[0.2em] mt-8 group">
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Adicionar Novo Objetivo
          </button>
        )}
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[200] animate-in fade-in duration-300" />
        <Dialog.Content className={cn(
          "fixed z-[201] bg-[#050505] border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col",
          "inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md max-h-[90vh] md:h-auto md:rounded-[2.5rem] p-8 md:p-10 overflow-y-auto no-scrollbar"
        )}>
          <div className="flex items-center justify-between mb-10">
            <div>
              <Dialog.Title className="text-2xl font-black text-white italic uppercase tracking-tighter">
                {isEdit ? "Editar Hábito" : "Novo Hábito"}
              </Dialog.Title>
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em] mt-1">
                {isEdit ? "Ajuste os parâmetros" : "Inicie uma nova rotina"}
              </p>
            </div>
            <Dialog.Close asChild>
              <button className="p-2 hover:bg-white/5 rounded-full transition-all text-zinc-600 hover:text-white active:scale-95">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-1">Identificador</label>
              <input
                type="text"
                required
                placeholder="Ex: Treino de Força"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && data.title) {
                    // Enter is handled by form onSubmit, but we can be explicit if needed
                  }
                }}
                className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-2xl px-5 text-sm font-medium text-white placeholder:text-zinc-800 focus:outline-none focus:border-purple-500/50 transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-1">Frequência Semanal</label>
              <div className="flex justify-between gap-2">
                {days.map((day) => (
                  <button
                    key={day.val}
                    type="button"
                    onClick={() => toggleDay(day.val)}
                    className={cn(
                      "flex-1 h-10 rounded-xl text-[10px] font-black transition-all border flex items-center justify-center uppercase",
                      data.targetDays.includes(day.val)
                        ? "bg-purple-500 text-white border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                        : "bg-transparent text-zinc-600 border-white/5 hover:border-purple-500/30"
                    )}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-1">Categoria</label>
              <div className="grid grid-cols-2 xs:grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.val}
                    type="button"
                    onClick={() => setData({ ...data, category: cat.val })}
                    className={cn(
                      "h-10 px-3 rounded-xl text-[9px] font-black transition-all border uppercase tracking-widest",
                      data.category === cat.val
                        ? "bg-white/10 text-white border-white/20"
                        : "bg-transparent text-zinc-700 border-white/5 hover:border-white/10"
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading || !data.title}
                className="w-full h-14 bg-purple-500 text-white font-black rounded-2xl transition-all active:scale-[0.98] disabled:opacity-30 uppercase tracking-[0.3em] text-[11px] shadow-[0_0_30px_rgba(168,85,247,0.2)] hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]"
              >
                {loading ? "Sincronizando..." : (isEdit ? "Salvar Alterações" : "Ativar Hábito")}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

