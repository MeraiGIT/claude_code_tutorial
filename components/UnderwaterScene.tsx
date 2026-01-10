'use client';

import { useRef, useMemo, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Environment, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { useMousePosition } from '@/hooks/useMousePosition';
import { CausticShaderMaterial, GodRaysShaderMaterial } from './shaders/CausticShader';

// Mouse context to share position across components
const MouseContext = React.createContext<THREE.Vector3>(new THREE.Vector3());
import React from 'react';

// Bioluminescent particles that react to pearls
function BioluminescentParticles({ pearlPositions }: { pearlPositions: THREE.Vector3[] }) {
  const pointsRef = useRef<THREE.Points>(null);
  const frameCounter = useRef(0);
  const particlesCount = 300;

  const { positions, velocities, glowIntensities } = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    const vel = new Float32Array(particlesCount * 3);
    const glow = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 25;
      pos[i3 + 1] = (Math.random() - 0.5) * 15;
      pos[i3 + 2] = (Math.random() - 0.5) * 15;

      vel[i3] = (Math.random() - 0.5) * 0.02;
      vel[i3 + 1] = (Math.random() - 0.5) * 0.02;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.02;

      glow[i] = Math.random();
    }

    return { positions: pos, velocities: vel, glowIntensities: glow };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    frameCounter.current++;
    const shouldUpdatePhysics = frameCounter.current % 3 === 0;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const colors = pointsRef.current.geometry.attributes.color?.array as Float32Array;

    if (!colors) return;

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;

      // Always update drift movement for smooth motion
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];

      // Boundary wrapping
      if (Math.abs(positions[i3]) > 12) velocities[i3] *= -1;
      if (Math.abs(positions[i3 + 1]) > 7) velocities[i3 + 1] *= -1;
      if (Math.abs(positions[i3 + 2]) > 7) velocities[i3 + 2] *= -1;

      // Only recalculate pearl proximity every 3rd frame (reduces 10,500 to 3,500 calculations/frame)
      if (shouldUpdatePhysics) {
        // React to nearby pearls - glow brighter
        let minDist = Infinity;
        pearlPositions.forEach((pearlPos) => {
          const dx = positions[i3] - pearlPos.x;
          const dy = positions[i3 + 1] - pearlPos.y;
          const dz = positions[i3 + 2] - pearlPos.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          minDist = Math.min(minDist, dist);
        });

        // Glow based on proximity to pearls
        const glowFactor = Math.max(0, 1 - minDist / 3);
        const baseGlow = (Math.sin(state.clock.elapsedTime * 2 + glowIntensities[i] * 10) * 0.5 + 0.5);
        const finalGlow = baseGlow + glowFactor * 0.8;

        // Color variation (cyan to green)
        colors[i3] = 0.2 + finalGlow * 0.4; // R
        colors[i3 + 1] = 0.6 + finalGlow * 0.4; // G
        colors[i3 + 2] = 0.8 + finalGlow * 0.2; // B
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    if (shouldUpdatePhysics && colors) {
      pointsRef.current.geometry.attributes.color.needsUpdate = true;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions}>
      <bufferAttribute
        attach="attributes-color"
        args={[new Float32Array(particlesCount * 3).fill(0.5), 3]}
      />
      <pointsMaterial
        size={0.08}
        transparent
        opacity={0.8}
        vertexColors
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Rising bubbles
function Bubbles() {
  const pointsRef = useRef<THREE.Points>(null);
  const particlesCount = 80;

  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 20;
      pos[i3 + 1] = Math.random() * 12 - 6;
      pos[i3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      positions[i3 + 1] += 0.015 + Math.sin(state.clock.elapsedTime + i) * 0.003;
      positions[i3] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.005;

      if (positions[i3 + 1] > 6) {
        positions[i3 + 1] = -6;
        positions[i3] = (Math.random() - 0.5) * 20;
        positions[i3 + 2] = (Math.random() - 0.5) * 10;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#5aacbd"
        size={0.12}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
      />
    </Points>
  );
}

// Simple 3D Perlin noise approximation for flow fields
function noise3D(x: number, y: number, z: number): number {
  // Use sine waves with prime number frequencies for pseudo-random field
  const n1 = Math.sin(x * 1.3 + y * 1.7 + z * 2.1) * Math.cos(x * 2.3 + y * 1.1 + z * 1.5);
  const n2 = Math.sin(x * 3.1 + y * 2.7 + z * 1.9) * Math.cos(x * 1.9 + y * 3.3 + z * 2.7);
  return (n1 + n2) * 0.5;
}

// Mouse-reactive pearl with physics and trails
function InteractivePearl({
  index,
  formationPosition,
  mousePosition,
  allPearlRefs,
}: {
  index: number;
  formationPosition: THREE.Vector3;
  mousePosition: THREE.Vector3;
  allPearlRefs: React.MutableRefObject<THREE.Mesh[]>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<any>(null);

  const pearlData = useMemo(() => ({
    basePosition: formationPosition.clone(),
    velocity: new THREE.Vector3(0, 0, 0),
    colorVariation: Math.random(),
    size: 0.32 + Math.random() * 0.12,
    phase: Math.random() * Math.PI * 2,
  }), [formationPosition]);

  const pearlColor = useMemo(() => {
    const v = pearlData.colorVariation;
    if (v < 0.33) return new THREE.Color(0x0a0f1a);
    else if (v < 0.66) return new THREE.Color(0x0d1418);
    else return new THREE.Color(0x12101a);
  }, [pearlData.colorVariation]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const pearl = meshRef.current;
    const time = state.clock.elapsedTime;

    // === FLOWING WATER PHYSICS ===

    // Gentle drift orbit (wider than before for graceful movement)
    const driftRadius = 1.8;
    const driftSpeed = 0.15;
    const targetX = pearlData.basePosition.x + Math.cos(time * driftSpeed + pearlData.phase) * driftRadius;
    const targetY = pearlData.basePosition.y + Math.sin(time * driftSpeed * 0.6 + pearlData.phase) * driftRadius * 0.8;
    const targetZ = pearlData.basePosition.z + Math.sin(time * driftSpeed * 0.4 + pearlData.phase) * driftRadius * 0.5;

    // Flow field from 3D noise
    const flowScale = 0.5;  // Noise space frequency
    const flowStrength = 0.008;  // Gentle force
    const flowNoiseX = noise3D(
      pearl.position.x * flowScale,
      pearl.position.y * flowScale,
      time * 0.3  // Slow time evolution
    );
    const flowNoiseY = noise3D(
      pearl.position.x * flowScale + 100,  // Offset for different pattern
      pearl.position.y * flowScale + 100,
      time * 0.3
    );
    const flowNoiseZ = noise3D(
      pearl.position.x * flowScale + 200,
      pearl.position.y * flowScale + 200,
      time * 0.3
    );

    // Apply flow field to velocity
    pearlData.velocity.x += flowNoiseX * flowStrength;
    pearlData.velocity.y += flowNoiseY * flowStrength;
    pearlData.velocity.z += flowNoiseZ * flowStrength;

    // Mouse creates gentle swirl (not direct attraction)
    const toMouse = new THREE.Vector3(
      mousePosition.x - pearl.position.x,
      mousePosition.y - pearl.position.y,
      mousePosition.z - pearl.position.z
    );
    const distToMouse = toMouse.length();

    if (distToMouse < 4.5) {  // Wider influence radius
      // Gentle swirl around mouse instead of attraction
      const swirlStrength = (4.5 - distToMouse) / 4.5 * 0.012;  // Very subtle
      const perpendicular = new THREE.Vector3(
        -toMouse.y,
        toMouse.x,
        0
      ).normalize();
      pearlData.velocity.add(perpendicular.multiplyScalar(swirlStrength));

      // Slight outward drift (no repulsion, just gentle push)
      const driftStrength = (4.5 - distToMouse) / 4.5 * 0.004;
      pearlData.velocity.add(toMouse.normalize().multiplyScalar(-driftStrength));
    }

    // Pearl-to-pearl soft avoidance with early exit optimization (reduces checks by ~60%)
    allPearlRefs.current.forEach((otherPearl, otherIndex) => {
      if (otherIndex === index || !otherPearl) return;

      // Early exit for distant pearls using fast Manhattan distance check (before expensive sqrt)
      const dx = pearl.position.x - otherPearl.position.x;
      const dy = pearl.position.y - otherPearl.position.y;
      const dz = pearl.position.z - otherPearl.position.z;

      // Fast Manhattan distance check before expensive sqrt
      if (Math.abs(dx) > 1.5 && Math.abs(dy) > 1.5 && Math.abs(dz) > 1.5) return;

      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < 1.5 && dist > 0) {
        const avoidStrength = (1.5 - dist) / 1.5 * 0.006;
        const toPearl = new THREE.Vector3(dx, dy, dz);
        pearlData.velocity.add(toPearl.normalize().multiplyScalar(avoidStrength));
      }
    });

    // Gentle return to drift orbit (not formation position)
    const returnForce = new THREE.Vector3(
      targetX - pearl.position.x,
      targetY - pearl.position.y,
      targetZ - pearl.position.z
    );
    pearlData.velocity.add(returnForce.multiplyScalar(0.008));  // Reduced from 0.015

    // Apply velocity with lighter damping (more momentum)
    pearl.position.add(pearlData.velocity);
    pearlData.velocity.multiplyScalar(0.96);  // Increased from 0.92 for smoother flow

    // Slower rotation for calmer feel
    pearl.rotation.x += 0.001;  // Reduced from 0.003
    pearl.rotation.y += 0.002;  // Reduced from 0.005

    // Pulsing glow effect
    const glowPulse = Math.sin(time * 2 + index * 0.5) * 0.5 + 0.5;
    (pearl.material as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.2 + glowPulse * 0.15;

    // Store ref for pearl-to-pearl interactions
    if (!allPearlRefs.current[index]) {
      allPearlRefs.current[index] = pearl;
    }
  });

  return (
    <Trail
      width={0.8}
      length={6}
      color={new THREE.Color(0x3fb4c7)}
      attenuation={(t) => t * t}
    >
      <mesh ref={meshRef} scale={pearlData.size}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial
          color={pearlColor}
          metalness={0.4}
          roughness={0.08}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          iridescence={0.5}
          iridescenceIOR={1.5}
          iridescenceThicknessRange={[100, 800]}
          envMapIntensity={1.8}
          reflectivity={0.95}
          sheen={0.6}
          sheenRoughness={0.3}
          sheenColor={new THREE.Color(0x2a5a6a)}
          transmission={0.05}
          thickness={0.5}
          ior={1.67}
          emissive={new THREE.Color(0x1a4d6f)}
          emissiveIntensity={0.2}
        />
      </mesh>
    </Trail>
  );
}

// Sacred geometry pearl formation
function PearlFormation({ mousePosition }: { mousePosition: THREE.Vector3 }) {
  const pearlRefs = useRef<THREE.Mesh[]>([]);

  // Stratified grid formation - spread across full viewport
  const formations = useMemo(() => {
    const pearls: THREE.Vector3[] = [];

    // Viewport bounds (slightly inset to prevent edge clipping)
    const xBounds = { min: -7.5, max: 7.5 };
    const yBounds = { min: -4.2, max: 4.2 };
    const zBounds = { min: -4, max: 4 };

    // Create 7x5 grid cells for stratified sampling
    const cols = 7;
    const rows = 5;
    const cellWidth = (xBounds.max - xBounds.min) / cols;
    const cellHeight = (yBounds.max - yBounds.min) / rows;

    // Place one pearl per cell with random offset
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cellX = xBounds.min + col * cellWidth;
        const cellY = yBounds.min + row * cellHeight;

        // Random offset within cell (0.6 gives nice variation)
        const offsetX = (Math.random() - 0.5) * cellWidth * 0.6;
        const offsetY = (Math.random() - 0.5) * cellHeight * 0.6;

        // Z depth based on golden ratio spiral for aesthetic distribution
        const index = row * cols + col;
        const goldenAngle = index * 137.5 * (Math.PI / 180);
        const zDepth = Math.sin(goldenAngle) * (zBounds.max - zBounds.min) / 2;

        pearls.push(new THREE.Vector3(
          cellX + offsetX,
          cellY + offsetY,
          zDepth
        ));
      }
    }

    return pearls;
  }, []);

  return (
    <>
      {formations.map((position, index) => (
        <InteractivePearl
          key={index}
          index={index}
          formationPosition={position}
          mousePosition={mousePosition}
          allPearlRefs={pearlRefs}
        />
      ))}
    </>
  );
}

