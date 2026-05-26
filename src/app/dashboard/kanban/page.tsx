"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Plus, Calendar, GripVertical, Trash2, X, Pencil,
  CheckSquare, ChevronDown, Check
} from "lucide-react";
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  getBoard, 
  createCard, 
  updateCard, 
  moveCard, 
  deleteCard, 
  createColumn, 
  deleteColumn, 
  renameColumn,
  addChecklistItem,
  toggleChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
  reorderChecklist
} from "@/lib/actions/kanban";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// --- Types ---
type ChecklistItem = {
  id: string;
  cardId: string;
  text: string;
  isChecked: boolean;
  order: number;
};

type Card = {
  id: string;
  columnId: string;
  title: string;
  description?: string;
  tag?: string;
  tagColor?: string;
  priority: string;
  dueDate?: Date;
  order: number;
  checklist: ChecklistItem[];
};

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

// --- Components ---

function SortableChecklistItem({ 
  item, 
  onToggle, 
  onDelete, 
  onUpdate,
  isEditing,
  setEditing
}: { 
  item: ChecklistItem, 
  onToggle: (id: string) => void,
  onDelete: (id: string) => void,
  onUpdate: (id: string, text: string) => void,
  isEditing: boolean,
  setEditing: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const [text, setText] = useState(item.text);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center gap-3 py-1 px-1 hover:bg-white/[0.02] rounded-md transition-colors"
    >
      <div {...attributes} {...listeners} className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing">
        <GripVertical className="w-3.5 h-3.5 text-zinc-600" />
      </div>

      <button 
        onClick={() => onToggle(item.id)}
        className={cn(
          "w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0",
          item.isChecked 
            ? "bg-[#7C3AED] border-[#7C3AED]" 
            : "border-[#374151] bg-transparent hover:border-[#4B5563]"
        )}
      >
        {item.isChecked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />}
      </button>

      {isEditing ? (
        <input 
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => onUpdate(item.id, text)}
          onKeyDown={(e) => e.key === "Enter" && onUpdate(item.id, text)}
          className="flex-1 bg-transparent border-none text-[13px] text-white focus:ring-0 p-0"
        />
      ) : (
        <span 
          onClick={setEditing}
          className={cn(
            "flex-1 text-[13px] transition-all cursor-text truncate",
            item.isChecked ? "text-[#6B7280] line-through" : "text-[#E5E7EB]"
          )}
        >
          {item.text}
        </span>
      )}

      <button 
        onClick={() => onDelete(item.id)}
        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-600 hover:text-red-500 transition-all"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

function CardChecklist({ 
  card, 
  onUpdate 
}: { 
  card: Card, 
  onUpdate: () => void 
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [newItemText, setNewItemText] = useState("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [items, setItems] = useState<ChecklistItem[]>(card.checklist || []);

  useEffect(() => {
    setItems(card.checklist || []);
  }, [card.checklist]);

  const completedCount = items.filter(i => i.isChecked).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleToggle = async (itemId: string) => {
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, isChecked: !i.isChecked } : i));
    try {
      await toggleChecklistItem(itemId);
      onUpdate();
    } catch (error) {
      toast.error("Erro ao atualizar item");
      setItems(card.checklist || []);
    }
  };

  const handleAddItem = async () => {
    if (!newItemText.trim()) return;
    try {
      await addChecklistItem(card.id, newItemText);
      setNewItemText("");
      onUpdate();
    } catch (error) {
      toast.error("Erro ao adicionar item");
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteChecklistItem(itemId);
      onUpdate();
    } catch (error) {
      toast.error("Erro ao excluir item");
    }
  };

  const handleUpdateText = async (itemId: string, text: string) => {
    if (!text.trim()) {
      setEditingItemId(null);
      return;
    }
    try {
      await updateChecklistItem(itemId, text);
      setEditingItemId(null);
      onUpdate();
    } catch (error) {
      toast.error("Erro ao renomear item");
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(i => i.id === active.id);
      const newIndex = items.findIndex(i => i.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      try {
        await reorderChecklist(card.id, newItems.map(i => i.id));
        onUpdate();
      } catch (error) {
        toast.error("Erro ao reordenar");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div 
        className="group flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <CheckSquare className="w-3.5 h-3.5 text-[#7C3AED]" />
          <span className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.08em]">
            Checklist
          </span>
          {totalCount > 0 && (
            <span className="text-[10px] text-zinc-500 font-bold ml-1">
              {completedCount}/{totalCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/5 rounded transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-zinc-500 hover:text-white" />
          </button>
          <ChevronDown 
            className={cn("w-3.5 h-3.5 text-zinc-500 transition-transform", !isExpanded && "-rotate-90")} 
          />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-3"
          >
            {totalCount > 0 && (
              <div className="h-[3px] w-full bg-[#1E1E2E] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-[#7C3AED] to-[#22C55E]"
                />
              </div>
            )}

            <DndContext 
              sensors={sensors} 
              collisionDetection={closestCorners} 
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-0.5">
                  {items.map((item) => (
                    <SortableChecklistItem 
                      key={item.id} 
                      item={item} 
                      onToggle={handleToggle}
                      onDelete={handleDeleteItem}
                      onUpdate={handleUpdateText}
                      isEditing={editingItemId === item.id}
                      setEditing={() => setEditingItemId(item.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <div className="flex items-center gap-3 px-1 mt-2">
              <Plus className="w-4 h-4 text-[#4B5563]" />
              <input 
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddItem();
                  if (e.key === "Escape") { setNewItemText(""); (e.target as HTMLInputElement).blur(); }
                }}
                placeholder="Adicionar item..."
                className="flex-1 bg-transparent border-none text-[12px] text-[#E5E7EB] placeholder:text-[#4B5563] focus:ring-0 p-0 border-b border-transparent focus:border-[#7C3AED] transition-colors"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function KanbanCard({ card, onEdit, onDelete }: { card: Card, onEdit: (c: Card) => void, onDelete: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: card.id,
    data: {
      type: "Card",
      card,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const priorityColor = {
    high: "bg-red-500",
    medium: "bg-amber-500",
    low: "bg-zinc-500",
  }[card.priority] || "bg-zinc-500";

  const tagColors: Record<string, string> = {
    purple: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    red:    "text-red-400 bg-red-400/10 border-red-400/20",
    green:  "text-green-400 bg-green-400/10 border-green-400/20",
    blue:   "text-blue-400 bg-blue-400/10 border-blue-400/20",
    amber:  "text-amber-400 bg-amber-400/10 border-amber-400/20",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative bg-[#0F0F14] border border-[#1E1E2E] rounded-lg p-3 space-y-2 hover:border-[#3E3E4E] transition-all cursor-default",
        isDragging && "opacity-50 grayscale"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        {card.tag && (
          <span className={cn(
            "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
            tagColors[card.tagColor || "purple"]
          )}>
            {card.tag}
          </span>
        )}
        <div 
          {...attributes} 
          {...listeners}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/5 rounded cursor-grab active:cursor-grabbing transition-opacity"
        >
          <GripVertical className="w-3.5 h-3.5 text-zinc-500" />
        </div>
      </div>

      <h4 className="text-[13px] font-medium text-white leading-snug">{card.title}</h4>
      
      {card.description && (
        <p className="text-[11px] text-zinc-500 line-clamp-2">{card.description}</p>
      )}

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <div className={cn("w-1.5 h-1.5 rounded-full", priorityColor)} title={`Prioridade: ${card.priority}`} />
          
          {card.checklist && card.checklist.length > 0 && (
            <div className="flex items-center gap-1">
              <CheckSquare 
                className={cn(
                  "w-3 h-3",
                  card.checklist.every(i => i.isChecked) ? "text-[#22C55E]" : 
                  card.checklist.some(i => i.isChecked) ? "text-[#F59E0B]" : "text-[#6B7280]"
                )} 
              />
              <span className="text-[10px] text-zinc-500 font-bold">
                {card.checklist.filter(i => i.isChecked).length}/{card.checklist.length}
              </span>
            </div>
          )}

          {card.dueDate && (
            <div className="flex items-center gap-1 text-[10px] text-zinc-500">
              <Calendar className="w-3 h-3" />
              {format(new Date(card.dueDate), "dd MMM", { locale: ptBR })}
            </div>
          )}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(card)} className="p-1 hover:bg-white/5 rounded text-zinc-500 hover:text-white transition-colors">
            <Pencil className="w-3 h-3" />
          </button>
          <button onClick={() => onDelete(card.id)} className="p-1 hover:bg-red-500/10 rounded text-zinc-500 hover:text-red-500 transition-colors">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

function KanbanColumnComponent({ 
  column, 
  cards, 
  onAddCard, 
  onRename, 
  onDelete,
  onEditCard,
  onDeleteCard
}: { 
  column: Column, 
  cards: Card[], 
  onAddCard: (colId: string) => void,
  onRename: (id: string, name: string) => void,
  onDelete: (id: string) => void,
  onEditCard: (c: Card) => void,
  onDeleteCard: (id: string) => void
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(column.name);

  const {
    setNodeRef,
    transition,
    isDragging
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const handleRename = () => {
    if (name.trim() && name !== column.name) {
      onRename(column.id, name);
    }
    setIsEditing(false);
  };

  return (
    <motion.div
      ref={setNodeRef}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col w-[280px] shrink-0 bg-[#09090B] rounded-xl overflow-hidden h-fit",
        isDragging && "opacity-50"
      )}
    >
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: column.color }} />
          {isEditing ? (
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              className="bg-black/40 border border-[#7C3AED] rounded px-1.5 py-0.5 text-sm font-bold text-white focus:outline-none w-full"
            />
          ) : (
            <h3 
              onDoubleClick={() => setIsEditing(true)}
              className="text-sm font-bold text-white truncate cursor-text"
            >
              {column.name}
            </h3>
          )}
          <span className="px-1.5 py-0.5 rounded-full bg-[#0F0F14] border border-[#1E1E2E] text-[10px] text-zinc-500 font-bold shrink-0">
            {cards.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onDelete(column.id)}
            className="p-1 hover:bg-red-500/10 rounded text-zinc-600 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-3 min-h-[150px]">
        <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map(card => (
            <KanbanCard 
              key={card.id} 
              card={card} 
              onEdit={onEditCard} 
              onDelete={onDeleteCard} 
            />
          ))}
        </SortableContext>
      </div>

      <button
        onClick={() => onAddCard(column.id)}
        className="flex items-center gap-2 w-full p-3 text-[11px] font-bold uppercase tracking-wider text-zinc-500 hover:text-white hover:bg-[#0F0F14] transition-all"
      >
        <Plus className="w-3.5 h-3.5" />
        Adicionar Card
      </button>
    </motion.div>
  );
}

function NewColumnInline({ boardId, onCreated }: { boardId: string, onCreated: () => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#7C3AED");
  const [showColors, setShowColors] = useState(false);

  const COLORS = [
    { value: "#7C3AED", name: "purple" },
    { value: "#EF4444", name: "red" },
    { value: "#22C55E", name: "green" },
    { value: "#3B82F6", name: "blue" },
    { value: "#F59E0B", name: "amber" },
    { value: "#6B7280", name: "gray" },
  ];

  const handleCreate = async () => {
    if (!name.trim()) return;
    try {
      await createColumn(boardId, name, color);
      setName("");
      setColor("#7C3AED");
      setIsExpanded(false);
      setShowColors(false);
      onCreated();
    } catch (error) {
      console.error("CLIENT_KANBAN_ERROR [createColumn]:", error);
      toast.error("Erro ao criar coluna");
    }
  };

  const handleCancel = () => {
    setName("");
    setColor("#7C3AED");
    setIsExpanded(false);
    setShowColors(false);
  };

  return (
    <motion.div
      layout
      layoutId="new-column"
      className={cn(
        "flex flex-col w-[280px] shrink-0 rounded-xl transition-all duration-200 h-fit",
        !isExpanded 
          ? "border border-dashed border-[#1E1E2E] hover:border-[#7C3AED] hover:bg-[#7C3AED]/[0.04] cursor-pointer group p-8 items-center justify-center gap-2" 
          : "bg-[#7C3AED]/[0.06] border border-[#7C3AED] p-4 cursor-default"
      )}
      onClick={() => !isExpanded && setIsExpanded(true)}
    >
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.div
            key="ghost"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-2"
          >
            <Plus className="w-5 h-5 text-[#4B5563] group-hover:text-[#7C3AED] transition-colors" />
            <span className="text-[12px] text-[#4B5563] group-hover:text-[#7C3AED] transition-colors">Nova coluna</span>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full space-y-4"
          >
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setShowColors(true);
                if (e.key === "Escape") handleCancel();
              }}
              placeholder="Nome da coluna"
              className="w-full bg-transparent border-none text-[15px] font-medium text-white placeholder:text-zinc-600 focus:ring-0 p-0"
            />

            <AnimatePresence>
              {showColors && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-3 overflow-hidden"
                >
                  <label className="text-[10px] uppercase font-bold text-[#6B7280] tracking-widest">Cor</label>
                  <div className="flex items-center justify-between">
                    {COLORS.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setColor(c.value)}
                        className={cn(
                          "w-7 h-7 rounded-full transition-all relative",
                          color === c.value && "scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#09090B]"
                        )}
                        style={{ backgroundColor: c.value }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreate();
                }}
                disabled={!name.trim()}
                className="px-3.5 py-1.5 rounded-md text-[12px] font-bold text-white transition-all shadow-lg"
                style={{ backgroundColor: color }}
              >
                Criar
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                className="px-3.5 py-1.5 rounded-md text-[12px] border border-[#1E1E2E] text-[#6B7280] hover:text-white hover:bg-white/5 transition-all"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- Main Page ---

export default function KanbanPage() {
  const { status } = useSession();
  const router = useRouter();

  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<Card | null>(null);

  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const loadBoard = useCallback(async () => {
    if (status !== "authenticated") return;
    setLoading(true);
    try {
      const data = await getBoard();
      setBoard(data as any);
    } catch (error) {
      console.error("CLIENT_KANBAN_ERROR [loadBoard]:", error);
      toast.error("Erro ao carregar board");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") loadBoard();
  }, [status, loadBoard]);

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
      console.error("CLIENT_KANBAN_ERROR [handleDeleteCard]:", error);
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

    // Dropping a Card over another Card
    if (isActiveACard && isOverACard) {
      setBoard((prev) => {
        if (!prev) return null;
        const activeCard = active.data.current?.card;
        const overCard = over.data.current?.card;
        
        const activeColumn = prev.columns.find(col => col.id === activeCard.columnId);
        const overColumn = prev.columns.find(col => col.id === overCard.columnId);

        if (!activeColumn || !overColumn) return prev;

        if (activeColumn.id !== overColumn.id) {
          const activeCards = [...activeColumn.cards];
          const overCards = [...overColumn.cards];
          const activeIndex = activeCards.findIndex(c => c.id === activeId);
          const overIndex = overCards.findIndex(c => c.id === overId);

          const movedCard = { ...activeCards[activeIndex], columnId: overColumn.id };
          activeCards.splice(activeIndex, 1);
          overCards.splice(overIndex, 0, movedCard);

          return {
            ...prev,
            columns: prev.columns.map(col => {
              if (col.id === activeColumn.id) return { ...col, cards: activeCards };
              if (col.id === overColumn.id) return { ...col, cards: overCards };
              return col;
            })
          };
        }
        return prev;
      });
    }

    // Dropping a Card over a Column
    const isOverAColumn = over.data.current?.type === "Column";
    if (isActiveACard && isOverAColumn) {
      setBoard((prev) => {
        if (!prev) return null;
        const activeCard = active.data.current?.card;
        const activeColumn = prev.columns.find(col => col.id === activeCard.columnId);
        const overColumn = prev.columns.find(col => col.id === overId);

        if (!activeColumn || !overColumn || activeColumn.id === overColumn.id) return prev;

        const activeCards = [...activeColumn.cards];
        const overCards = [...overColumn.cards];
        const activeIndex = activeCards.findIndex(c => c.id === activeId);

        const movedCard = { ...activeCards[activeIndex], columnId: overColumn.id };
        activeCards.splice(activeIndex, 1);
        overCards.push(movedCard);

        return {
          ...prev,
          columns: prev.columns.map(col => {
            if (col.id === activeColumn.id) return { ...col, cards: activeCards };
            if (col.id === overColumn.id) return { ...col, cards: overCards };
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

        try {
          // You might need a moveColumn action here if orders are persisted
          // await moveColumn(activeId, newIndex + 1);
        } catch (error) {
          console.error("CLIENT_KANBAN_ERROR [moveColumn]:", error);
        }
      }
      return;
    }

    if (active.data.current?.type === "Card") {
      const overCard = over.data.current?.card;
      const targetColumnId = over.data.current?.type === "Column" ? overId : overCard.columnId;

      const finalColumn = board?.columns.find(c => c.id === targetColumnId);
      if (!finalColumn) return;

      const cardIndex = finalColumn.cards.findIndex(c => c.id === activeId);
      const newOrder = cardIndex !== -1 ? cardIndex + 1 : finalColumn.cards.length + 1;

      try {
        await moveCard(activeId, targetColumnId, newOrder);
        loadBoard();
      } catch (error) {
        console.error("CLIENT_KANBAN_ERROR [moveCard]:", error);
        toast.error("Erro ao mover card");
        loadBoard();
      }
    }
  };

  if (loading && !board) return (
    <div className="p-8 space-y-8 animate-pulse">
      <div className="h-8 w-48 bg-[#0F0F14] rounded-lg" />
      <div className="flex gap-6 overflow-hidden">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="w-[280px] h-[600px] bg-[#0F0F14] rounded-xl border border-[#1E1E2E]" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#09090B] text-white p-4 lg:p-8 flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold">Kanban</h1>
        <p className="text-zinc-400 text-sm">Arraste os cards entre as colunas</p>
      </header>

      <div className="flex-1 overflow-x-auto no-scrollbar pb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          <div className="flex gap-6 h-full min-h-[600px]">
            <SortableContext items={board?.columns.map(c => c.id) || []}>
              {board?.columns.map(column => (
                <KanbanColumnComponent
                  key={column.id}
                  column={column}
                  cards={column.cards}
                  onAddCard={handleAddCard}
                  onRename={async (id, name) => {
                    try {
                      await renameColumn(id, name);
                      loadBoard();
                    } catch (err) {
                      console.error("CLIENT_KANBAN_ERROR [renameColumn]:", err);
                      toast.error("Erro ao renomear");
                    }
                  }}
                  onDelete={async (id) => {
                    if (confirm("Excluir esta coluna?")) {
                      try {
                        await deleteColumn(id);
                        loadBoard();
                      } catch (err) {
                        console.error("CLIENT_KANBAN_ERROR [deleteColumn]:", err);
                        toast.error("Erro ao excluir");
                      }
                    }
                  }}
                  onEditCard={handleEditCard}
                  onDeleteCard={handleDeleteCard}
                />
              ))}
            </SortableContext>
            
            {board && (
              <NewColumnInline 
                boardId={board.id} 
                onCreated={loadBoard} 
              />
            )}
          </div>

          <DragOverlay dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: {
                active: {
                  opacity: "0.5",
                },
              },
            }),
          }}>
            {activeCard && (
              <div className="opacity-80 scale-105">
                <KanbanCard card={activeCard} onEdit={() => {}} onDelete={() => {}} />
              </div>
            )}
            {activeColumn && (
              <div className="opacity-80 scale-105">
                <KanbanColumnComponent 
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

      <AnimatePresence>
        {isCardModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCardModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#0F0F14] border border-[#1E1E2E] rounded-2xl shadow-2xl overflow-hidden"
            >
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
                } catch (error) {
                  console.error("CLIENT_KANBAN_ERROR [saveCard]:", error);
                  toast.error("Erro ao salvar card");
                }
              }} className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">
                    {editingCard ? "Editar Card" : "Novo Card"}
                  </h2>
                  <button type="button" onClick={() => setIsCardModalOpen(false)} className="p-1 hover:bg-white/5 rounded text-zinc-500 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Título</label>
                    <input 
                      name="title" 
                      required 
                      defaultValue={editingCard?.title}
                      placeholder="O que precisa ser feito?"
                      className="w-full bg-black/40 border border-[#1E1E2E] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#7C3AED]" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Descrição</label>
                    <textarea 
                      name="description" 
                      rows={3} 
                      defaultValue={editingCard?.description || ""}
                      placeholder="Mais detalhes..."
                      className="w-full bg-black/40 border border-[#1E1E2E] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#7C3AED] resize-none" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Tag</label>
                      <select 
                        name="tag" 
                        defaultValue={editingCard?.tag || "Tarefa"}
                        className="w-full bg-black/40 border border-[#1E1E2E] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#7C3AED]"
                      >
                        {["Tarefa", "Hábito", "Saúde", "Projeto", "App", "Outro"].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Cor da Tag</label>
                      <div className="flex gap-2 pt-1">
                        {["purple", "red", "green", "blue", "amber"].map(c => (
                          <label key={c} className="cursor-pointer">
                            <input 
                              type="radio" 
                              name="tagColor" 
                              value={c} 
                              defaultChecked={editingCard?.tagColor === c || (c === "purple" && !editingCard)} 
                              className="peer sr-only" 
                            />
                            <div className={cn(
                              "w-5 h-5 rounded-full border-2 border-transparent peer-checked:border-white transition-all",
                              c === "purple" && "bg-purple-500",
                              c === "red" && "bg-red-500",
                              c === "green" && "bg-green-500",
                              c === "blue" && "bg-blue-500",
                              c === "amber" && "bg-amber-500"
                            )} />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Prioridade</label>
                      <select 
                        name="priority" 
                        defaultValue={editingCard?.priority || "medium"}
                        className="w-full bg-black/40 border border-[#1E1E2E] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#7C3AED]"
                      >
                        <option value="low">Baixa</option>
                        <option value="medium">Média</option>
                        <option value="high">Alta</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Prazo</label>
                      <input 
                        type="date" 
                        name="dueDate" 
                        defaultValue={editingCard?.dueDate ? format(new Date(editingCard.dueDate), "yyyy-MM-dd") : ""}
                        className="w-full bg-black/40 border border-[#1E1E2E] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#7C3AED]" 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-purple-500/20">
                    {editingCard ? "Salvar Alterações" : "Criar Card"}
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
