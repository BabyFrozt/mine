import React from 'react';
import { useGame } from '../../context/GameContext';
import { ITEM_NAMES, ITEM_COLORS, formatCoords } from '../../mock';
import { Activity } from 'lucide-react';

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
    <div className="w-full md:w-80 bg-black/85 border border-yellow-400/25 backdrop-blur-sm flex flex-col h-full">
      <div className="px-4 py-3 border-b border-yellow-400/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-yellow-400" />
          <span className="font-mono text-[11px] tracking-[0.2em] text-yellow-400">// LIVE ACTIVITY</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
          <span className="font-mono text-[10px] tracking-[0.2em] text-stone-400">LIVE</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {liveFeed.length === 0 && (
          <div className="p-4 font-mono text-xs text-stone-500">// Awaiting events...</div>
        )}
        {liveFeed.map((ev) => {
          const rType = ev.reward?.type || 'gems';
          const itemName = ITEM_NAMES[rType] || 'Item';
          const color = ITEM_COLORS[rType] || '#a78bfa';
          const coords = ev.coords ? formatCoords(ev.coords.x, ev.coords.y) : '0,0,0';
          return (
            <div key={ev.id} className="px-3 py-2 border-b border-yellow-400/10 hover:bg-yellow-400/5 transition-colors">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="w-2.5 h-2.5 shrink-0" style={{ background: color }} />
                  <span className="font-mono text-xs text-yellow-400 truncate">{ev.nick}</span>
                  <span className="font-mono text-[11px] text-stone-500">excavated</span>
                  <span className="font-mono text-[11px] font-bold truncate" style={{ color }}>{itemName}</span>
                </div>
                <span className="font-mono text-[10px] text-stone-600 shrink-0">{relTime(ev.ts)}</span>
              </div>
              <div className="flex items-center justify-between mt-0.5 pl-4.5">
                <span className="font-mono text-[10px] text-stone-600 ml-4.5">{ev.reward?.final ? (rType === 'usdc' ? `$${ev.reward.final}` : `+${ev.reward.final.toLocaleString()}`) : ''}</span>
                <span className="font-mono text-[10px] text-stone-600">{coords}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="px-3 py-2 border-t border-yellow-400/20 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.2em] text-stone-500">// ON-SITE</span>
        <span className="font-mono text-[10px] tracking-[0.2em] text-yellow-400">{onlineCount} MINERS</span>
      </div>
    </div>
  );
}
