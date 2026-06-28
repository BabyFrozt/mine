import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useGame } from '../../context/GameContext';
import { Gem, DollarSign, Sparkles, ArrowDownToLine, ArrowUpFromLine, Lock, Wallet2, CheckCircle2, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function Wallet({ open, onOpenChange }) {
  const { player, connectWallet, disconnectWallet } = useGame();
  const [amount, setAmount] = useState('');
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts[0]) {
          connectWallet(accounts[0]);
          toast.success('Wallet connected!');
        }
      } else {
        // Mock address fallback when MetaMask is not installed
        const mockAddr = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        connectWallet(mockAddr);
        toast.success('Demo wallet connected (no MetaMask detected)');
      }
    } catch (err) {
      toast.error('Connection rejected');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    toast.success('Wallet disconnected');
  };

  if (!player) return null;
  const { wallet } = player;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="bg-black border-yellow-400/30 text-stone-200 w-full sm:max-w-lg p-0 overflow-y-auto">
        <SheetHeader className="px-6 pt-6 pb-3 border-b border-yellow-400/20">
          <SheetTitle className="font-mono text-sm tracking-[0.2em] text-yellow-400 flex items-center justify-between">
            <span>// WALLET</span>
            {wallet.connected
              ? <span className="font-mono text-[10px] tracking-[0.2em] text-green-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> CONNECTED</span>
              : <span className="font-mono text-[10px] tracking-[0.2em] text-stone-500">NOT CONNECTED</span>
            }
          </SheetTitle>
        </SheetHeader>

        <div className="px-6 py-5 space-y-3">
          {/* Connect / Disconnect */}
          <div className="border border-yellow-400/30 bg-neutral-950 p-4">
            <div className="font-mono text-[11px] tracking-[0.2em] text-yellow-400 mb-3">// WEB3 WALLET</div>
            {wallet.connected ? (
              <div className="space-y-3">
                <div className="font-mono text-[10px] text-stone-400 break-all">
                  {wallet.address}
                </div>
                <Button
                  onClick={handleDisconnect}
                  variant="outline"
                  className="w-full border-red-500/40 text-red-300 hover:bg-red-500/10 hover:text-red-300 h-9 font-mono text-[11px] tracking-[0.2em] rounded-none"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1.5" /> DISCONNECT
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleConnect}
                disabled={connecting}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black h-10 font-mono text-[11px] tracking-[0.2em] rounded-none"
              >
                <Wallet2 className="w-3.5 h-3.5 mr-1.5" />
                {connecting ? 'CONNECTING...' : 'CONNECT WALLET'}
              </Button>
            )}
          </div>

          <Card label="GEMS" value={wallet.gems.toLocaleString()} color="#22d3ee" Icon={Gem} />
          <Card label="USDC" value={`$${wallet.usdc.toFixed(4)}`} color="#22c55e" Icon={DollarSign} />
          <Card label="$MINEX" value={wallet.minex.toLocaleString()} color="#facc15" Icon={Sparkles} />

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
