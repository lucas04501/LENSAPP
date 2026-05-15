"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Flame, Check, Trash2, BarChart2, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Todos", "Saúde", "Mente", "Trabalho", "Social", "Finanças"];

const MOCK_HABITS = [
  { id:"1", title:"Meditação 10min",    icon:"🧘", color:"#A855F7", category:"Mente",    streak:12, total:45, xpReward:10, todayDone:true  },
  { id:"2", title:"Exercício",          icon:"🏋️", color:"#EF4444", category:"Saúde",   streak:8,  total:38, xpReward:20, todayDone:true  },
  { id:"3", title:"Leitura 30min",      icon:"📚", color:"#3B82F6", category:"Mente",    streak:5,  total:22, xpReward:15, todayDone:false },
  { id:"4", title:"Sem redes sociais",  icon:"🧠", color:"#22C55E", category:"Mente",    streak:3,  total:15, xpReward:25, todayDone:false },
  { id:"5", title:"Água 2L",            icon:"💧", color:"#06B6D4", category:"Saúde",   streak:15, total:60, xpReward:10, todayDone:true  },
  { id:"6", title:"Planejamento noturno",icon:"📝",color:"#F59E0B", category:"Trabalho", streak:7,  total:30, xpReward:10, todayDone:false },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function HabitsPage() {
  const [habits, setHabits]     = useState(MOCK_HABITS);
  const [filter, setFilter]     = useState("Todos");
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const filtered = filter === "Todos" ? habits : habits.filter(h => h.category === filter);
  const doneCount = habits.filter(h => h.todayDone).length;

  const toggleDone = (id: string) => {
    setHabits(hs => hs.map(h =>
      h.id === id ? { ...h, todayDone: !h.todayDone } : h
    ));
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 sm:space-y-8 pb-20">

      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white italic uppercase tracking-tighter">Seus hábitos</h1>
          <p className="text-text-muted text-xs sm:text-sm mt-1 uppercase font-bold tracking-widest">
            <span className="text-purple font-black">{doneCount}</span> de{" "}
            <span className="text-white font-black">{habits.length}</span> completados hoje
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-purple to-red text-white font-black px-6 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-purple/20 text-sm uppercase tracking-widest"
        >
          <Plus className="w-4 h-4" />
          Novo hábito
        </motion.button>
      </motion.div>

      {/* Progress bar */}
      <motion.div variants={item} className="glass rounded-[2rem] border border-white/5 p-5 sm:p-6 bg-[#050505]">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
          <span className="text-text-muted">Progresso de hoje</span>
          <span className="text-purple">{Math.round((doneCount / habits.length) * 100)}%</span>
        </div>
        <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple to-red rounded-full shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            initial={{ width: 0 }}
            animate={{ width: `${(doneCount / habits.length) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={item} className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
              filter === cat
                ? "bg-purple text-white border-purple shadow-xl"
                : "bg-surface-2 text-text-muted border-white/5 hover:border-white/20"
            )}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Habits grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <AnimatePresence>
          {filtered.map((habit, i) => (
            <motion.div
              key={habit.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "glass rounded-[2rem] border p-5 sm:p-6 transition-all duration-300 bg-[#050505] flex flex-col justify-between group",
                habit.todayDone
                  ? "border-white/10 opacity-60"
                  : "border-white/5 hover:border-purple/20"
              )}
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xl"
                    style={{ backgroundColor: `${habit.color}15`, border: `1px solid ${habit.color}30` }}
                  >
                    {habit.icon}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red/10 border border-red/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                    <Flame className="w-3.5 h-3.5 text-red" />
                    <span className="text-xs font-black text-white italic">{habit.streak}</span>
                  </div>
                </div>

                <h3 className={cn(
                  "font-black text-base uppercase italic tracking-tighter mb-2 transition-all",
                  habit.todayDone ? "line-through text-text-muted" : "text-white"
                )}>
                  {habit.title}
                </h3>

                <div className="flex items-center gap-3 mb-6">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{habit.total} total</span>
                  <span
                    className="text-[9px] px-2 py-0.5 rounded-lg font-black uppercase tracking-widest"
                    style={{ backgroundColor: `${habit.color}15`, color: habit.color }}
                  >
                    +{habit.xpReward} XP
                  </span>
                </div>
              </div>

              {/* Complete button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => toggleDone(habit.id)}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all min-h-[52px]",
                  habit.todayDone
                    ? "bg-surface-2 text-text-muted border border-white/5"
                    : "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-purple/40"
                )}
              >
                {habit.todayDone ? (
                  <>
                    <Check className="w-4 h-4" style={{ color: habit.color }} />
                    <span style={{ color: habit.color }}>Completado</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Check-in
                  </>
                )}
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add habit mock modal placeholder or redirect */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 w-full sm:max-w-md z-50 p-4"
            >
              <div className="glass border border-white/10 rounded-[2rem] p-8 h-full sm:h-auto bg-[#050505] flex flex-col relative overflow-hidden"
                   style={{ boxShadow: "0 0 40px rgba(168,85,247,0.1)" }}>
                
                <button 
                  onClick={() => setShowForm(false)}
                  className="sm:hidden absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-text-muted"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="mb-8">
                  <h2 className="font-black text-xl text-white uppercase italic tracking-tighter">Novo hábito</h2>
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">Sua jornada começa com um único passo</p>
                </div>

                <div className="space-y-6 flex-1">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Nome do Hábito</label>
                    <input
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      placeholder="Ex: Treino de força"
                      className="w-full bg-surface-2 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white placeholder:text-text-muted/30 focus:outline-none focus:border-purple/50 transition-all"
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-3 pt-4 mt-auto">
                    <button
                      onClick={() => setShowForm(false)}
                      className="hidden sm:flex flex-1 items-center justify-center py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-text-muted hover:bg-white/10 transition-all"
                    >
                      Cancelar
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      disabled={!newTitle.trim()}
                      className="flex-1 bg-gradient-to-r from-purple to-red text-white font-black py-4 rounded-2xl shadow-lg shadow-purple/20 text-[10px] font-black uppercase tracking-widest disabled:opacity-40 transition-all"
                      onClick={() => {
                        if (!newTitle.trim()) return;
                        setHabits(hs => [{
                          id: Date.now().toString(),
                          title: newTitle,
                          icon: "⭐",
                          color: "#A855F7",
                          category: "Mente",
                          streak: 0,
                          total: 0,
                          xpReward: 10,
                          todayDone: false,
                        }, ...hs]);
                        setNewTitle("");
                        setShowForm(false);
                      }}
                    >
                      Criar hábito
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
