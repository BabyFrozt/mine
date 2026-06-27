import React, { useCallback, useState, useRef, useEffect } from 'react';
import OrbitView from '../components/game/OrbitView';
import TileMineView from '../components/game/TileMineView';
import HUD from '../components/game/HUD';
import LiveFeed from '../components/game/LiveFeed';
import RewardPopup from '../components/game/RewardPopup';
import Shop from '../components/game/Shop';
import Inventory from '../components/game/Inventory';
import Wallet from '../components/game/Wallet';
import Profile from '../components/game/Profile';
import { useGame } from '../context/GameContext';
import { rollReward, TIER_DATA, randomNick } from '../mock';
import { X, ChevronRight } from 'lucide-react';

const COLS = 200;
const ROWS = 140;

export default function GamePage() {
  const { player, activeTool, consumeToolUses, addReward, setRewardPopup, pushFeedEvent } = useGame();
  const [view, setView] = useState('orbit'); // 'orbit' | 'tiles'
  const [tiles, setTiles] = useState(() => new Map()); // 'x,y' -> { type, by }
  const [shop, setShop] = useState(false);
  const [inv, setInv] = useState(false);
  const [wallet, setWallet] = useState(false);
  const [profile, setProfile] = useState(false);
  const [feedOpen, setFeedOpen] = useState(true);

  // Simulate other players mining tiles (so multiplayer feel)
  useEffect(() => {
    if (view !== 'tiles') return;
    const id = setInterval(() => {
      const reward = ['gems', 'usdc', 'minex', 'zonk', 'zonk', 'zonk', 'gems'][Math.floor(Math.random() * 7)];
      setTiles((prev) => {
        if (prev.size > 8000) return prev;
        // pick a random tile not yet mined
        for (let i = 0; i < 8; i++) {
          const x = Math.floor(Math.random() * COLS);
          const y = Math.floor(Math.random() * ROWS);
          const key = `${x},${y}`;
          if (!prev.has(key)) {
            const next = new Map(prev);
            next.set(key, { type: reward, by: 'other' });
            return next;
          }
        }
        return prev;
      });
    }, 700);
    return () => clearInterval(id);
  }, [view]);

  const handleMine = useCallback((tx, ty) => {
    if (!activeTool || activeTool.broken || activeTool.uses <= 0) return;
    const tier = activeTool.tier;
    const range = TIER_DATA[tier].range;

    // Pick `range` nearest unmined tiles around (tx,ty) within radius (Chebyshev) up to 6
    const candidates = [];
    const radius = Math.max(2, Math.ceil(Math.sqrt(range)) + 1);
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const x = tx + dx, y = ty + dy;
        if (x < 0 || y < 0 || x >= COLS || y >= ROWS) continue;
        const key = `${x},${y}`;
        if (tiles.has(key)) continue;
        candidates.push({ x, y, key, d: Math.abs(dx) + Math.abs(dy) });
      }
    }
    candidates.sort((a, b) => a.d - b.d);
    const toMine = candidates.slice(0, Math.min(range, activeTool.uses));
    if (toMine.length === 0) return;

    // Roll rewards per tile
    let best = null;
    const prio = { minex: 3, usdc: 2, gems: 1 };
    setTiles((prev) => {
      const next = new Map(prev);
      toMine.forEach((t) => {
        const r = rollReward(tier);
        next.set(t.key, { type: r.type, by: 'me' });
        if (r.type !== 'zonk') {
          if (!best || prio[r.type] > prio[best.type]) best = r;
          else if (prio[r.type] === prio[best.type]) best = { ...best, base: +(best.base + r.base).toFixed(4), final: +(best.final + r.final).toFixed(4) };
        }
      });
      return next;
    });

    consumeToolUses(toMine.length);

    if (best) {
      addReward(best);
      setRewardPopup(best);
      pushFeedEvent({ nick: player.nickname, reward: best });
    }
  }, [activeTool, tiles, consumeToolUses, addReward, setRewardPopup, pushFeedEvent, player?.nickname]);

  if (!player) return null;

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden no-select">
      {view === 'orbit' && (
        <OrbitView onEnter={() => setView('tiles')} />
      )}
      {view === 'tiles' && (
        <TileMineView tiles={tiles} onMine={handleMine} onBack={() => setView('orbit')} />
      )}

      <HUD
        openShop={() => setShop(true)}
        openInventory={() => setInv(true)}
        openWallet={() => setWallet(true)}
        openProfile={() => setProfile(true)}
      />

      {/* Live feed sidebar - only show in tile view */}
      {view === 'tiles' && (
        <>
          <div className={`hidden md:flex absolute bottom-24 left-3 top-32 w-72 transition-transform ${feedOpen ? '' : '-translate-x-[110%]'} z-10`}>
            <div className="relative h-full w-full">
              <LiveFeed />
              <button onClick={() => setFeedOpen(false)} className="absolute -right-9 top-3 w-8 h-8 border border-yellow-400/40 bg-black/85 flex items-center justify-center text-stone-200 hover:text-yellow-400"><X className="w-4 h-4" /></button>
            </div>
          </div>
          {!feedOpen && (
            <button onClick={() => setFeedOpen(true)} className="hidden md:flex absolute bottom-24 left-3 h-10 px-3 border border-yellow-400/40 bg-black/85 font-mono text-[11px] tracking-[0.2em] text-stone-200 hover:text-yellow-400 items-center z-10">
              <ChevronRight className="w-4 h-4 mr-1" /> LIVE FEED
            </button>
          )}
        </>
      )}

      <RewardPopup />
      <Shop open={shop} onOpenChange={setShop} />
      <Inventory open={inv} onOpenChange={setInv} />
      <Wallet open={wallet} onOpenChange={setWallet} />
      <Profile open={profile} onOpenChange={setProfile} />
    </div>
  );
}
