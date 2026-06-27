import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ChevronLeft } from 'lucide-react';

const COLS = 200;
const ROWS = 140;
const BASE_TILE = 24;

// State per tile (sparse map: key 'x,y' -> { type })
const COLORS = {
  unmined: '#171717',
  gridline: '#0a0a0a',
  zonk: '#3a3a3a',
  gems: '#22d3ee',
  usdc: '#22c55e',
  minex: '#facc15',
};

export default function TileMineView({ onMine, tiles, onBack, viewportTitle = 'ORBIT 04-X · FACE A' }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const draggingRef = useRef({ dragging: false, startX: 0, startY: 0, baseX: 0, baseY: 0, moved: false });
  const animatingTiles = useRef(new Map()); // key -> { start, color }
  const [, force] = useState(0);

  // Center initially
  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const w = c.clientWidth, h = c.clientHeight;
    const worldW = COLS * BASE_TILE, worldH = ROWS * BASE_TILE;
    setOffset({ x: (w - worldW) / 2, y: (h - worldH) / 2 });
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== w * dpr) {
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    }
    ctx.clearRect(0, 0, w, h);
    // bg
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);

    const ts = BASE_TILE * scale;
    // visible tile range
    const minX = Math.max(0, Math.floor(-offset.x / ts));
    const maxX = Math.min(COLS - 1, Math.ceil((w - offset.x) / ts));
    const minY = Math.max(0, Math.floor(-offset.y / ts));
    const maxY = Math.min(ROWS - 1, Math.ceil((h - offset.y) / ts));

    // tiles
    const now = performance.now();
    let needsRedraw = false;
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const key = `${x},${y}`;
        const tile = tiles.get(key);
        let color = COLORS.unmined;
        if (tile) {
          color = COLORS[tile.type] || COLORS.zonk;
        }
        const px = offset.x + x * ts;
        const py = offset.y + y * ts;
        // animation: scale-in from center for newly mined
        const anim = animatingTiles.current.get(key);
        let scaleAnim = 1;
        if (anim) {
          const t = (now - anim.start) / 380;
          if (t < 1) { scaleAnim = 0.2 + t * 0.8; needsRedraw = true; }
          else { animatingTiles.current.delete(key); }
        }
        ctx.fillStyle = color;
        const inset = ts * (1 - scaleAnim) / 2;
        ctx.fillRect(px + inset + 1, py + inset + 1, ts - 2 - inset * 2, ts - 2 - inset * 2);
        // highlight ring for non-zonk recently mined
        if (anim && tile && tile.type !== 'zonk') {
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = Math.max(0, 1 - (now - anim.start) / 600);
          ctx.strokeRect(px - 1, py - 1, ts + 2, ts + 2);
          ctx.globalAlpha = 1;
          needsRedraw = true;
        }
      }
    }

    // overlay subtle gridlines at higher zoom
    if (ts > 14) {
      ctx.strokeStyle = 'rgba(250,204,21,0.06)';
      ctx.lineWidth = 1;
      for (let x = minX; x <= maxX + 1; x++) {
        const px = offset.x + x * ts;
        ctx.beginPath();
        ctx.moveTo(px, offset.y + minY * ts);
        ctx.lineTo(px, offset.y + (maxY + 1) * ts);
        ctx.stroke();
      }
      for (let y = minY; y <= maxY + 1; y++) {
        const py = offset.y + y * ts;
        ctx.beginPath();
        ctx.moveTo(offset.x + minX * ts, py);
        ctx.lineTo(offset.x + (maxX + 1) * ts, py);
        ctx.stroke();
      }
    }

    if (needsRedraw) requestAnimationFrame(() => force((n) => n + 1));
  }, [tiles, offset, scale]);

  // Redraw on changes
  useEffect(() => {
    draw();
  }, [draw]);

  // Resize handler
  useEffect(() => {
    const handler = () => draw();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [draw]);

  // Watch tiles changes for animation registration
  const prevTilesRef = useRef(tiles);
  useEffect(() => {
    const prev = prevTilesRef.current;
    tiles.forEach((v, k) => {
      if (!prev.has(k)) {
        animatingTiles.current.set(k, { start: performance.now() });
      }
    });
    prevTilesRef.current = tiles;
    draw();
  }, [tiles, draw]);

  const clientToTile = (cx, cy) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = cx - rect.left;
    const y = cy - rect.top;
    const ts = BASE_TILE * scale;
    const tx = Math.floor((x - offset.x) / ts);
    const ty = Math.floor((y - offset.y) / ts);
    return { tx, ty };
  };

  const onPointerDown = (e) => {
    draggingRef.current = { dragging: true, startX: e.clientX, startY: e.clientY, baseX: offset.x, baseY: offset.y, moved: false };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    const d = draggingRef.current;
    if (!d.dragging) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true;
    if (d.moved) setOffset({ x: d.baseX + dx, y: d.baseY + dy });
  };
  const onPointerUp = (e) => {
    const d = draggingRef.current;
    draggingRef.current = { ...d, dragging: false };
    if (!d.moved) {
      const { tx, ty } = clientToTile(e.clientX, e.clientY);
      if (tx >= 0 && ty >= 0 && tx < COLS && ty < ROWS) {
        onMine(tx, ty);
      }
    }
  };
  const onWheel = (e) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.4, Math.min(2.4, scale * factor));
    // zoom toward cursor
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const wx = (cx - offset.x) / scale;
    const wy = (cy - offset.y) / scale;
    setOffset({ x: cx - wx * newScale, y: cy - wy * newScale });
    setScale(newScale);
  };

  return (
    <div ref={containerRef} className="absolute inset-0 bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full touch-none cursor-crosshair"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        style={{ width: '100%', height: '100%' }}
      />
      {/* Top-left status */}
      <div className="absolute top-3 left-3 md:top-5 md:left-5 pointer-events-none">
        <div className="font-mono text-[10px] tracking-[0.25em] text-stone-500 mb-1">// LOCATION</div>
        <div className="font-mono text-xs tracking-[0.18em] text-yellow-400">{viewportTitle}</div>
      </div>
      {/* Back to orbit */}
      <button onClick={onBack} className="absolute bottom-20 md:bottom-3 left-3 h-10 px-4 border border-yellow-400/40 bg-black/85 font-mono text-[11px] tracking-[0.2em] text-stone-200 hover:text-yellow-400 hover:border-yellow-400 transition-colors flex items-center gap-2 z-30">
        <ChevronLeft className="w-4 h-4" /> BACK TO ORBIT
      </button>
      {/* Zoom hint */}
      <div className="absolute bottom-3 right-3 md:bottom-5 md:right-5 pointer-events-none font-mono text-[10px] tracking-[0.2em] text-stone-500 text-right">
        <div>TAP TILE → MINE</div>
        <div>DRAG TO PAN · SCROLL TO ZOOM</div>
        <div className="text-yellow-400 mt-1">Z {Math.round(scale * 100)}%</div>
      </div>
    </div>
  );
}
