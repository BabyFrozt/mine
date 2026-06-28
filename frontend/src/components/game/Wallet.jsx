import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useGame } from '../../context/GameContext';
import { Gem, DollarSign, Sparkles, ArrowDownToLine, ArrowUpFromLine, Lock, CheckCircle2, LogOut, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

// Base58 alphabet used by Solana
const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
function mockSolanaAddress() {
  return Array.from({ length: 44 }, () => BASE58[Math.floor(Math.random() * BASE58.length)]).join('');
}

function getSolanaProvider() {
  if (typeof window === 'undefined') return null;
  if (window.phantom?.solana?.isPhantom) return window.phantom.solana;
  if (window.solana?.isPhantom) return window.solana;
  if (window.backpack?.isBackpack) return window.backpack;
  if (window.solflare?.isSolflare) return window.solflare;
  return null;
}

export default function Wallet({ open, onOpenChange }) {
  const { player, connectWallet, disconnectWallet } = useGame();
  const [amount, setAmount] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [walletName, setWalletName] = useState('');

  // Detect which wallet is available
  useEffect(() => {
    const provider = getSolanaProvider();
    if (!provider) return;
    if (provider.isPhantom)   setWalletName('Phantom');
    else if (provider.isBackpack) setWalletName('Backpack');
    else if (provider.isSolflare) setWalletName('Solflare');
    else setWalletName('Solana Wallet');
  }, [open]);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const provider = getSolanaProvider();
      if (provider) {
        const resp = await provider.connect();
        const address = resp.publicKey.toString();
        connectWallet(address);
        const name = walletName || 'Solana Wallet';
        toast.success(`${name} connected!`);
      } else {
        // No Solana wallet installed — use mock address
        connectWallet(mockSolanaAddress());
        toast.success('Demo wallet connected — install Phantom for real connection');
      }
    } catch (err) {
      toast.error(err?.message === 'User rejected the request.' ? 'Connection rejected' : 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      const provider = getSolanaProvider();
      if (provider?.disconnect) await provider.disconnect();
    } catch (_) { /* ignore */ }
    disconnectWallet();
    toast.success('Wallet disconnected');
  };

  if (!player) return null;
  const { wallet } = player;
  const provider = getSolanaProvider();
  const hasWallet = !!provider;

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
          {/* Solana Connect / Disconnect */}
          <div className="border border-purple-500/30 bg-neutral-950 p-4">
            <div className="flex items-center gap-2 mb-3">
              {/* Solana logo mark */}
              <svg width="16" height="14" viewBox="0 0 646 476" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M108.53 350.89L190.3 432.66C194.22 436.58 199.59 438.83 205.2 438.83H628.73C637.87 438.83 642.44 427.81 636.01 421.38L554.24 339.61C550.32 335.69 544.95 333.44 539.34 333.44H115.81C106.67 333.44 102.1 344.46 108.53 350.89Z" fill="url(#sol_a)"/>
                <path d="M108.53 43.61L190.3 125.38C194.22 129.3 199.59 131.55 205.2 131.55H628.73C637.87 131.55 642.44 120.53 636.01 114.1L554.24 32.33C550.32 28.41 544.95 26.16 539.34 26.16H115.81C106.67 26.16 102.1 37.18 108.53 43.61Z" fill="url(#sol_b)"/>
                <path d="M554.24 196.49L472.47 114.72C468.55 110.8 463.18 108.55 457.57 108.55H34.04C24.9 108.55 20.33 119.57 26.76 126L108.53 207.77C112.45 211.69 117.82 213.94 123.43 213.94H546.96C556.1 213.94 560.67 202.92 554.24 196.49Z" fill="url(#sol_c)"/>
                <defs>
                  <linearGradient id="sol_a" x1="585.78" y1="295.97" x2="159.21" y2="479.59" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9945FF"/><stop offset="1" stopColor="#14F195"/>
                  </linearGradient>
                  <linearGradient id="sol_b" x1="438.99" y1="-11.66" x2="12.42" y2="171.96" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9945FF"/><stop offset="1" stopColor="#14F195"/>
                  </linearGradient>
                  <linearGradient id="sol_c" x1="512.38" y1="141.04" x2="85.81" y2="324.66" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9945FF"/><stop offset="1" stopColor="#14F195"/>
                  </linearGradient>
                </defs>
              </svg>
              <span className="font-mono text-[11px] tracking-[0.2em] text-purple-400">// SOLANA NETWORK</span>
            </div>

            {wallet.connected ? (
              <div className="space-y-3">
                <div className="bg-black/60 border border-purple-500/20 px-3 py-2 rounded-sm">
                  <div className="font-mono text-[9px] tracking-[0.2em] text-stone-500 mb-1">PUBLIC KEY</div>
                  <div className="font-mono text-[10px] text-stone-300 break-all leading-relaxed">{wallet.address}</div>
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
              <div className="space-y-3">
                <Button
                  onClick={handleConnect}
                  disabled={connecting}
                  className="w-full h-10 font-mono text-[11px] tracking-[0.2em] rounded-none bg-gradient-to-r from-purple-600 to-green-500 hover:from-purple-500 hover:to-green-400 text-white border-0"
                >
                  {connecting ? 'CONNECTING...' : hasWallet ? `CONNECT ${walletName.toUpperCase() || 'WALLET'}` : 'CONNECT DEMO WALLET'}
                </Button>
                {!hasWallet && (
                  <a
                    href="https://phantom.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 font-mono text-[10px] tracking-[0.18em] text-stone-500 hover:text-purple-400 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" /> GET PHANTOM WALLET
                  </a>
                )}
              </div>
            )}
          </div>

          <Card label="GEMS" value={wallet.gems.toLocaleString()} color="#22d3ee" icon={<GemIcon />} />
          <Card label="USDC" value={`$${wallet.usdc.toFixed(4)}`} color="#22c55e" icon={<USDCIcon />} />
          <Card label="$MINEX" value={wallet.minex.toLocaleString()} color="#facc15" icon={<MinexIcon />} />

          <div className="border border-yellow-400/30 bg-neutral-950 p-4 mt-6">
            <div className="font-mono text-[11px] tracking-[0.2em] text-yellow-400 mb-2">// DEPOSIT</div>
            <div className="flex gap-2">
              <Input type="number" disabled placeholder="0.00 USDC" value={amount} onChange={(e) => setAmount(e.target.value)} className="font-mono bg-transparent border-yellow-400/30 focus-visible:ring-yellow-400/40 rounded-none" />
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

function Card({ label, value, color, icon }) {
  return (
    <div className="border border-yellow-400/20 bg-neutral-950 p-4 flex items-center gap-3">
      <div className="w-12 h-12 border border-yellow-400/20 flex items-center justify-center shrink-0" style={{ background: `radial-gradient(closest-side, ${color}33, transparent 70%)` }}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-mono text-[10px] tracking-[0.2em] text-stone-500">{label}</div>
        <div className="font-display text-white text-2xl">{value}</div>
      </div>
    </div>
  );
}

function GemIcon() {
  return <Gem className="w-6 h-6" style={{ color: '#22d3ee' }} />;
}
function USDCIcon() {
  return <DollarSign className="w-6 h-6" style={{ color: '#22c55e' }} />;
}
function MinexIcon() {
  return <Sparkles className="w-6 h-6" style={{ color: '#facc15' }} />;
}
