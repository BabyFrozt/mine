import React from 'react';
import { Pickaxe, Wrench, Gem, RotateCcw } from 'lucide-react';

const items = [
  { num: '01', title: 'MINE BLOCKS', icon: Pickaxe, desc: 'Click voxels on the Octahedron. Every block has a chance to drop GEMS, USDC, $MINEX, or zonk.' },
  { num: '02', title: 'UPGRADE TOOLS', icon: Wrench, desc: 'Buy Mk2–Mk5 tools. Bigger range, more uses, higher reward boost.' },
  { num: '03', title: 'COLLECT TREASURE', icon: Gem, desc: 'Find rare drops. $USDC payouts roll from a hidden lucky-table. Best of luck, miner.' },
  { num: '04', title: 'REPAIR & REPEAT', icon: RotateCcw, desc: 'Repair broken tools. Boost rewards. Repeat — the Orbit refills every 24h.' },
];

export default function Mission() {
  return (
    <section id="mission" className="relative py-20 md:py-28 bg-black">
      <div className="px-5 md:px-10 max-w-7xl mx-auto">
        <div className="flex items-baseline gap-4 mb-10">
          <span className="font-mono text-xs tracking-[0.2em] text-yellow-400">// SEC 01</span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-stone-500">THE MISSION</span>
        </div>
        <h2 className="font-display text-white text-[14vw] md:text-[8rem] leading-none">THE MISSION</h2>
        <p className="font-mono text-sm text-stone-400 mt-6 max-w-2xl">Eat. Sleep. Mine. Repeat. — The four pillars of Consortium life.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-14">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <div key={it.num} className="group border border-yellow-400/20 hover:border-yellow-400/70 p-6 transition-colors relative bg-neutral-950">
                <div className="flex items-start justify-between mb-8">
                  <span className="font-mono text-xs tracking-[0.2em] text-stone-500">// {it.num}</span>
                  <Icon className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="font-display text-white text-2xl mb-3">{it.title}</div>
                <div className="font-mono text-xs leading-relaxed text-stone-400">{it.desc}</div>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-yellow-400 group-hover:w-full transition-all duration-500" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
