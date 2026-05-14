import { Brain } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden">
      {/* Radial Gradient Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="p-2 bg-purple-600/10 rounded-xl border border-purple-500/20 group-hover:border-purple-500/50 transition-colors">
            <Brain className="w-8 h-8 text-purple-500" />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-white">LENS</span>
        </Link>

        {/* Card with Glassmorphism */}
        <div className="bg-[#111111]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
