import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { useGame } from '../../context/GameContext';
import { TIER_DATA } from '../../mock';
import { Pickaxe, Hammer, Wrench, Drill, Zap, CheckCircle2, Merge, AlertTriangle } from 'lucide-react';
import { Progress } from '../ui/progress';
import { toast } from 'sonner';

const icons = { 1: Pickaxe, 2: Hammer, 3: Wrench, 4: Drill, 5: Zap };

export default function Inventory({ open, onOpenChange }) {
  const { player, setActiveTool, repairTool, fuseTool } = useGame();
  const [tab,   setTab]   = useState('tools');
  const [fuseA, setFuseA] = useState(null);
  const [fuseB, setFuseB] = useState(null);

  const onRepair = (id, tier) => {
    const d = TIER_DATA[tier];
    const w = player.wallet;
    const canAfford = d.repairCurrency === 'gems' ? w.gems >= d.repairCost : w.usdc >= d.repairCost;
    if (!canAfford) { toast.error('Insufficient funds to repair'); return; }
    const ok = repairTool(id);
    if (ok) {
      toast.success('Repair successful! Durability restored.');
    } else {
      toast.error('Repair FAILED — tool was destroyed!', { duration: 5000 });
    }
  };

  const handleFuseSelect = (toolId) => {
    if (!fuseA) {
      setFuseA(toolId);
    } else if (fuseA === toolId) {
      setFuseA(null); setFuseB(null);
    } else if (!fuseB) {
      setFuseB(toolId);
    } else {
      setFuseA(toolId); setFuseB(null);
    }
  };

  const confirmFuse = () => {
    if (!fuseA || !fuseB) return;
    const t1 = player.tools.find((x) => x.id === fuseA);
    const t2 = player.tools.find((x) => x.id === fuseB);
    if (!t1 || !t2 || t1.tier !== t2.tier) {
      toast.error('Select two tools of the same tier.');
      return;
    }
    const bothBroken = t1.broken && t2.broken;
    const bothNormal = !t1.broken && !t2.broken;
    if (!bothBroken && !bothNormal) {
      toast.error('Both tools must be in the same state (both broken or both intact).');
      return;
    }
    if (bothNormal && t1.tier === 5) {
      toast.error('Tier 5 is already max — fuse two broken Mk5s to restore one instead.');
      return;
    }
    const targetTier = bothBroken ? t1.tier : Math.min(5, t1.tier + 1);
    const td = TIER_DATA[targetTier];
    fuseTool(fuseA, fuseB);
    setFuseA(null); setFuseB(null);
    const desc = bothBroken
      ? `Restored a fresh ${TIER_DATA[t1.tier].name}!`
      : `Fused into ${td.name} (Tier ${targetTier})!`;
    toast.success(desc);
  };

  if (!player) return null;

  return (
    <Sheet open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) { setFuseA(null); setFuseB(null); } }}>
      <SheetContent side="right" className="bg-black border-yellow-400/30 text-stone-200 w-full sm:max-w-lg p-0 overflow-y-auto">
        <SheetHeader className="px-6 pt-6 pb-3 border-b border-yellow-400/20">
          <SheetTitle className="font-mono text-sm tracking-[0.2em] text-yellow-400 flex items-center justify-between">
            <span>// TOOLS</span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-stone-500">{player.tools.length} ITEMS</span>
          </SheetTitle>
        </SheetHeader>

        <Tabs value={tab} onValueChange={(v) => { setTab(v); setFuseA(null); setFuseB(null); }} className="px-6 pt-4">
          <TabsList className="bg-neutral-900 border border-yellow-400/20 grid grid-cols-2 w-full rounded-none">
            <TabsTrigger value="tools" className="font-mono text-xs tracking-[0.18em] data-[state=active]:bg-yellow-400 data-[state=active]:text-black rounded-none">INVENTORY</TabsTrigger>
            <TabsTrigger value="fuse"  className="font-mono text-xs tracking-[0.18em] data-[state=active]:bg-yellow-400 data-[state=active]:text-black rounded-none flex items-center gap-1"><Merge className="w-3 h-3" />FUSE</TabsTrigger>
          </TabsList>

          {/* Tools tab */}
          <TabsContent value="tools" className="pt-5 pb-8 space-y-3">
            {player.tools.map((t) => {
              const d    = TIER_DATA[t.tier];
              const Icon = icons[t.tier];
              const digPct = (t.digUses    / t.maxDigUses)   * 100;
              const durPct = (t.durability / t.maxDurability) * 100;
              const active = t.id === player.activeToolId;
              const resetMs = t.digUsesResetAt ? Math.max(0, t.digUsesResetAt - Date.now()) : 0;
              return (
                <div key={t.id} className={`border p-4 bg-neutral-950 ${active ? 'border-yellow-400' : 'border-yellow-400/20'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 border border-yellow-400/20 flex items-center justify-center shrink-0" style={{ background: `radial-gradient(closest-side, ${d.color}33, transparent 70%)` }}>
                      <Icon className="w-6 h-6" style={{ color: d.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display text-white">{d.name}</span>
                        <span className="font-mono text-[10px] tracking-[0.2em] text-stone-500">TIER {t.tier}</span>
                        {active  && <span className="font-mono text-[10px] tracking-[0.2em] text-yellow-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> EQUIPPED</span>}
                        {t.broken && <span className="font-mono text-[10px] tracking-[0.2em] text-red-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> BROKEN</span>}
                      </div>
                      {/* Dig Uses bar */}
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-mono text-[9px] tracking-[0.15em] text-yellow-400/70">DIG USES (24H)</span>
                          <span className="font-mono text-[9px] text-stone-500">{t.digUses}/{t.maxDigUses}
                            {resetMs > 0 && ` · resets ${Math.ceil(resetMs / 3_600_000)}h`}
                          </span>
                        </div>
                        <Progress value={digPct} className="h-1 bg-neutral-800" />
                      </div>
                      {/* Durability bar */}
                      <div className="mt-1.5">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-mono text-[9px] tracking-[0.15em] text-red-400/70">DURABILITY</span>
                          <span className="font-mono text-[9px] text-stone-500">{t.durability}/{t.maxDurability}</span>
                        </div>
                        <div className="h-1 bg-neutral-800 relative overflow-hidden rounded-sm">
                          <div className="h-full bg-red-500 transition-all" style={{ width: `${durPct}%` }} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1.5 font-mono text-[10px] tracking-[0.18em] text-stone-500">
                        <span>RANGE {d.range}</span>
                        <span className="text-green-400">+{d.boost}% BOOST</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {!active && !t.broken && (
                      <Button onClick={() => setActiveTool(t.id)} className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black h-9 font-mono text-[11px] tracking-[0.2em] rounded-none">EQUIP</Button>
                    )}
                    <Button
                      onClick={() => onRepair(t.id, t.tier)}
                      variant="outline"
                      className="flex-1 border-red-500/40 text-red-300 hover:bg-red-500/10 hover:text-red-300 h-9 font-mono text-[11px] tracking-[0.2em] rounded-none"
                    >
                      REPAIR — 50/50 ({d.repairCurrency === 'gems' ? `${d.repairCost} GEMS` : `$${d.repairCost}`})
                    </Button>
                  </div>
                </div>
              );
            })}
            <p className="font-mono text-[10px] tracking-[0.2em] text-stone-500 pt-2">
              // DIG USES RESET AUTOMATICALLY AFTER 24H · REPAIR IS 50/50 (FAIL = TOOL LOST)
            </p>
          </TabsContent>

          {/* Fuse tab */}
          <TabsContent value="fuse" className="pt-5 pb-8 space-y-4">
            <div className="font-mono text-[10px] tracking-[0.2em] text-stone-500">
              // FUSE 2 SAME-TIER TOOLS → UPGRADE<br />
              // INTACT + INTACT = TIER UP · BROKEN + BROKEN = FRESH SAME TIER
            </div>

            {fuseA && fuseB && (() => {
              const t1 = player.tools.find((x) => x.id === fuseA);
              const t2 = player.tools.find((x) => x.id === fuseB);
              if (!t1 || !t2) return null;
              const bothBroken = t1.broken && t2.broken;
              const bothNormal = !t1.broken && !t2.broken;
              const valid = t1.tier === t2.tier && (bothBroken || bothNormal);
              const targetTier = bothBroken ? t1.tier : Math.min(5, t1.tier + 1);
              return (
                <div className="border border-yellow-400/40 bg-neutral-950 p-4">
                  <div className="font-mono text-[10px] tracking-[0.2em] text-stone-400 mb-2">// FUSE PREVIEW</div>
                  <div className="flex items-center gap-3 justify-center">
                    <ToolChip tool={t1} />
                    <span className="font-mono text-yellow-400">+</span>
                    <ToolChip tool={t2} />
                    <span className="font-mono text-yellow-400">=</span>
                    <div className="font-mono text-sm text-white">{valid ? `${TIER_DATA[targetTier].name} (T${targetTier})` : '⚠ INVALID'}</div>
                  </div>
                  {valid && (
                    <Button onClick={confirmFuse} className="w-full mt-4 bg-yellow-400 hover:bg-yellow-300 text-black h-10 font-mono text-[11px] tracking-[0.2em] rounded-none">
                      CONFIRM FUSE
                    </Button>
                  )}
                  {!valid && (
                    <p className="font-mono text-[10px] text-red-400 mt-2">
                      {t1.tier !== t2.tier ? 'Tools must be same tier.' : 'Both must be intact or both broken.'}
                    </p>
                  )}
                </div>
              );
            })()}

            <div className="space-y-2">
              {player.tools.map((t) => {
                const d    = TIER_DATA[t.tier];
                const Icon = icons[t.tier];
                const sel  = t.id === fuseA || t.id === fuseB;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleFuseSelect(t.id)}
                    className={`w-full border p-3 bg-neutral-950 flex items-center gap-3 text-left transition-colors ${sel ? 'border-yellow-400' : 'border-yellow-400/20 hover:border-yellow-400/50'}`}
                  >
                    <div className="w-10 h-10 border border-yellow-400/20 flex items-center justify-center shrink-0" style={{ background: `radial-gradient(closest-side, ${d.color}33, transparent 70%)` }}>
                      <Icon className="w-5 h-5" style={{ color: d.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-white text-sm">{d.name}</span>
                        <span className="font-mono text-[10px] text-stone-500">T{t.tier}</span>
                        {t.broken && <span className="font-mono text-[10px] text-red-400">BROKEN</span>}
                      </div>
                      <span className="font-mono text-[10px] text-stone-500">DUR {t.durability}/{t.maxDurability} · USES {t.digUses}/{t.maxDigUses}</span>
                    </div>
                    {sel && <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
            {player.tools.length < 2 && (
              <p className="font-mono text-[10px] text-stone-500">// Need at least 2 tools to fuse.</p>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

function ToolChip({ tool }) {
  const d    = TIER_DATA[tool.tier];
  const Icon = icons[tool.tier];
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-8 h-8 border border-yellow-400/30 flex items-center justify-center" style={{ background: `radial-gradient(closest-side, ${d.color}33, transparent 70%)` }}>
        <Icon className="w-4 h-4" style={{ color: d.color }} />
      </div>
      <span className="font-mono text-[9px] text-stone-400">{d.name}</span>
    </div>
  );
}
