import React, { useEffect } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Button } from '../ui/button';
import { Gem, DollarSign, Sparkles, Info } from 'lucide-react';
import { useGame } from '../../context/GameContext';

const META = {
  gems: { label: 'GEMS', Icon: Gem, color: '#22d3ee' },
  usdc: { label: 'USDC', Icon: DollarSign, color: '#22c55e' },
  minex: { label: '$MINEX', Icon: Sparkles, color: '#facc15' },
};

export default function RewardPopup() {
  const { rewardPopup, setRewardPopup } = useGame();
  const open = !!rewardPopup;

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => setRewardPopup(null), 6500);
    return () => clearTimeout(id);
  }, [open, setRewardPopup]);

  if (!rewardPopup) return null;
  const m = META[rewardPopup.type];
  if (!m) return null;
  const Icon = m.Icon;
  const base = rewardPopup.base;
  const final = rewardPopup.final;
  const boost = rewardPopup.boost;

  const fmt = (v) => rewardPopup.type === 'usdc' ? `$${v} USDC` : `${v.toLocaleString()} ${m.label}`;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && setRewardPopup(null)}>
      <DialogContent className="bg-black border-yellow-400/40 text-stone-200 max-w-md p-0 overflow-hidden">
        <div className="px-6 pt-6 pb-3 border-b border-yellow-400/20 flex items-center justify-between">
          <span className="font-mono text-[11px] tracking-[0.2em] text-yellow-400">// MINEX BLOCK</span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-stone-500">REWARD-DROP</span>
        </div>
        <div className="px-6 py-8 flex flex-col items-center text-center">
          <div className="relative w-40 h-40 mb-6">
            <div className="absolute inset-0 rounded-3xl" style={{ background: `radial-gradient(closest-side, ${m.color}55, transparent 70%)` }} />
            <div className="absolute inset-3 rounded-2xl flex items-center justify-center" style={{ background: `${m.color}25`, border: `1px solid ${m.color}99` }}>
              <Icon className="w-16 h-16" style={{ color: m.color }} />
            </div>
          </div>
          <div className="font-mono text-xs tracking-[0.25em] text-stone-400">YOU HAVE FOUND!</div>
          <div className="font-display text-white text-4xl mt-2">{fmt(final)}</div>

          <div className="w-full mt-8 space-y-3">
            <Row label="MAX VALUE" value={fmt(base)} />
            <Row label="TOOL EFFICIENCY" value={`× ${boost}%`} valueClass="text-green-400" />
            <div className="h-px bg-yellow-400/20 my-2" />
            <Row label="YOU EARNED" value={fmt(final)} highlight />
          </div>

          <Button onClick={() => setRewardPopup(null)} className="mt-7 w-full bg-yellow-400 hover:bg-yellow-300 text-black font-mono tracking-[0.25em] py-6 rounded-full text-base">
            COLLECT
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value, valueClass = '', highlight = false }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-mono text-[11px] tracking-[0.2em] text-stone-400 flex items-center gap-2">{label} <Info className="w-3 h-3 opacity-60" /></span>
      <span className={`font-mono text-sm px-3 py-1 rounded-md ${highlight ? 'bg-green-500/15 text-green-400 border border-green-500/30' : 'bg-neutral-900 text-stone-200 border border-stone-700'} ${valueClass}`}>{value}</span>
    </div>
  );
}
