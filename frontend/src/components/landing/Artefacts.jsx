import React from 'react';

const gems = [
  { name: 'GRAPHENE GEM', color: '#22d3ee', sub: 'COMMON · +5% YIELD', shape: 'hex' },
  { name: 'AEROGEL GEM', color: '#a78bfa', sub: 'RARE · +20% YIELD', shape: 'diamond' },
  { name: 'NANOPOLYMER GEM', color: '#f97316', sub: 'EPIC · +50% YIELD', shape: 'tri' },
];

export default function Artefacts() {
  return (
    <section id="gems" className="relative py-20 md:py-28 bg-black">
      <div className="px-5 md:px-10 max-w-7xl mx-auto">
        <div className="flex items-baseline gap-4 mb-10">
          <span className="font-mono text-xs tracking-[0.2em] text-yellow-400">// SEC 03</span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-stone-500">RARE FINDS</span>
        </div>
        <h2 className="font-display text-white text-[14vw] md:text-[8rem] leading-none">ARTEFACTS</h2>
        <p className="font-mono text-sm text-stone-400 mt-6 max-w-2xl">
          The Minexdron is rich with valuable artefacts. Some boost your equipment; rare ones can be exchanged for $USDC, crypto, or physical items at the Foundry.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-14">
          {gems.map((g) => (
            <div key={g.name} className="group relative aspect-[4/5] border border-yellow-400/20 hover:border-yellow-400/70 transition-colors bg-neutral-950 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <GemShape color={g.color} shape={g.shape} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-yellow-400/20">
                <div className="font-display text-white text-xl">{g.name}</div>
                <div className="font-mono text-[10px] tracking-[0.2em] text-stone-500 mt-1">// {g.sub}</div>
              </div>
              <div className="absolute top-3 right-3 font-mono text-[10px] tracking-[0.2em] text-yellow-400/70">ID-{Math.floor(Math.random() * 999).toString().padStart(3, '0')}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GemShape({ color, shape }) {
  const w = 180;
  return (
    <svg width={w} height={w} viewBox="0 0 200 200">
      <defs>
        <radialGradient id={`grd-${color}`} cx="50%" cy="40%">
          <stop offset="0" stopColor={color} stopOpacity="0.95" />
          <stop offset="1" stopColor="#000" stopOpacity="0.1" />
        </radialGradient>
      </defs>
      {shape === 'hex' && (
        <polygon points="100,20 175,60 175,140 100,180 25,140 25,60" fill={`url(#grd-${color})`} stroke={color} strokeWidth="1.5" />
      )}
      {shape === 'diamond' && (
        <polygon points="100,20 180,100 100,180 20,100" fill={`url(#grd-${color})`} stroke={color} strokeWidth="1.5" />
      )}
      {shape === 'tri' && (
        <polygon points="100,20 180,170 20,170" fill={`url(#grd-${color})`} stroke={color} strokeWidth="1.5" />
      )}
      <polygon points="100,40 130,80 90,120 70,80" fill="white" opacity="0.18" />
    </svg>
  );
}
