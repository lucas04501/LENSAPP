"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Image, Send, Flame, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_POSTS = [
  {
    id: "1",
    user: { name: "Rafael Costa", username: "rafaelc", level: 8, rank: "DEEP WORKER", rankColor: "#F59E0B", avatar: "R" },
    content: "Dia 30 de streak consecutivo 🔥 Malhar todo dia parecia impossível. Agora parece estranho não ir. O hábito virou identidade.",
    images: [],
    tags: ["#habitos", "#disciplina", "#streak"],
    likes: 47,
    comments: 12,
    type: "MILESTONE",
    time: "há 2h",
    isLiked: false,
  },
  {
    id: "2",
    user: { name: "Ana Lima", username: "analima", level: 5, rank: "ARCHITECT OF FLOW", rankColor: "#A855F7", avatar: "A" },
    content: "Completei meu primeiro Dia Off de Dopamina da semana. As primeiras 4h foram tensão pura. Depois? Clareza absurda. Li 80 páginas, escrevi no diário, cozinhei. Recomendo demais.",
    images: [],
    tags: ["#dopamina", "#detox", "#clareza"],
    likes: 83,
    comments: 28,
    type: "PROGRESS",
    time: "há 4h",
    isLiked: true,
  },
  {
    id: "3",
    user: { name: "Pedro Nunes", username: "pedron", level: 3, rank: "BUILDER", rankColor: "#3B82F6", avatar: "P" },
    content: "Semana 1 completada. 6/6 hábitos feitos. Parece pouco mas há 3 semanas eu não terminava nem 1. Começo honesto.",
    images: [],
    tags: ["#semana1", "#iniciante", "#habitos"],
    likes: 35,
    comments: 9,
    type: "PROGRESS",
    time: "há 6h",
    isLiked: false,
  },
];

const POST_TYPE_STYLES: Record<string, { label: string; color: string }> = {
  MILESTONE: { label: "Milestone", color: "#F59E0B" },
  PROGRESS:  { label: "Progresso", color: "#A855F7" },
  CHALLENGE: { label: "Desafio",   color: "#EF4444" },
  REFLECTION:{ label: "Reflexão",  color: "#22C55E" },
};

export default function SocialPage() {
  const [posts, setPosts]       = useState(MOCK_POSTS);
  const [newPost, setNewPost]   = useState("");
  const [posting, setPosting]   = useState(false);

  const handleLike = (postId: string) => {
    setPosts(ps => ps.map(p =>
      p.id === postId
        ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
        : p
    ));
  };

  const handlePost = () => {
    if (!newPost.trim()) return;
    setPosting(true);
    setTimeout(() => {
      setPosts(ps => [{
        id: Date.now().toString(),
        user: { name: "Lucas", username: "lucasCEO", level: 4, rank: "ARCHITECT OF FLOW", rankColor: "#A855F7", avatar: "L" },
        content: newPost,
        images: [],
        tags: [],
        likes: 0,
        comments: 0,
        type: "PROGRESS",
        time: "agora",
        isLiked: false,
      }, ...ps]);
      setNewPost("");
      setPosting(false);
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 px-1 sm:px-0">
      {/* Header */}
      <div className="px-3 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-black text-white italic uppercase tracking-tighter">Gym Rats 💪</h1>
        <p className="text-text-muted text-xs sm:text-sm mt-1 uppercase font-bold tracking-widest">Compartilhe sua evolução. Inspire a tribo.</p>
      </div>

      {/* Compose */}
      <div className="glass rounded-[2rem] border border-white/5 p-4 sm:p-6 bg-[#050505]">
        <div className="flex gap-3 sm:gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple to-red flex items-center justify-center text-sm font-bold text-white shrink-0">
            L
          </div>
          <div className="flex-1">
            <textarea
              value={newPost}
              onChange={e => setNewPost(e.target.value)}
              placeholder="Como foi sua sessão hoje? Compartilhe..."
              rows={3}
              className="w-full bg-[#080808] border border-white/5 rounded-2xl p-4 text-sm text-white placeholder:text-text-muted/30 focus:outline-none focus:border-purple/30 transition-all resize-none"
            />
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black text-text-muted uppercase tracking-widest hover:bg-white/5 transition-all">
                  <Image className="w-3.5 h-3.5" /> Foto
                </button>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handlePost}
                disabled={!newPost.trim() || posting}
                className={cn(
                  "flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  newPost.trim()
                    ? "bg-purple text-white shadow-neon-purple"
                    : "bg-surface-2 text-text-muted cursor-not-allowed"
                )}
              >
                <Send className="w-3.5 h-3.5" />
                {posting ? "Postando..." : "Postar"}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-6 sm:space-y-8">
        {posts.map((post, i) => {
          const typeStyle = POST_TYPE_STYLES[post.type];
          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass rounded-[2rem] border border-white/5 p-5 sm:p-8 bg-[#050505] hover:border-white/10 transition-all group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-purple/40 to-red/40 flex items-center justify-center font-black text-white italic tracking-tighter sm:text-lg">
                    {post.user.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm sm:text-base text-white uppercase italic tracking-tighter">{post.user.name}</span>
                      <span className="text-[10px] text-text-muted font-bold tracking-widest">@{post.user.username}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className="text-[9px] font-black uppercase tracking-widest"
                        style={{ color: post.user.rankColor }}
                      >
                        {post.user.rank}
                      </span>
                      <span className="text-[9px] text-text-muted font-bold uppercase tracking-widest">LVL {post.user.level}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span
                    className="text-[8px] font-black px-2 py-0.5 rounded bg-white/5 border border-white/5 uppercase tracking-[0.2em]"
                    style={{ color: typeStyle.color }}
                  >
                    {typeStyle.label}
                  </span>
                  <span className="text-[8px] text-text-muted font-bold uppercase tracking-widest">{post.time}</span>
                </div>
              </div>

              {/* Content */}
              <p className="text-sm sm:text-base text-text-primary leading-relaxed mb-4 sm:mb-6 font-medium italic">
                "{post.content}"
              </p>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-black text-purple/60 hover:text-purple cursor-pointer transition-colors uppercase tracking-widest px-2 py-1 rounded-lg bg-purple/5 border border-purple/10">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 sm:pt-6 border-t border-white/5">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => handleLike(post.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    post.isLiked
                      ? "text-red bg-red/10 border border-red/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                      : "text-text-muted hover:text-red hover:bg-red/5 border border-transparent"
                  )}
                >
                  <Heart className={cn("w-3.5 h-3.5", post.isLiked && "fill-current")} />
                  {post.likes}
                </motion.button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-purple hover:bg-purple/5 transition-all">
                  <MessageCircle className="w-3.5 h-3.5" />
                  {post.comments}
                </button>
                <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-white transition-all ml-auto">
                  <Share2 className="w-3.5 h-3.5" />
                  Compartilhar
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
