import React, { useMemo, useRef, useCallback, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Generate octahedron-shape voxel positions
function buildOctahedron(R = 14) {
  const positions = [];
  for (let x = -R; x <= R; x++) {
    for (let y = -R; y <= R; y++) {
      for (let z = -R; z <= R; z++) {
        const d = Math.abs(x) + Math.abs(y) + Math.abs(z);
        // Shell only: outer surface of octahedron + a thin inner band
        if (d >= R - 2 && d <= R) {
          positions.push([x, y, z, d]);
        }
      }
    }
  }
  return positions;
}

// Stable color assignment for treasure hint (visual only)
function blockColor(x, y, z, d, R) {
  // Base black tones
  const hash = Math.abs((x * 73856093) ^ (y * 19349663) ^ (z * 83492791)) % 1000;
  if (hash < 18) return new THREE.Color('#facc15'); // gold rare
  if (hash < 60) return new THREE.Color('#a78bfa'); // purple
  if (hash < 110) return new THREE.Color('#22d3ee'); // cyan
  if (hash < 150) return new THREE.Color('#f97316');
  // shadow tint based on layer
  const t = d / R;
  const c = new THREE.Color().setHSL(0, 0, 0.06 + (1 - t) * 0.18);
  return c;
}

function Octahedron({ R = 14, minedSet, onMineBlock, hoverHandler, activeTool }) {
  const meshRef = useRef();
  const positions = useMemo(() => buildOctahedron(R), [R]);

  const colorArray = useMemo(() => {
    const arr = new Float32Array(positions.length * 3);
    positions.forEach((p, i) => {
      const c = blockColor(p[0], p[1], p[2], p[3], R);
      arr[i * 3] = c.r; arr[i * 3 + 1] = c.g; arr[i * 3 + 2] = c.b;
    });
    return arr;
  }, [positions, R]);

  // Apply transforms only when minedSet changes
  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    positions.forEach((p, i) => {
      const [x, y, z] = p;
      const key = `${x},${y},${z}`;
      const mined = minedSet.has(key);
      if (mined) {
        dummy.position.set(0, 1e6, 0);
        dummy.scale.set(0.001, 0.001, 0.001);
      } else {
        dummy.position.set(x, y, z);
        dummy.scale.set(0.94, 0.94, 0.94);
      }
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [positions, minedSet]);

  // Gentle idle rotation of the whole object
  useFrame((state, dt) => {
    if (meshRef.current && meshRef.current.parent) {
      meshRef.current.parent.rotation.y += dt * 0.05;
    }
  });

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    const i = e.instanceId;
    if (i == null) return;
    const p = positions[i];
    if (!p) return;
    const [x, y, z] = p;
    onMineBlock({ x, y, z, index: i, activeTool, R, positions, minedSet });
  }, [positions, onMineBlock, activeTool, R, minedSet]);

  return (
    <group>
      <instancedMesh
        ref={meshRef}
        args={[null, null, positions.length]}
        onClick={handleClick}
        onPointerOver={(e) => { e.stopPropagation(); hoverHandler(true); }}
        onPointerOut={(e) => { e.stopPropagation(); hoverHandler(false); }}
        castShadow receiveShadow
      >
        <boxGeometry args={[1, 1, 1]}>
          <instancedBufferAttribute attach="attributes-color" args={[colorArray, 3]} />
        </boxGeometry>
        <meshStandardMaterial vertexColors metalness={0.4} roughness={0.55} />
      </instancedMesh>
    </group>
  );
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[12, 18, 10]} intensity={1.1} castShadow />
      <directionalLight position={[-14, -6, -10]} intensity={0.4} color="#facc15" />
      <pointLight position={[0, 0, 0]} intensity={0.35} color="#facc15" />
    </>
  );
}

export default function VoxelOctahedron({ minedSet, onMineBlock, activeTool, R = 14 }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Canvas
      shadows
      camera={{ position: [26, 22, 26], fov: 45 }}
      style={{ cursor: hovered ? 'crosshair' : 'grab' }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 40, 90]} />
      <Stars radius={80} depth={50} count={1500} factor={3} fade speed={0.5} />
      <Lighting />
      <Octahedron R={R} minedSet={minedSet} onMineBlock={onMineBlock} hoverHandler={setHovered} activeTool={activeTool} />
      <OrbitControls enablePan={false} minDistance={14} maxDistance={45} rotateSpeed={0.6} zoomSpeed={0.8} />
    </Canvas>
  );
}
