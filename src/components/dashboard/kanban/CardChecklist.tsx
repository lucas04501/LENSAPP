"use client";

import { useState, useEffect } from "react";
import { 
  DndContext, closestCorners, KeyboardSensor, PointerSensor, 
  useSensor, useSensors, DragEndEvent 
} from "@dnd-kit/core";
import { 
  arrayMove, SortableContext, sortableKeyboardCoordinates, 
  verticalListSortingStrategy, useSortable 
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, CheckSquare, ChevronDown, Check, X, GripVertical 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  addChecklistItem, toggleChecklistItem, updateChecklistItem, 
  deleteChecklistItem, reorderChecklist 
} from "@/lib/actions/kanban";
import toast from "react-hot-toast";

type ChecklistItem = {
  id: string;
  cardId: string;
  text: string;
  isChecked: boolean;
  order: number;
};

function SortableChecklistItem({ 
  item, onToggle, onDelete, onUpdate, isEditing, setEditing 
}: { 
  item: ChecklistItem, onToggle: (id: string) => void, onDelete: (id: string) => void, 
  onUpdate: (id: string, text: string) => void, isEditing: boolean, setEditing: () => void 
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  const style = { transform: CSS.Translate.toString(transform), transition };
  const [text, setText] = useState(item.text);

  return (
    <div ref={setNodeRef} style={style} className="group flex items-center gap-3 py-1.5 px-2 hover:bg-white/[0.02] rounded-lg transition-colors">
      <div {...attributes} {...listeners} className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing">
        <GripVertical className="w-3.5 h-3.5 text-zinc-600" />
      </div>
      <button 
        onClick={() => onToggle(item.id)}
        className={cn(
          "w-4 h-4 rounded-sm border flex items-center justify-center transition-all shrink-0",
          item.isChecked ? "bg-purple-500 border-purple-500" : "border-zinc-700 bg-transparent hover:border-purple-500/50"
        )}
      >
        {item.isChecked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />}
      </button>
      {isEditing ? (
        <input 
          autoFocus value={text} onChange={(e) => setText(e.target.value)}
          onBlur={() => onUpdate(item.id, text)} onKeyDown={(e) => e.key === "Enter" && onUpdate(item.id, text)}
          className="flex-1 bg-transparent border-none text-[13px] text-white focus:ring-0 p-0"
        />
      ) : (
        <span onClick={setEditing} className={cn("flex-1 text-[13px] transition-all cursor-text truncate", item.isChecked ? "text-zinc-600 line-through" : "text-zinc-300")}>
          {item.text}
        </span>
      )}
      <button onClick={() => onDelete(item.id)} className="opacity-0 group-hover:opacity-100 p-1 text-zinc-600 hover:text-red-500 transition-all">
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

export function CardChecklist({ cardId, checklist = [], onUpdate }: { cardId: string, checklist: any[], onUpdate: () => void }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [newItemText, setNewItemText] = useState("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [items, setItems] = useState<ChecklistItem[]>(checklist);

  useEffect(() => { setItems(checklist); }, [checklist]);

  const progress = items.length > 0 ? (items.filter(i => i.isChecked).length / items.length) * 100 : 0;

  const handleToggle = async (itemId: string) => {
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, isChecked: !i.isChecked } : i));
    try { await toggleChecklistItem(itemId); onUpdate(); } catch { toast.error("Erro ao atualizar"); setItems(checklist); }
  };

  const handleAddItem = async () => {
    if (!newItemText.trim()) return;
    try { await addChecklistItem(cardId, newItemText); setNewItemText(""); onUpdate(); } catch { toast.error("Erro ao adicionar"); }
  };

  const handleDeleteItem = async (itemId: string) => {
    try { await deleteChecklistItem(itemId); onUpdate(); } catch { toast.error("Erro ao excluir"); }
  };

  const handleUpdateText = async (itemId: string, text: string) => {
    if (!text.trim()) { setEditingItemId(null); return; }
    try { await updateChecklistItem(itemId, text); setEditingItemId(null); onUpdate(); } catch { toast.error("Erro ao renomear"); }
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(i => i.id === active.id);
      const newIndex = items.findIndex(i => i.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      try { await reorderChecklist(cardId, newItems.map(i => i.id)); onUpdate(); } catch { toast.error("Erro ao reordenar"); }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between cursor-pointer group" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-2">
          <CheckSquare className="w-3.5 h-3.5 text-purple-500" />
          <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest text-shadow-glow">Etapas</span>
          <span className="text-[10px] font-black text-zinc-700 tabular-nums">{items.filter(i => i.isChecked).length}/{items.length}</span>
        </div>
        <ChevronDown size={14} className={cn("text-zinc-600 transition-transform", !isExpanded && "-rotate-90")} />
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-4">
            {items.length > 0 && (
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-purple-600 to-purple-400" />
              </div>
            )}
            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
              <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-1">
                  {items.map(item => (
                    <SortableChecklistItem key={item.id} item={item} onToggle={handleToggle} onDelete={handleDeleteItem} onUpdate={handleUpdateText} isEditing={editingItemId === item.id} setEditing={() => setEditingItemId(item.id)} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
            <div className="flex items-center gap-3 px-2">
              <Plus size={14} className="text-zinc-600" />
              <input 
                value={newItemText} onChange={(e) => setNewItemText(e.target.value)} 
                onKeyDown={(e) => { if (e.key === "Enter") handleAddItem(); }} 
                placeholder="Adicionar etapa..." 
                className="flex-1 bg-transparent border-none text-[12px] text-zinc-300 placeholder:text-zinc-700 focus:ring-0 p-0"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
