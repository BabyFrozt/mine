// Mock data + drop economy for MineX Block

export const TIER_DATA = {
  1: { name: 'Mk1', range: 1,  maxDigUses: 100,  maxDurability: 200,  repairCost: 200, repairCurrency: 'gems', boost: 10,  color: '#9ca3af', priceGems: 2000, priceUsdc: null },
  2: { name: 'Mk2', range: 3,  maxDigUses: 250,  maxDurability: 600,  repairCost: 5,   repairCurrency: 'usdc', boost: 20,  color: '#22d3ee', priceGems: null, priceUsdc: 5   },
  3: { name: 'Mk3', range: 6,  maxDigUses: 400,  maxDurability: 1000, repairCost: 1.5, repairCurrency: 'usdc', boost: 50,  color: '#a78bfa', priceGems: null, priceUsdc: 10  },
  4: { name: 'Mk4', range: 10, maxDigUses: 750,  maxDurability: 2000, repairCost: 3,   repairCurrency: 'usdc', boost: 80,  color: '#facc15', priceGems: null, priceUsdc: 30  },
  5: { name: 'Mk5', range: 15, maxDigUses: 1500, maxDurability: 5000, repairCost: 6,   repairCurrency: 'usdc', boost: 120, color: '#f97316', priceGems: null, priceUsdc: 70  },
};

// Dynamic difficulty brackets based on player's USDC balance
export function getBracket(usdc) {
  if (usdc < 2)  return 'A';
  if (usdc < 5)  return 'B';
  if (usdc < 8)  return 'C';
  if (usdc < 10) return 'D';
  return 'A';
}

export const BRACKET_LABEL = {
  A: 'EASY',
  B: 'MEDIUM',
  C: 'HARD',
  D: 'BRUTAL',
};

const DROP_TABLES = {
  A: [
    { type: 'zonk', weight: 68 },
    { type: 'gems', weight: 20 },
    { type: 'usdc', weight: 10 },
    { type: 'minex', weight: 2 },
  ],
  B: [
    { type: 'zonk', weight: 82 },
    { type: 'gems', weight: 12 },
    { type: 'usdc', weight: 5 },
    { type: 'minex', weight: 1 },
  ],
  C: [
    { type: 'zonk', weight: 91 },
    { type: 'gems', weight: 6 },
    { type: 'usdc', weight: 2.7 },
    { type: 'minex', weight: 0.3 },
  ],
  D: [
    { type: 'zonk', weight: 96 },
    { type: 'gems', weight: 2.5 },
    { type: 'usdc', weight: 1.3 },
    { type: 'minex', weight: 0.2 },
  ],
};

const USDC_DROPS_BY_BRACKET = {
  A: [
    { value: 0.05, weight: 60 },
    { value: 0.10, weight: 25 },
    { value: 0.20, weight: 10 },
    { value: 0.50, weight: 4 },
    { value: 1.00, weight: 1 },
  ],
  B: [
    { value: 0.05, weight: 70 },
    { value: 0.10, weight: 20 },
    { value: 0.20, weight: 7 },
    { value: 0.50, weight: 2.5 },
    { value: 1.00, weight: 0.5 },
  ],
  C: [
    { value: 0.05, weight: 80 },
    { value: 0.10, weight: 15 },
    { value: 0.20, weight: 4 },
    { value: 0.50, weight: 1 },
  ],
  D: [
    { value: 0.05, weight: 90 },
    { value: 0.10, weight: 9 },
    { value: 0.20, weight: 1 },
  ],
};

// Reduced gem ranges — gems are now less easy to get
const GEMS_RANGE = {
  A: [20,  80],
  B: [15,  50],
  C: [8,   30],
  D: [5,   20],
};

const MINEX_RANGE = [1000, 3500];

export function weightedPick(table) {
  const total = table.reduce((s, x) => s + x.weight, 0);
  let r = Math.random() * total;
  for (const item of table) {
    r -= item.weight;
    if (r <= 0) return item;
  }
  return table[table.length - 1];
}

