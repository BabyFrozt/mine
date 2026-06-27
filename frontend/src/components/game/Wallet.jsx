import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useGame } from '../../context/GameContext';
import { Gem, DollarSign, Sparkles, ArrowDownToLine, ArrowUpFromLine, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function Wallet({ open, onOpenChange }) {
  const { player } = useGame();
  const [amount, setAmount] = useState('');

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="bg-black border-yellow-400/30 text-stone-200 w-full sm:max-w-lg p-0 overflow-y-auto">
        <SheetHeader className="px-6 pt-6 pb-3 border-b border-yellow-400/20">
          <SheetTitle className="font-mono text-sm tracking-[0.2em] text-yellow-400 flex items-center justify-between">
            <span>// WALLET</span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-stone-500">MOCK</span>
          </SheetTitle>
        </SheetHeader>

        <div className="px-6 py-5 space-y-3">
          <Card label="GEMS" value={player.wallet.gems.toLocaleString()} color="#22d3ee" Icon={Gem} />
          <Card label="USDC" value={`$${player.wallet.usdc.toFixed(4)}`} color="#22c55e" Icon={DollarSign} />
          <Card label="$MINEX" value={player.wallet.minex.toLocaleString()} color="#facc15" Icon={Sparkles} />

          <div className="border border-yellow-400/30 bg-neutral-950 p-4 mt-6">
            <div className="font-mono text-[11px] tracking-[0.2em] text-yellow-400 mb-2">// DEPOSIT</div>
            <div className="flex gap-2">
              <Input type="number" disabled placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="font-mono bg-transparent border-yellow-400/30 focus-visible:ring-yellow-400/40 rounded-none" />
              <Button disabled className="bg-yellow-400/40 text-black h-10 px-4 font-mono text-[11px] tracking-[0.2em] rounded-none">
                <ArrowDownToLine className="w-3.5 h-3.5 mr-1" /> DEPOSIT
              </Button>
            </div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-stone-500 mt-2"><Lock className="w-3 h-3 inline mr-1" />ON-CHAIN BRIDGE — COMING SOON</p>
          </div>

          <div className="border border-yellow-400/30 bg-neutral-950 p-4">
            <div className="font-mono text-[11px] tracking-[0.2em] text-yellow-400 mb-2">// WITHDRAW</div>
            <div className="flex gap-2">
              <Input type="number" disabled placeholder="MIN $10.00" className="font-mono bg-transparent border-yellow-400/30 focus-visible:ring-yellow-400/40 rounded-none" />
              <Button disabled className="bg-yellow-400/40 text-black h-10 px-4 font-mono text-[11px] tracking-[0.2em] rounded-none">
                <ArrowUpFromLine className="w-3.5 h-3.5 mr-1" /> WITHDRAW
              </Button>
            </div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-stone-500 mt-2"><Lock className="w-3 h-3 inline mr-1" />MINIMUM $10 USDC · FOUNDRY OPENING SOON</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Card({ label, value, color, Icon }) {
  return (
    <div className="border border-yellow-400/20 bg-neutral-950 p-4 flex items-center gap-3">
      <div className="w-12 h-12 border border-yellow-400/20 flex items-center justify-center" style={{ background: `radial-gradient(closest-side, ${color}33, transparent 70%)` }}>
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div className="flex-1">
        <div className="font-mono text-[10px] tracking-[0.2em] text-stone-500">{label}</div>
        <div className="font-display text-white text-2xl">{value}</div>
      </div>
    </div>
  );
}
