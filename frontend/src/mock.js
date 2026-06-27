// Mock data for Mines Block (frontend-only MVP)

export const TIER_DATA = {
  1: { name: 'Mk1', range: 1, maxUses: 100, durability: 100, repairCost: 200, boost: 10, color: '#9ca3af', priceGems: 2000, priceUsdc: null },
  2: { name: 'Mk2', range: 3, maxUses: 250, durability: 250, repairCost: 500, boost: 20, color: '#22d3ee', priceGems: null, priceUsdc: 5 },
  3: { name: 'Mk3', range: 6, maxUses: 400, durability: 400, repairCost: 1.5, boost: 50, color: '#a78bfa', priceGems: null, priceUsdc: 10 },
  4: { name: 'Mk4', range: 10, maxUses: 750, durability: 750, repairCost: 3, boost: 80, color: '#facc15', priceGems: null, priceUsdc: 30 },
  5: { name: 'Mk5', range: 15, maxUses: 1500, durability: 1500, repairCost: 6, boost: 120, color: '#f97316', priceGems: null, priceUsdc: 70 },
};

export const USDC_DROPS = [
  { value: 0.1, weight: 50 },
  { value: 0.3, weight: 20 },
  { value: 0.5, weight: 15 },
  { value: 1, weight: 10 },
  { value: 2.5, weight: 3 },
  { value: 5, weight: 2 },
];

export const REWARD_TYPES = {
  ZONK: 'zonk',
  GEMS: 'gems',
  USDC: 'usdc',
  MINEX: 'minex',
};

// Probability for a single mined block to drop something
export const DROP_TABLE = [
  { type: 'zonk', weight: 55 },
  { type: 'gems', weight: 30 },
  { type: 'usdc', weight: 12 },
  { type: 'minex', weight: 3 },
];

export function weightedPick(table) {
  const total = table.reduce((s, x) => s + x.weight, 0);
  let r = Math.random() * total;
  for (const item of table) {
    r -= item.weight;
    if (r <= 0) return item;
  }
  return table[table.length - 1];
}

export function rollReward(toolTier) {
  const pick = weightedPick(DROP_TABLE);
  const boost = TIER_DATA[toolTier]?.boost || 0;
  const mult = 1 + boost / 100;
  if (pick.type === 'zonk') return { type: 'zonk', base: 0, final: 0, boost };
  if (pick.type === 'gems') {
    const base = Math.floor(100 + Math.random() * 1100);
    return { type: 'gems', base, final: Math.floor(base * mult), boost };
  }
  if (pick.type === 'usdc') {
    const drop = weightedPick(USDC_DROPS);
    const base = drop.value;
    return { type: 'usdc', base, final: +(base * mult).toFixed(4), boost };
  }
  if (pick.type === 'minex') {
    const base = Math.floor(2000 + Math.random() * 3001);
    return { type: 'minex', base, final: Math.floor(base * mult), boost };
  }
  return { type: 'zonk', base: 0, final: 0, boost };
}

export const MOCK_NICKNAMES = [
  'Gon_Freecs', 'Killua', 'NanoMiner', 'OrbitHunter', 'VoidWalker', 'GemFiend',
  'CryoDigger', 'NeonProspect', 'Tycho', 'Zephyrus', 'OctaPrime', 'Stardust',
  'Cobalt', 'Nyx', 'Quasar', 'Magnetar', 'Helios', 'Andromeda',
];

export function randomNick() {
  return MOCK_NICKNAMES[Math.floor(Math.random() * MOCK_NICKNAMES.length)] + Math.floor(Math.random() * 1000);
}

export const INITIAL_PLAYER = {
  id: null,
  nickname: '',
  email: '',
  isGuest: true,
  wallet: { gems: 5000, usdc: 0, minex: 0 },
  tools: [
    { id: 'starter', tier: 1, uses: 100, maxUses: 100, broken: false },
  ],
  activeToolId: 'starter',
  totalMined: 0,
  joinedAt: new Date().toISOString(),
};

export const MOCK_LIVE_FEED_SEED = [
  { id: 1, nick: 'Cobalt_42', reward: { type: 'usdc', final: 0.3 }, ts: Date.now() - 1000 },
  { id: 2, nick: 'Tycho_98', reward: { type: 'gems', final: 850 }, ts: Date.now() - 5000 },
  { id: 3, nick: 'NanoMiner_12', reward: { type: 'minex', final: 2300 }, ts: Date.now() - 9000 },
];

export const GACHA_BOXES = [
  { id: 'bronze', name: 'Bronze Crate', color: '#b08152', price: 1000, currency: 'gems', odds: 'Mk1 90% · Mk2 10%' },
  { id: 'silver', name: 'Silver Crate', color: '#c0c4cc', price: 10, currency: 'usdc', odds: 'Mk2 70% · Mk3 25% · Mk4 5%' },
  { id: 'gold', name: 'Gold Crate', color: '#f5c84b', price: 35, currency: 'usdc', odds: 'Mk3 50% · Mk4 35% · Mk5 15%' },
];
