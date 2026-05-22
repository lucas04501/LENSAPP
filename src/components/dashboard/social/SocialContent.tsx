"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  MessageCircle, 
  Image as ImageIcon, 
  Terminal, 
  Trash2, 
  Plus,
  ShieldAlert,
  Flame,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleLike, createPost, deletePost } from "@/lib/actions/social";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import toast from "react-hot-toast";

interface SocialContentProps {
  initialPosts: any[];
}

export function SocialContent({ initialPosts }: SocialContentProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [posts, setPosts]       = useState(initialPosts);
  const [newPost, setNewPost]   = useState("");
  const [posting, setPosting]   = useState(false);
  const composerRef = useRef<HTMLDivElement>(null);

  const handleLike = async (postId: string) => {
    if (!userId) return;
    
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
      toast.error("Telemetry sync failure");
    }
  };

  const handlePost = async () => {
    if (!newPost.trim() || !userId) return;
    setPosting(true);
    const tags = newPost.match(/#[\wÀ-ú]+/g) || [];
    const result = await createPost(userId, newPost, tags, "PROGRESS");
    if (result.success) {
      toast.success("Packet transmitted");
      setNewPost("");
      router.refresh();
    } else {
      toast.error("Transmission error");
    }
    setPosting(false);
  };

  const handleDelete = async (postId: string) => {
    if (!userId) return;
    if (!confirm("TERMINATE THIS RECORD?")) return;

    const result = await deletePost(postId, userId);
    if (result.success) {
      toast.success("Record purged");
      setPosts(ps => ps.filter(p => p.id !== postId));
    } else {
      toast.error("Purge failure");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 selection:bg-purple-500/30">
      {/* ── Header Telemetry ── */}
      <div className="flex flex-col items-center justify-center pt-4 space-y-2 border-b border-[#1A1A1A] pb-8">
        <p className="text-purple-500 font-mono text-[10px] tracking-[0.4em] uppercase">Neural Network // Activity Stream</p>
        <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Active Logs</h1>
      </div>

      {/* ── Command Input (Composer) ── */}
      <div ref={composerRef} className="max-w-2xl mx-auto w-full px-4">
        <div className="relative group">
          <div className="absolute -left-4 top-4 text-purple-500/50">
            <ChevronRight className="w-4 h-4" />
          </div>
          <textarea
            value={newPost}
            onChange={e => setNewPost(e.target.value)}
            placeholder="[ BROADCAST EVOLUTION STATUS... ]"
            rows={2}
            className="w-full bg-black border border-[#1A1A1A] rounded-md p-4 pt-4 text-sm text-zinc-300 placeholder:text-[#2D2D3A] font-mono focus:outline-none focus:border-purple-500/50 transition-all resize-none"
          />
          <div className="flex items-center justify-end mt-3 gap-4">
            <button className="text-[10px] font-bold text-[#4B5563] hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2">
              <ImageIcon className="w-3.5 h-3.5" /> ATTACH_DATA
            </button>
            <button
              onClick={handlePost}
              disabled={!newPost.trim() || posting}
              className={cn(
                "h-8 px-6 rounded-sm border transition-all uppercase text-[10px] font-bold tracking-widest flex items-center gap-2",
                newPost.trim()
                  ? "border-purple-500 bg-purple-600/10 text-white hover:bg-purple-600/20 shadow-[0_0_15px_rgba(124,58,237,0.2)]"
                  : "border-[#1A1A1A] text-[#2D2D3A] cursor-not-allowed"
              )}
            >
              {posting ? "SYNCING..." : "COMMIT_PACKET"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Terminal Feed ── */}
      <div className="flex flex-col border-t border-[#111]">
        <AnimatePresence mode="popLayout">
          {posts.length > 0 ? (
            posts.map((post, i) => {
              const isOwner = userId === post.userId;
              
              return (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 px-4 py-5 border-b border-[#111] hover:bg-white/[0.01] transition-all relative overflow-hidden"
                >
                  {/* Timestamp */}
                  <div className="shrink-0 min-w-[70px]">
                    <span className="text-[11px] font-mono text-[#4B5563] tracking-tighter">
                      {format(new Date(post.createdAt), "HH:mm:ss", { locale: ptBR })}
                    </span>
                  </div>

                  {/* Icon Status */}
                  <div className="hidden sm:flex shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500/40 shadow-[0_0_8px_rgba(168,85,247,0.3)]" />
                  </div>

                  {/* Log Content */}
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <span className="text-[12px] font-bold text-white shrink-0">
                      {post.user.username.toUpperCase()}
                    </span>
                    <span className="hidden sm:inline text-[#2D2D3A] font-mono text-xs">{'//'}</span>
                    <p className="text-[13px] text-zinc-400 font-mono line-clamp-1 group-hover:line-clamp-none transition-all uppercase tracking-tight">
                      {post.content}
                    </p>
                  </div>

                  {/* Meta & Tags */}
                  <div className="flex items-center gap-4 shrink-0 sm:ml-4">
                    {post.tags.slice(0, 1).map((tag: string) => (
                      <span key={tag} className="text-[9px] font-mono font-bold text-purple-500/50 uppercase tracking-widest">
                        {tag}
                      </span>
                    ))}
                    
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={cn(
                          "flex items-center gap-1 transition-all",
                          post.isLiked ? "text-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]" : "text-[#2D2D3A] hover:text-[#4B5563]"
                        )}
                      >
                        <Zap strokeWidth={1.5} className={cn("w-3.5 h-3.5", post.isLiked && "fill-current")} />
                        <span className="text-[10px] font-mono font-bold">{post._count.likes.toString().padStart(2, '0')}</span>
                      </button>
                      
                      <button className="text-[#2D2D3A] hover:text-[#4B5563] transition-all flex items-center gap-1">
                        <MessageCircle strokeWidth={1.5} className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-mono font-bold">{post._count.comments.toString().padStart(2, '0')}</span>
                      </button>

                      {isOwner && (
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="text-[#2D2D3A] hover:text-red-500/70 transition-all"
                        >
                          <Trash2 strokeWidth={1.5} className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="py-32 text-center border border-dashed border-[#1A1A1A] m-4 rounded-md bg-transparent">
              <Terminal className="w-10 h-10 text-[#2D2D3A] mx-auto mb-6" />
              <p className="text-[10px] font-mono text-[#2D2D3A] uppercase tracking-[0.3em]">No activity detected on secure channel.</p>
              <button 
                onClick={() => composerRef.current?.querySelector('textarea')?.focus()}
                className="mt-8 text-[11px] font-bold text-[#4B5563] hover:text-white uppercase tracking-widest transition-all"
              >
                INITIALIZE_FIRST_PACKET
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

