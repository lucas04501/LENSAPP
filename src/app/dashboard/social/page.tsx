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
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Gym Rats 💪</h1>
        <p className="text-text-muted text-sm mt-1">Compartilhe sua evolução. Inspire quem está começando.</p>
      </div>

      {/* Compose */}
      <div className="glass rounded-2xl border border-white/5 p-4">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple to-red flex items-center justify-center text-sm font-bold text-white shrink-0">
            L
          </div>
          <div className="flex-1">
            <textarea
              value={newPost}
              onChange={e => setNewPost(e.target.value)}
              placeholder="Como foi sua sessão hoje? Compartilhe com a tribo..."
              rows={3}
              className="lens-input resize-none text-sm"
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-2">
                <button className="btn-ghost text-xs gap-1.5">
                  <Image className="w-3.5 h-3.5" /> Foto
                </button>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handlePost}
                disabled={!newPost.trim() || posting}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
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
      <div className="space-y-4">
        {posts.map((post, i) => {
          const typeStyle = POST_TYPE_STYLES[post.type];
          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass rounded-2xl border border-white/5 p-5 hover:border-purple/10 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple/60 to-red/60 flex items-center justify-center font-bold text-white">
                    {post.user.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-text-primary">{post.user.name}</span>
                      <span className="text-xs text-text-muted">@{post.user.username}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className="text-[10px] font-bold"
                        style={{ color: post.user.rankColor }}
                      >
                        {post.user.rank}
                      </span>
                      <span className="text-[10px] text-text-muted">LVL {post.user.level}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${typeStyle.color}15`, color: typeStyle.color }}
                  >
                    {typeStyle.label}
                  </span>
                  <span className="text-[10px] text-text-muted">{post.time}</span>
                </div>
              </div>

              {/* Content */}
              <p className="text-sm text-text-primary leading-relaxed mb-3">{post.content}</p>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-[11px] text-purple/70 hover:text-purple cursor-pointer transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-1 pt-3 border-t border-white/5">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => handleLike(post.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all",
                    post.isLiked
                      ? "text-red bg-red/10"
                      : "text-text-muted hover:text-red hover:bg-red/5"
                  )}
                >
                  <Heart className={cn("w-3.5 h-3.5", post.isLiked && "fill-current")} />
                  {post.likes}
                </motion.button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-text-muted hover:text-purple hover:bg-purple/5 transition-all">
                  <MessageCircle className="w-3.5 h-3.5" />
                  {post.comments}
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-text-muted hover:text-purple hover:bg-purple/5 transition-all ml-auto">
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