export function rollReward(toolTier, usdcBalance = 0) {
  const bracket = getBracket(usdcBalance);
  const table = DROP_TABLES[bracket];
  const pick = weightedPick(table);
  const boost = TIER_DATA[toolTier]?.boost || 0;
  const mult = 1 + boost / 100;
  if (pick.type === 'zonk') return { type: 'zonk', base: 0, final: 0, boost, bracket };
  if (pick.type === 'gems') {
    const [lo, hi] = GEMS_RANGE[bracket];
    const base = Math.floor(lo + Math.random() * (hi - lo + 1));
    return { type: 'gems', base, final: Math.floor(base * mult), boost, bracket };
  }
  if (pick.type === 'usdc') {
    const drop = weightedPick(USDC_DROPS_BY_BRACKET[bracket]);
    const base = drop.value;
    return { type: 'usdc', base, final: +(base * mult).toFixed(4), boost, bracket };
  }
  if (pick.type === 'minex') {
    const base = Math.floor(MINEX_RANGE[0] + Math.random() * (MINEX_RANGE[1] - MINEX_RANGE[0] + 1));
    return { type: 'minex', base, final: Math.floor(base * mult), boost, bracket };
  }
  return { type: 'zonk', base: 0, final: 0, boost, bracket };
}

export const ITEM_NAMES = {
  zonk:  'Dust',
  gems:  'Graphene Gem',
  usdc:  '$USDC Shard',
  minex: '$MINEX Crystal',
};

export const ITEM_COLORS = {
  zonk:  '#a78bfa',
  gems:  '#22d3ee',
  usdc:  '#22c55e',
  minex: '#facc15',
};

export const MOCK_NICKNAMES = [
  'Wegoim1', 'Killua', 'NanoMiner', 'OrbitHunter', 'VoidWalker', 'GemFiend',
  'CryoDigger', 'NeonProspect', 'Tycho', 'Zephyrus', 'OctaPrime', 'Stardust',
  'Cobalt', 'Nyx', 'Quasar', 'Magnetar', 'Helios', 'Andromeda',
];

export function randomNick() {
  return MOCK_NICKNAMES[Math.floor(Math.random() * MOCK_NICKNAMES.length)] + Math.floor(Math.random() * 1000);
}

export function makeTool(tier, idPrefix = 't') {
  const d = TIER_DATA[tier];
  return {
    id: idPrefix + '_' + Math.random().toString(36).slice(2, 10),
    tier,
    digUses:        d.maxDigUses,
    maxDigUses:     d.maxDigUses,
    digUsesResetAt: null,
    durability:     d.maxDurability,
    maxDurability:  d.maxDurability,
    broken:         false,
  };
}

export const INITIAL_PLAYER = {
  id:         null,
  nickname:   '',
  email:      '',
  isGuest:    true,
  wallet:     { gems: 2000, usdc: 0, minex: 0, connected: false, address: null },
  tools: [
    { id: 'starter', tier: 1, digUses: 100, maxDigUses: 100, digUsesResetAt: null, durability: 200, maxDurability: 200, broken: false },
  ],
  activeToolId: 'starter',
  totalMined:   0,
  joinedAt:     new Date().toISOString(),
};

export const MOCK_LIVE_FEED_SEED = [];

export const GACHA_BOXES = [
  { id: 'bronze', name: 'Bronze Crate', color: '#b08152', price: 1000, currency: 'gems', odds: 'Mk1 90% · Mk2 10%' },
  { id: 'silver', name: 'Silver Crate', color: '#c0c4cc', price: 10,   currency: 'usdc', odds: 'Mk2 70% · Mk3 25% · Mk4 5%' },
  { id: 'gold',   name: 'Gold Crate',   color: '#f5c84b', price: 35,   currency: 'usdc', odds: 'Mk3 50% · Mk4 35% · Mk5 15%' },
];

export function formatCoords(x, y) {
  const cx = x - 100;
  const cy = y - 70;
  const h = ((x * 73856093) ^ (y * 19349663)) >>> 0;
  const cz = ((h & 7) - 3);
  return `${cx},${cy},${cz}`;
}
