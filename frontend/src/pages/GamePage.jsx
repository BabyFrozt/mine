import React, { useCallback, useState, useEffect } from 'react';
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
import { rollReward, TIER_DATA } from '../mock';
import { X, ChevronRight, ChevronDown } from 'lucide-react';

const COLS = 200;
const ROWS = 140;
const TOTAL_TILES = COLS * ROWS;

export default function GamePage() {
  const { player, activeTool, consumeDigUses, consumeDurability, addReward, setRewardPopup, pushFeedEvent } = useGame();
  const [view,       setView]       = useState('orbit');
  const [transition, setTransition] = useState('idle');
  const [tiles,      setTiles]      = useState(() => new Map());
  const [shop,       setShop]       = useState(false);
  const [inv,        setInv]        = useState(false);
  const [wallet,     setWallet]     = useState(false);
  const [profile,    setProfile]    = useState(false);
  const [feedOpen,   setFeedOpen]   = useState(true);

  // Simulate other players mining tiles
  useEffect(() => {
    const id = setInterval(() => {
      const reward = ['gems', 'usdc', 'minex', 'zonk', 'zonk', 'zonk', 'gems'][Math.floor(Math.random() * 7)];
      setTiles((prev) => {
        if (prev.size > 8000) return prev;
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
  }, []);

  const handleMine = useCallback((tx, ty) => {
    if (!activeTool || activeTool.broken || activeTool.digUses <= 0) return;
    const tier  = activeTool.tier;
    const range = TIER_DATA[tier].range;

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
    const toMine = candidates.slice(0, Math.min(range, activeTool.digUses));
    if (toMine.length === 0) return;

    let best = null;
    const prio = { minex: 3, usdc: 2, gems: 1 };
    const usdcBalance = player?.wallet?.usdc || 0;
    let firstMinedCoord = null;

    setTiles((prev) => {
      const next = new Map(prev);
      toMine.forEach((t, idx) => {
        const r = rollReward(tier, usdcBalance);
        next.set(t.key, { type: r.type, by: 'me' });
        if (idx === 0) firstMinedCoord = { x: t.x, y: t.y };
        if (r.type !== 'zonk') {
          if (!best || prio[r.type] > prio[best.type]) best = r;
          else if (prio[r.type] === prio[best.type]) best = { ...best, base: +(best.base + r.base).toFixed(4), final: +(best.final + r.final).toFixed(4) };
        }
      });
      return next;
    });

    consumeDigUses(toMine.length);
    consumeDurability();

    if (best) {
      addReward(best);
      setRewardPopup(best);
      pushFeedEvent({ nick: player.nickname, reward: best, coords: firstMinedCoord });
    } else if (firstMinedCoord) {
      pushFeedEvent({ nick: player.nickname, reward: { type: 'zonk', final: 0 }, coords: firstMinedCoord });
    }
  }, [activeTool, tiles, consumeDigUses, consumeDurability, addReward, setRewardPopup, pushFeedEvent, player]);

  const beginEnter = () => {
    if (transition !== 'idle') return;
    setTransition('zoom-in');
  };

  const onZoomComplete = () => {
    setTransition('fade-in');
    setView('tiles');
    setTimeout(() => setTransition('idle'), 380);
  };

  const goBackToOrbit = () => {
    setView('orbit');
    setTransition('idle');
  };

  if (!player) return null;

  const minedPct = ((tiles.size / TOTAL_TILES) * 100).toFixed(2);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden no-select">
      {view === 'orbit' && (
        <OrbitView
          onEnter={beginEnter}
          tiles={tiles}
          entering={transition === 'zoom-in'}
          onEntered={onZoomComplete}
        />
      )}
      {view === 'tiles' && (
        <TileMineView tiles={tiles} onMine={handleMine} onBack={goBackToOrbit} minedPct={minedPct} />
      )}

      {/* Black fade overlay during transition */}
      <div
        className={`absolute inset-0 bg-black pointer-events-none transition-opacity z-40 ${transition === 'zoom-in' ? 'opacity-100' : 'opacity-0'}`}
        style={{ transitionDuration: transition === 'zoom-in' ? '900ms' : '380ms' }}
      />

      <HUD
        openShop={()    => setShop(true)}
        openInventory={() => setInv(true)}
        openWallet={()  => setWallet(true)}
        openProfile={()  => setProfile(true)}
      />

      {/* Live feed — desktop: side panel, mobile: bottom tray */}
      {view === 'tiles' && (
        <>
          {/* Desktop side panel */}
          <div className={`hidden md:flex absolute bottom-24 left-3 top-32 w-80 transition-transform ${feedOpen ? '' : '-translate-x-[110%]'} z-10`}>
            <div className="relative h-full w-full">
              <LiveFeed />
              <button
                onClick={() => setFeedOpen(false)}
                className="absolute -right-9 top-3 w-8 h-8 border border-yellow-400/40 bg-black/85 flex items-center justify-center text-stone-200 hover:text-yellow-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          {!feedOpen && (
            <button
              onClick={() => setFeedOpen(true)}
              className="hidden md:flex absolute bottom-24 left-3 h-10 px-3 border border-yellow-400/40 bg-black/85 font-mono text-[11px] tracking-[0.2em] text-stone-200 hover:text-yellow-400 items-center z-10"
            >
              <ChevronRight className="w-4 h-4 mr-1" /> LIVE FEED
            </button>
          )}

          {/* Mobile bottom tray */}
          <div className={`md:hidden absolute left-0 right-0 z-10 transition-all duration-300 ${feedOpen ? 'bottom-[88px]' : 'bottom-[88px] translate-y-[calc(100%-2.5rem)]'}`}>
            <div className="bg-black/95 border border-yellow-400/25 flex flex-col" style={{ maxHeight: '40vh' }}>
              <button
                onClick={() => setFeedOpen((v) => !v)}
                className="flex items-center justify-between px-4 py-2.5 w-full border-b border-yellow-400/20 shrink-0"
              >
                <span className="font-mono text-[11px] tracking-[0.2em] text-yellow-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                  LIVE FEED
                </span>
                <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${feedOpen ? '' : 'rotate-180'}`} />
              </button>
              <div className="overflow-y-auto no-scrollbar flex-1">
                <LiveFeed compact />
              </div>
            </div>
          </div>
        </>
      )}

      <RewardPopup />
      <Shop     open={shop}    onOpenChange={setShop}    />
      <Inventory open={inv}    onOpenChange={setInv}     />
      <Wallet   open={wallet}  onOpenChange={setWallet}  />
      <Profile  open={profile} onOpenChange={setProfile} />
    </div>
  );
}
