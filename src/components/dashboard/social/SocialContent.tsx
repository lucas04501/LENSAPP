"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Image as ImageIcon, 
  Send, 
  Users, 
  Trash2, 
  Plus,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleLike, createPost, deletePost } from "@/lib/actions/social";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import toast from "react-hot-toast";

interface SocialContentProps {
  initialPosts: any[];
}

const POST_TYPE_STYLES: Record<string, { label: string; color: string }> = {
  MILESTONE: { label: "Milestone", color: "#F59E0B" },
  PROGRESS:  { label: "Progresso", color: "#A855F7" },
  CHALLENGE: { label: "Desafio",   color: "#EF4444" },
  REFLECTION:{ label: "Reflexão",  color: "#22C55E" },
};

export function SocialContent({ initialPosts }: SocialContentProps) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [posts, setPosts]       = useState(initialPosts);
  const [newPost, setNewPost]   = useState("");
  const [posting, setPosting]   = useState(false);
  const composerRef = useRef<HTMLDivElement>(null);

  const scrollToComposer = () => {
    composerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    composerRef.current?.focus();
  };

  const handleLike = async (postId: string) => {
    if (!userId) return;
    
    // Optimistic update
    setPosts(ps => ps.map(p =>
      p.id === postId
        ? { 
            ...p, 
            isLiked: !p.isLiked, 
            _count: { 
              ...p._count, 
              likes: p.isLiked ? p._count.likes - 1 : p._count.likes + 1 
            } 
          }
        : p
    ));

    const result = await toggleLike(postId, userId);
    if (!result.success) {
      // Revert if failed (simple way)
      toast.error("Erro ao curtir post");
    }
  };

  const handlePost = async () => {
    if (!newPost.trim() || !userId) return;
    
    setPosting(true);
    
    // Extract tags: #word
    const tags = newPost.match(/#[\wÀ-ú]+/g) || [];
    
    const result = await createPost(userId, newPost, tags, "PROGRESS");
    
    if (result.success) {
      toast.success(result.message);
      setNewPost("");
      router.refresh();
    } else {
      toast.error(result.message);
    }
    setPosting(false);
  };

  const handleDelete = async (postId: string) => {
    if (!userId) return;
    if (!confirm("Tem certeza que deseja deletar este post?")) return;

    const result = await deletePost(postId, userId);
    if (result.success) {
      toast.success(result.message);
      setPosts(ps => ps.filter(p => p.id !== postId));
    } else {
      toast.error(result.message);
    }
  };

  const getUserInitials = (name?: string) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 px-1 sm:px-0 pb-20">
      {/* Header */}
      <div className="px-3 sm:px-0 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white italic uppercase tracking-tighter">Feed 🚀</h1>
          <p className="text-[#666] text-xs sm:text-sm mt-1 uppercase font-bold tracking-widest">Acompanhe a jornada da tribo.</p>
        </div>
      </div>

      {/* Compose */}
      <div ref={composerRef} className="bg-[#050505] rounded-[2rem] border border-[#1A1A1A] p-4 sm:p-6">
        <div className="flex gap-3 sm:gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A855F7] to-[#EF4444] flex items-center justify-center text-sm font-bold text-white shrink-0">
            {getUserInitials(session?.user?.name || "")}
          </div>
          <div className="flex-1">
            <textarea
              value={newPost}
              onChange={e => setNewPost(e.target.value)}
              placeholder="Como está sua evolução hoje?"
              rows={3}
              className="w-full bg-[#080808] border border-[#1A1A1A] rounded-2xl p-4 text-sm text-white placeholder:text-[#333] focus:outline-none focus:border-[#A855F7]/30 transition-all resize-none font-medium"
            />
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black text-[#666] uppercase tracking-widest hover:bg-white/5 transition-all">
                  <ImageIcon className="w-3.5 h-3.5" /> Foto
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
                    ? "bg-[#A855F7] text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                    : "bg-[#1A1A1A] text-[#444] cursor-not-allowed"
                )}
              >
                <Send className="w-3.5 h-3.5" />
                {posting ? "Publicando..." : "Publicar"}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-6 sm:space-y-8">
        <AnimatePresence mode="popLayout">
          {posts.length > 0 ? (
            posts.map((post, i) => {
              const typeStyle = POST_TYPE_STYLES[post.type] || POST_TYPE_STYLES.PROGRESS;
              const isOwner = userId === post.userId;
              
              return (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-[#050505] rounded-[2rem] border border-[#1A1A1A] p-5 sm:p-8 hover:border-[#1A1A1A]/80 transition-all group relative"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] overflow-hidden flex items-center justify-center font-black text-white italic tracking-tighter sm:text-lg">
                        {post.user.avatarUrl ? (
                          <img src={post.user.avatarUrl} alt={post.user.name} className="w-full h-full object-cover" />
                        ) : (
                          getUserInitials(post.user.name)
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm sm:text-base text-white uppercase italic tracking-tighter">{post.user.name}</span>
                          <span className="text-[10px] text-[#666] font-bold tracking-widest">@{post.user.username}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span
                            className="text-[9px] font-black uppercase tracking-widest"
                            style={{ color: post.user.rank?.color || "#666" }}
                          >
                            {post.user.rank?.name || "INICIANTE"}
                          </span>
                          <span className="text-[9px] text-[#666] font-bold uppercase tracking-widest">LVL {post.user.level}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <div className="flex items-center gap-2">
                        {isOwner && (
                          <button 
                            onClick={() => handleDelete(post.id)}
                            className="p-2 rounded-lg text-[#333] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <span
                          className="text-[8px] font-black px-2 py-0.5 rounded bg-[#0A0A0A] border border-[#1A1A1A] uppercase tracking-[0.2em]"
                          style={{ color: typeStyle.color }}
                        >
                          {typeStyle.label}
                        </span>
                      </div>
                      <span className="text-[8px] text-[#444] font-bold uppercase tracking-widest">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ptBR })}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-sm sm:text-base text-white leading-relaxed mb-4 sm:mb-6 font-medium italic">
                    "{post.content}"
                  </p>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.map((tag: string) => (
                        <span key={tag} className="text-[9px] font-black text-[#A855F7]/60 hover:text-[#A855F7] cursor-pointer transition-colors uppercase tracking-widest px-2 py-1 rounded-lg bg-[#A855F7]/5 border border-[#A855F7]/10">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 sm:pt-6 border-t border-[#1A1A1A]">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => handleLike(post.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        post.isLiked
                          ? "text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                          : "text-[#666] hover:text-[#EF4444] hover:bg-[#EF4444]/5 border border-transparent"
                      )}
                    >
                      <Heart className={cn("w-3.5 h-3.5", post.isLiked && "fill-current")} />
                      {post._count.likes}
                    </motion.button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#666] hover:text-[#A855F7] hover:bg-[#A855F7]/5 transition-all">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {post._count.comments}
                    </button>
                    <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#666] hover:text-white transition-all ml-auto">
                      <Share2 className="w-3.5 h-3.5" />
                      Compartilhar
                    </button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0D0D0D] rounded-[2.5rem] border border-[#1A1A1A] p-12 sm:p-20 text-center flex flex-col items-center justify-center relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#A855F7]/20 to-transparent" />
              
              <div className="w-20 h-20 rounded-3xl bg-[#050505] border border-[#1A1A1A] flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 bg-[#A855F7]/5 blur-2xl rounded-full group-hover:bg-[#A855F7]/10 transition-colors" />
                <Users className="w-10 h-10 text-[#A855F7] relative z-10" />
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white italic uppercase tracking-tighter mb-4">
                Nenhum post ainda
              </h2>
              <p className="text-[#666] text-sm max-w-xs mx-auto leading-relaxed mb-10 font-medium">
                Seja o primeiro a compartilhar sua evolução com a tribo. Cada passo conta.
              </p>

              <button
                onClick={scrollToComposer}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-[#A855F7] hover:text-white transition-all duration-500 shadow-xl"
              >
                <Plus className="w-4 h-4" />
                Criar primeiro post
              </button>

              <div className="mt-12 flex items-center gap-2 text-[10px] font-bold text-[#333] uppercase tracking-[0.2em]">
                <Sparkles className="w-3 h-3" />
                Junte-se aos outros 0 membros
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
