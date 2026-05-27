"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, ChevronRight, Plus, MoreHorizontal, 
  ArrowLeft, Pin, Trash2, Settings2, Check 
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
  const [showProjectList, setShowProjectList] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectColor, setNewProjectColor] = useState("#7C3AED");

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const savedIndicatorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (userId) {
      fetchProjects();
    }
  }, [userId]);

  useEffect(() => {
    if (userId && isOpen) {
      fetchNotes();
    }
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
        setShowSavedIndicator(true);
        if (savedIndicatorTimeoutRef.current) clearTimeout(savedIndicatorTimeoutRef.current);
        savedIndicatorTimeoutRef.current = setTimeout(() => setShowSavedIndicator(false), 2000);
        fetchNotes();
      }
    }, 800);
  };

  const handleDeleteNote = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta nota?")) {
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

  const wordCount = activeNote?.content?.trim() ? activeNote.content.trim().split(/\s+/).length : 0;

  if (!userId) return null;

  const activeProject = projects.find(p => p.id === activeProjectId);

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePanel}
            className="fixed inset-0 bg-black/30 z-30"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : 300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-[300px] bg-[#09090B] border-l border-[#1E1E2E] z-40 flex flex-col shadow-2xl"
      >
        {/* Toggle Tab */}
        <button 
          onClick={togglePanel}
          className="absolute left-[-28px] top-1/2 -translate-y-1/2 w-7 h-28 bg-[#09090B] border border-r-0 border-[#1E1E2E] rounded-l-md flex flex-col items-center justify-center gap-6 py-4 hover:text-white transition-colors group"
        >
          {isOpen ? <ChevronRight size={14} className="text-[#4B5563] group-hover:text-white" /> : <ChevronLeft size={14} className="text-[#4B5563] group-hover:text-white" />}
          <span className="rotate-90 text-[10px] font-bold uppercase tracking-[0.2em] text-[#4B5563] group-hover:text-white whitespace-nowrap">
            Notas
          </span>
        </button>

        {/* Header */}
        <header className="h-[40px] px-3 flex items-center justify-between border-b border-[#1A1A1A] shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <div 
              className="w-2 h-2 rounded-full shrink-0" 
              style={{ backgroundColor: activeProject?.color || "#4B5563" }} 
            />
            <button 
              onClick={() => setShowProjectList(!showProjectList)}
              className="text-[13px] font-medium text-zinc-300 truncate hover:text-white transition-colors"
            >
              {activeProject?.name || "Todas as Notas"}
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={handleCreateNote}
              className="p-1.5 text-[#4B5563] hover:text-white transition-colors"
            >
              <Plus size={16} />
            </button>
            <button className="p-1.5 text-[#4B5563] hover:text-white transition-colors">
              <Settings2 size={16} />
            </button>
          </div>
        </header>

        {/* Project List (Collapsible) */}
        <AnimatePresence>
          {showProjectList && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-[#1A1A1A] overflow-hidden max-h-[140px] overflow-y-auto no-scrollbar"
            >
              <div className="p-1">
                <button
                  onClick={() => { setActiveProject(null); setShowProjectList(false); }}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded-sm transition-colors text-[13px]",
                    !activeProjectId ? "bg-[#0F0F14] text-white border-l-2 border-[#7C3AED]" : "text-zinc-400 hover:bg-[#0F0F14] hover:text-zinc-200"
                  )}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                  <span>Todas as Notas</span>
                  <span className="ml-auto text-[11px] opacity-40">{notes.length}</span>
                </button>
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setActiveProject(p.id); setShowProjectList(false); }}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 rounded-sm transition-colors text-[13px]",
                      activeProjectId === p.id ? "bg-[#0F0F14] text-white border-l-2 border-[#7C3AED]" : "text-zinc-400 hover:bg-[#0F0F14] hover:text-zinc-200"
                    )}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="truncate">{p.name}</span>
                    <span className="ml-auto text-[11px] opacity-40">{p._count.notes}</span>
                  </button>
                ))}
                
                {isAddingProject ? (
                  <div className="px-2 py-1.5 space-y-2">
                    <input 
                      autoFocus
                      className="w-full bg-transparent border-none text-[13px] text-white placeholder:text-zinc-600 focus:ring-0 p-0"
                      placeholder="Nome do projeto..."
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCreateProject();
                        if (e.key === 'Escape') setIsAddingProject(false);
                      }}
                    />
                    <div className="flex items-center gap-2">
                      {["#7C3AED", "#EF4444", "#10B981", "#3B82F6", "#F59E0B"].map(color => (
                        <button 
                          key={color}
                          onClick={() => setNewProjectColor(color)}
                          className={cn("w-3 h-3 rounded-full", newProjectColor === color && "ring-1 ring-white ring-offset-1 ring-offset-black")}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <button onClick={handleCreateProject} className="ml-auto text-[11px] text-purple-400 hover:text-purple-300">Criar</button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsAddingProject(true)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    <Plus size={12} />
                    <span>Novo projeto</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <AnimatePresence mode="wait">
            {!activeNoteId ? (
              /* Note List */
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1 overflow-y-auto no-scrollbar"
              >
                {notes.length === 0 ? (
                  <div className="h-full flex items-center justify-center p-8 text-center">
                    <p className="text-[12px] text-zinc-600 leading-relaxed">
                      Nenhuma nota.<br />Clique em + para começar.
                    </p>
                  </div>
                ) : (
                  <div className="p-1">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        onClick={() => setActiveNote(note.id)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          if (confirm(note.isPinned ? "Desafixar nota?" : "Fixar nota?")) handleTogglePin(note.id);
                        }}
                        className="group flex flex-col gap-1 px-3 py-3 rounded-sm hover:bg-[#0F0F14] cursor-pointer transition-colors relative"
                      >
                        <div className="flex items-center gap-2">
                          {note.isPinned && <div className="w-1 h-1 rounded-full bg-purple-500 shrink-0" />}
                          <span className="text-[13px] text-zinc-200 truncate font-medium group-hover:text-white">
                            {note.title || "Sem título"}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-600">
                          {format(new Date(note.updatedAt), "d 'de' MMM", { locale: ptBR })}
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(note.id);
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              /* Note Editor */
              <motion.div
                key="editor"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex-1 flex flex-col bg-[#09090B]"
              >
                <div className="flex items-center h-[40px] px-2 border-b border-[#1A1A1A]">
                  <button 
                    onClick={() => setActiveNote(null)}
                    className="p-1.5 text-[#4B5563] hover:text-white transition-colors"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  {showSavedIndicator && (
                    <span className="ml-auto mr-2 text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
                      Salvo
                    </span>
                  )}
                  {isSaving && (
                    <span className="ml-auto mr-2 text-[10px] text-zinc-600 animate-pulse">
                      Salvando...
                    </span>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col p-4 overflow-y-auto no-scrollbar">
                  <input 
                    className="w-full bg-transparent border-none text-[15px] font-medium text-white placeholder:text-zinc-700 focus:ring-0 p-0 mb-4"
                    placeholder="Título da nota"
                    value={activeNote?.title || ""}
                    onChange={(e) => handleUpdateNote({ title: e.target.value })}
                  />
                  <div className="h-[1px] bg-[#1A1A1A] w-full mb-4" />
                  <textarea 
                    className="flex-1 w-full bg-transparent border-none text-[13px] leading-[1.8] text-zinc-300 placeholder:text-zinc-700 focus:ring-0 p-0 resize-none"
                    placeholder="Escreva aqui..."
                    value={activeNote?.content || ""}
                    onChange={(e) => handleUpdateNote({ content: e.target.value })}
                  />
                </div>
                
                <div className="h-[30px] px-4 flex items-center justify-end border-t border-[#1A1A1A]">
                  <span className="text-[10px] text-zinc-600 font-mono">
                    {wordCount} PALAVRAS
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
