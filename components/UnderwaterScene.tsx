'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Points, PointMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

function Bubbles() {
  const pointsRef = useRef<THREE.Points>(null);

  const particlesCount = 100;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 20;
      pos[i3 + 1] = Math.random() * 10 - 5;
      pos[i3 + 2] = (Math.random() - 0.5) * 10;
    }

    return pos;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;

      positions[i3 + 1] += 0.01 + Math.sin(state.clock.elapsedTime + i) * 0.002;
      positions[i3] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.003;

      if (positions[i3 + 1] > 5) {
        positions[i3 + 1] = -5;
        positions[i3] = (Math.random() - 0.5) * 20;
        positions[i3 + 2] = (Math.random() - 0.5) * 10;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#3fb4c7"
        size={0.1}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const particlesCount = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 30;
      pos[i3 + 1] = (Math.random() - 0.5) * 20;
      pos[i3 + 2] = (Math.random() - 0.5) * 20;
    }

    return pos;
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;

    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
  });

  return (
    <Points ref={particlesRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#6dd5ed"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.3}
      />
    </Points>
  );
}

// Photorealistic Black Pearl Component
function BlackPearl({
  position,
  scale = 1
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Randomize pearl characteristics for variety
  const pearlData = useMemo(() => ({
    speed: 0.15 + Math.random() * 0.2,
    rotationSpeed: 0.002 + Math.random() * 0.003,
    colorVariation: Math.random(),
    size: scale * (0.9 + Math.random() * 0.2), // Slight size variation
  }), [scale]);

  // Create custom pearl colors with peacock iridescence
  const pearlColor = useMemo(() => {
    const variation = pearlData.colorVariation;
    if (variation < 0.3) {
      return new THREE.Color(0x0a0f1a); // Deep black with blue undertone
    } else if (variation < 0.6) {
      return new THREE.Color(0x0d1418); // Black with green undertone
    } else {
      return new THREE.Color(0x12101a); // Black with purple undertone
    }
  }, [pearlData.colorVariation]);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Smooth floating animation
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * pearlData.speed) * 0.4;
    meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * pearlData.speed * 0.7) * 0.25;

    // Gentle rotation to show different pearl surfaces
    meshRef.current.rotation.x += pearlData.rotationSpeed;
    meshRef.current.rotation.y += pearlData.rotationSpeed * 1.5;
  });

  return (
    <mesh ref={meshRef} position={position} scale={pearlData.size}>
      <sphereGeometry args={[0.35, 64, 64]} />
      <meshPhysicalMaterial
        color={pearlColor}

        // High reflectivity for pearl luster
        metalness={0.4}
        roughness={0.08}

        // Clearcoat creates the glossy, wet look
        clearcoat={1.0}
        clearcoatRoughness={0.05}

        // Iridescence for peacock colors
        iridescence={0.4}
        iridescenceIOR={1.5}
        iridescenceThicknessRange={[100, 800]}

        // Environmental reflections
        envMapIntensity={1.5}
        reflectivity={0.95}

        // Subtle sheen for organic feel
        sheen={0.5}
        sheenRoughness={0.3}
        sheenColor={new THREE.Color(0x1a3a4a)}

        // Transmission for depth
        transmission={0.05}
        thickness={0.5}
        ior={1.67} // Pearl's index of refraction
      />
    </mesh>
  );
}

function PearlCluster() {
  const pearls = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 9,
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 6,
      ] as [number, number, number],
      scale: 0.8 + Math.random() * 0.5,
    }));
  }, []);

  return (
    <>
      {pearls.map((pearl) => (
        <BlackPearl
          key={pearl.id}
          position={pearl.position}
          scale={pearl.scale}
        />
      ))}
    </>
  );
}

// Professional lighting setup for pearls
function PearlLighting() {
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    // Animate key light for dynamic highlights
    if (keyLightRef.current) {
      keyLightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.3) * 4;
      keyLightRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.3) * 4;
    }

    // Animate rim light for dynamic edge lighting
    if (rimLightRef.current) {
      rimLightRef.current.position.x = Math.cos(state.clock.elapsedTime * 0.25) * 6;
      rimLightRef.current.position.z = Math.sin(state.clock.elapsedTime * 0.25) * 6;
    }
  });

  return (
    <>
      {/* Key Light - Main illumination creating specular highlights */}
      <directionalLight
        ref={keyLightRef}
        position={[5, 8, 5]}
        intensity={2.5}
        color="#d0e8f2"
        castShadow
      />

      {/* Fill Light - Soft ambient lighting */}
      <ambientLight intensity={0.6} color="#1a3a4a" />

      {/* Rim Light - Creates edge highlights on pearls */}
      <pointLight
        ref={rimLightRef}
        position={[-5, 3, -5]}
        intensity={2}
        color="#6dd5ed"
        distance={15}
        decay={2}
      />

      {/* Accent Lights - Additional colored highlights */}
      <pointLight
        position={[3, -3, 4]}
        intensity={1.5}
        color="#3fb4c7"
        distance={12}
        decay={2}
      />

      <pointLight
        position={[-3, 4, -3]}
        intensity={1.2}
        color="#5a8da3"
        distance={10}
        decay={2}
      />

      {/* Top spotlight for dramatic effect */}
      <spotLight
        position={[0, 10, 0]}
        angle={0.4}
        penumbra={0.8}
        intensity={1.5}
        color="#a8d8e8"
        castShadow
      />

      {/* Hemisphere light for natural underwater ambiance */}
      <hemisphereLight
        color="#4a7a8a"
        groundColor="#0a1a28"
        intensity={0.8}
      />
    </>
  );
}

export default function UnderwaterScene() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 55 }}
        gl={{
          alpha: true,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
      >
        {/* Environment map for realistic reflections */}
        <Environment preset="city" />

        <PearlLighting />
        <PearlCluster />
        <Bubbles />
        <FloatingParticles />
        <fog attach="fog" args={['#0a1628', 8, 28]} />
      </Canvas>
    </div>
  );
}
