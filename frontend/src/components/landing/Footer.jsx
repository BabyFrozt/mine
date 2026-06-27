import React from 'react';
import { Send, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-yellow-400/20 bg-black">
      <div className="px-5 md:px-10 max-w-7xl mx-auto py-12 grid md:grid-cols-3 gap-8">
        <div>
          <div className="font-display text-white text-2xl">MINES BLOCK</div>
          <p className="font-mono text-xs text-stone-500 mt-3 max-w-xs leading-relaxed">
            A multiplayer voxel mining game. Dig the Octahedron, claim the prize pool.
          </p>
        </div>
        <div>
          <div className="font-mono text-[10px] tracking-[0.2em] text-stone-500 mb-3">// NAVIGATE</div>
          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            {['MISSION', '$OCT', 'ARTEFACTS', 'EQUIPMENT', 'ABOUT', 'MARKETPLACE'].map((x) => (
              <a key={x} href={`#${x.toLowerCase().replace('$', '')}`} className="text-stone-300 hover:text-yellow-400">{x}</a>
            ))}
          </div>
        </div>
        <div>
          <div className="font-mono text-[10px] tracking-[0.2em] text-stone-500 mb-3">// CONNECT</div>
          <div className="flex gap-3">
            <a className="w-10 h-10 border border-yellow-400/30 hover:border-yellow-400 flex items-center justify-center text-stone-200 hover:text-yellow-400 transition-colors" href="#" aria-label="x"><Twitter className="w-4 h-4" /></a>
            <a className="w-10 h-10 border border-yellow-400/30 hover:border-yellow-400 flex items-center justify-center text-stone-200 hover:text-yellow-400 transition-colors" href="#" aria-label="telegram"><Send className="w-4 h-4" /></a>
          </div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-stone-600 mt-6">© MINES BLOCK · CONSORTIUM 2025</p>
        </div>
      </div>
    </footer>
  );
}
