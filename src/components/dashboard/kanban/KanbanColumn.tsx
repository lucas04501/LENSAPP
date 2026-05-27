"use client";

import { useState } from "react";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { 
  MoreHorizontal, Plus, Trash2, Pencil, Check
} from "lucide-react";
import { KanbanCard } from "./KanbanCard";
import { motion } from "framer-motion";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

type Card = any;
type Column = {
  id: string;
  name: string;
  color: string;
  order: number;
  cards: Card[];
};

export function KanbanColumn({ 
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
    transform,
    isDragging
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const handleRename = () => {
    if (name.trim() && name !== column.name) {
      onRename(column.id, name);
    }
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex flex-col w-[300px] shrink-0 h-full max-h-full",
        isDragging && "opacity-50 grayscale"
      )}
    >
      {/* ── Column Header ── */}
      <div className="flex items-center justify-between px-2 mb-4 group/header">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-1 h-5 rounded-full" style={{ backgroundColor: column.color || "#A855F7" }} />
          
          {isEditing ? (
            <div className="flex items-center gap-1">
              <input 
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={(e) => e.key === "Enter" && handleRename()}
                className="bg-white/5 border border-white/10 rounded px-2 py-0.5 text-[13px] font-bold text-white focus:outline-none focus:border-purple-500/50"
              />
              <button onClick={handleRename} className="p-1 text-green-500"><Check size={14} /></button>
            </div>
          ) : (
            <h3 
              onClick={() => setIsEditing(true)}
              className="text-[13px] font-black text-white/90 uppercase tracking-[0.2em] truncate cursor-pointer hover:text-white transition-colors"
            >
              {column.name}
            </h3>
          )}
          
          <span className="text-[10px] font-black text-zinc-600 bg-white/5 px-1.5 py-0.5 rounded-md tabular-nums">
            {cards.length}
          </span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover/header:opacity-100 transition-opacity">
          <button 
            onClick={() => onAddCard(column.id)}
            className="p-1.5 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-all"
          >
            <Plus size={14} />
          </button>
          
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="p-1.5 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-all">
                <MoreHorizontal size={14} />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="z-[100] min-w-[160px] bg-[#0A0A0A] border border-white/10 rounded-xl p-1 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <DropdownMenu.Item onSelect={() => setIsEditing(true)} className="flex items-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 outline-none rounded-lg cursor-pointer">
                  <Pencil size={12} /> Renomear
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => onDelete(column.id)} className="flex items-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-red-500/70 hover:text-red-500 hover:bg-red-500/10 outline-none rounded-lg cursor-pointer">
                  <Trash2 size={12} /> Excluir Coluna
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      {/* ── Cards Area ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar pr-1 pb-10 space-y-4">
        <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <KanbanCard 
              key={card.id} 
              card={card} 
              onEdit={onEditCard} 
              onDelete={onDeleteCard} 
            />
          ))}
        </SortableContext>
        
        <button 
          onClick={() => onAddCard(column.id)}
          className="w-full py-4 rounded-[1.25rem] border border-dashed border-white/5 text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] hover:border-white/10 hover:text-zinc-400 hover:bg-white/[0.01] transition-all group"
        >
          <Plus size={14} className="inline-block mr-2 group-hover:scale-110 transition-transform" />
          Adicionar Card
        </button>
      </div>
    </div>
  );
}
