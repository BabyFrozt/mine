import React, { useEffect, useState } from 'react';
import { ArrowRight, Send } from 'lucide-react';
import { useGame } from '../../context/GameContext';

export default function Hero({ onPlayClick }) {
  const { onlineCount } = useGame();
  const [seed, setSeed] = useState('04-X');
  useEffect(() => {
    const id = setInterval(() => {
      const codes = ['04-X', '05-Z', '11-Q', '07-K', '09-M'];
      setSeed(codes[Math.floor(Math.random() * codes.length)]);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen bg-grid pt-28 pb-16 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[900px] h-[700px] rounded-full blur-3xl opacity-30" style={{ background: 'radial-gradient(closest-side, rgba(250,204,21,0.45), transparent 70%)' }} />
      </div>

      <div className="relative px-5 md:px-10">
        <div className="grid grid-cols-2 gap-3 md:gap-6 max-w-6xl mx-auto mt-4">
          <div className="border border-yellow-400/40 p-3 font-mono text-[10px] md:text-xs tracking-[0.18em] text-stone-300">
            BULLETIN {seed}
            <span className="text-yellow-400 ml-2 term-cursor">_</span>
          </div>
          <div className="border border-yellow-400/40 p-3 font-mono text-[10px] md:text-xs tracking-[0.18em] text-stone-300">
            MINEXDRON ENTERED ORBIT
          </div>
        </div>

        <h1 className="font-display text-white mt-10 md:mt-14 max-w-7xl mx-auto leading-[0.86] text-[16vw] md:text-[11vw] lg:text-[9.5rem]">
          <div>EXCAVATE.</div>
          <div className="md:pl-[6vw]">PROTECT.</div>
          <div className="md:pl-[14vw]">PROFIT.</div>
        </h1>

        <div className="mt-10 md:mt-14 max-w-6xl mx-auto grid md:grid-cols-3 gap-6 items-end">
          <p className="text-stone-400 font-mono text-xs md:text-sm leading-relaxed md:col-span-2">
            <span className="text-yellow-400">_____</span> A mysterious Minexdron has arrived in low-Earth orbit.
            Join the miners, dig through its voxel shell, claim $GEMS, $MINEX and $USDC.
            <br />Mine alongside <span className="text-yellow-400 font-bold">{onlineCount}</span> players online right now.
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={onPlayClick} className="w-full bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-4 rounded-full font-mono text-sm tracking-[0.2em] font-bold flex items-center justify-center gap-2 transition-colors glow-yellow">
              <Send className="w-4 h-4" /> LAUNCH GAME
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center justify-center gap-2 font-mono text-[11px] tracking-[0.18em] text-stone-400">
              <span className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
              {onlineCount} MINERS ONLINE
            </div>
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto mt-12 md:mt-16">
          <VoxelPyramidStatic />
        </div>
      </div>
    </section>
  );
}

function VoxelPyramidStatic() {
  return (
    <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-yellow-400/20 bg-black">
      <div className="absolute inset-0 bg-grid-tight opacity-60" />
      <svg viewBox="0 0 800 450" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#262626" />
            <stop offset="1" stopColor="#0a0a0a" />
          </linearGradient>
          <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#404040" />
            <stop offset="1" stopColor="#1a1a1a" />
          </linearGradient>
          <linearGradient id="g3" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#facc15" stopOpacity="0.85" />
            <stop offset="1" stopColor="#a16207" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <g transform="translate(400,225)">
          <polygon points="0,-180 220,0 0,0" fill="url(#g2)" stroke="#facc15" strokeOpacity="0.5" />
          <polygon points="0,-180 -220,0 0,0" fill="url(#g1)" stroke="#facc15" strokeOpacity="0.4" />
          <polygon points="0,180 220,0 0,0" fill="url(#g1)" stroke="#facc15" strokeOpacity="0.5" />
          <polygon points="0,180 -220,0 0,0" fill="url(#g2)" stroke="#facc15" strokeOpacity="0.4" />
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={'h' + i} x1={-220 + i * 44} y1={0} x2={0} y2={-180 + (i * 18)} stroke="#facc15" strokeOpacity="0.18" />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={'v' + i} x1={i * 22} y1={-180 + i * 18} x2={i * 22 - 220} y2={i * 18} stroke="#facc15" strokeOpacity="0.14" />
          ))}
          <polygon points="-30,-60 -10,-50 -10,-30 -30,-20 -50,-30 -50,-50" fill="url(#g3)" />
          <polygon points="60,20 80,30 80,50 60,60 40,50 40,30" fill="#a78bfa" opacity="0.7" />
          <polygon points="-90,40 -70,50 -70,70 -90,80 -110,70 -110,50" fill="#22d3ee" opacity="0.7" />
        </g>
      </svg>
      <div className="absolute bottom-3 left-4 font-mono text-[10px] tracking-[0.18em] text-stone-400">
        // MINEXDRON · ORBIT 04-X
      </div>
      <div className="absolute top-3 right-4 font-mono text-[10px] tracking-[0.18em] text-yellow-400">
        STATUS: <span className="text-green-400">LIVE</span>
      </div>
    </div>
  );
}
