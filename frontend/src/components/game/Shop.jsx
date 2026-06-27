import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { TIER_DATA, GACHA_BOXES } from '../../mock';
import { useGame } from '../../context/GameContext';
import { Pickaxe, Hammer, Wrench, Drill, Zap, Package, Lock, Gem, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const icons = { 1: Pickaxe, 2: Hammer, 3: Wrench, 4: Drill, 5: Zap };

export default function Shop({ open, onOpenChange }) {
  const { player, buyTool } = useGame();
  const [tab, setTab] = useState('tools');

  const onBuy = (tier) => {
    const d = TIER_DATA[tier];
    const canAfford = d.priceGems ? player.wallet.gems >= d.priceGems : player.wallet.usdc >= d.priceUsdc;
    if (!canAfford) { toast.error('Insufficient funds'); return; }
    buyTool(tier);
    toast.success(`Acquired ${d.name}`);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="bg-black border-yellow-400/30 text-stone-200 w-full sm:max-w-lg p-0 overflow-y-auto">
        <SheetHeader className="px-6 pt-6 pb-3 border-b border-yellow-400/20">
          <SheetTitle className="font-mono text-sm tracking-[0.2em] text-yellow-400 flex items-center justify-between">
            <span>// CONSORTIUM SHOP</span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-stone-500">SEC-CHAN 02</span>
          </SheetTitle>
        </SheetHeader>

        <Tabs value={tab} onValueChange={setTab} className="px-6 pt-4">
          <TabsList className="bg-neutral-900 border border-yellow-400/20 grid grid-cols-2 w-full rounded-none">
            <TabsTrigger value="tools" className="font-mono text-xs tracking-[0.18em] data-[state=active]:bg-yellow-400 data-[state=active]:text-black rounded-none">TOOLS</TabsTrigger>
            <TabsTrigger value="crates" className="font-mono text-xs tracking-[0.18em] data-[state=active]:bg-yellow-400 data-[state=active]:text-black rounded-none">CRATES</TabsTrigger>
          </TabsList>

          <TabsContent value="tools" className="pt-5 pb-8 space-y-3">
            {[1, 2, 3, 4, 5].map((t) => {
              const d = TIER_DATA[t];
              const Icon = icons[t];
              const canAfford = d.priceGems ? player.wallet.gems >= d.priceGems : player.wallet.usdc >= d.priceUsdc;
              return (
                <div key={t} className="border border-yellow-400/20 bg-neutral-950 p-4 flex items-center gap-4">
                  <div className="w-14 h-14 border border-yellow-400/20 flex items-center justify-center shrink-0" style={{ background: `radial-gradient(closest-side, ${d.color}30, transparent 70%)` }}>
                    <Icon className="w-7 h-7" style={{ color: d.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-white text-lg">{d.name}</span>
                      <span className="font-mono text-[10px] tracking-[0.2em] text-stone-500">TIER {t}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 font-mono text-[10px] tracking-[0.18em] text-stone-400">
                      <span>RANGE {d.range}</span>
                      <span>USES {d.maxUses}</span>
                      <span className="text-green-400">+{d.boost}%</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono text-xs text-yellow-400 mb-1 flex items-center justify-end gap-1">
                      {d.priceGems ? <><Gem className="w-3 h-3" />{d.priceGems.toLocaleString()}</> : <><DollarSign className="w-3 h-3" />{d.priceUsdc}</>}
                    </div>
                    <Button onClick={() => onBuy(t)} disabled={!canAfford} className="bg-yellow-400 hover:bg-yellow-300 text-black h-8 px-3 font-mono text-[11px] tracking-[0.2em] rounded-none disabled:opacity-40">BUY</Button>
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="crates" className="pt-5 pb-8 space-y-3">
            <div className="font-mono text-[10px] tracking-[0.2em] text-stone-500 mb-2">// LOOT CRATES · PREVIEW</div>
            {GACHA_BOXES.map((b) => (
              <div key={b.id} className="border border-yellow-400/20 bg-neutral-950 p-4 flex items-center gap-4 opacity-80">
                <div className="w-14 h-14 border border-yellow-400/20 flex items-center justify-center shrink-0" style={{ background: `radial-gradient(closest-side, ${b.color}40, transparent 70%)` }}>
                  <Package className="w-7 h-7" style={{ color: b.color }} />
                </div>
                <div className="flex-1">
                  <div className="font-display text-white text-lg">{b.name}</div>
                  <div className="font-mono text-[10px] tracking-[0.18em] text-stone-400 mt-1">{b.odds}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs text-yellow-400">{b.currency === 'gems' ? `${b.price} GEMS` : `$${b.price} USDC`}</div>
                  <Button disabled className="mt-1 h-8 px-3 font-mono text-[11px] tracking-[0.2em] rounded-none"><Lock className="w-3 h-3 mr-1" /> SOON</Button>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
