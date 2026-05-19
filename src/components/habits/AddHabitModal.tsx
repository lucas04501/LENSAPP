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
    icon: "🧘",
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
        icon: habit.icon || "🧘",
        category: habit.category,
        targetDays: habit.targetDays || [1, 2, 3, 4, 5, 6, 7],
        targetCount: habit.targetCount || 1,
        xpReward: habit.xpReward || 10,
        color: habit.color || "#A855F7",
      });
    }
  }, [habit]);

  const categories = ["HEALTH", "MIND", "WORK", "SOCIAL", "FINANCE", "CREATIVE", "OTHER"];
  const days = [
    { label: "S", val: 1 }, { label: "T", val: 2 }, { label: "Q", val: 3 },
    { label: "Q", val: 4 }, { label: "S", val: 5 }, { label: "S", val: 6 }, { label: "D", val: 7 }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        const res = await updateHabit(habit.id, userId, data);
        if (res.success) {
          toast.success("Hábito atualizado! ✨");
          setOpen(false);
          onSuccess?.();
        } else {
          toast.error(res.error || "Erro ao atualizar hábito");
        }
      } else {
        const res = await createHabit(data, userId);
        if (res.success) {
          toast.success("Hábito criado com sucesso! ✨");
          res.unlockedAchievements?.forEach(showAchievementToast);
          setOpen(false);
          setData({ ...data, title: "" });
          onSuccess?.();
        } else {
          toast.error(res.error || "Erro ao criar hábito");
        }
      }
    } catch (error) {
      toast.error("Erro ao processar hábito");
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
          <button className="w-full flex items-center gap-2 p-4 rounded-2xl border border-dashed border-white/10 text-text-muted hover:border-purple/30 hover:text-purple transition-all text-sm mt-4 min-h-[52px]">
            <Plus className="w-4.5 h-4.5" />
            <span className="font-bold uppercase tracking-widest text-xs">Adicionar hábito</span>
          </button>
        )}
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] animate-in fade-in duration-200" />
        <Dialog.Content className={cn(
          "fixed z-[101] bg-[#050505] border-white/10 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col",
          "inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md md:h-auto md:rounded-[2rem] md:border p-6 sm:p-8"
        )}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple/10 rounded-xl border border-purple/20">
                {isEdit ? <Save className="w-5 h-5 text-purple" /> : <Sparkles className="w-5 h-5 text-purple" />}
              </div>
              <div>
                <Dialog.Title className="text-xl font-black text-white italic uppercase tracking-tighter">
                  {isEdit ? "Editar Hábito" : "Novo Hábito"}
                </Dialog.Title>
                <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">
                  {isEdit ? "Ajuste sua estratégia de evolução" : "Inicie uma nova jornada de consistência"}
                </p>
              </div>
            </div>
            <Dialog.Close asChild>
              <button className="p-2.5 hover:bg-white/5 rounded-xl transition-all text-text-muted active:scale-95">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 flex-1 overflow-y-auto no-scrollbar">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">O que você quer rastrear?</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={data.icon}
                  onChange={(e) => setData({ ...data, icon: e.target.value })}
                  className="w-14 h-14 bg-surface-2 border border-white/5 rounded-2xl text-center text-2xl focus:outline-none focus:border-purple/50 transition-all"
                  maxLength={2}
                />
                <input
                  type="text"
                  required
                  placeholder="Ex: Meditação"
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  className="flex-1 bg-surface-2 border border-white/5 rounded-2xl px-5 text-sm font-bold text-white placeholder:text-text-muted/30 focus:outline-none focus:border-purple/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Frequência semanal</label>
              <div className="flex justify-between gap-1.5">
                {days.map((day) => (
                  <button
                    key={day.val}
                    type="button"
                    onClick={() => toggleDay(day.val)}
                    className={cn(
                      "flex-1 aspect-square rounded-xl text-[10px] font-black transition-all border flex items-center justify-center uppercase",
                      data.targetDays.includes(day.val)
                        ? "bg-purple text-white border-purple shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                        : "bg-surface-2 text-text-muted border-white/5 hover:border-purple/20"
                    )}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Categoria</label>
              <div className="grid grid-cols-2 xs:grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setData({ ...data, category: cat })}
                    className={cn(
                      "px-3 py-2.5 rounded-xl text-[9px] font-black transition-all border uppercase tracking-widest",
                      data.category === cat
                        ? "bg-white/10 text-white border-white/20 shadow-xl"
                        : "bg-surface-2 text-text-muted border-transparent hover:border-white/5"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-auto">
              <button
                type="submit"
                disabled={loading || !data.title}
                className="w-full bg-gradient-to-r from-purple to-red hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] text-white font-black py-4 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.2em] text-xs"
              >
                {loading ? "Sincronizando..." : (isEdit ? "Salvar alterações" : "Começar Agora")}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
