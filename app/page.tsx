'use client';

import * as React from 'react';
import Link from 'next/link';
import { Flame, MessageSquare, ShieldCheck, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MOCK_EMOJIS_ACCENTS, MOCK_CATEGORIAS } from '@/utils/mockData';
import { Categoria } from '@/types';

export default function Home() {
  const [categorias, setCategorias] = React.useState<Categoria[]>(MOCK_CATEGORIAS);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <>
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 flex flex-col items-center">
        
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-10 animate-pop-in">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/10 border-2 border-amber-500/30 text-xs font-bold text-amber-400 mb-6 hover:rotate-[1deg] transition-transform cursor-default">
            <Sparkles size={12} className="animate-spin-slow text-amber-400" />
            <span>¡100% Libre, Público y Sin Registrarse! 💬</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-tight text-white">
            Di lo que quieras,{' '}
            <span className="text-amber-400">
              ¡cuenta todo!
            </span>
          </h1>
          
          <p className="text-base sm:text-lg text-zinc-400 font-medium leading-relaxed mb-8 max-w-2xl mx-auto">
            El rincón de internet donde el chisme, la confesión y el chiste son los protagonistas. ¡Publica al instante de forma anónima y diviértete!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5 text-zinc-500 text-xs font-bold">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border-2 border-zinc-800/80">
              <ShieldCheck size={14} className="text-emerald-400" />
              Anónimo Opcional
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border-2 border-zinc-800/80">
              <MessageSquare size={14} className="text-purple-400" />
              Comentarios Libres
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border-2 border-zinc-800/80">
              <Flame size={14} className="text-rose-400" />
              Reacciones de Locura
            </span>
          </div>
        </section>

        {/* TODO: Publicidad - AdSense Leaderboard (728x90 o 970x90) */}
        {/* <div className="w-full max-w-5xl my-8">
          <AdBanner slot="home-top-leaderboard" type="leaderboard" />
        </div> */}

        {/* Categories Grid Header */}
        <div className="w-full max-w-6xl flex items-center justify-between mb-8 pb-4 border-b-2 border-zinc-900">
          <div className="flex items-center gap-2">
            <TrendingUp size={22} className="text-amber-400 animate-bounce-little" />
            <h2 className="text-2xl font-black tracking-tight text-white">Elige tu categoría:</h2>
          </div>
          <span className="text-xs bg-zinc-900 px-3 py-1.5 rounded-xl border-2 border-zinc-800/80 text-zinc-400 font-bold">
            {categorias.length} Foros
          </span>
        </div>

        {/* Categories Grid */}
        <section className="w-full max-w-6xl">
          {categorias.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900/50 border border-zinc-800 rounded-lg">
              <p className="text-zinc-400">Cargando categorías...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorias.map((cat, index) => {
            const styles = MOCK_EMOJIS_ACCENTS[cat.slug] || {
              border: 'border-zinc-800',
              text: 'text-zinc-300',
              bg: 'bg-zinc-900/50',
              shadow: 'shadow-black/50',
            };

            const emoji = cat.nombre.split(' ')[0];
            const titleText = cat.nombre.replace(emoji, '').trim();

            return (
              <Link
                key={cat.id}
                href={`/${cat.slug}`}
                className={`comic-card group relative flex flex-col justify-between p-6 rounded-3xl border-2 ${styles.bg} ${styles.border} transition-all hover:shadow-xl`}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl ${styles.bg} border-2 ${styles.border.split(' ')[0]} flex items-center justify-center text-3xl mb-4 group-hover:rotate-[-6deg] group-hover:scale-110 transition-transform duration-300`}>
                    {emoji}
                  </div>
                  <h3 className={`text-xl font-bold ${styles.text} mb-2 flex items-center gap-1 group-hover:opacity-80 transition-opacity`}>
                    {titleText}
                  </h3>
                  <p className={`text-xs sm:text-sm ${styles.text} font-medium leading-relaxed mb-6 opacity-75`}>
                    {cat.descripcion}
                  </p>
                </div>

                <div className={`flex items-center gap-1 text-xs font-bold ${styles.text} group-hover:opacity-60 transition-opacity mt-auto pt-2`}>
                  <span>¡Entrar!</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                </div>

                {/* Decorative border highlight */}
                <div className="absolute inset-0 rounded-[22px] bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
              </Link>
            );
          })}
            </div>
          )}
        </section>

        {/* TODO: Publicidad - AdSense Leaderboard (728x90 o 970x90) */}
        {/* <div className="w-full max-w-5xl mt-12">
          <AdBanner slot="home-bottom-leaderboard" type="leaderboard" />
        </div> */}
      </main>
      
      <Footer />
    </>
  );
}
