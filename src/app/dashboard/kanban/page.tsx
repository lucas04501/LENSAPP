"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Plus, X, Filter, Search, MoreHorizontal, Settings2, Layout
} from "lucide-react";
import { 
  DndContext, DragOverlay, closestCorners, KeyboardSensor, 
  PointerSensor, useSensor, useSensors, DragStartEvent, 
  DragOverEvent, DragEndEvent, defaultDropAnimationSideEffects
} from "@dnd-kit/core";
import { 
  arrayMove, SortableContext, sortableKeyboardCoordinates
} from "@dnd-kit/sortable";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  getBoard, createCard, updateCard, moveCard, deleteCard, 
  createColumn, deleteColumn, renameColumn
} from "@/lib/actions/kanban";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { KanbanColumn } from "@/components/dashboard/kanban/KanbanColumn";
import { KanbanCard } from "@/components/dashboard/kanban/KanbanCard";
import { CardChecklist } from "@/components/dashboard/kanban/CardChecklist";

// --- Types ---
type Card = any;
type Column = {
  id: string;
  name: string;
  color: string;
  order: number;
  cards: Card[];
};
type Board = {
  id: string;
  name: string;
  columns: Column[];
};

export default function KanbanPage() {
  const { status } = useSession();
  const router = useRouter();

  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<Card | null>(null);

  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const loadBoard = useCallback(async () => {
    if (status !== "authenticated") return;
    try {
      const data = await getBoard();
      setBoard(data as any);
    } catch (error) {
      toast.error("Erro ao carregar board");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") loadBoard();
  }, [status, router, loadBoard]);

  const handleAddCard = (columnId: string) => {
    setActiveColumnId(columnId);
    setEditingCard(null);
    setIsCardModalOpen(true);
  };

  const handleEditCard = (card: Card) => {
    setEditingCard(card);
    setIsCardModalOpen(true);
  };

  const handleDeleteCard = async (id: string) => {
    if (!confirm("Arquivar este card?")) return;
    try {
      await deleteCard(id);
      toast.success("Card arquivado");
      loadBoard();
    } catch (error) {
      toast.error("Erro ao excluir card");
    }
  };

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Card") {
      setActiveCard(event.active.data.current.card);
      return;
    }
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const isActiveACard = active.data.current?.type === "Card";
    const isOverACard = over.data.current?.type === "Card";

    if (!isActiveACard) return;

    if (isActiveACard && isOverACard) {
      setBoard((prev) => {
        if (!prev) return null;
        const activeCard = active.data.current?.card;
        const overCard = over.data.current?.card;
        const activeCol = prev.columns.find(col => col.id === activeCard.columnId);
        const overCol = prev.columns.find(col => col.id === overCard.columnId);
        if (!activeCol || !overCol) return prev;

        if (activeCol.id !== overCol.id) {
          const activeCards = [...activeCol.cards];
          const overCards = [...overCol.cards];
          const activeIndex = activeCards.findIndex(c => c.id === activeId);
          const overIndex = overCards.findIndex(c => c.id === overId);
          const movedCard = { ...activeCards[activeIndex], columnId: overCol.id };
          activeCards.splice(activeIndex, 1);
          overCards.splice(overIndex, 0, movedCard);
          return {
            ...prev,
            columns: prev.columns.map(col => {
              if (col.id === activeCol.id) return { ...col, cards: activeCards };
              if (col.id === overCol.id) return { ...col, cards: overCards };
              return col;
            })
          };
        }
        return prev;
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";
    if (isActiveACard && isOverAColumn) {
      setBoard((prev) => {
        if (!prev) return null;
        const activeCard = active.data.current?.card;
        const activeCol = prev.columns.find(col => col.id === activeCard.columnId);
        const overCol = prev.columns.find(col => col.id === overId);
        if (!activeCol || !overCol || activeCol.id === overCol.id) return prev;

        const activeCards = [...activeCol.cards];
        const overCards = [...overCol.cards];
        const activeIndex = activeCards.findIndex(c => c.id === activeId);
        const movedCard = { ...activeCards[activeIndex], columnId: overCol.id };
        activeCards.splice(activeIndex, 1);
        overCards.push(movedCard);
        return {
          ...prev,
          columns: prev.columns.map(col => {
            if (col.id === activeCol.id) return { ...col, cards: activeCards };
            if (col.id === overCol.id) return { ...col, cards: overCards };
            return col;
          })
        };
      });
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    setActiveCard(null);
    setActiveColumn(null);
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;

    if (active.data.current?.type === "Column") {
      if (activeId !== overId) {
        setBoard((prev) => {
          if (!prev) return null;
          const oldIndex = prev.columns.findIndex(c => c.id === activeId);
          const newIndex = prev.columns.findIndex(c => c.id === overId);
          return { ...prev, columns: arrayMove(prev.columns, oldIndex, newIndex) };
        });
      }
      return;
    }

    if (active.data.current?.type === "Card") {
      const overCard = over.data.current?.card;
      const targetColId = over.data.current?.type === "Column" ? overId : overCard.columnId;
      const finalCol = board?.columns.find(c => c.id === targetColId);
      if (!finalCol) return;
      const cardIndex = finalCol.cards.findIndex(c => c.id === activeId);
      const newOrder = cardIndex !== -1 ? cardIndex + 1 : finalCol.cards.length + 1;
      try {
        await moveCard(activeId, targetColId, newOrder);
        loadBoard();
      } catch {
        toast.error("Erro ao mover card");
        loadBoard();
      }
    }
  };

  if (loading && !board) return (
    <div className="p-8 space-y-8 animate-pulse">
      <div className="h-8 w-48 bg-white/[0.02] rounded-lg" />
      <div className="flex gap-6 overflow-hidden">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="w-[300px] h-[600px] bg-white/[0.02] rounded-2xl border border-white/5" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col gap-8 pb-10">
      
      {/* ── Page Header ── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 lg:px-8 pt-4">
        <div>
          <h1 className="text-[32px] font-black text-white leading-tight italic uppercase tracking-tighter">
            Kanban
          </h1>
          <p className="text-zinc-600 text-[10px] mt-1 uppercase font-black tracking-[0.3em]">
            Gestão de Fluxo <span className="text-zinc-400">· {board?.columns.reduce((acc, col) => acc + col.cards.length, 0)} cards ativos</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 group-focus-within:text-purple-500 transition-colors" />
            <input 
              type="text"
              placeholder="BUSCAR CARD..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 pl-10 pr-4 bg-white/[0.02] border border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-purple-500/50 w-full md:w-[240px] transition-all"
            />
          </div>
          <button className="p-2.5 rounded-full border border-white/5 bg-white/[0.02] text-zinc-500 hover:text-white transition-all">
            <Filter size={16} />
          </button>
          <button className="p-2.5 rounded-full border border-white/5 bg-white/[0.02] text-zinc-500 hover:text-white transition-all">
            <Settings2 size={16} />
          </button>
        </div>
      </header>

      {/* ── Board Area ── */}
      <div className="flex-1 overflow-x-auto no-scrollbar px-4 lg:px-8">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          <div className="flex gap-6 h-full min-h-[calc(100vh-250px)]">
            <SortableContext items={board?.columns.map(c => c.id) || []}>
              {board?.columns.map(column => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  cards={column.cards.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))}
                  onAddCard={handleAddCard}
                  onRename={async (id, name) => {
                    await renameColumn(id, name);
                    loadBoard();
                  }}
                  onDelete={async (id) => {
                    if (confirm("Excluir esta coluna?")) {
                      await deleteColumn(id);
                      loadBoard();
                    }
                  }}
                  onEditCard={handleEditCard}
                  onDeleteCard={handleDeleteCard}
                />
              ))}
            </SortableContext>
            
            {/* New Column Button */}
            <button 
              onClick={async () => {
                const name = prompt("Nome da nova coluna:");
                if (name) {
                  await createColumn(board?.id!, name, "#7C3AED");
                  loadBoard();
                }
              }}
              className="flex flex-col items-center justify-center w-[300px] shrink-0 h-[100px] rounded-[1.25rem] border border-dashed border-white/5 bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/10 transition-all group"
            >
              <Plus className="w-5 h-5 text-zinc-700 group-hover:text-zinc-500 group-hover:scale-110 transition-all mb-2" />
              <span className="text-[10px] font-black text-zinc-700 group-hover:text-zinc-500 uppercase tracking-[0.3em]">Nova Coluna</span>
            </button>
          </div>

          <DragOverlay dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: { active: { opacity: "0.5" } },
            }),
          }}>
            {activeCard && (
              <div className="opacity-80 scale-105 rotate-2">
                <KanbanCard card={activeCard} onEdit={() => {}} onDelete={() => {}} />
              </div>
            )}
            {activeColumn && (
              <div className="opacity-80 scale-105">
                <KanbanColumn 
                  column={activeColumn} 
                  cards={activeColumn.cards} 
                  onAddCard={() => {}} 
                  onRename={() => {}} 
                  onDelete={() => {}}
                  onEditCard={() => {}}
                  onDeleteCard={() => {}}
                />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {/* ── Card Modal ── */}
      <AnimatePresence>
        {isCardModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCardModalOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-[#050505] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = {
                  title: formData.get("title") as string,
                  description: formData.get("description") as string,
                  tag: formData.get("tag") as string,
                  tagColor: formData.get("tagColor") as string,
                  priority: formData.get("priority") as string,
                  dueDate: formData.get("dueDate") ? new Date(formData.get("dueDate") as string) : undefined,
                };

                try {
                  if (editingCard) {
                    await updateCard(editingCard.id, data);
                    toast.success("Card atualizado");
                  } else if (activeColumnId) {
                    await createCard(activeColumnId, data);
                    toast.success("Card criado");
                  }
                  setIsCardModalOpen(false);
                  loadBoard();
                } catch {
                  toast.error("Erro ao salvar card");
                }
              }} className="flex-1 p-8 space-y-8 overflow-y-auto no-scrollbar max-h-[90vh]">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Layout className="w-5 h-5 text-purple-500" />
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                      {editingCard ? "Editar Card" : "Novo Card"}
                    </h2>
                  </div>
                  <button type="button" onClick={() => setIsCardModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-zinc-600 hover:text-white transition-all">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-1">Identificador</label>
                    <input name="title" required defaultValue={editingCard?.title} placeholder="Ex: Finalizar UI do Kanban" className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-2xl px-5 text-sm font-medium text-white placeholder:text-zinc-800 focus:outline-none focus:border-purple-500/50 transition-all" />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-1">Descrição</label>
                    <textarea name="description" rows={3} defaultValue={editingCard?.description || ""} placeholder="Mais detalhes operacionais..." className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 text-sm font-medium text-white placeholder:text-zinc-800 focus:outline-none focus:border-purple-500/50 transition-all resize-none" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-1">Tag</label>
                      <select name="tag" defaultValue={editingCard?.tag || "Tarefa"} className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-2xl px-5 text-sm font-medium text-white focus:outline-none focus:border-purple-500/50 transition-all appearance-none cursor-pointer">
                        {["Tarefa", "Hábito", "Saúde", "Projeto", "App", "Outro"].map(t => (
                          <option key={t} value={t} className="bg-[#050505]">{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-1">Cor da Tag</label>
                      <div className="flex gap-3 pt-1">
                        {["purple", "red", "green", "blue", "amber"].map(c => (
                          <label key={c} className="cursor-pointer">
                            <input type="radio" name="tagColor" value={c} defaultChecked={editingCard?.tagColor === c || (c === "purple" && !editingCard)} className="peer sr-only" />
                            <div className={cn(
                              "w-6 h-6 rounded-full border-2 border-transparent peer-checked:border-white transition-all shadow-lg",
                              c === "purple" && "bg-purple-500 shadow-purple-500/20",
                              c === "red" && "bg-red-500 shadow-red-500/20",
                              c === "green" && "bg-green-500 shadow-green-500/20",
                              c === "blue" && "bg-blue-500 shadow-blue-500/20",
                              c === "amber" && "bg-amber-500 shadow-amber-500/20"
                            )} />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-1">Prioridade</label>
                      <select name="priority" defaultValue={editingCard?.priority || "medium"} className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-2xl px-5 text-sm font-medium text-white focus:outline-none focus:border-purple-500/50 transition-all appearance-none cursor-pointer">
                        <option value="low" className="bg-[#050505]">BAIXA</option>
                        <option value="medium" className="bg-[#050505]">MÉDIA</option>
                        <option value="high" className="bg-[#050505]">ALTA</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-1">Prazo</label>
                      <input type="date" name="dueDate" defaultValue={editingCard?.dueDate ? format(new Date(editingCard.dueDate), "yyyy-MM-dd") : ""} className="w-full h-12 bg-white/[0.02] border border-white/5 rounded-2xl px-5 text-sm font-medium text-white focus:outline-none focus:border-purple-500/50 transition-all [color-scheme:dark]" />
                    </div>
                  </div>

                  {editingCard && (
                    <div className="pt-6 border-t border-white/5">
                      <CardChecklist 
                        cardId={editingCard.id} 
                        checklist={editingCard.checklist} 
                        onUpdate={loadBoard} 
                      />
                    </div>
                  )}
                </div>

                <div className="pt-6">
                  <button type="submit" className="w-full h-14 bg-purple-500 text-white font-black rounded-2xl transition-all active:scale-[0.98] uppercase tracking-[0.3em] text-[11px] shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                    {editingCard ? "Salvar Alterações" : "Ativar Card"}
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
