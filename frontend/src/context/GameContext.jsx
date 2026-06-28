import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { INITIAL_PLAYER, TIER_DATA, randomNick, rollReward, makeTool } from '../mock';

const GameContext = createContext(null);

const STORAGE_KEY = 'minesblock.player.v2';

export function GameProvider({ children }) {
  const [player, setPlayer] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return null;
  });

  const [liveFeed, setLiveFeed] = useState(() => {
    const seed = [];
    for (let i = 0; i < 4; i++) {
      const tier = 1 + Math.floor(Math.random() * 5);
      const fakeUsdc = Math.random() * 8;
      let r = rollReward(tier, fakeUsdc);
      let attempts = 0;
      while (r.type === 'zonk' && attempts < 6) { r = rollReward(tier, fakeUsdc); attempts++; }
      if (r.type === 'zonk') continue;
      const x = Math.floor(Math.random() * 200);
      const y = Math.floor(Math.random() * 140);
      seed.push({ id: Date.now() + i + Math.random(), nick: randomNick(), reward: r, coords: { x, y }, ts: Date.now() - (i + 1) * 4000 });
    }
    return seed;
  });

  const [onlineCount, setOnlineCount] = useState(248);
  const [rewardPopup, setRewardPopup] = useState(null);

  useEffect(() => {
    if (player) localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
  }, [player]);

  // Simulated live feed
  useEffect(() => {
    const interval = setInterval(() => {
      const tier = 1 + Math.floor(Math.random() * 5);
      const fakeUsdc = Math.random() * 8;
      let r = rollReward(tier, fakeUsdc);
      let attempts = 0;
      while (r.type === 'zonk' && attempts < 3) { r = rollReward(tier, fakeUsdc); attempts++; }
      if (r.type !== 'zonk') {
        const nick = randomNick();
        const x = Math.floor(Math.random() * 200);
        const y = Math.floor(Math.random() * 140);
        setLiveFeed((prev) => [
          { id: Date.now() + Math.random(), nick, reward: r, coords: { x, y }, ts: Date.now() },
          ...prev.slice(0, 24),
        ]);
      }
      setOnlineCount((c) => Math.max(120, c + (Math.floor(Math.random() * 7) - 3)));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Check 24h dig-uses reset every minute
  useEffect(() => {
    const check = () => {
      setPlayer((p) => {
        if (!p) return p;
        const now = Date.now();
        let changed = false;
        const tools = p.tools.map((t) => {
          if (t.digUsesResetAt && now >= t.digUsesResetAt) {
            changed = true;
            return { ...t, digUses: t.maxDigUses, digUsesResetAt: null };
          }
          return t;
        });
        return changed ? { ...p, tools } : p;
      });
    };
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);

  const login = useCallback(({ email, nickname, isGuest }) => {
    setPlayer({
      ...INITIAL_PLAYER,
      id:       'p_' + Math.random().toString(36).slice(2, 10),
      email:    email || '',
      nickname: nickname || randomNick(),
      isGuest:  !!isGuest,
      joinedAt: new Date().toISOString(),
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setPlayer(null);
  }, []);

  const activeTool = useMemo(() => {
    if (!player) return null;
    return player.tools.find((t) => t.id === player.activeToolId) || player.tools[0] || null;
  }, [player]);

  // Decrease daily dig-uses per tile mined; starts 24h reset timer when depleted
  const consumeDigUses = useCallback((count) => {
    setPlayer((p) => {
      if (!p) return p;
      const tools = p.tools.map((t) => {
        if (t.id !== p.activeToolId) return t;
        const newUses  = Math.max(0, t.digUses - count);
        const resetAt  = newUses === 0 && !t.digUsesResetAt
          ? Date.now() + 24 * 3600 * 1000
          : t.digUsesResetAt;
        return { ...t, digUses: newUses, digUsesResetAt: resetAt };
      });
      return { ...p, tools, totalMined: p.totalMined + count };
    });
  }, []);

  // Decrease durability by 1 per mining click; marks tool broken at 0
  const consumeDurability = useCallback(() => {
    setPlayer((p) => {
      if (!p) return p;
      const tools = p.tools.map((t) => {
        if (t.id !== p.activeToolId) return t;
        const newDur = Math.max(0, t.durability - 1);
        return { ...t, durability: newDur, broken: newDur === 0 };
      });
      return { ...p, tools };
    });
  }, []);

  // Repair with 50/50 chance. Returns true = success, false = tool destroyed.
  const repairTool = useCallback((toolId) => {
    const success = Math.random() < 0.5;
    setPlayer((p) => {
      if (!p) return p;
      const t = p.tools.find((x) => x.id === toolId);
      if (!t) return p;
      const d = TIER_DATA[t.tier];
      const w = { ...p.wallet };

      if (d.repairCurrency === 'gems') {
        if (w.gems < d.repairCost) return p;
        w.gems -= d.repairCost;
      } else {
        if (w.usdc < d.repairCost) return p;
        w.usdc = +(w.usdc - d.repairCost).toFixed(4);
      }

      if (success) {
        const tools = p.tools.map((x) =>
          x.id === toolId ? { ...x, durability: d.maxDurability, broken: false } : x
        );
        return { ...p, wallet: w, tools };
      } else {
        const tools     = p.tools.filter((x) => x.id !== toolId);
        const activeToolId = p.activeToolId === toolId
          ? (tools[0]?.id ?? null)
          : p.activeToolId;
        return { ...p, wallet: w, tools, activeToolId };
      }
    });
    return success;
  }, []);

  // Fuse two same-tier tools:
  //   both not broken → tier+1 (max tier 5)
  //   both broken     → same tier, fresh durability/uses
  const fuseTool = useCallback((toolId1, toolId2) => {
    setPlayer((p) => {
      if (!p) return p;
      const t1 = p.tools.find((x) => x.id === toolId1);
      const t2 = p.tools.find((x) => x.id === toolId2);
      if (!t1 || !t2 || t1.tier !== t2.tier) return p;

      const bothBroken = t1.broken && t2.broken;
      const bothNormal = !t1.broken && !t2.broken;
      if (!bothBroken && !bothNormal) return p;

      const targetTier  = bothBroken ? t1.tier : Math.min(5, t1.tier + 1);
      const newTool     = makeTool(targetTier, 'fused');
      const tools       = [...p.tools.filter((x) => x.id !== toolId1 && x.id !== toolId2), newTool];
      const activeToolId = (p.activeToolId === toolId1 || p.activeToolId === toolId2)
        ? newTool.id
        : p.activeToolId;

      return { ...p, tools, activeToolId };
    });
  }, []);

  const buyTool = useCallback((tier) => {
    setPlayer((p) => {
      if (!p) return p;
      const d = TIER_DATA[tier];
      const w = { ...p.wallet };
      if (d.priceGems != null) {
        if (w.gems < d.priceGems) return p;
        w.gems -= d.priceGems;
      } else if (d.priceUsdc != null) {
        if (w.usdc < d.priceUsdc) return p;
        w.usdc = +(w.usdc - d.priceUsdc).toFixed(4);
      }
      const newTool = makeTool(tier);
      return { ...p, wallet: w, tools: [...p.tools, newTool], activeToolId: newTool.id };
    });
  }, []);

  const setActiveTool = useCallback((toolId) => {
    setPlayer((p) => p ? { ...p, activeToolId: toolId } : p);
  }, []);

  const addReward = useCallback((reward) => {
    setPlayer((p) => {
      if (!p) return p;
      const w = { ...p.wallet };
      if (reward.type === 'gems')  w.gems  += reward.final;
      if (reward.type === 'usdc')  w.usdc   = +(w.usdc + reward.final).toFixed(4);
      if (reward.type === 'minex') w.minex += reward.final;
      return { ...p, wallet: w };
    });
  }, []);

  const connectWallet = useCallback((address) => {
    setPlayer((p) => p ? { ...p, wallet: { ...p.wallet, connected: true, address } } : p);
  }, []);

  const disconnectWallet = useCallback(() => {
    setPlayer((p) => p ? { ...p, wallet: { ...p.wallet, connected: false, address: null } } : p);
  }, []);

  const pushFeedEvent = useCallback((event) => {
    setLiveFeed((prev) => [
      { id: Date.now() + Math.random(), ...event, ts: Date.now() },
      ...prev.slice(0, 19),
    ]);
  }, []);

  const value = {
    player, setPlayer, login, logout,
    activeTool,
    consumeDigUses, consumeDurability,
    addReward, repairTool, buyTool, fuseTool, setActiveTool,
    connectWallet, disconnectWallet,
    liveFeed, onlineCount, pushFeedEvent,
    rewardPopup, setRewardPopup,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