// Animated caustic background
function CausticBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -8]} scale={[60, 40, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        attach="material"
        {...CausticShaderMaterial}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Volumetric god rays
function GodRays() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 5]} scale={[20, 12, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        {...GodRaysShaderMaterial}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// Professional lighting
function PearlLighting() {
  const keyLightRef = useRef<THREE.DirectionalLight>(null);

  useFrame((state) => {
    if (keyLightRef.current) {
      keyLightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.3) * 4;
      keyLightRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.3) * 4;
    }
  });

  return (
    <>
      <directionalLight
        ref={keyLightRef}
        position={[5, 10, 5]}
        intensity={2.8}
        color="#d8f0f8"
      />
      <ambientLight intensity={0.7} color="#1a4a5a" />
      <pointLight position={[-6, 4, -4]} intensity={2.2} color="#6dd5ed" distance={18} decay={2} />
      <pointLight position={[4, -2, 5]} intensity={1.8} color="#3fb4c7" distance={15} decay={2} />
      <spotLight
        position={[0, 12, 0]}
        angle={0.5}
        penumbra={0.9}
        intensity={1.8}
        color="#b0e0e8"
      />
      <hemisphereLight color="#5a8da3" groundColor="#0a1828" intensity={0.9} />
    </>
  );
}

// Scene wrapper with mouse tracking
function Scene() {
  const mousePosition3D = useMousePosition();
  const [pearlPositions, setPearlPositions] = useState<THREE.Vector3[]>([]);

  return (
    <>
      <CausticBackground />
      <GodRays />
      <PearlLighting />

      {/* Lazy load environment map after critical scene elements for better perceived performance */}
      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>

      <PearlFormation mousePosition={mousePosition3D.worldPosition} />
      <Bubbles />
      <BioluminescentParticles pearlPositions={pearlPositions} />

      <fog attach="fog" args={['#0a1628', 10, 35]} />
    </>
  );
}

export default function UnderwaterScene() {
  return (
    <div className="fixed inset-0 -z-10" style={{ background: '#0a1628' }}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        aria-hidden="true"
        gl={{
          alpha: false,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.3,
          powerPreference: 'high-performance',
        }}
      >
        <color attach="background" args={['#0a1628']} />
        <Scene />
      </Canvas>
    </div>
  );
}
