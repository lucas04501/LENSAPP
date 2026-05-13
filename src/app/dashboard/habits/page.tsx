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
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

      {/* Header */}
      <motion.div variants={item} className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Seus hábitos</h1>
          <p className="text-text-muted text-sm mt-1">
            <span className="text-purple font-semibold">{doneCount}</span> de{" "}
            <span className="text-text-primary font-semibold">{habits.length}</span> completados hoje
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo hábito
        </motion.button>
      </motion.div>

      {/* Progress bar */}
      <motion.div variants={item} className="glass rounded-2xl border border-white/5 p-4">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-text-muted">Progresso de hoje</span>
          <span className="text-purple font-semibold">{Math.round((doneCount / habits.length) * 100)}%</span>
        </div>
        <div className="xp-bar h-2">
          <motion.div
            className="xp-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${(doneCount / habits.length) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={item} className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
              filter === cat
                ? "bg-purple/15 text-purple border border-purple/30"
                : "bg-surface-2 text-text-muted border border-border hover:border-purple/20"
            )}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Habits grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                "glass rounded-2xl border p-4 transition-all duration-300",
                habit.todayDone
                  ? "border-white/10 opacity-75"
                  : "border-white/5 hover:border-purple/20"
              )}
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${habit.color}15` }}
                >
                  {habit.icon}
                </div>
                <div className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-red" />
                  <span className="text-xs font-bold text-text-primary">{habit.streak}</span>
                </div>
              </div>

              <h3 className={cn(
                "font-semibold text-sm mb-1 transition-all",
                habit.todayDone ? "line-through text-text-muted" : "text-text-primary"
              )}>
                {habit.title}
              </h3>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs text-text-muted">{habit.total} dias</span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ backgroundColor: `${habit.color}15`, color: habit.color }}
                >
                  +{habit.xpReward} XP
                </span>
              </div>

              {/* Complete button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => toggleDone(habit.id)}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all",
                  habit.todayDone
                    ? "bg-surface-2 text-text-muted"
                    : "border border-dashed text-text-muted hover:border-purple/40 hover:text-purple hover:bg-purple/5"
                )}
                style={habit.todayDone ? { borderColor: `${habit.color}30` } : {}}
              >
                {habit.todayDone ? (
                  <>
                    <Check className="w-4 h-4" style={{ color: habit.color }} />
                    <span style={{ color: habit.color }}>Completo!</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Marcar como feito
                  </>
                )}
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add habit modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 px-4"
            >
              <div className="glass border border-purple/20 rounded-2xl p-6"
                   style={{ boxShadow: "0 0 40px rgba(168,85,247,0.2)" }}>
                <h2 className="font-bold text-lg text-text-primary mb-4">Criar novo hábito</h2>
                <div className="space-y-3">
                  <input
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="Nome do hábito..."
                    className="lens-input"
                    autoFocus
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowForm(false)}
                      className="flex-1 btn-ghost border border-border"
                    >
                      Cancelar
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      disabled={!newTitle.trim()}
                      className="flex-1 btn-primary disabled:opacity-40"
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
