"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, ChevronRight, Plus, MoreHorizontal, 
  ArrowLeft, Pin, Trash2, Settings2, Check, Search, 
  Layers, StickyNote, Sparkles, Hash
} from "lucide-react";
import { useNotesPanelStore } from "@/store";
import { useSession } from "next-auth/react";
import { 
  getProjects, createProject, updateProject, deleteProject,
  getNotes, createNote, updateNote, deleteNote, togglePin 
} from "@/lib/actions/notes";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function NotesPanel() {
  const { data: session } = useSession();
  const userId = session?.user?.id as string;
  
  const { 
    isOpen, togglePanel, closePanel, 
    activeProjectId, setActiveProject,
    activeNoteId, setActiveNote 
  } = useNotesPanelStore();

  const [projects, setProjects] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [activeNote, setActiveNoteData] = useState<any>(null);
  const [showProjectList, setShowProjectList] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectColor, setNewProjectColor] = useState("#A855F7");

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (userId) fetchProjects();
  }, [userId]);

  useEffect(() => {
    if (userId && isOpen) fetchNotes();
  }, [userId, activeProjectId, isOpen]);

  useEffect(() => {
    if (activeNoteId) {
      const note = notes.find(n => n.id === activeNoteId);
      if (note) setActiveNoteData(note);
    } else {
      setActiveNoteData(null);
    }
  }, [activeNoteId, notes]);

  const fetchProjects = async () => {
    const res = await getProjects(userId);
    if (res.success && res.data) setProjects(res.data);
  };

  const fetchNotes = async () => {
    const res = await getNotes(userId, activeProjectId);
    if (res.success && res.data) setNotes(res.data);
  };

  const handleCreateNote = async () => {
    const res = await createNote(userId, activeProjectId);
    if (res.success && res.data) {
      await fetchNotes();
      setActiveNote(res.data.id);
    }
  };

  const handleUpdateNote = (data: Partial<{ title: string; content: string }>) => {
    if (!activeNote) return;
    const updatedNote = { ...activeNote, ...data };
    setActiveNoteData(updatedNote);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    setIsSaving(true);
    saveTimeoutRef.current = setTimeout(async () => {
      const res = await updateNote(activeNote.id, userId, data);
      if (res.success) {
        setIsSaving(false);
        fetchNotes();
      }
    }, 1000);
  };

  const handleDeleteNote = async (id: string) => {
    if (confirm("Excluir esta nota?")) {
      const res = await deleteNote(id, userId);
      if (res.success) {
        if (activeNoteId === id) setActiveNote(null);
        fetchNotes();
      }
    }
  };

  const handleTogglePin = async (id: string) => {
    const res = await togglePin(id, userId);
    if (res.success) fetchNotes();
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    const res = await createProject(userId, newProjectName, newProjectColor);
    if (res.success) {
      setNewProjectName("");
      setIsAddingProject(false);
      fetchProjects();
    }
  };

  if (!userId) return null;

  const activeProject = projects.find(p => p.id === activeProjectId);
  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closePanel} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30" />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : 400 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#050505] border-l border-white/5 z-40 flex flex-col shadow-2xl"
      >
        {/* Toggle Button */}
        <button 
          onClick={togglePanel}
          className="absolute left-[-40px] top-10 w-10 h-10 bg-[#050505] border border-r-0 border-white/5 rounded-l-xl flex items-center justify-center text-zinc-500 hover:text-white transition-all group shadow-xl"
        >
          {isOpen ? <ChevronRight size={18} /> : <StickyNote size={18} className="group-hover:scale-110 transition-transform" />}
        </button>

        {/* ── Header ── */}
        <header className="px-6 py-6 border-b border-white/5 space-y-6 shrink-0 bg-white/[0.01]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-1">Vault</h2>
              <button 
                onClick={() => setShowProjectList(!showProjectList)}
                className="flex items-center gap-2 text-xl font-black text-white italic uppercase tracking-tighter hover:text-purple-500 transition-all"
              >
                {activeProject?.name || "Notas"}
                <ChevronDown size={14} className={cn("transition-transform mt-1", showProjectList && "rotate-180")} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleCreateNote} className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center hover:bg-purple-600 transition-all active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                <Plus size={20} />
              </button>
            </div>
          </div>

          <div className="relative group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-purple-500 transition-colors" />
            <input 
              type="text" 
              placeholder="BUSCAR NO VAULT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white/[0.02] border border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-purple-500/50 transition-all"
            />
          </div>
        </header>

        {/* ── Project Switcher ── */}
        <AnimatePresence>
          {showProjectList && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-white/[0.02] border-b border-white/5 overflow-hidden shrink-0">
              <div className="p-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setActiveProject(null); setShowProjectList(false); }}
                  className={cn("flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", !activeProjectId ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5")}
                >
                  <Layers size={12} /> Todas
                </button>
                {projects.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { setActiveProject(p.id); setShowProjectList(false); }}
                    className={cn("flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all truncate", activeProjectId === p.id ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5")}
                  >
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                    <span className="truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Content ── */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          <AnimatePresence mode="wait">
            {!activeNoteId ? (
              /* Note List */
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2">
                {filteredNotes.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center px-10 opacity-20">
                    <Sparkles size={40} className="mb-4" />
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] leading-relaxed">Nenhum insight encontrado.<br />Inicie a captura no Vault.</p>
                  </div>
                ) : (
                  filteredNotes.map(note => (
                    <div
                      key={note.id}
                      onClick={() => setActiveNote(note.id)}
                      className="group p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] hover:border-white/10 transition-all cursor-pointer relative"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-[13px] font-bold text-zinc-100 truncate group-hover:text-white transition-colors">{note.title || "Insight Sem Título"}</h3>
                        {note.isPinned && <Pin size={10} className="text-purple-500 fill-purple-500 shrink-0 mt-1" />}
                      </div>
                      <p className="text-[11px] text-zinc-600 line-clamp-2 leading-relaxed mb-3">{note.content || "Nenhum conteúdo adicional..."}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">{format(new Date(note.updatedAt), "dd MMM · HH:mm", { locale: ptBR })}</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={(e) => { e.stopPropagation(); handleTogglePin(note.id); }} className="p-1.5 hover:bg-white/5 rounded-full text-zinc-600 hover:text-purple-500 transition-colors"><Pin size={12} /></button>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }} className="p-1.5 hover:bg-red-500/10 rounded-full text-zinc-600 hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            ) : (
              /* Note Editor */
              <motion.div key="editor" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex-1 flex flex-col bg-[#050505]">
                <div className="h-14 px-4 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
                  <button onClick={() => setActiveNote(null)} className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-all active:scale-90"><ArrowLeft size={18} /></button>
                  <div className="flex items-center gap-2">
                    {isSaving && <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />}
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{isSaving ? "Capturando..." : "Sincronizado"}</span>
                  </div>
                  <div className="w-10" /> {/* Spacer */}
                </div>
                
                <div className="flex-1 flex flex-col p-8 space-y-6 overflow-y-auto no-scrollbar">
                  <input 
                    className="w-full bg-transparent border-none text-2xl font-black text-white italic uppercase tracking-tighter placeholder:text-zinc-800 focus:ring-0 p-0"
                    placeholder="TÍTULO DO INSIGHT"
                    value={activeNote?.title || ""}
                    onChange={(e) => handleUpdateNote({ title: e.target.value })}
                  />
                  <div className="h-px bg-white/5 w-12" />
                  <textarea 
                    className="flex-1 w-full bg-transparent border-none text-[14px] leading-[1.8] text-zinc-400 placeholder:text-zinc-800 focus:ring-0 p-0 resize-none font-medium"
                    placeholder="Descreva seu insight ou anotação estratégica..."
                    value={activeNote?.content || ""}
                    onChange={(e) => handleUpdateNote({ content: e.target.value })}
                  />
                </div>
                
                <div className="px-8 py-4 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
                  <div className="flex items-center gap-1.5">
                    <Hash size={10} className="text-zinc-600" />
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{activeNote?.content?.trim() ? activeNote.content.trim().split(/\s+/).length : 0} PALAVRAS</span>
                  </div>
                  <button onClick={() => handleTogglePin(activeNote.id)} className={cn("p-2 rounded-full transition-all", activeNote?.isPinned ? "text-purple-500 bg-purple-500/10" : "text-zinc-700 hover:text-white")}><Pin size={14} /></button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}

