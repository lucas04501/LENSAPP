"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Calendar, Tag, Trash2, 
  Search, Filter, ChevronRight, X,
  Save, CheckCircle2, Loader2, Sparkles,
  Flame, TrendingUp, BarChart2
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { saveEntry, deleteEntry } from "@/lib/actions/journal";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";

const MOODS = [
  { emoji: "😫", value: 1, label: "Péssimo", color: "#EF4444" },
  { emoji: "😕", value: 2, label: "Ruim",    color: "#F97316" },
  { emoji: "😐", value: 3, label: "Normal",  color: "#F59E0B" },
  { emoji: "🙂", value: 4, label: "Bom",     color: "#22C55E" },
  { emoji: "🔥", value: 5, label: "Incrível", color: "#A855F7" },
];

interface JournalContentProps {
  userId: string;
  initialToday: any;
  history: any[];
}

export function JournalContent({ userId, initialToday, history }: JournalContentProps) {
  const [content, setContent] = useState(initialToday?.content || "");
  const [mood, setMood] = useState(initialToday?.mood || 3);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(initialToday?.tags || []);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  // Debounced Auto-save
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (content !== (initialToday?.content || "") || mood !== (initialToday?.mood || 3) || JSON.stringify(tags) !== JSON.stringify(initialToday?.tags || [])) {
        handleSave();
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [content, mood, tags]);

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaveStatus("saving");
    const res = await saveEntry(userId, { content, mood, tags });
    if (res.success) {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } else {
      toast.error(res.error || "Erro ao salvar");
      setSaveStatus("idle");
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      const val = tagInput.trim().toLowerCase();
      if (val && !tags.includes(val) && tags.length < 5) {
        setTags([...tags, val]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const avgMood = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.mood, 0) / history.length)
    : 3;

  const currentStreak = 0; // Placeholder for logic or extra data

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20 max-w-7xl mx-auto">
      
      {/* ── Main Editor ── */}
      <div className="lg:col-span-8 space-y-6">
        
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-purple" />
              Seu Diário
            </h1>
            <p className="text-text-muted text-sm mt-1">
              Hoje é <span className="text-purple font-bold">{format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <AnimatePresence mode="wait">
              {saveStatus === "saving" && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-2 text-[10px] font-black text-purple uppercase tracking-widest"
                >
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Salvando...
                </motion.div>
              )}
              {saveStatus === "saved" && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-2 text-[10px] font-black text-green uppercase tracking-widest"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  Salvo ✓
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple to-red text-white font-bold text-xs shadow-lg shadow-purple/20 hover:scale-[1.02] transition-all active:scale-[0.98] uppercase tracking-widest"
            >
              <Save className="w-3.5 h-3.5" />
              Salvar
            </button>
          </div>
        </header>

        {/* Mood Selector */}
        <section className="glass rounded-3xl border border-white/5 p-6 bg-[#050505]">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4">Como você está se sentindo agora?</p>
          <div className="flex justify-between sm:justify-start sm:gap-6">
            {MOODS.map((m) => {
              const isActive = mood === m.value;
              return (
                <button
                  key={m.value}
                  onClick={() => setMood(m.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 group transition-all duration-300",
                    !isActive && "opacity-40 hover:opacity-100"
                  )}
                >
                  <div 
                    className={cn(
                      "text-3xl sm:text-4xl p-2 rounded-2xl transition-all duration-300",
                      isActive ? "bg-white/5 shadow-xl scale-110" : "group-hover:scale-110"
                    )}
                    style={isActive ? { 
                      boxShadow: `0 0 20px ${m.color}30`,
                      border: `1px solid ${m.color}40`
                    } : {}}
                  >
                    {m.emoji}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-tighter" style={{ color: isActive ? m.color : "#505050" }}>
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Text Area */}
        <section className="relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Como foi seu dia? O que aprendeu? O que quer melhorar?"
            className="w-full bg-[#080808] border border-white/5 rounded-3xl p-8 text-base text-text-primary leading-[1.8] min-h-[300px] focus:outline-none focus:border-purple/30 transition-all placeholder:text-text-muted/20 selection:bg-purple/30"
          />
          <div className="absolute bottom-6 right-8 flex items-center gap-2 text-[10px] font-bold text-text-muted/40 uppercase tracking-widest pointer-events-none">
            {content.length} caracteres
          </div>
        </section>

        {/* Tags */}
        <section className="glass rounded-3xl border border-white/5 p-6 bg-[#050505]">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-3.5 h-3.5 text-purple" />
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Tags (máx 5)</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {tags.map((t) => (
                <motion.span
                  key={t}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="px-3 py-1.5 rounded-xl bg-purple/10 border border-purple/20 text-[10px] font-black text-purple uppercase tracking-widest flex items-center gap-2 group"
                >
                  {t}
                  <button onClick={() => removeTag(t)} className="hover:text-red transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Adicione tags..."
              className="bg-transparent border-none focus:outline-none text-xs text-text-primary placeholder:text-text-muted/30 py-1 flex-1 min-w-[120px]"
            />
          </div>
        </section>

      </div>

      {/* ── Sidebar: History & Stats ── */}
      <aside className="lg:col-span-4 space-y-8">
        
        {/* Stats */}
        <section className="grid grid-cols-1 gap-4">
          <div className="glass rounded-3xl border border-white/5 p-6 bg-[#050505] flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red/10 border border-red/20 flex items-center justify-center">
              <Flame className="w-6 h-6 text-red" />
            </div>
            <div>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Sequência</p>
              <p className="text-xl font-black text-white italic tracking-tighter">{history.length} DIAS</p>
            </div>
          </div>
          
          <div className="glass rounded-3xl border border-white/5 p-6 bg-[#050505] flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple/10 border border-purple/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple" />
            </div>
            <div>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Humor Médio</p>
              <p className="text-xl font-black text-white italic tracking-tighter">
                {MOODS.find(m => m.value === avgMood)?.emoji} {MOODS.find(m => m.value === avgMood)?.label.toUpperCase()}
              </p>
            </div>
          </div>
        </section>

        {/* History */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
              <BarChart2 className="w-3.5 h-3.5 text-purple" />
              Histórico Recente
            </h2>
            <button className="text-[10px] font-bold text-text-muted hover:text-purple transition-colors uppercase tracking-widest">
              Ver Tudo
            </button>
          </div>

          <div className="space-y-3">
            {history.length === 0 ? (
              <div className="glass rounded-2xl border border-white/5 p-8 text-center italic text-xs text-text-muted">
                Nenhuma entrada anterior.
              </div>
            ) : (
              history.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedEntry(entry)}
                  className="glass rounded-2xl border border-white/5 p-4 bg-[#050505] hover:border-white/10 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">
                      {format(new Date(entry.date), "dd MMM yyyy", { locale: ptBR })}
                    </span>
                    <span className="text-xl">{MOODS.find(m => m.value === entry.mood)?.emoji}</span>
                  </div>
                  <p className="text-xs text-text-primary line-clamp-2 leading-relaxed mb-3 italic text-text-muted">
                    &quot;{entry.content}&quot;
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {entry.tags.map((t: string) => (
                      <span key={t} className="text-[8px] font-black text-purple/60 uppercase tracking-widest px-1.5 py-0.5 rounded bg-purple/5 border border-purple/10">
                        #{t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>
      </aside>

      {/* ── Entry Detail Modal ── */}
      <Dialog.Root open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-200" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#080808] border border-white/10 rounded-[2rem] p-8 shadow-2xl z-[101] animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto no-scrollbar">
            {selectedEntry && (
              <>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl p-3 rounded-2xl bg-white/5 border border-white/5 shadow-xl">
                      {MOODS.find(m => m.value === selectedEntry.mood)?.emoji}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
                        {format(new Date(selectedEntry.date), "dd 'de' MMMM", { locale: ptBR })}
                      </h2>
                      <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mt-1">
                        Dia {MOODS.find(m => m.value === selectedEntry.mood)?.label}
                      </p>
                    </div>
                  </div>
                  <Dialog.Close asChild>
                    <button className="p-2 hover:bg-white/5 rounded-xl transition-colors text-text-muted">
                      <X className="w-4 h-4" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="space-y-6">
                  <div className="text-base text-text-primary leading-[1.8] italic whitespace-pre-wrap border-l-2 border-purple/20 pl-6 py-2">
                    &quot;{selectedEntry.content}&quot;
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                    {selectedEntry.tags.map((t: string) => (
                      <span key={t} className="px-3 py-1.5 rounded-xl bg-purple/10 border border-purple/20 text-[10px] font-black text-purple uppercase tracking-widest">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  );
}
