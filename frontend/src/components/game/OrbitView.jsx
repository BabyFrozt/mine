import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import { ITEM_COLORS } from '../../mock';

const R = 3;

// Hash a tile coordinate to a deterministic point on the octahedron surface
function tileToOrbitPosition(x, y) {
  const h1 = (((x + 1000) * 73856093) ^ ((y + 1000) * 19349663)) >>> 0;
  const h2 = (((x + 1000) * 83492791) ^ ((y + 1000) * 2654435761)) >>> 0;
  const sx = (h1 & 1) ? 1 : -1;
  const sy = ((h1 >> 1) & 1) ? 1 : -1;
  const sz = ((h1 >> 2) & 1) ? 1 : -1;
  let u = ((h1 >> 3) & 0xffff) / 0xffff;
  let v = (h2 & 0xffff) / 0xffff;
  if (u + v > 1) { u = 1 - u; v = 1 - v; }
  const w = 1 - u - v;
  // Slight outward push so dots sit on surface
  const F = R * 1.005;
  return [sx * F * u, sy * F * v, sz * F * w];
}

function MinedMarkers({ tiles }) {
  const meshRef = useRef();
  const arr = useMemo(() => {
    const list = [];
    let count = 0;
    for (const [key, val] of tiles) {
      if (count >= 600) break;
      const [x, y] = key.split(',').map(Number);
      list.push({ pos: tileToOrbitPosition(x, y), color: ITEM_COLORS[val.type] || '#5a5a5a' });
      count++;
    }
    return list;
  }, [tiles]);

  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    const tempColor = new THREE.Color();
    arr.forEach((m, i) => {
      dummy.position.set(...m.pos);
      dummy.scale.set(0.08, 0.08, 0.08);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      tempColor.set(m.color);
      meshRef.current.setColorAt(i, tempColor);
    });
    meshRef.current.count = arr.length;
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [arr]);

  if (arr.length === 0) return null;
  return (
    <instancedMesh ref={meshRef} args={[null, null, 600]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial vertexColors toneMapped={false} />
    </instancedMesh>
  );
}

function SmoothMinexdron({ onEnter, entering, tiles }) {
  const ref = useRef();
  useFrame((_, dt) => {
    if (!ref.current) return;
    const speed = entering ? 0.9 : 0.25;
    ref.current.rotation.y += dt * speed;
    ref.current.rotation.x = Math.sin(performance.now() / 2200) * 0.08;
  });
  return (
    <group ref={ref}>
      <mesh onClick={(e) => { e.stopPropagation(); onEnter(); }} onPointerOver={() => (document.body.style.cursor = 'pointer')} onPointerOut={() => (document.body.style.cursor = 'default')}>
        <octahedronGeometry args={[R, 0]} />
        <meshStandardMaterial color="#050505" metalness={0.95} roughness={0.35} flatShading />
      </mesh>
      <mesh>
        <octahedronGeometry args={[R + 0.005, 0]} />
        <meshBasicMaterial color="#facc15" wireframe transparent opacity={0.18} />
      </mesh>
      <mesh>
        <octahedronGeometry args={[R + 0.6, 0]} />
        <meshBasicMaterial color="#facc15" transparent opacity={0.025} side={THREE.BackSide} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[R + 1.2, 0.02, 8, 90]} />
        <meshBasicMaterial color="#facc15" transparent opacity={0.45} />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, Math.PI / 3, 0]}>
        <torusGeometry args={[R + 1.8, 0.015, 8, 90]} />
        <meshBasicMaterial color="#facc15" transparent opacity={0.28} />
      </mesh>
      <MinedMarkers tiles={tiles} />
    </group>
  );
}

function CameraDolly({ entering, onComplete }) {
  const startedRef = useRef(false);
  const startTimeRef = useRef(0);
  useFrame(({ camera }, dt) => {
    if (!entering) {
      // Idle: gentle drift back toward home position
      camera.position.lerp(new THREE.Vector3(0, 0, 12), Math.min(1, dt * 1.2));
      camera.lookAt(0, 0, 0);
      startedRef.current = false;
      return;
    }
    if (!startedRef.current) {
      startedRef.current = true;
      startTimeRef.current = performance.now();
    }
    const elapsed = (performance.now() - startTimeRef.current) / 1000;
    const target = new THREE.Vector3(0, 0, 1.6);
    camera.position.lerp(target, Math.min(1, dt * 2.4));
    camera.lookAt(0, 0, 0);
    if (elapsed > 1.05) onComplete?.();
  });
  return null;
}

export default function OrbitView({ onEnter, tiles = new Map(), entering = false, onEntered }) {
  const totalTiles = 200 * 140;
  const minedPct = Math.min(100, ((tiles.size / totalTiles) * 100));

  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 12], fov: 45 }} gl={{ antialias: true }}>
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 16, 40]} />
        <Stars radius={80} depth={60} count={2200} factor={4} fade speed={0.5} />
        <ambientLight intensity={0.45} />
        <directionalLight position={[6, 8, 6]} intensity={1.2} />
        <directionalLight position={[-6, -3, -6]} intensity={0.5} color="#facc15" />
        <pointLight position={[0, 0, 0]} intensity={1.1} color="#facc15" distance={6} />
        <Float speed={1.1} rotationIntensity={0.3} floatIntensity={0.5} enabled={!entering}>
          <SmoothMinexdron onEnter={onEnter} entering={entering} tiles={tiles} />
        </Float>
        <CameraDolly entering={entering} onComplete={onEntered} />
        {!entering && (
          <OrbitControls enablePan={false} minDistance={8} maxDistance={20} rotateSpeed={0.6} zoomSpeed={0.6} autoRotate autoRotateSpeed={0.4} />
        )}
      </Canvas>

      {/* Hint overlay */}
      <div className={`absolute inset-x-0 bottom-24 md:bottom-28 flex flex-col items-center pointer-events-none transition-opacity duration-500 ${entering ? 'opacity-0' : 'opacity-100'}`}>
        <div className="font-mono text-[10px] tracking-[0.3em] text-yellow-400 mb-2 animate-pulse">// THE MINEXDRON · ORBIT 04-X</div>
        <button onClick={onEnter} className="pointer-events-auto px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-mono text-sm tracking-[0.3em] font-bold rounded-full transition-colors glow-yellow">
          ZOOM IN → MINE
        </button>
      </div>

      <div className={`absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none transition-opacity duration-300 ${entering ? 'opacity-0' : 'opacity-100'}`}>
        <div className="font-mono text-[10px] tracking-[0.3em] text-stone-500">CLICK THE MINEXDRON</div>
      </div>

      {/* Mining progress on orbit */}
      <div className="absolute bottom-3 right-3 md:bottom-5 md:right-5 pointer-events-none font-mono text-[10px] tracking-[0.2em] text-stone-500 text-right">
        <div>// SHELL INTEGRITY</div>
        <div className="text-yellow-400 font-bold text-base">{(100 - minedPct).toFixed(2)}%</div>
        <div>{tiles.size.toLocaleString()} / {totalTiles.toLocaleString()} MINED</div>
      </div>
    </div>
  );
}
