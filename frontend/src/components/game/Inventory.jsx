import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Button } from '../ui/button';
import { useGame } from '../../context/GameContext';
import { TIER_DATA } from '../../mock';
import { Pickaxe, Hammer, Wrench, Drill, Zap, CheckCircle2 } from 'lucide-react';
import { Progress } from '../ui/progress';
import { toast } from 'sonner';

const icons = { 1: Pickaxe, 2: Hammer, 3: Wrench, 4: Drill, 5: Zap };

export default function Inventory({ open, onOpenChange }) {
  const { player, setActiveTool, repairTool } = useGame();

  const onRepair = (id, tier) => {
    const d = TIER_DATA[tier];
    const w = player.wallet;
    const can = tier === 1 ? w.gems >= d.repairCost : w.usdc >= d.repairCost;
    if (!can) { toast.error('Insufficient funds to repair'); return; }
    repairTool(id);
    toast.success(`Repaired ${d.name}`);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="bg-black border-yellow-400/30 text-stone-200 w-full sm:max-w-lg p-0 overflow-y-auto">
        <SheetHeader className="px-6 pt-6 pb-3 border-b border-yellow-400/20">
          <SheetTitle className="font-mono text-sm tracking-[0.2em] text-yellow-400 flex items-center justify-between">
            <span>// INVENTORY</span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-stone-500">{player.tools.length} ITEMS</span>
          </SheetTitle>
        </SheetHeader>

        <div className="px-6 py-5 space-y-3">
          {player.tools.map((t) => {
            const d = TIER_DATA[t.tier];
            const Icon = icons[t.tier];
            const pct = (t.uses / t.maxUses) * 100;
            const active = t.id === player.activeToolId;
            return (
              <div key={t.id} className={`border p-4 bg-neutral-950 ${active ? 'border-yellow-400' : 'border-yellow-400/20'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 border border-yellow-400/20 flex items-center justify-center" style={{ background: `radial-gradient(closest-side, ${d.color}33, transparent 70%)` }}>
                    <Icon className="w-6 h-6" style={{ color: d.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-white">{d.name}</span>
                      <span className="font-mono text-[10px] tracking-[0.2em] text-stone-500">TIER {t.tier}</span>
                      {active && <span className="font-mono text-[10px] tracking-[0.2em] text-yellow-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> EQUIPPED</span>}
                      {t.broken && <span className="font-mono text-[10px] tracking-[0.2em] text-red-400">BROKEN</span>}
                    </div>
                    <Progress value={pct} className="h-1.5 mt-2 bg-neutral-800" />
                    <div className="flex items-center justify-between mt-2 font-mono text-[10px] tracking-[0.2em] text-stone-500">
                      <span>{t.uses}/{t.maxUses} USES</span>
                      <span className="text-green-400">+{d.boost}% BOOST</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  {!active && !t.broken && (
                    <Button onClick={() => setActiveTool(t.id)} className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black h-9 font-mono text-[11px] tracking-[0.2em] rounded-none">EQUIP</Button>
                  )}
                  <Button onClick={() => onRepair(t.id, t.tier)} variant="outline" className="flex-1 border-yellow-400/40 text-stone-200 hover:bg-yellow-400/10 hover:text-yellow-400 h-9 font-mono text-[11px] tracking-[0.2em] rounded-none">
                    REPAIR ({t.tier === 1 ? `${d.repairCost} GEMS` : `$${d.repairCost}`})
                  </Button>
                </div>
              </div>
            );
          })}
          <div className="font-mono text-[10px] tracking-[0.2em] text-stone-500 pt-2">
            // BROKEN TOOLS RETURN MAX USES EVERY 24H AUTOMATICALLY
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
