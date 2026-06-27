import React from 'react';
import { useGame } from '../../context/GameContext';
import { TIER_DATA } from '../../mock';
import { Pickaxe, Hammer, Wrench, Drill, Zap, Settings2, ArrowLeft } from 'lucide-react';
import { Progress } from '../ui/progress';
import { useNavigate } from 'react-router-dom';

const icons = { 1: Pickaxe, 2: Hammer, 3: Wrench, 4: Drill, 5: Zap };

export default function HUD({ openShop, openInventory, openWallet, openProfile, showHomeBtn = true }) {
  const { player, activeTool, logout } = useGame();
  const navigate = useNavigate();
  if (!player) return null;
  const tier = activeTool?.tier ?? 1;
  const Icon = icons[tier];
  const tdata = TIER_DATA[tier];
  const pct = activeTool ? (activeTool.uses / activeTool.maxUses) * 100 : 0;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {/* Top bar */}
      <div className="px-3 md:px-5 py-3 flex items-center justify-between gap-3 pointer-events-auto">
        <div className="flex items-center gap-2">
          {showHomeBtn && (
            <button onClick={() => { logout(); navigate('/'); }} className="w-10 h-10 border border-yellow-400/40 bg-black/80 flex items-center justify-center text-stone-200 hover:text-yellow-400 hover:border-yellow-400 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <button onClick={openProfile} className="flex items-center gap-2 border border-yellow-400/40 bg-black/80 px-3 h-10">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-700 flex items-center justify-center font-display text-black text-xs">{(player.nickname[0] || 'M').toUpperCase()}</div>
            <span className="font-mono text-xs text-stone-200 truncate max-w-[120px]">{player.nickname}</span>
          </button>
        </div>

        {/* Center: Tool & uses indicator */}
        <div className="hidden md:flex items-center gap-3 border border-yellow-400/40 bg-black/85 px-4 h-12">
          <div className="w-8 h-8 border border-yellow-400/30 flex items-center justify-center shrink-0" style={{ background: `radial-gradient(closest-side, ${tdata.color}33, transparent 70%)` }}>
            <Icon className="w-4 h-4" style={{ color: tdata.color }} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-display text-white text-sm">{tdata.name}</span>
              <span className="font-mono text-[10px] tracking-[0.2em] text-stone-500">TIER {tier}</span>
              {activeTool?.broken && <span className="font-mono text-[10px] tracking-[0.2em] text-red-400">BROKEN</span>}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-xs text-yellow-400 font-bold">{activeTool?.uses ?? 0}<span className="text-stone-500">/{activeTool?.maxUses ?? 0}</span></span>
              <span className="font-mono text-[10px] tracking-[0.2em] text-stone-500">USES</span>
              <span className="text-stone-700">·</span>
              <span className="font-mono text-[10px] tracking-[0.2em] text-green-400">+{tdata.boost}% BOOST</span>
              <span className="text-stone-700">·</span>
              <span className="font-mono text-[10px] tracking-[0.2em] text-stone-400">RANGE {tdata.range}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={openShop} className="h-10 px-4 bg-yellow-400 hover:bg-yellow-300 text-black font-mono text-[11px] tracking-[0.2em] font-bold flex items-center gap-2">
            <Settings2 className="w-4 h-4" /> SHOP
          </button>
        </div>
      </div>

      {/* Mobile centered uses indicator */}
      <div className="md:hidden absolute top-16 left-1/2 -translate-x-1/2 pointer-events-auto">
        <div className="border border-yellow-400/40 bg-black/85 px-3 py-2 flex items-center gap-2">
          <Icon className="w-4 h-4" style={{ color: tdata.color }} />
          <span className="font-display text-white text-sm">{tdata.name}</span>
          <span className="font-mono text-xs text-yellow-400 font-bold">{activeTool?.uses ?? 0}<span className="text-stone-500">/{activeTool?.maxUses ?? 0}</span></span>
        </div>
      </div>

      {/* Currencies bar */}
      <div className="absolute top-16 md:top-20 right-3 md:right-5 flex flex-col items-end gap-2 pointer-events-auto">
        <Pill label="GEMS" value={player.wallet.gems.toLocaleString()} color="#22d3ee" />
        <Pill label="USDC" value={`$${player.wallet.usdc.toFixed(2)}`} color="#22c55e" />
        <Pill label="MINEX" value={player.wallet.minex.toLocaleString()} color="#facc15" />
        <div className="flex gap-2 mt-1">
          <button onClick={openWallet} className="h-8 px-3 border border-yellow-400/40 bg-black/80 font-mono text-[10px] tracking-[0.2em] text-stone-200 hover:text-yellow-400 hover:border-yellow-400">WALLET</button>
          <button onClick={openInventory} className="h-8 px-3 border border-yellow-400/40 bg-black/80 font-mono text-[10px] tracking-[0.2em] text-stone-200 hover:text-yellow-400 hover:border-yellow-400">INVENTORY</button>
        </div>
      </div>

      {/* Bottom durability bar */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 md:bottom-5 pointer-events-auto w-[min(560px,calc(100vw-24px))]">
        <div className="bg-black/85 border border-yellow-400/40 px-4 py-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[10px] tracking-[0.2em] text-stone-400">DURABILITY</span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-stone-400">{activeTool?.uses ?? 0}/{activeTool?.maxUses ?? 0}</span>
          </div>
          <Progress value={pct} className="h-1.5 bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}

function Pill({ label, value, color }) {
  return (
    <div className="h-9 border border-yellow-400/40 bg-black/80 px-3 flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      <span className="font-mono text-[10px] tracking-[0.2em] text-stone-400">{label}</span>
      <span className="font-mono text-xs text-stone-100 font-bold">{value}</span>
    </div>
  );
}
