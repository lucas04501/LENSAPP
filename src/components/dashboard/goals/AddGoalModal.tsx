"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Target, Calendar, Zap, AlignLeft, Briefcase, Plus, Trash2 } from "lucide-react";
import { createGoal, updateGoal } from "@/lib/actions/goals";
import { toast } from "react-hot-toast";
import { addDays, format, isBefore, isAfter } from "date-fns";
import { cn } from "@/lib/utils";

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  goal?: any;
}

const CATEGORIES = ["TRABALHO", "SAÚDE", "MENTE", "SOCIAL", "FINANÇAS", "CRIATIVO", "OUTRO"];

export function AddGoalModal({ isOpen, onClose, userId, goal }: AddGoalModalProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    category: "TRABALHO",
    targetDate: format(addDays(new Date(), 90), "yyyy-MM-dd"),
    xpReward: 100,
  });
  const [steps, setSteps] = useState<string[]>([]);

  const isEdit = !!goal;

  useEffect(() => {
    if (goal) {
      setData({
        title: goal.title,
        description: goal.description || "",
        category: goal.category,
        targetDate: format(new Date(goal.targetDate), "yyyy-MM-dd"),
        xpReward: goal.xpReward,
      });
      setSteps(goal.steps?.map((s: any) => s.title) || []);
    }
  }, [goal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const targetDate = new Date(data.targetDate);
    const minDate = addDays(new Date(), 6);
    const maxDate = addDays(new Date(), 366);

    if (!isEdit && isBefore(targetDate, minDate)) {
      return toast.error("DURAÇÃO MÍNIMA DE 7 DIAS");
    }
    if (isAfter(targetDate, maxDate)) {
      return toast.error("DURAÇÃO MÁXIMA DE 365 DIAS");
    }

    setLoading(true);
    try {
      if (isEdit) {
        const res = await updateGoal(goal.id, {
          ...data,
          targetDate: new Date(data.targetDate),
        }, userId);
        if (res.success) {
          toast.success("META ATUALIZADA");
          onClose();
        } else {
          toast.error(res.error || "ERRO AO ATUALIZAR");
        }
      } else {
        const res = await createGoal({
          ...data,
          targetDate: new Date(data.targetDate),
          steps: steps.filter(s => s.trim() !== ""),
        }, userId);

        if (res.success) {
          toast.success("META INICIADA");
          onClose();
          resetForm();
        } else {
          toast.error(res.error || "ERRO AO INICIAR");
        }
      }
    } catch (error) {
      toast.error("ERRO NO PROTOCOLO");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setData({
      title: "",
      description: "",
      category: "TRABALHO",
      targetDate: format(addDays(new Date(), 90), "yyyy-MM-dd"),
      xpReward: 100,
    });
    setSteps([]);
  };

  const addStep = () => setSteps([...steps, ""]);
  const removeStep = (index: number) => setSteps(steps.filter((_, i) => i !== index));
  const updateStep = (index: number, val: string) => {
    const newSteps = [...steps];
    newSteps[index] = val;
    setSteps(newSteps);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[200] animate-in fade-in duration-300" />
        <Dialog.Content className={cn(
          "fixed z-[201] bg-[#050505] border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col",
          "inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-xl md:h-[90vh] md:rounded-[2.5rem] p-8 md:p-10 overflow-y-auto no-scrollbar"
        )}>
          
          <div className="flex items-center justify-between mb-10">
            <div>
              <Dialog.Title className="text-2xl font-black text-white italic uppercase tracking-tighter">
                {isEdit ? "Editar Meta" : "Nova Meta"}
              </Dialog.Title>
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em] mt-1">
                {isEdit ? "Ajuste os parâmetros estratégicos" : "Estabeleça um novo objetivo de longo prazo"}
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
                placeholder="Ex: Dominar Next.js"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-2xl px-5 text-sm font-medium text-white placeholder:text-zinc-800 focus:outline-none focus:border-purple-500/50 transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-1">Descrição</label>
              <textarea
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                rows={2}
                placeholder="Detalhes adicionais da missão..."
                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 text-sm font-medium text-white placeholder:text-zinc-800 focus:outline-none focus:border-purple-500/50 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-1">Setor</label>
                <select
                  value={data.category}
                  onChange={(e) => setData({ ...data, category: e.target.value })}
                  className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-2xl px-5 text-sm font-medium text-white focus:outline-none focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c} className="bg-[#050505]">{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-1">Prazo Final</label>
                <input
                  type="date"
                  required
                  value={data.targetDate}
                  onChange={(e) => setData({ ...data, targetDate: e.target.value })}
                  className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-2xl px-5 text-sm font-medium text-white focus:outline-none focus:border-purple-500/50 transition-all [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Steps Section */}
            {!isEdit && (
              <div className="space-y-4">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Etapas do Projeto</label>
                  <button 
                    type="button" 
                    onClick={addStep}
                    className="flex items-center gap-1.5 text-[9px] font-black text-purple-500 uppercase tracking-widest hover:text-purple-400 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Adicionar Etapa
                  </button>
                </div>
                
                <div className="space-y-3">
                  {steps.map((step, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder={`Etapa ${i + 1}`}
                        value={step}
                        onChange={(e) => updateStep(i, e.target.value)}
                        className="flex-1 h-10 bg-white/[0.01] border border-white/5 rounded-xl px-4 text-xs font-medium text-zinc-300 focus:border-purple-500/30 transition-all"
                      />
                      <button 
                        type="button"
                        onClick={() => removeStep(i)}
                        className="p-2 text-zinc-800 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {steps.length === 0 && (
                    <p className="text-[10px] text-zinc-800 italic ml-1">Defina etapas para acompanhar seu progresso.</p>
                  )}
                </div>
              </div>
            )}

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-purple-500 text-white font-black rounded-2xl transition-all active:scale-[0.98] disabled:opacity-30 uppercase tracking-[0.3em] text-[11px] shadow-[0_0_30px_rgba(168,85,247,0.2)]"
              >
                {loading ? "PROCESSANDO..." : (isEdit ? "Salvar Alterações" : "Ativar Objetivo")}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

