"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { 
  GripVertical, Pencil, Trash2, Calendar, CheckSquare, Clock
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

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
  checklist: any[];
};

export function KanbanCard({ card, onEdit, onDelete }: { card: Card, onEdit: (c: Card) => void, onDelete: (id: string) => void }) {
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

  const daysLeft = card.dueDate ? differenceInDays(new Date(card.dueDate), new Date()) : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-[1.25rem] p-4 space-y-3 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 shadow-lg",
        isDragging && "opacity-50 grayscale ring-2 ring-purple-500/50"
      )}
    >
      {/* ── Drag Handle & Tag ── */}
      <div className="flex items-start justify-between gap-3">
        {card.tag ? (
          <span className={cn(
            "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm",
            tagColors[card.tagColor || "purple"]
          )}>
            {card.tag}
          </span>
        ) : <div />}
        <div 
          {...attributes} 
          {...listeners}
          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/5 rounded-lg cursor-grab active:cursor-grabbing transition-all"
        >
          <GripVertical className="w-3.5 h-3.5 text-zinc-600" />
        </div>
      </div>

      {/* ── Title ── */}
      <div>
        <h4 className="text-[13px] font-bold text-white leading-relaxed">{card.title}</h4>
        {card.description && (
          <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1 italic leading-snug">{card.description}</p>
        )}
      </div>

      {/* ── Progress & Metadata ── */}
      <div className="flex items-center justify-between pt-2 border-t border-white/[0.03]">
        <div className="flex items-center gap-3">
          <div className={cn("w-1.5 h-1.5 rounded-full shadow-glow", priorityColor)} title={`Prioridade: ${card.priority}`} />
          
          {card.checklist && card.checklist.length > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
              <CheckSquare className="w-3 h-3 text-zinc-500" />
              <span className="text-[9px] text-zinc-400 font-black tabular-nums">
                {card.checklist.filter(i => i.isChecked).length}/{card.checklist.length}
              </span>
            </div>
          )}

          {card.dueDate && (
            <div className={cn(
              "flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter",
              daysLeft !== null && daysLeft < 0 ? "text-red-500" : "text-zinc-600"
            )}>
              <Clock className="w-3 h-3" />
              {format(new Date(card.dueDate), "dd MMM", { locale: ptBR })}
            </div>
          )}
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
          <button onClick={() => onEdit(card)} className="p-1.5 hover:bg-white/5 rounded-full text-zinc-600 hover:text-white transition-colors">
            <Pencil className="w-3 h-3" />
          </button>
          <button onClick={() => onDelete(card.id)} className="p-1.5 hover:bg-red-500/10 rounded-full text-zinc-600 hover:text-red-500 transition-colors">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
