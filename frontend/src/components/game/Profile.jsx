import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Button } from '../ui/button';
import { useGame } from '../../context/GameContext';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile({ open, onOpenChange }) {
  const { player, logout } = useGame();
  const navigate = useNavigate();
  if (!player) return null;

  const onLogout = () => {
    logout();
    navigate('/');
  };

  const joined = new Date(player.joinedAt).toLocaleDateString();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="bg-black border-yellow-400/30 text-stone-200 w-full sm:max-w-md p-0 overflow-y-auto">
        <SheetHeader className="px-6 pt-6 pb-3 border-b border-yellow-400/20">
          <SheetTitle className="font-mono text-sm tracking-[0.2em] text-yellow-400 flex items-center justify-between">
            <span>// MINER PROFILE</span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-stone-500">{player.isGuest ? 'GUEST' : 'REGISTERED'}</span>
          </SheetTitle>
        </SheetHeader>

        <div className="px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-700 flex items-center justify-center font-display text-black text-2xl">
              {(player.nickname[0] || 'M').toUpperCase()}
            </div>
            <div>
              <div className="font-display text-white text-2xl">{player.nickname}</div>
              <div className="font-mono text-[10px] tracking-[0.2em] text-stone-500 mt-1">// ID {player.id}</div>
              {player.email && <div className="font-mono text-xs text-stone-400 mt-1">{player.email}</div>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <Stat label="BLOCKS MINED" value={player.totalMined.toLocaleString()} />
            <Stat label="TOOLS OWNED" value={player.tools.length} />
            <Stat label="USDC EARNED" value={`$${player.wallet.usdc.toFixed(2)}`} />
            <Stat label="JOINED" value={joined} />
          </div>

          <Button onClick={onLogout} variant="outline" className="w-full mt-8 border-red-500/40 text-red-300 hover:bg-red-500/10 hover:text-red-300 font-mono tracking-[0.2em] rounded-none">
            <LogOut className="w-4 h-4 mr-2" /> LOGOUT
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Stat({ label, value }) {
  return (
    <div className="border border-yellow-400/20 bg-neutral-950 p-3">
      <div className="font-mono text-[10px] tracking-[0.2em] text-stone-500">// {label}</div>
      <div className="font-display text-yellow-400 text-xl mt-1">{value}</div>
    </div>
  );
}
