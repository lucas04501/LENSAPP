"use client";

import { useState, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  currentAvatar?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg";
}

export function AvatarUpload({ currentAvatar, name, size = "md" }: AvatarUploadProps) {
  const { data: session, update } = useSession();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizes = {
    sm: "w-12 h-12 text-sm",
    md: "w-20 h-20 text-xl",
    lg: "w-32 h-32 text-3xl",
  };

  const getInitials = (n?: string | null) => {
    if (!n) return "U";
    return n.split(" ").map(i => i[0]).join("").toUpperCase().slice(0, 2);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview imediato
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Upload
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const response = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro no upload");
      }

      toast.success("Foto atualizada! ✨");
      
      // Atualizar sessão global
      await update({ avatarUrl: result.avatarUrl });
      
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar foto");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative group flex flex-col items-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <div 
        onClick={triggerUpload}
        className={cn(
          "relative rounded-full overflow-hidden cursor-pointer transition-all duration-300 border-2 border-purple/30 group-hover:border-purple flex items-center justify-center",
          sizes[size],
          uploading && "opacity-70 pointer-events-none"
        )}
      >
        {preview || currentAvatar ? (
          <img 
            src={preview || currentAvatar || ""} 
            alt={name || "Avatar"} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple to-red flex items-center justify-center font-black text-white italic tracking-tighter">
            {getInitials(name)}
          </div>
        )}

        {/* Overlay Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {uploading ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : (
            <Camera className="w-6 h-6 text-white" />
          )}
        </div>
      </div>
      
      {uploading && (
        <span className="text-[10px] font-black text-purple uppercase tracking-widest mt-2 animate-pulse">
          Enviando...
        </span>
      )}
    </div>
  );
}
