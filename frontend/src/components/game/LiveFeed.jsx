import React from 'react';
import { useGame } from '../../context/GameContext';
import { Gem, DollarSign, Sparkles, Coins } from 'lucide-react';

const META = {
  gems: { label: 'GEMS', Icon: Gem, color: '#22d3ee' },
  usdc: { label: 'USDC', Icon: DollarSign, color: '#22c55e' },
  minex: { label: '$MINEX', Icon: Sparkles, color: '#facc15' },
  zonk: { label: 'ZONK', Icon: Coins, color: '#737373' },
};

function relTime(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h`;
}

export default function LiveFeed() {
  const { liveFeed, onlineCount } = useGame();

  return (
    <div className="w-full md:w-72 bg-black/85 border border-yellow-400/25 backdrop-blur-sm flex flex-col h-full">
      <div className="px-4 py-3 border-b border-yellow-400/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
          <span className="font-mono text-[11px] tracking-[0.2em] text-yellow-400">LIVE FEED</span>
        </div>
        <span className="font-mono text-[10px] tracking-[0.2em] text-stone-400">{onlineCount} ONLINE</span>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {liveFeed.length === 0 && (
          <div className="p-4 font-mono text-xs text-stone-500">// Awaiting events...</div>
        )}
        {liveFeed.map((ev) => {
          const m = META[ev.reward?.type] || META.gems;
          const Icon = m.Icon;
          const v = ev.reward.type === 'usdc' ? `$${ev.reward.final}` : `${ev.reward.final?.toLocaleString?.() ?? ev.reward.final}`;
          return (
            <div key={ev.id} className="px-4 py-2.5 border-b border-yellow-400/10 flex items-center gap-3 hover:bg-yellow-400/5 transition-colors">
              <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: `${m.color}22`, border: `1px solid ${m.color}55` }}>
                <Icon className="w-4 h-4" style={{ color: m.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-xs text-stone-200 truncate">{ev.nick}</div>
                <div className="font-mono text-[10px] text-stone-500">found {v} {m.label}</div>
              </div>
              <span className="font-mono text-[10px] text-stone-600 shrink-0">{relTime(ev.ts)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
