import React, { useState } from 'react';
import { Menu, X, Send } from 'lucide-react';

export default function Navbar({ onLoginClick, onPlayClick }) {
  const [open, setOpen] = useState(false);
  const nav = [
    { label: 'MISSION', id: 'mission' },
    { label: '$OCT', id: 'oct' },
    { label: 'ABOUT', id: 'about' },
    { label: 'MARKETPLACE', id: 'marketplace' },
  ];
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <div className="px-5 md:px-10 py-4 flex items-center justify-between">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 font-display text-white tracking-tight">
          <Diamond />
          <span className="text-xl md:text-2xl">THE OCT</span>
        </button>

        <nav className="hidden md:flex items-center gap-8 font-mono text-[12px] tracking-[0.18em] text-stone-300">
          {nav.map((n) => (
            <button key={n.id} onClick={() => scrollTo(n.id)} className="hover:text-yellow-400 transition-colors">
              {n.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button onClick={onLoginClick} className="font-mono text-[12px] tracking-[0.18em] text-stone-300 hover:text-yellow-400 transition-colors">FOUNDRY LOGIN</button>
          <button onClick={onPlayClick} className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black px-5 py-2.5 rounded-full font-mono text-[12px] tracking-[0.18em] font-bold transition-colors">
            <Send className="w-3.5 h-3.5" />
            PLAY NOW
          </button>
        </div>

        <button className="md:hidden text-stone-200" onClick={() => setOpen((v) => !v)} aria-label="menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden mx-5 mb-3 border border-yellow-400/30 bg-black/95 rounded-lg p-5 font-mono">
          <div className="flex flex-col gap-3 text-stone-200 text-sm tracking-[0.18em]">
            {nav.map((n) => (
              <button key={n.id} onClick={() => scrollTo(n.id)} className="text-left hover:text-yellow-400">{n.label}</button>
            ))}
            <button onClick={() => { setOpen(false); onLoginClick(); }} className="text-left hover:text-yellow-400">FOUNDRY LOGIN</button>
            <button onClick={() => { setOpen(false); onPlayClick(); }} className="mt-2 flex items-center gap-2 bg-yellow-400 text-black px-4 py-2.5 rounded-full justify-center font-bold">
              <Send className="w-3.5 h-3.5" /> PLAY NOW
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function Diamond() {
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2 L30 16 L16 30 L2 16 Z" stroke="#facc15" strokeWidth="2.2" fill="none" />
      <path d="M16 8 L24 16 L16 24 L8 16 Z" stroke="#facc15" strokeWidth="1.8" fill="none" />
      <circle cx="16" cy="16" r="1.6" fill="#facc15" />
    </svg>
  );
}
