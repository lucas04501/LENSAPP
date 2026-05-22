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
  { value: 1, label: "CRITICAL",  color: "#EF4444" },
  { value: 2, label: "LOW",       color: "#F97316" },
  { value: 3, label: "STABLE",    color: "#F59E0B" },
  { value: 4, label: "OPTIMIZED", color: "#22C55E" },
  { value: 5, label: "PEAK",      color: "#A855F7" },
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
      textareaRef.current.style.height = `${Math.max(300, textareaRef.current.scrollHeight)}px`;
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
      const val = tagInput.trim().toUpperCase();
      if (val && !tags.includes(val) && tags.length < 5) {
        setTags([...tags, val]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const avgMoodValue = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.mood, 0) / history.length)
    : 3;
  const avgMood = MOODS.find(m => m.value === avgMoodValue);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20 max-w-7xl mx-auto selection:bg-purple-500/30">
      
      {/* ── Main Editor ── */}
      <div className="lg:col-span-8 space-y-8">
        
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1 h-6 bg-purple rounded-full" />
              <h1 className="text-2xl font-bold text-white tracking-tight uppercase">
                Neural Journal
              </h1>
            </div>
            <p className="text-[#4B5563] text-[11px] font-mono tracking-widest uppercase">
              STATUS: ONLINE {'//'} DATE: <span className="text-white">{format(new Date(), "dd.MM.yyyy", { locale: ptBR })}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <AnimatePresence mode="wait">
              {saveStatus === "saving" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-[10px] font-bold text-purple uppercase tracking-[0.2em]"
                >
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Syncing...
                </motion.div>
              )}
              {saveStatus === "saved" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-[10px] font-bold text-green-500 uppercase tracking-[0.2em]"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  Secured
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={handleSave}
              className="h-9 px-5 rounded-md bg-purple text-white font-bold text-[11px] uppercase tracking-widest hover:bg-purple/90 transition-all flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              Commit
            </button>
          </div>
        </header>

        {/* Mood Selector (Geometric Nodes) */}
        <section className="bg-[#050505] border border-[#1A1A1A] p-6 rounded-xl">
          <p className="text-[10px] font-bold text-[#4B5563] uppercase tracking-[0.2em] mb-6">Neural State Calibration</p>
          <div className="flex items-center gap-8">
            {MOODS.map((m) => {
              const isActive = mood === m.value;
              return (
                <button
                  key={m.value}
                  onClick={() => setMood(m.value)}
                  className="flex flex-col items-center gap-3 group"
                >
                  <div className="relative">
                    <div 
                      className={cn(
                        "w-4 h-4 rounded-full transition-all duration-500 bg-white/5 backdrop-blur-md border border-white/10",
                        isActive ? "scale-125" : "group-hover:border-white/30"
                      )}
                      style={isActive ? { 
                        backgroundColor: m.color,
                        boxShadow: `0 0 20px ${m.color}`,
                        borderColor: m.color
                      } : {}}
                    />
                    {isActive && (
                      <motion.div
                        layoutId="pulse"
                        className="absolute inset-0 rounded-full bg-current opacity-20"
                        style={{ color: m.color }}
                        animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </div>
                  <span className={cn(
                    "text-[9px] font-bold uppercase tracking-widest transition-colors",
                    isActive ? "text-white" : "text-[#2D2D3A]"
                  )}>
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Text Area (HUD Panel) */}
        <section className="relative group">
          <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-[#1A1A1A] pointer-events-none group-focus-within:border-purple/50 transition-colors" />
          <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-[#1A1A1A] pointer-events-none group-focus-within:border-purple/50 transition-colors" />
          
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="[ ENTER NEURAL DATA... ]"
            className="w-full bg-black border border-[#1A1A1A] rounded-md p-8 text-sm text-zinc-300 font-mono leading-[1.8] min-h-[400px] focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-[#1A1A1A] no-scrollbar"
          />
          
          <div className="absolute bottom-4 right-6 flex items-center gap-4 text-[9px] font-mono text-[#2D2D3A] uppercase tracking-widest">
            <span>BYTES: {content.length * 2}</span>
            <span>LEN: {content.length}</span>
          </div>
        </section>

        {/* Tags */}
        <section className="bg-[#050505] border border-[#1A1A1A] p-6 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-3 h-3 text-purple" />
            <p className="text-[10px] font-bold text-[#4B5563] uppercase tracking-[0.2em]">Metadata Index (Max 5)</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <AnimatePresence>
              {tags.map((t) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="px-3 py-1.5 rounded bg-purple/10 border border-purple/30 text-[9px] font-bold text-purple uppercase tracking-widest flex items-center gap-2"
                >
                  {t}
                  <button onClick={() => removeTag(t)} className="hover:text-white transition-colors">
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
              placeholder="APPEND TAG..."
              className="bg-transparent border-none focus:outline-none text-[10px] font-mono text-zinc-300 placeholder:text-[#1A1A1A] py-1 flex-1 min-w-[150px]"
            />
          </div>
        </section>

      </div>

      {/* ── Sidebar ── */}
      <aside className="lg:col-span-4 space-y-8">
        
        {/* Stats */}
        <section className="space-y-4">
          <div className="bg-[#050505] border border-[#1A1A1A] p-5 rounded-xl flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#4B5563] uppercase tracking-widest">Persistence</p>
              <p className="text-lg font-bold text-white uppercase tracking-tight">{history.length} CYCLES</p>
            </div>
          </div>
          
          <div className="bg-[#050505] border border-[#1A1A1A] p-5 rounded-xl flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-purple/10 border border-purple/20 flex items-center justify-center shrink-0">
              <div 
                className="w-3 h-3 rounded-full shadow-[0_0_10px_currentcolor]" 
                style={{ color: avgMood?.color, backgroundColor: avgMood?.color }} 
              />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#4B5563] uppercase tracking-widest">Global Variance</p>
              <p className="text-lg font-bold text-white uppercase tracking-tight">
                {avgMood?.label}
              </p>
            </div>
          </div>
        </section>

        {/* History */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2">
              <BarChart2 className="w-3.5 h-3.5 text-purple" />
              Recent Logs
            </h2>
            <button className="text-[9px] font-bold text-[#4B5563] hover:text-purple transition-colors uppercase tracking-widest">
              Index All
            </button>
          </div>

          <div className="space-y-3">
            {history.length === 0 ? (
              <div className="border border-[#1A1A1A] border-dashed rounded-xl p-8 text-center text-[10px] font-mono text-[#2D2D3A] uppercase tracking-widest">
                NO DATA FOUND.
              </div>
            ) : (
              history.slice(0, 5).map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedEntry(entry)}
                  className="bg-[#050505] border border-[#1A1A1A] p-4 rounded-xl hover:border-purple/30 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] font-mono text-[#4B5563] uppercase tracking-widest">
                      {format(new Date(entry.date), "dd.MM.yy", { locale: ptBR })}
                    </span>
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ 
                        backgroundColor: MOODS.find(m => m.value === entry.mood)?.color,
                        boxShadow: `0 0 8px ${MOODS.find(m => m.value === entry.mood)?.color}50`
                      }} 
                    />
                  </div>
                  <p className="text-[11px] font-mono text-[#2D2D3A] line-clamp-2 leading-relaxed mb-3 group-hover:text-zinc-400 transition-colors uppercase">
                    {entry.content}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((t: string) => (
                      <span key={t} className="text-[8px] font-bold text-purple/40 uppercase tracking-widest">
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
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] animate-in fade-in duration-200" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-black border border-[#1A1A1A] rounded-xl p-8 shadow-2xl z-[101] animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto no-scrollbar selection:bg-purple-500/30">
            {selectedEntry && (
              <>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-4 h-4 rounded-full shadow-[0_0_15px_currentcolor]" 
                      style={{ color: MOODS.find(m => m.value === selectedEntry.mood)?.color, backgroundColor: MOODS.find(m => m.value === selectedEntry.mood)?.color }} 
                    />
                    <div>
                      <h2 className="text-lg font-bold text-white uppercase tracking-tight">
                        Log Entry: {format(new Date(selectedEntry.date), "dd MMMM yyyy", { locale: ptBR })}
                      </h2>
                      <p className="text-[9px] text-[#4B5563] font-mono uppercase tracking-[0.2em] mt-0.5">
                        Neural State: {MOODS.find(m => m.value === selectedEntry.mood)?.label}
                      </p>
                    </div>
                  </div>
                  <Dialog.Close asChild>
                    <button className="p-1.5 hover:bg-white/5 rounded transition-colors text-[#4B5563]">
                      <X className="w-4 h-4" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="space-y-6">
                  <div className="text-sm text-zinc-300 font-mono leading-[2] whitespace-pre-wrap border-l border-purple/20 pl-6 py-2 uppercase">
                    {selectedEntry.content}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-6 border-t border-[#1A1A1A]">
                    {selectedEntry.tags.map((t: string) => (
                      <span key={t} className="px-3 py-1.5 rounded bg-purple/10 border border-purple/30 text-[9px] font-bold text-purple uppercase tracking-widest">
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
