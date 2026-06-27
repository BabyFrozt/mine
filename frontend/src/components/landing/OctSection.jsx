import React from 'react';
import { Coins } from 'lucide-react';

export default function OctSection() {
  return (
    <section id="minex" className="relative py-20 md:py-28 bg-black overflow-hidden">
      <div className="px-5 md:px-10 max-w-7xl mx-auto">
        <div className="flex items-baseline gap-4 mb-10">
          <span className="font-mono text-xs tracking-[0.2em] text-yellow-400">// SEC 02</span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-stone-500">CURRENCY</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-white text-[16vw] md:text-[8rem] leading-none">$MINEX</h2>
            <p className="font-mono text-sm text-stone-400 mt-6 max-w-md leading-relaxed">
              Each black cell of the Minexdron holds <span className="text-yellow-400">$MINEX</span> — the native token, the most valuable treasure and the ultimate catalyst for progress.
              With a finite supply, it&apos;s the key to unlocking superior tools.
            </p>
            <p className="font-mono text-[11px] tracking-[0.18em] text-stone-500 mt-3">
              // TOKEN NOT DEPLOYED YET — STATS LOCKED
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3">
              <Stat label="SUPPLY" value="—" />
              <Stat label="MINED" value="—" />
              <Stat label="BURNED" value="—" />
            </div>
          </div>

          <div className="relative aspect-square max-w-[460px] mx-auto w-full">
            <div className="absolute inset-0 grid grid-cols-6 gap-2">
              {Array.from({ length: 36 }).map((_, i) => {
                const isBright = [8, 15, 21, 28].includes(i);
                return (
                  <div key={i} className={`aspect-square rounded-xl ${isBright ? 'bg-white' : 'bg-neutral-900'} border ${isBright ? 'border-white' : 'border-neutral-800'} relative overflow-hidden`} style={isBright ? { boxShadow: '0 0 30px rgba(255,255,255,0.6)' } : null}>
                    {isBright && <Coins className="absolute inset-0 m-auto w-5 h-5 text-yellow-500" />}
                  </div>
                );
              })}
            </div>
            <div className="absolute -inset-2 rounded-3xl border border-yellow-400/30" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="border border-yellow-400/30 p-3 bg-neutral-950">
      <div className="font-mono text-[10px] tracking-[0.2em] text-stone-500">// {label}</div>
      <div className="font-display text-yellow-400 text-2xl mt-1">{value}</div>
    </div>
  );
}
