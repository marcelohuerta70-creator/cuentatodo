'use client';

import React from 'react';

interface ScatteredEmoji {
  emoji: string;
  top: string;
  left: string;
  size: string;
  rotate: string;
  opacity: string;
  pulse?: boolean;
}

const SCATTERED_EMOJIS: ScatteredEmoji[] = [
  // Top Area
  { emoji: '😂', top: '8%', left: '8%', size: 'text-3xl md:text-4xl', rotate: 'rotate-12', opacity: 'opacity-[0.07]' },
  { emoji: '🤫', top: '12%', left: '88%', size: 'text-4xl md:text-5xl', rotate: '-rotate-12', opacity: 'opacity-[0.08]', pulse: true },
  { emoji: '👀', top: '18%', left: '48%', size: 'text-2xl md:text-3xl', rotate: 'rotate-6', opacity: 'opacity-[0.06]' },
  
  // Upper Mid
  { emoji: '🗣', top: '28%', left: '15%', size: 'text-4xl', rotate: '-rotate-45', opacity: 'opacity-[0.05]' },
  { emoji: '💡', top: '32%', left: '78%', size: 'text-3xl', rotate: 'rotate-12', opacity: 'opacity-[0.06]' },
  { emoji: '🚩', top: '38%', left: '5%', size: 'text-3xl', rotate: 'rotate-[20deg]', opacity: 'opacity-[0.05]' },
  { emoji: '🟢', top: '35%', left: '92%', size: 'text-2xl', rotate: '-rotate-6', opacity: 'opacity-[0.07]' },

  // Center Mid
  { emoji: '👻', top: '48%', left: '20%', size: 'text-4xl md:text-5xl', rotate: 'rotate-45', opacity: 'opacity-[0.06]', pulse: true },
  { emoji: '🌶️', top: '52%', left: '82%', size: 'text-3xl md:text-4xl', rotate: '-rotate-12', opacity: 'opacity-[0.06]' },
  { emoji: '📖', top: '58%', left: '42%', size: 'text-3xl', rotate: 'rotate-12', opacity: 'opacity-[0.05]' },

  // Lower Mid
  { emoji: '😂', top: '68%', left: '10%', size: 'text-3xl', rotate: '-rotate-[15deg]', opacity: 'opacity-[0.06]' },
  { emoji: '🤫', top: '72%', left: '90%', size: 'text-4xl', rotate: 'rotate-45', opacity: 'opacity-[0.07]' },
  { emoji: '👀', top: '78%', left: '52%', size: 'text-2xl md:text-3xl', rotate: '-rotate-12', opacity: 'opacity-[0.06]', pulse: true },
  { emoji: '💡', top: '82%', left: '25%', size: 'text-3xl', rotate: 'rotate-6', opacity: 'opacity-[0.05]' },

  // Bottom Area
  { emoji: '🗣', top: '92%', left: '8%', size: 'text-4xl', rotate: 'rotate-12', opacity: 'opacity-[0.06]' },
  { emoji: '🚩', top: '88%', left: '75%', size: 'text-3xl', rotate: '-rotate-45', opacity: 'opacity-[0.05]' },
  { emoji: '🟢', top: '95%', left: '45%', size: 'text-2xl', rotate: 'rotate-[25deg]', opacity: 'opacity-[0.06]' },
  { emoji: '🌶️', top: '96%', left: '88%', size: 'text-3xl', rotate: 'rotate-12', opacity: 'opacity-[0.05]' },
];

export default function EmojiBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      
      {/* Playful background colorful radial mesh gradient */}
      <div className="absolute inset-0 bg-zinc-950" />
      
      {/* Purple glow */}
      <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/15 blur-[120px]" />
      
      {/* Amber glow */}
      <div className="absolute top-[40%] right-[-10%] w-[60%] h-[60%] rounded-full bg-amber-900/10 blur-[130px]" />
      
      {/* Rose glow */}
      <div className="absolute bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-rose-950/15 blur-[140px]" />

      {/* Scattered emojis */}
      {SCATTERED_EMOJIS.map((item, index) => (
        <div
          key={index}
          className={`absolute font-bold text-center ${item.size} ${item.rotate} ${item.opacity} transition-all duration-1000 ${
            item.pulse ? 'animate-pulse duration-[3000ms]' : ''
          }`}
          style={{
            top: item.top,
            left: item.left,
          }}
        >
          {item.emoji}
        </div>
      ))}
    </div>
  );
}
