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
        <div className="w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4 py-8">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-10 group">
          <div className="p-2.5 bg-purple-600/10 rounded-xl border border-purple-500/20 group-hover:border-purple-500/50 transition-colors shadow-2xl shadow-purple-500/20">
            <Brain className="w-8 h-8 text-purple-500" />
          </div>
          <span className="text-3xl font-black tracking-tighter text-white italic">LENS</span>
        </Link>

        {/* Card with Glassmorphism */}
        <div className="bg-[#111111]/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple/10 blur-[80px] rounded-full" />
          {children}
        </div>
      </div>
    </div>
  );
}
