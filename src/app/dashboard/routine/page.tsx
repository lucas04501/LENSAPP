"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  CalendarClock, Plus, Pencil, Trash2, 
  X, Check, Copy, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  getRoutineBlocks, 
  createRoutineBlock, 
  updateRoutineBlock, 
  deleteRoutineBlock,
  duplicateDayToWeek
} from "@/lib/actions/routine";
import toast from "react-hot-toast";

const DAYS = [
  { id: 1, label: "Seg" },
  { id: 2, label: "Ter" },
  { id: 3, label: "Qua" },
  { id: 4, label: "Qui" },
  { id: 5, label: "Sex" },
  { id: 6, label: "Sáb" },
  { id: 7, label: "Dom" },
];

const COLORS = [
  { id: "purple", border: "#7C3AED", bg: "rgba(124,58,237,0.08)", hex: "#7C3AED" },
  { id: "red",    border: "#EF4444", bg: "rgba(239,68,68,0.08)", hex: "#EF4444" },
  { id: "green",  border: "#22C55E", bg: "rgba(34,197,94,0.08)", hex: "#22C55E" },
  { id: "blue",   border: "#3B82F6", bg: "rgba(59,130,246,0.08)", hex: "#3B82F6" },
  { id: "amber",  border: "#F59E0B", bg: "rgba(245,158,11,0.08)", hex: "#F59E0B" },
  { id: "gray",   border: "#6B7280", bg: "rgba(107,114,128,0.08)", hex: "#6B7280" },
];

const CATEGORIES = ["Saúde", "Mente", "Trabalho", "Lazer", "Outro"];

