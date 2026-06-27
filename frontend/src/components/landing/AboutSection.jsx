import React from 'react';
import { Quote } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="relative py-20 md:py-28 bg-black">
      <div className="px-5 md:px-10 max-w-7xl mx-auto">
        <div className="flex items-baseline gap-4 mb-10">
          <span className="font-mono text-xs tracking-[0.2em] text-yellow-400">// SEC 05</span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-stone-500">THE CONSORTIUM</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 border border-yellow-400/20 p-8 bg-neutral-950">
            <h3 className="font-display text-white text-4xl md:text-5xl leading-tight">WHAT IS<br />THE CONSORTIUM?</h3>
            <p className="font-mono text-sm text-stone-400 mt-6 leading-relaxed max-w-xl">
              The Consortium is a dedicated group focused on helping miners uncover the vast treasures within the OCT.
              We provide top-tier equipment and facilitate trades at a fair commission, ensuring every miner has the tools and support to outplay competitors.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 max-w-md">
              <Mini label="BLOCKS" value="21,400" />
              <Mini label="PLAYERS" value="104K+" />
              <Mini label="PAID OUT" value="$184K" />
              <Mini label="DAILY DROPS" value="912" />
            </div>
          </div>

          <div className="border border-yellow-400/20 p-8 bg-neutral-950 relative">
            <Quote className="w-7 h-7 text-yellow-400/70" />
            <p className="font-mono text-sm text-stone-300 leading-relaxed mt-4 italic">
              &ldquo;Thanks for giving me a chance to mine 190 USDC! Amazing game — looking forward to the final release!&rdquo;
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-700 flex items-center justify-center font-display text-black">G</div>
              <div>
                <div className="font-display text-white">GON_FREECS</div>
                <div className="font-mono text-[10px] tracking-[0.2em] text-stone-500">// MINER · LVL 14</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Mini({ label, value }) {
  return (
    <div className="border border-yellow-400/30 p-3">
      <div className="font-mono text-[10px] tracking-[0.2em] text-stone-500">// {label}</div>
      <div className="font-display text-yellow-400 text-xl mt-1">{value}</div>
    </div>
  );
}
