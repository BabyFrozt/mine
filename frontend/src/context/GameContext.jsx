import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { INITIAL_PLAYER, TIER_DATA, randomNick, rollReward, MOCK_LIVE_FEED_SEED } from '../mock';

const GameContext = createContext(null);

const STORAGE_KEY = 'minesblock.player.v1';

export function GameProvider({ children }) {
  const [player, setPlayer] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return null;
  });
  const [liveFeed, setLiveFeed] = useState(MOCK_LIVE_FEED_SEED);
  const [onlineCount, setOnlineCount] = useState(248);
  const [rewardPopup, setRewardPopup] = useState(null);

  useEffect(() => {
    if (player) localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
  }, [player]);

  // Simulated live feed of other players
  useEffect(() => {
    const interval = setInterval(() => {
      // Random reward event from another player
      if (Math.random() < 0.7) {
        const tier = 1 + Math.floor(Math.random() * 5);
        const r = rollReward(tier);
        if (r.type === 'zonk') return;
        const nick = randomNick();
        setLiveFeed((prev) => [
          { id: Date.now() + Math.random(), nick, reward: r, ts: Date.now() },
          ...prev.slice(0, 19),
        ]);
      }
      // wiggle online count
      setOnlineCount((c) => Math.max(120, c + (Math.floor(Math.random() * 7) - 3)));
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const login = useCallback(({ email, nickname, isGuest }) => {
    setPlayer({
      ...INITIAL_PLAYER,
      id: 'p_' + Math.random().toString(36).slice(2, 10),
      email: email || '',
      nickname: nickname || randomNick(),
      isGuest: !!isGuest,
      joinedAt: new Date().toISOString(),
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setPlayer(null);
  }, []);

  const activeTool = useMemo(() => {
    if (!player) return null;
    return player.tools.find((t) => t.id === player.activeToolId) || player.tools[0];
  }, [player]);

  const consumeToolUses = useCallback((blocksMined) => {
    setPlayer((p) => {
      if (!p) return p;
      const tools = p.tools.map((t) => {
        if (t.id !== p.activeToolId) return t;
        const newUses = Math.max(0, t.uses - blocksMined);
        return { ...t, uses: newUses, broken: newUses === 0 };
      });
      return { ...p, tools, totalMined: p.totalMined + blocksMined };
    });
  }, []);

  const addReward = useCallback((reward) => {
    setPlayer((p) => {
      if (!p) return p;
      const w = { ...p.wallet };
      if (reward.type === 'gems') w.gems += reward.final;
      if (reward.type === 'usdc') w.usdc = +(w.usdc + reward.final).toFixed(4);
      if (reward.type === 'minex') w.minex += reward.final;
      return { ...p, wallet: w };
    });
  }, []);

  const buyTool = useCallback((tier) => {
    setPlayer((p) => {
      if (!p) return p;
      const data = TIER_DATA[tier];
      const w = { ...p.wallet };
      if (data.priceGems != null) {
        if (w.gems < data.priceGems) return p;
        w.gems -= data.priceGems;
      } else if (data.priceUsdc != null) {
        if (w.usdc < data.priceUsdc) return p;
        w.usdc = +(w.usdc - data.priceUsdc).toFixed(4);
      }
      const newTool = {
        id: 't_' + Math.random().toString(36).slice(2, 10),
        tier,
        uses: data.maxUses,
        maxUses: data.maxUses,
        broken: false,
      };
      return { ...p, wallet: w, tools: [...p.tools, newTool], activeToolId: newTool.id };
    });
  }, []);

  const repairTool = useCallback((toolId) => {
    setPlayer((p) => {
      if (!p) return p;
      const t = p.tools.find((x) => x.id === toolId);
      if (!t) return p;
      const data = TIER_DATA[t.tier];
      const w = { ...p.wallet };
      // Tier 1 repair in gems, others in usdc
      if (t.tier === 1) {
        if (w.gems < data.repairCost) return p;
        w.gems -= data.repairCost;
      } else {
        if (w.usdc < data.repairCost) return p;
        w.usdc = +(w.usdc - data.repairCost).toFixed(4);
      }
      const tools = p.tools.map((x) => x.id === toolId ? { ...x, uses: data.maxUses, broken: false } : x);
      return { ...p, wallet: w, tools };
    });
  }, []);

  const setActiveTool = useCallback((toolId) => {
    setPlayer((p) => p ? { ...p, activeToolId: toolId } : p);
  }, []);

  const pushFeedEvent = useCallback((event) => {
    setLiveFeed((prev) => [
      { id: Date.now() + Math.random(), ...event, ts: Date.now() },
      ...prev.slice(0, 19),
    ]);
  }, []);

  const value = {
    player, setPlayer, login, logout,
    consumeToolUses, addReward,
    buyTool, repairTool, setActiveTool,
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
