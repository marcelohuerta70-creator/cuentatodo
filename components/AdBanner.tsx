import { Megaphone } from 'lucide-react';

interface AdBannerProps {
  slot?: string;
  className?: string;
  type?: 'leaderboard' | 'rectangle' | 'in-feed';
}

export default function AdBanner({ slot = 'default', className = '', type = 'leaderboard' }: AdBannerProps) {
  // Styles based on banner type
  const typeStyles = {
    leaderboard: 'w-full min-h-[90px] md:min-h-[100px] flex items-center justify-center p-4',
    rectangle: 'w-full min-h-[250px] md:min-h-[280px] flex flex-col items-center justify-center p-6',
    'in-feed': 'w-full min-h-[120px] flex items-center justify-between p-4',
  };

  const labels = {
    leaderboard: 'Banner Publicitario (728x90 / Responsivo)',
    rectangle: 'Anuncio Lateral (300x250 / 300x600)',
    'in-feed': 'Anuncio In-Feed (Publicidad Integrada)',
  };

  return (
    <div
      className={`relative rounded-2xl border-2 border-dashed border-zinc-800/80 bg-zinc-950/40 hover:bg-zinc-950/60 transition-colors flex flex-col items-center justify-center text-center overflow-hidden group ${typeStyles[type]} ${className}`}
      data-ad-slot={slot}
    >
      {/* Decorative background grid pattern to look like a placeholder */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      
      <div className="flex flex-col items-center gap-2 relative z-10">
        <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:scale-110 transition-transform">
          <Megaphone size={14} className="rotate-[-10deg] text-amber-500/80" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-650 bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-800">
            Publicidad / AdSense
          </span>
          <p className="text-xs text-zinc-500 font-semibold mt-1.5">{labels[type]}</p>
          {type === 'rectangle' && (
            <p className="text-[10px] text-zinc-650 mt-1 max-w-[200px]">
              Este espacio se cargará automáticamente con Google AdSense una vez aprobado el dominio.
            </p>
          )}
        </div>
      </div>

      {/* Tiny badge */}
      <span className="absolute bottom-1 right-2 text-[8px] font-bold text-zinc-750 select-none">
        ADS BY CUENTATODO
      </span>
    </div>
  );
}
