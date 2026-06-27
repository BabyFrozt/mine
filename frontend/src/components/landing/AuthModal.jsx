import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ArrowRight, Mail, User, Lock } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { useNavigate } from 'react-router-dom';
import { randomNick } from '../../mock';

export default function AuthModal({ open, onOpenChange }) {
  const { login } = useGame();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [nick, setNick] = useState('');
  const [tab, setTab] = useState('email');
  const [err, setErr] = useState('');

  const onEmail = (e) => {
    e.preventDefault();
    if (!email.includes('@') || pass.length < 4) {
      setErr('Invalid Comms Address or Access Key');
      return;
    }
    setErr('');
    login({ email, nickname: email.split('@')[0], isGuest: false });
    onOpenChange(false);
    navigate('/play');
  };

  const onGuest = (e) => {
    e.preventDefault();
    const n = nick.trim() || randomNick();
    login({ nickname: n, isGuest: true });
    onOpenChange(false);
    navigate('/play');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black border-yellow-400/40 text-stone-200 max-w-md p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-3 border-b border-yellow-400/20 flex flex-row items-center justify-between">
          <DialogTitle className="font-mono text-sm tracking-[0.2em] text-yellow-400">// FOUNDRY LOGIN</DialogTitle>
          <span className="font-mono text-[10px] tracking-[0.2em] text-stone-500">SEC-CHAN 04</span>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="px-6 pt-4">
          <TabsList className="bg-neutral-900 border border-yellow-400/20 grid grid-cols-2 w-full rounded-none">
            <TabsTrigger value="email" className="font-mono text-xs tracking-[0.18em] data-[state=active]:bg-yellow-400 data-[state=active]:text-black rounded-none">EMAIL</TabsTrigger>
            <TabsTrigger value="guest" className="font-mono text-xs tracking-[0.18em] data-[state=active]:bg-yellow-400 data-[state=active]:text-black rounded-none">GUEST</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="pt-4 pb-6">
            <form onSubmit={onEmail} className="space-y-4">
              <div>
                <label className="font-mono text-[10px] tracking-[0.2em] text-stone-400">COMMS ADDRESS</label>
                <div className="flex items-center gap-2 mt-2 border border-yellow-400/20 px-3">
                  <Mail className="w-4 h-4 text-stone-500" />
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="miner@minesblock.xyz" className="font-mono bg-transparent border-0 focus-visible:ring-0 px-0" />
                </div>
              </div>
              <div>
                <label className="font-mono text-[10px] tracking-[0.2em] text-stone-400">ACCESS KEY</label>
                <div className="flex items-center gap-2 mt-2 border border-yellow-400/20 px-3">
                  <Lock className="w-4 h-4 text-stone-500" />
                  <Input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" className="font-mono bg-transparent border-0 focus-visible:ring-0 px-0" />
                </div>
              </div>
              {err && <div className="font-mono text-xs text-red-400">// {err}</div>}
              <Button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-mono tracking-[0.2em] rounded-none">
                AUTHENTICATE <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <p className="font-mono text-[10px] tracking-[0.2em] text-stone-500">
                NEW TO MINEX BLOCK? <button type="button" onClick={() => setTab('guest')} className="text-yellow-400 underline">ENLIST NOW</button>
              </p>
            </form>
          </TabsContent>

          <TabsContent value="guest" className="pt-4 pb-6">
            <form onSubmit={onGuest} className="space-y-4">
              <div>
                <label className="font-mono text-[10px] tracking-[0.2em] text-stone-400">CALL SIGN</label>
                <div className="flex items-center gap-2 mt-2 border border-yellow-400/20 px-3">
                  <User className="w-4 h-4 text-stone-500" />
                  <Input value={nick} onChange={(e) => setNick(e.target.value)} placeholder="OrbitHunter_42" className="font-mono bg-transparent border-0 focus-visible:ring-0 px-0" />
                </div>
                <p className="font-mono text-[10px] tracking-[0.2em] text-stone-500 mt-2">// LEAVE BLANK FOR RANDOM</p>
              </div>
              <Button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-mono tracking-[0.2em] rounded-none">
                ENTER ORBIT <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <p className="font-mono text-[10px] tracking-[0.2em] text-stone-500">
                GUEST PROGRESS SAVES TO THIS DEVICE ONLY.
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
