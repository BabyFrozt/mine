import React from 'react';
import { useGame } from '../../context/GameContext';
import { TIER_DATA } from '../../mock';
import { Pickaxe, Hammer, Wrench, Drill, Zap, Settings2, ArrowLeft } from 'lucide-react';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

const icons = { 1: Pickaxe, 2: Hammer, 3: Wrench, 4: Drill, 5: Zap };

export default function HUD({ openShop, openInventory, openWallet, openProfile }) {
  const { player, activeTool, logout } = useGame();
  const navigate = useNavigate();
  if (!player) return null;
  const tier = activeTool?.tier ?? 1;
  const Icon = icons[tier];
  const tdata = TIER_DATA[tier];
  const pct = activeTool ? (activeTool.uses / activeTool.maxUses) * 100 : 0;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      <div className="px-3 md:px-5 py-3 flex items-center justify-between gap-3 pointer-events-auto">
        <div className="flex items-center gap-2">
          <button onClick={() => { logout(); navigate('/'); }} className="w-10 h-10 border border-yellow-400/40 bg-black/80 flex items-center justify-center text-stone-200 hover:text-yellow-400 hover:border-yellow-400 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button onClick={openProfile} className="flex items-center gap-2 border border-yellow-400/40 bg-black/80 px-3 h-10">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-700 flex items-center justify-center font-display text-black text-xs">{(player.nickname[0] || 'M').toUpperCase()}</div>
            <span className="font-mono text-xs text-stone-200 truncate max-w-[120px]">{player.nickname}</span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Pill label="GEMS" value={player.wallet.gems.toLocaleString()} color="#22d3ee" />
          <Pill label="USDC" value={`$${player.wallet.usdc.toFixed(2)}`} color="#22c55e" />
          <Pill label="MINEX" value={player.wallet.minex.toLocaleString()} color="#facc15" />
        </div>

        <div className="flex items-center gap-2">
          <button onClick={openWallet} className="hidden md:flex h-10 px-4 border border-yellow-400/40 bg-black/80 font-mono text-[11px] tracking-[0.2em] text-stone-200 hover:text-yellow-400 hover:border-yellow-400 items-center">WALLET</button>
          <button onClick={openInventory} className="hidden md:flex h-10 px-4 border border-yellow-400/40 bg-black/80 font-mono text-[11px] tracking-[0.2em] text-stone-200 hover:text-yellow-400 hover:border-yellow-400 items-center">INVENTORY</button>
          <button onClick={openShop} className="h-10 px-4 bg-yellow-400 hover:bg-yellow-300 text-black font-mono text-[11px] tracking-[0.2em] font-bold flex items-center gap-2">
            <Settings2 className="w-4 h-4" /> SHOP
          </button>
        </div>
      </div>

      {/* Mobile currency strip */}
      <div className="md:hidden px-3 mt-1 flex gap-2 pointer-events-auto overflow-x-auto no-scrollbar">
        <Pill label="GEMS" value={player.wallet.gems.toLocaleString()} color="#22d3ee" />
        <Pill label="USDC" value={`$${player.wallet.usdc.toFixed(2)}`} color="#22c55e" />
        <Pill label="MINEX" value={player.wallet.minex.toLocaleString()} color="#facc15" />
        <button onClick={openWallet} className="shrink-0 h-9 px-3 border border-yellow-400/40 bg-black/80 font-mono text-[10px] tracking-[0.2em] text-stone-200">WALLET</button>
        <button onClick={openInventory} className="shrink-0 h-9 px-3 border border-yellow-400/40 bg-black/80 font-mono text-[10px] tracking-[0.2em] text-stone-200">INVENTORY</button>
      </div>

      {/* Bottom: active tool */}
      <div className="absolute bottom-3 left-3 right-3 md:left-5 md:right-auto md:bottom-5 pointer-events-auto">
        <div className="bg-black/85 border border-yellow-400/40 px-4 py-3 max-w-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 border border-yellow-400/30 flex items-center justify-center" style={{ background: `radial-gradient(closest-side, ${tdata.color}33, transparent 70%)` }}>
              <Icon className="w-6 h-6" style={{ color: tdata.color }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="font-display text-white text-base">{tdata.name} <span className="text-stone-500 text-xs ml-1">TIER {tier}</span></div>
                <div className="font-mono text-[11px] text-stone-400">{activeTool?.uses}/{activeTool?.maxUses}</div>
              </div>
              <Progress value={pct} className="h-1.5 mt-2 bg-neutral-800" />
              <div className="flex items-center justify-between mt-2 font-mono text-[10px] tracking-[0.2em] text-stone-500">
                <span>RANGE {tdata.range}</span>
                <span className="text-green-400">+{tdata.boost}% BOOST</span>
                {activeTool?.broken && <span className="text-red-400">BROKEN</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pill({ label, value, color }) {
  return (
    <div className="shrink-0 h-9 md:h-10 border border-yellow-400/40 bg-black/80 px-3 flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      <span className="font-mono text-[10px] tracking-[0.2em] text-stone-400">{label}</span>
      <span className="font-mono text-xs text-stone-100 font-bold">{value}</span>
    </div>
  );
}
