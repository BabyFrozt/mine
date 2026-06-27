import React from 'react';
import { Wrench, Zap, Hammer, Pickaxe, Drill } from 'lucide-react';
import { TIER_DATA } from '../../mock';

const icons = { 1: Pickaxe, 2: Hammer, 3: Wrench, 4: Drill, 5: Zap };

export default function EquipmentSection() {
  return (
    <section id="equipment" className="relative py-20 md:py-28 bg-black">
      <div className="px-5 md:px-10 max-w-7xl mx-auto">
        <div className="flex items-baseline gap-4 mb-10">
          <span className="font-mono text-xs tracking-[0.2em] text-yellow-400">// SEC 04</span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-stone-500">EQUIPMENT</span>
        </div>
        <h2 className="font-display text-white text-[12vw] md:text-[7rem] leading-[0.9]">EQUIPMENT<br /><span className="text-yellow-400">& FUSING</span></h2>
        <p className="font-mono text-sm text-stone-400 mt-6 max-w-2xl">
          Five tool tiers. Bigger range, more durability, fatter boost. Fuse two of the same tier (50% chance) for a higher tier instead of buying.
        </p>

        <div className="mt-14 overflow-x-auto no-scrollbar">
          <div className="grid grid-cols-5 gap-3 min-w-[860px]">
            {[1, 2, 3, 4, 5].map((t) => {
              const d = TIER_DATA[t];
              const Icon = icons[t];
              return (
                <div key={t} className="border border-yellow-400/20 hover:border-yellow-400/70 transition-colors bg-neutral-950 p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-stone-500">// TIER</span>
                    <span className="font-display text-yellow-400 text-3xl">{t}</span>
                  </div>
                  <div className="aspect-square my-3 rounded-md border border-yellow-400/15 bg-black flex items-center justify-center" style={{ background: `radial-gradient(closest-side, ${d.color}25, transparent 70%)` }}>
                    <Icon className="w-10 h-10" style={{ color: d.color }} />
                  </div>
                  <div className="font-display text-white text-lg">{d.name}</div>
                  <div className="mt-2 space-y-1 font-mono text-[11px] text-stone-400">
                    <Row k="RANGE" v={`${d.range} blocks`} />
                    <Row k="USES" v={d.maxUses} />
                    <Row k="BOOST" v={`+${d.boost}%`} />
                    <Row k="PRICE" v={d.priceGems ? `${d.priceGems} GEMS` : `$${d.priceUsdc} USDC`} highlight />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ k, v, highlight }) {
  return (
    <div className="flex items-center justify-between border-b border-yellow-400/10 py-1">
      <span className="text-stone-500">{k}</span>
      <span className={highlight ? 'text-yellow-400 font-bold' : 'text-stone-200'}>{v}</span>
    </div>
  );
}
