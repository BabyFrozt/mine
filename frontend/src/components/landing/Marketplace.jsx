import React from 'react';
import { Store, Coins } from 'lucide-react';

export default function Marketplace() {
  return (
    <section id="marketplace" className="relative py-20 md:py-28 bg-black">
      <div className="px-5 md:px-10 max-w-7xl mx-auto">
        <div className="flex items-baseline gap-4 mb-10">
          <span className="font-mono text-xs tracking-[0.2em] text-yellow-400">// SEC 06</span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-stone-500">FOUNDRY</span>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <Card title="MARKETPLACE" icon={Store} desc="Trade rare tools, gems and boosters with other miners. 5% commission." status="COMING SOON" />
          <Card title="FOUNDRY" icon={Coins} desc="Cash out your USDC prize pool. Withdrawals settle to your wallet in under 24h." status="COMING SOON" />
        </div>
      </div>
    </section>
  );
}

function Card({ title, icon: Icon, desc, status }) {
  return (
    <div className="group relative border border-yellow-400/20 hover:border-yellow-400/70 transition-colors bg-neutral-950 p-8 overflow-hidden">
      <div className="flex items-start justify-between">
        <Icon className="w-7 h-7 text-yellow-400" />
        <span className="font-mono text-[10px] tracking-[0.2em] text-stone-500 border border-stone-700 px-2 py-1">{status}</span>
      </div>
      <div className="font-display text-white text-3xl md:text-5xl mt-10">{title}</div>
      <p className="font-mono text-xs text-stone-400 mt-3 max-w-md">{desc}</p>
      <div className="absolute -bottom-1 left-0 h-0.5 w-0 bg-yellow-400 group-hover:w-full transition-all duration-500" />
    </div>
  );
}
