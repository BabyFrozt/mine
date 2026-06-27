import React, { useCallback, useMemo, useState } from 'react';
import VoxelOctahedron from '../components/game/VoxelOctahedron';
import HUD from '../components/game/HUD';
import LiveFeed from '../components/game/LiveFeed';
import RewardPopup from '../components/game/RewardPopup';
import Shop from '../components/game/Shop';
import Inventory from '../components/game/Inventory';
import Wallet from '../components/game/Wallet';
import Profile from '../components/game/Profile';
import { useGame } from '../context/GameContext';
import { rollReward, TIER_DATA } from '../mock';
import { Info, X } from 'lucide-react';

const R = 14;

export default function GamePage() {
  const { player, activeTool, consumeToolUses, addReward, setRewardPopup, pushFeedEvent } = useGame();
  const [minedSet, setMinedSet] = useState(() => new Set());
  const [shop, setShop] = useState(false);
  const [inv, setInv] = useState(false);
  const [wallet, setWallet] = useState(false);
  const [profile, setProfile] = useState(false);
  const [feedOpen, setFeedOpen] = useState(true);
  const [hint, setHint] = useState(true);

  const handleMine = useCallback(({ x, y, z, positions, minedSet: ms }) => {
    if (!activeTool || activeTool.broken || activeTool.uses <= 0) return;
    const tier = activeTool.tier;
    const range = TIER_DATA[tier].range;

    // Determine blocks to mine: nearest `range` unmined blocks (by manhattan dist to click)
    const candidates = positions
      .map((p) => ({ p, key: `${p[0]},${p[1]},${p[2]}`, d: Math.abs(p[0] - x) + Math.abs(p[1] - y) + Math.abs(p[2] - z) }))
      .filter((c) => !ms.has(c.key))
      .sort((a, b) => a.d - b.d)
      .slice(0, Math.min(range, activeTool.uses));

    if (candidates.length === 0) return;

    setMinedSet((prev) => {
      const next = new Set(prev);
      candidates.forEach((c) => next.add(c.key));
      return next;
    });

    consumeToolUses(candidates.length);

    // Roll one collective reward weighted across blocks
    let bestReward = null;
    let collectedZonk = 0;
    for (let i = 0; i < candidates.length; i++) {
      const r = rollReward(tier);
      if (r.type === 'zonk') { collectedZonk++; continue; }
      // Keep the rarest find (priority: minex > usdc > gems)
      const prio = { minex: 3, usdc: 2, gems: 1 };
      if (!bestReward || prio[r.type] > prio[bestReward.type]) bestReward = r;
      else if (prio[r.type] === prio[bestReward.type]) bestReward = { ...bestReward, base: bestReward.base + r.base, final: +(bestReward.final + r.final).toFixed(4) };
    }

    if (bestReward) {
      addReward(bestReward);
      setRewardPopup(bestReward);
      pushFeedEvent({ nick: player.nickname, reward: bestReward });
    }
  }, [activeTool, consumeToolUses, addReward, setRewardPopup, pushFeedEvent, player?.nickname]);

  const positionsCount = useMemo(() => {
    let c = 0;
    for (let x = -R; x <= R; x++) for (let y = -R; y <= R; y++) for (let z = -R; z <= R; z++) {
      const d = Math.abs(x) + Math.abs(y) + Math.abs(z);
      if (d >= R - 2 && d <= R) c++;
    }
    return c;
  }, []);

  if (!player) return null;

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden no-select">
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <VoxelOctahedron R={R} minedSet={minedSet} onMineBlock={handleMine} activeTool={activeTool} />
      </div>

      {/* HUD */}
      <HUD
        openShop={() => setShop(true)}
        openInventory={() => setInv(true)}
        openWallet={() => setWallet(true)}
        openProfile={() => setProfile(true)}
      />

      {/* Right side live feed - desktop */}
      <div className={`hidden md:flex absolute top-20 right-3 bottom-20 transition-transform ${feedOpen ? '' : 'translate-x-[110%]'}`}>
        <div className="relative h-full">
          <LiveFeed />
          <button onClick={() => setFeedOpen(false)} className="absolute -left-9 top-3 w-8 h-8 border border-yellow-400/40 bg-black/85 flex items-center justify-center text-stone-200 hover:text-yellow-400"><X className="w-4 h-4" /></button>
        </div>
      </div>
      {!feedOpen && (
        <button onClick={() => setFeedOpen(true)} className="hidden md:flex absolute top-20 right-3 h-10 px-3 border border-yellow-400/40 bg-black/85 font-mono text-[11px] tracking-[0.2em] text-stone-200 hover:text-yellow-400 items-center">
          LIVE FEED
        </button>
      )}

      {/* World info ribbon - bottom right */}
      <div className="hidden md:flex absolute bottom-5 right-5 flex-col items-end gap-1 pointer-events-none">
        <div className="font-mono text-[10px] tracking-[0.2em] text-stone-500">// ORBIT 04-X · SHELL R={R}</div>
        <div className="font-mono text-[10px] tracking-[0.2em] text-stone-500">BLOCKS {positionsCount - minedSet.size}/{positionsCount}</div>
      </div>

      {/* First-time hint */}
      {hint && (
        <div className="absolute left-1/2 -translate-x-1/2 top-24 md:top-28 pointer-events-auto z-10">
          <div className="bg-black/90 border border-yellow-400/40 px-4 py-2 flex items-center gap-3 max-w-md">
            <Info className="w-4 h-4 text-yellow-400" />
            <span className="font-mono text-[11px] tracking-[0.15em] text-stone-300">CLICK A BLOCK TO MINE · DRAG TO ORBIT · SCROLL TO ZOOM</span>
            <button onClick={() => setHint(false)} className="text-stone-500 hover:text-yellow-400"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* Reward popup */}
      <RewardPopup />

      {/* Drawers */}
      <Shop open={shop} onOpenChange={setShop} />
      <Inventory open={inv} onOpenChange={setInv} />
      <Wallet open={wallet} onOpenChange={setWallet} />
      <Profile open={profile} onOpenChange={setProfile} />
    </div>
  );
}
