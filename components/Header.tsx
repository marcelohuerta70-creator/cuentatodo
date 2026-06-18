import Link from 'next/link';
import { MessageSquare, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-zinc-950/90 border-b-2 border-zinc-900 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Playful brand name */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 border-2 border-zinc-950 flex items-center justify-center text-zinc-950 shadow-[2px_2px_0px_0px_rgba(251,191,36,0.3)] group-hover:rotate-[-4deg] group-hover:scale-105 transition-all">
            <MessageSquare size={20} className="fill-zinc-950 stroke-[2.5]" />
          </div>
          <span className="font-black text-2xl tracking-tight text-white group-hover:text-amber-400 transition-colors flex items-center gap-1">
            CuentaTodo<span className="text-amber-400">.</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs sm:text-sm font-bold text-zinc-400 hover:text-white transition-colors"
          >
            Categorías
          </Link>
          <span className="text-zinc-800">|</span>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-zinc-900 border-2 border-zinc-800/80 text-[10px] sm:text-xs font-black text-amber-400">
            <Sparkles size={12} className="text-amber-400 animate-spin-slow" />
            <span>MVP DIVERTIDO</span>
          </div>
        </div>
        
      </div>
    </header>
  );
}
