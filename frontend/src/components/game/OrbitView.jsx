import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

function SmoothOctahedron({ onEnter }) {
  const ref = useRef();
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.25;
    ref.current.rotation.x = Math.sin(performance.now() / 2200) * 0.08;
  });
  return (
    <group ref={ref}>
      {/* Core octahedron */}
      <mesh onClick={(e) => { e.stopPropagation(); onEnter(); }} onPointerOver={() => (document.body.style.cursor = 'pointer')} onPointerOut={() => (document.body.style.cursor = 'default')}>
        <octahedronGeometry args={[3, 0]} />
        <meshStandardMaterial color="#050505" metalness={0.95} roughness={0.35} flatShading />
      </mesh>
      {/* Wireframe overlay */}
      <mesh>
        <octahedronGeometry args={[3.005, 0]} />
        <meshBasicMaterial color="#facc15" wireframe transparent opacity={0.18} />
      </mesh>
      {/* Subtle inner glow shell */}
      <mesh>
        <octahedronGeometry args={[3.6, 0]} />
        <meshBasicMaterial color="#facc15" transparent opacity={0.025} side={THREE.BackSide} />
      </mesh>
      {/* Orbiting accent rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4.2, 0.02, 8, 90]} />
        <meshBasicMaterial color="#facc15" transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, Math.PI / 3, 0]}>
        <torusGeometry args={[4.8, 0.015, 8, 90]} />
        <meshBasicMaterial color="#facc15" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

export default function OrbitView({ onEnter }) {
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
        <Float speed={1.1} rotationIntensity={0.4} floatIntensity={0.6}>
          <SmoothOctahedron onEnter={onEnter} />
        </Float>
        <OrbitControls enablePan={false} minDistance={8} maxDistance={20} rotateSpeed={0.6} zoomSpeed={0.6} autoRotate autoRotateSpeed={0.4} />
      </Canvas>
      {/* Hint overlay */}
      <div className="absolute inset-x-0 bottom-24 md:bottom-28 flex flex-col items-center pointer-events-none">
        <div className="font-mono text-[10px] tracking-[0.3em] text-yellow-400 mb-2 animate-pulse">// THE OCTAHEDRON · ORBIT 04-X</div>
        <button onClick={onEnter} className="pointer-events-auto px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-mono text-sm tracking-[0.3em] font-bold rounded-full transition-colors glow-yellow">
          TAP TO MINE →
        </button>
      </div>
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none">
        <div className="font-mono text-[10px] tracking-[0.3em] text-stone-500">CLICK THE OCTAHEDRON</div>
      </div>
    </div>
  );
}