export default function RoutinePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [selectedDay, setSelectedDay] = useState(() => {
    const day = new Date().getDay();
    return day === 0 ? 7 : day;
  });
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<any>(null);

  const loadBlocks = useCallback(async () => {
    if (status !== "authenticated") return;
    
    setLoading(true);
    try {
      const data = await getRoutineBlocks(selectedDay);
      setBlocks(data);
    } catch (error) {
      console.error("CLIENT_ROUTINE_ERROR [loadBlocks]:", error);
      toast.error("Erro ao carregar rotina");
    } finally {
      setLoading(false);
    }
  }, [status, selectedDay]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      loadBlocks();
    }
  }, [status, selectedDay, loadBlocks]);

  const handleAddBlock = () => {
    setEditingBlock(null);
    setIsModalOpen(true);
  };

  const handleEditBlock = (block: any) => {
    setEditingBlock(block);
    setIsModalOpen(true);
  };

  const handleDeleteBlock = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este bloco?")) return;

    try {
      await deleteRoutineBlock(id);
      toast.success("Bloco excluído");
      loadBlocks();
    } catch (error) {
      console.error("CLIENT_ROUTINE_ERROR [handleDeleteBlock]:", error);
      toast.error("Erro ao excluir bloco");
    }
  };

  const handleDuplicate = async () => {
    if (!confirm(`Copiar rotina de ${DAYS.find(d => d.id === selectedDay)?.label} para toda a semana?`)) return;

    try {
      await duplicateDayToWeek(selectedDay);
      toast.success("Rotina duplicada para a semana");
      loadBlocks();
    } catch (error) {
      console.error("CLIENT_ROUTINE_ERROR [handleDuplicate]:", error);
      toast.error("Erro ao duplicar rotina");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Rotina Semanal</h1>
            <p className="text-zinc-400 text-sm">Organize seu dia do início ao fim</p>
          </div>
          <button
            onClick={handleDuplicate}
            className="flex items-center gap-2 px-4 py-2 bg-[#0F0F14] border border-[#1E1E2E] rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-[#15151A] transition-all"
          >
            <Copy className="w-4 h-4" />
            Duplicar para semana
          </button>
        </header>

        {/* Day Selector */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2">
          {DAYS.map((day) => (
            <button
              key={day.id}
              onClick={() => setSelectedDay(day.id)}
              className={cn(
                "px-6 py-2 rounded-lg text-sm font-medium transition-all shrink-0 border",
                selectedDay === day.id
                  ? "bg-[#7C3AED] text-white border-[#7C3AED]"
                  : "bg-[#0F0F14] text-zinc-500 border-[#1E1E2E] hover:border-zinc-700"
              )}
            >
              {day.label}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-[#0F0F14] animate-pulse rounded-xl border border-[#1E1E2E]" />
              ))}
            </div>
          ) : blocks.length > 0 ? (
            <div className="space-y-3">
              {blocks.map((block, index) => {
                const colorInfo = COLORS.find(c => c.id === block.color) || COLORS[0];
                return (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group flex gap-4"
                  >
                    <div className="w-12 pt-2 text-[12px] text-zinc-500 font-mono">
                      {block.startTime}
                    </div>
                    <div 
                      className="flex-1 relative p-4 rounded-xl border-l-[3px] transition-all bg-[#0F0F14] border-[#1E1E2E] hover:bg-[#12121A]"
                      style={{ 
                        borderLeftColor: colorInfo.border,
                        backgroundColor: colorInfo.bg 
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-medium text-white">{block.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] text-zinc-500">
                              {block.startTime} — {block.endTime}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-500 uppercase tracking-wider font-semibold">
                              {block.category}
                            </span>
                          </div>
                          {block.description && (
                            <p className="mt-2 text-xs text-zinc-400 line-clamp-2">
                              {block.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEditBlock(block)}
                            className="p-1.5 hover:bg-white/5 rounded-md text-zinc-500 hover:text-white transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteBlock(block.id)}
                            className="p-1.5 hover:bg-red-500/10 rounded-md text-zinc-500 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#0F0F14] border border-[#1E1E2E] flex items-center justify-center text-zinc-600">
                <CalendarClock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-zinc-400 font-medium">Nenhum bloco para este dia</p>
                <p className="text-zinc-500 text-sm">Adicione sua primeira rotina ↓</p>
              </div>
            </div>
          )}
        </div>

        {/* Floating Action Button */}
        <button
          onClick={handleAddBlock}
          className="fixed bottom-8 right-8 flex items-center gap-2 px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-full shadow-lg shadow-purple-500/20 transition-all hover:scale-105 active:scale-95 z-50"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold text-sm">Adicionar bloco</span>
        </button>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg bg-black/60 backdrop-blur-xl border border-zinc-800/80 rounded-[2rem] shadow-2xl overflow-hidden"
              >
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  
                  // Clean mapping of days checkboxes to numbers array
                  const selectedDays = Array.from(formData.getAll("days")).map(val => parseInt(val as string, 10)).filter(n => !isNaN(n));

                  const data = {
                    title: formData.get("title") as string,
                    description: formData.get("description") as string,
                    startTime: formData.get("startTime") as string,
                    endTime: formData.get("endTime") as string,
                    category: formData.get("category") as string,
                    color: formData.get("color") as string,
                    days: selectedDays,
                  };

                  if (!data.title || !data.startTime || !data.endTime || data.days.length === 0) {
                    toast.error("Preencha todos os campos obrigatórios");
                    return;
                  }

                  try {
                    if (editingBlock) {
                      await updateRoutineBlock(editingBlock.id, data);
                      toast.success("Bloco atualizado");
                    } else {
                      await createRoutineBlock(data);
                      toast.success("Bloco criado");
                    }
                    setIsModalOpen(false);
                    loadBlocks();
                  } catch (error) {
                    console.error("CLIENT_ROUTINE_ERROR [saveBlock]:", error);
                    toast.error("Erro ao salvar bloco");
                  }
                }} className="p-8 space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                        {editingBlock ? "Editar Bloco" : "Novo Bloco de Rotina"}
                      </h2>
                      <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em] mt-1">
                        Sincronize sua performance
                      </p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="p-2 rounded-full hover:bg-white/5 text-zinc-600 hover:text-white transition-all active:scale-95"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-1">Identificador</label>
                      <input
                        name="title"
                        required
                        defaultValue={editingBlock?.title}
                        placeholder="Ex: Ritual Matinal"
                        className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-5 py-3 text-sm font-medium text-white placeholder:text-zinc-800 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600/30 transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-1">Início</label>
                        <input
                          name="startTime"
                          type="time"
                          required
                          defaultValue={editingBlock?.startTime || "08:00"}
                          className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-5 py-3 text-sm font-medium text-white focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600/30 transition-all"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-1">Fim</label>
                        <input
                          name="endTime"
                          type="time"
                          required
                          defaultValue={editingBlock?.endTime || "09:00"}
                          className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-5 py-3 text-sm font-medium text-white focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600/30 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-1">Nota de Missão</label>
                      <textarea
                        name="description"
                        rows={2}
                        defaultValue={editingBlock?.description}
                        placeholder="O que você fará nesse tempo?"
                        className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-5 py-3 text-sm font-medium text-white placeholder:text-zinc-800 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600/30 transition-all resize-none"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-1">Sincronização Diária</label>
                      <div className="flex flex-wrap gap-2">
                        {DAYS.map((day) => (
                          <label key={day.id} className="relative cursor-pointer group">
                            <input
                              type="checkbox"
                              name="days"
                              value={day.id}
                              defaultChecked={editingBlock ? editingBlock.days.includes(day.id) : day.id <= 5}
                              className="peer sr-only"
                            />
                            <div className="w-10 h-10 rounded-full border border-zinc-800 bg-zinc-950/50 text-[10px] font-bold text-zinc-600 flex items-center justify-center uppercase peer-checked:bg-purple-600 peer-checked:border-purple-600 peer-checked:text-white peer-checked:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all group-hover:border-zinc-700">
                              {day.label.charAt(0)}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-1">Assinatura Visual</label>
                        <div className="flex gap-2">
                          {COLORS.map((c) => (
                            <label key={c.id} className="relative cursor-pointer group">
                              <input
                                type="radio"
                                name="color"
                                value={c.id}
                                defaultChecked={editingBlock ? editingBlock.color === c.id : c.id === "purple"}
                                className="peer sr-only"
                              />
                              <div 
                                className="w-6 h-6 rounded-full border-2 border-transparent peer-checked:border-white/50 transition-all scale-100 peer-checked:scale-110 group-hover:scale-110 shadow-lg"
                                style={{ backgroundColor: c.hex }}
                              />
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-1">Categoria</label>
                        <select
                          name="category"
                          defaultValue={editingBlock?.category || "Outro"}
                          className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:border-purple-600 transition-all appearance-none"
                        >
                          {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6 border-t border-zinc-900">
                    {editingBlock && (
                      <button
                        type="button"
                        onClick={() => handleDeleteBlock(editingBlock.id)}
                        className="flex-1 h-14 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-red-500/10 transition-all flex items-center justify-center gap-2 active:scale-95"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remover
                      </button>
                    )}
                    <button
                      type="submit"
                      className="flex-[2] h-14 rounded-xl bg-purple-600 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-purple-700 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] active:scale-95"
                    >
                      {editingBlock ? "Atualizar Protocolo" : "Ativar Bloco"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
