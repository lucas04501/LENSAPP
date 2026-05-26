"use client"
import { useState, useRef } from "react"
import { Camera, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"

interface AvatarUploadProps {
  currentAvatarUrl?: string | null
  username: string
  onUpdate: (newUrl: string) => void
}

export function AvatarUpload({ currentAvatarUrl, username, onUpdate }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl ?? null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Immediate preview
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
        // DO NOT set Content-Type header — browser sets it with boundary
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Erro no upload")
      }

      setPreview(data.avatarUrl)
      onUpdate(data.avatarUrl)
      toast.success("Foto atualizada!")
    } catch (err: any) {
      toast.error(err.message || "Erro ao fazer upload")
      setPreview(currentAvatarUrl ?? null) // revert preview
    } finally {
      setIsUploading(false)
      // Reset input so same file can be selected again
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const initials = username?.slice(0, 2).toUpperCase() ?? "??"

  return (
    <div
      className="relative w-20 h-20 rounded-xl cursor-pointer group shrink-0"
      onClick={() => !isUploading && inputRef.current?.click()}
    >
      {preview ? (
        <img
          src={preview}
          alt="Avatar"
          className="w-full h-full rounded-xl object-cover"
        />
      ) : (
        <div className="w-full h-full rounded-xl bg-gradient-to-br from-purple-700
          to-red-600 flex items-center justify-center text-white font-bold text-xl">
          {initials}
        </div>
      )}

      {/* Overlay on hover */}
      <div className="absolute inset-0 rounded-xl bg-black/50 opacity-0
        group-hover:opacity-100 transition-opacity flex items-center
        justify-center">
        {isUploading ? (
          <Loader2 className="w-5 h-5 text-white animate-spin" />
        ) : (
          <Camera className="w-5 h-5 text-white" />
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
    </div>
  )
}
